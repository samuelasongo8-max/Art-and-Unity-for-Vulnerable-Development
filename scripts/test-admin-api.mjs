/**
 * test-admin-api — a self-contained check of the admin API handlers.
 *
 * It stubs req/res and redirects lib/db.js to an in-memory fake (see
 * admin-db-loader.mjs), so it exercises the real handler code — the auth gate,
 * the validation, the cookie, the rate limit — without a database, a server or
 * a network. Run it after changing anything under /api or /lib:
 *
 *   npm run test:admin-api
 */
import assert from "node:assert/strict";
import { register } from "node:module";

/* The hook has to be installed BEFORE lib/db.js is first imported, which is
   why this runs before the dynamic imports below. */
register("./admin-db-loader.mjs", import.meta.url);

/* A placeholder so the routes' config guard is satisfied. Nothing ever dials
   it: lib/db.js is redirected to the in-memory stub for the whole run, so this
   value is only ever checked for presence, never parsed. */
process.env.MONGODB_URI = "mongodb://stub-not-a-real-server:27017/auvd";
process.env.JWT_SECRET = "test-secret-not-a-real-value";
process.env.JWT_EXPIRES_IN = "7d";

/** A stub with just enough surface for the sendJson() helper. */
const makeRes = () => ({
  statusCode: null,
  body: null,
  headers: {},
  headersSent: false,
  setHeader(key, value) {
    this.headers[key.toLowerCase()] = value;
  },
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  },
});

/* The store lives in the stub module, which the loader hook substitutes for
   lib/db.js. Importing it directly guarantees it has run — and therefore set
   globalThis.__auvdTestStore — before the handlers below pull it in. */
await import("./admin-db-stub.mjs");
const store = globalThis.__auvdTestStore;

const { default: login } = await import("../api/admin/login.js");
const { default: logout } = await import("../api/admin/logout.js");
const { default: me } = await import("../api/admin/me.js");
/* `reg` not `register`: the module-loader `register` is already in scope, and
   two bindings with the same name in one module is a SyntaxError. */
const { default: reg } = await import("../api/admin/register.js");
const { default: setupStatus } = await import("../api/admin/setup-status.js");
const postsIndex = (await import("../api/posts/index.js")).default;
const postsById = (await import("../api/posts/[id].js")).default;
const bcrypt = (await import("bcryptjs")).default;

const req = (method, { body, query, cookie } = {}) => ({
  method,
  body,
  query: query ?? {},
  headers: cookie ? { cookie } : {},
});

const VALID_POST = {
  date: "2026-08-15",
  topic: "education",
  image: "/moments/education-study-group.jpg",
  imageAlt: "Students in a classroom",
  caption: "Morning Study Groups",
  paragraph: "A short factual account of the session.",
};


/* ---------- 1. Every protected route refuses an anonymous request ---------- */
console.log("1. anonymous requests are refused");

let res = makeRes();
postsIndex(req("POST", { body: VALID_POST }), res);
assert.equal(res.statusCode, 401, "POST /api/posts must be 401 without a session");

res = makeRes();
postsById(req("PUT", { body: VALID_POST, query: { id: "0123456789abcdef01234567" } }), res);
assert.equal(res.statusCode, 401, "PUT must be 401 without a session");

res = makeRes();
postsById(req("DELETE", { query: { id: "0123456789abcdef01234567" } }), res);
assert.equal(res.statusCode, 401, "DELETE must be 401 without a session");

/* A forged token must be rejected too, not only a missing cookie. */
res = makeRes();
me(req("GET", { cookie: "auvd_admin=not.a.real.token" }), res);
assert.equal(res.statusCode, 401, "a forged token must be 401");

/* ---------- 2. GET /api/posts is public ---------- */
console.log("2. GET /api/posts is public");
res = makeRes();
await postsIndex(req("GET"), res);
assert.equal(res.statusCode, 200);
assert.equal(res.body.ok, true);
assert.ok(Array.isArray(res.body.posts));
assert.equal("token" in res.body, false, "the body must never carry a token");

/* ---------- 3. Login rejects a wrong password with the generic message ---- */
console.log("3. a wrong password gives one generic message");
store.admin.length = 0;
/* Cost 4 rather than the real 12: this harness runs on every change, and the
   cost factor is bcrypt's business, not the handler's. */
store.admin.push({
  email: "admin@example.org",
  passwordHash: await bcrypt.hash("correct-horse-battery", 4),
});
res = makeRes();
await login(req("POST", { body: { email: "admin@example.org", password: "wrong" } }), res);
assert.equal(res.statusCode, 401);
assert.deepEqual(res.body, { ok: false, error: "Invalid email or password" });
assert.equal("token" in res.body, false);

/* An unknown email must produce the IDENTICAL response, so the form cannot be
   used to discover which addresses have an account. */
res = makeRes();
await login(req("POST", { body: { email: "nobody@example.org", password: "wrong" } }), res);
assert.equal(res.statusCode, 401);
assert.deepEqual(res.body, { ok: false, error: "Invalid email or password" });

/* ---------- 4. A correct login sets an httpOnly cookie, not a body token --- */
console.log("4. a correct login sets the cookie and hides the token");
store.login_attempts.length = 0;

res = makeRes();
await login(req("POST", { body: { email: "admin@example.org", password: "correct-horse-battery" } }), res);
assert.equal(res.statusCode, 200);
assert.equal(res.body.ok, true);
assert.equal(res.body.email, "admin@example.org");
assert.equal("token" in res.body, false, "the JWT must never appear in the body");

const setCookie = res.headers["set-cookie"];
assert.ok(setCookie, "a Set-Cookie header is required");
assert.match(setCookie, /^auvd_admin=/);
assert.match(setCookie, /HttpOnly/);
assert.match(setCookie, /Secure/);
assert.match(setCookie, /SameSite=Strict/);

/* Only the name=value pair is needed for the follow-up requests; a browser
   stores the attributes separately from the value. */
const cookieHeader = setCookie.split(";")[0];
assert.ok(!setCookie.includes("correct-horse-battery"), "the password must not appear in the cookie");

/* ---------- 5. The session works on every protected route ---------- */
console.log("5. the session authorises me and the writes");
res = makeRes();
await me(req("GET", { cookie: cookieHeader }), res);
assert.equal(res.statusCode, 200);
assert.equal(res.body.email, "admin@example.org");

res = makeRes();
await postsIndex(req("POST", { body: VALID_POST, cookie: cookieHeader }), res);
assert.equal(res.statusCode, 201, `expected 201, got ${res.statusCode} ${JSON.stringify(res.body)}`);
const created = res.body.post;
assert.equal(created.caption, VALID_POST.caption);
assert.ok(created.id, "the new post must come back with an id");

/* The public shape must be exactly the seven fields the feed reads. */
assert.deepEqual(
  Object.keys(created).sort(),
  ["caption", "date", "id", "image", "imageAlt", "paragraph", "topic"]
);

res = makeRes();
await postsIndex(req("GET"), res);
assert.equal(res.body.posts.length, 1);
assert.equal(res.body.posts[0].id, created.id);

/* ---------- 6. Validation rejects bad input with 400 ---------- */
console.log("6. validation rejects bad input");
const badInputs = [
  { ...VALID_POST, topic: "not-a-topic" },
  { ...VALID_POST, date: "2026-02-31" },
  { ...VALID_POST, date: "15/08/2026" },
  { ...VALID_POST, caption: "   " },
  { ...VALID_POST, imageAlt: "" },
];
for (const bad of badInputs) {
  res = makeRes();
  await postsIndex(req("POST", { body: bad, cookie: cookieHeader }), res);
  assert.equal(res.statusCode, 400, `expected 400 for ${JSON.stringify(bad)}`);
  assert.equal(res.body.ok, false);
}

/* ---------- 7. PUT updates, DELETE removes, bad ids 404 ---------- */
console.log("7. PUT, DELETE and 404s");
res = makeRes();
await postsById(
  req("PUT", { body: { ...VALID_POST, caption: "Edited Caption" }, query: { id: created.id }, cookie: cookieHeader }),
  res
);
assert.equal(res.statusCode, 200);
assert.equal(res.body.post.caption, "Edited Caption");

res = makeRes();
await postsById(req("PUT", { body: VALID_POST, query: { id: "nonsense" }, cookie: cookieHeader }), res);
assert.equal(res.statusCode, 404, "a malformed id must be 404, not a 500");

res = makeRes();
await postsById(req("DELETE", { query: { id: "nonsense" }, cookie: cookieHeader }), res);
assert.equal(res.statusCode, 404);

res = makeRes();
await postsById(req("DELETE", { query: { id: created.id }, cookie: cookieHeader }), res);
assert.equal(res.statusCode, 200);

res = makeRes();
await postsIndex(req("GET"), res);
assert.equal(res.body.posts.length, 0, "the post should be gone");

/* ---------- 8. Rate limiting locks the email after 5 failures ---------- */
console.log("8. five failures lock the email out");
store.login_attempts.length = 0;
for (let attempt = 0; attempt < 6; attempt += 1) {
  res = makeRes();
  await login(req("POST", { body: { email: "admin@example.org", password: "wrong" } }), res);
  assert.equal(res.statusCode, 401, "every attempt must return the same 401, lockout or not");
  assert.deepEqual(res.body, { ok: false, error: "Invalid email or password" });
}

const locked = store.login_attempts.find((row) => row.lockedUntil > 0);
assert.ok(locked, "the email should be locked out after 5 failures");
assert.ok(locked.lockedUntil > Date.now(), "the lockout window should be in the future");

/* Now the CORRECT password is refused too, because the lockout applies to the
   email rather than to the answer. That is the intended trade-off: a lockout
   is about stopping guessing, not about punishing one person. */
res = makeRes();
await login(req("POST", { body: { email: "admin@example.org", password: "correct-horse-battery" } }), res);
assert.equal(res.statusCode, 401);

/* ---------- 9. Logout clears the cookie ---------- */
console.log("9. logout expires the cookie");
res = makeRes();
await logout(req("POST"), res);
assert.equal(res.statusCode, 200);
assert.deepEqual(res.body, { ok: true });
assert.match(res.headers["set-cookie"], /auvd_admin=;/);
assert.match(res.headers["set-cookie"], /Max-Age=0/);

/* ---------- 10. Method guards ---------- */
console.log("10. wrong methods are 405");
res = makeRes();
await login(req("GET"), res);
assert.equal(res.statusCode, 405);

res = makeRes();
await postsIndex(req("DELETE"), res);
assert.equal(res.statusCode, 405);

res = makeRes();
await postsById(req("POST", { query: { id: created.id }, cookie: cookieHeader }), res);
assert.equal(res.statusCode, 405);

/* ---------- 11. REGISTER: one account, once, ever ----------
   This is the most important rule in the system, so it is tested directly and
   first among the registration checks. */
console.log("11. register creates exactly one account, then refuses forever");

store.admin.length = 0;
store.login_attempts.length = 0;
/* The index is cached on globalThis by lib/adminSetup.js, so it is cleared
   between groups here the same way a fresh serverless instance would be. */
globalThis.__auvdAdminIndexPromise = null;

/* -- setup-status reports "not set up yet" -- */
res = makeRes();
await setupStatus(req("GET"), res);
assert.equal(res.statusCode, 200);
assert.deepEqual(res.body, { ok: true, hasAdmin: false });

/* -- bad input is refused before anything is written -- */
for (const bad of [
  { email: "not-an-email", password: "long-enough-password" },
  { email: "someone@example.org", password: "short" }, // 5 chars
  { email: "someone@example.org", password: "123456789" }, // exactly 9
]) {
  res = makeRes();
  await reg(req("POST", { body: bad }), res);
  assert.equal(res.statusCode, 400, `expected 400 for ${JSON.stringify(bad)}`);
  assert.equal(res.body.error, "Invalid email or password format.");
}
assert.equal(store.admin.length, 0, "a rejected registration must write nothing");

/* -- a valid registration succeeds AND signs you in -- */
res = makeRes();
await reg(
  req("POST", { body: { email: "Owner@Example.org", password: "a-long-enough-password" } }),
  res
);
assert.equal(res.statusCode, 201, `expected 201, got ${res.statusCode} ${JSON.stringify(res.body)}`);
assert.equal(res.body.ok, true);
/* Lowercased on the way in, so login finds it the same way. */
assert.equal(res.body.email, "owner@example.org");
assert.equal("token" in res.body, false, "the JWT must never appear in the body");
assert.equal(store.admin.length, 1, "exactly one document");

/* The stored password must be a bcrypt hash, never the plaintext. */
const stored = store.admin[0];
assert.notEqual(stored.passwordHash, "a-long-enough-password");
assert.match(stored.passwordHash, /^\$2[aby]\$\d{2}\$/, "the password must be bcrypt-hashed");
assert.ok(stored.createdAt instanceof Date, "createdAt must be set");

/* The same cookie as login, so no second step is needed. */
const regCookie = res.headers["set-cookie"];
assert.ok(regCookie, "register must set the session cookie");
assert.match(regCookie, /^auvd_admin=/);
assert.match(regCookie, /HttpOnly/);
assert.match(regCookie, /Secure/);
assert.match(regCookie, /SameSite=Strict/);

/* -- registering also authenticates: /api/admin/me accepts it -- */
res = makeRes();
await me(req("GET", { cookie: regCookie.split(";")[0] }), res);
assert.equal(res.statusCode, 200, "register must leave you signed in");
assert.equal(res.body.email, "owner@example.org");

/* -- THE RULE: a second registration is refused, always -- */
for (let attempt = 0; attempt < 5; attempt += 1) {
  res = makeRes();
  await reg(
    req("POST", { body: { email: `attacker${attempt}@example.org`, password: "another-long-password" } }),
    res
  );
  assert.equal(res.statusCode, 403, `attempt ${attempt + 1} must be refused with 403`);
  assert.deepEqual(res.body, { ok: false, error: "An admin account already exists." });
  assert.equal("token" in res.body, false);
}
assert.equal(store.admin.length, 1, "there must still be exactly one admin document");
assert.equal(store.admin[0].email, "owner@example.org", "the first account must be untouched");

/* -- the refused registration never replaced the password -- */
res = makeRes();
await login(req("POST", { body: { email: "owner@example.org", password: "a-long-enough-password" } }), res);
assert.equal(res.statusCode, 200, "the original password must still work");

/* -- and the attacker's password does not work either -- */
res = makeRes();
await login(req("POST", { body: { email: "attacker0@example.org", password: "another-long-password" } }), res);
assert.equal(res.statusCode, 401, "the refused account must not be able to log in");

/* -- the unique index exists, so the guarantee is the database's, not a check -- */
res = makeRes();
await setupStatus(req("GET"), res);
assert.deepEqual(res.body, { ok: true, hasAdmin: true });

/* -- the race: two simultaneous registrations, one must lose ----------
   Both requests pass the hasAdmin() check before either insert lands, which is
   exactly the window a plain findOne-then-insert would get wrong. The unique
   _id is what makes the second one fail here.

   Each racer needs its OWN res, and the results are read off the res objects
   afterwards — the handlers answer by writing to res and return undefined, so
   the status has to be collected from the stubs, not from the return value. */
store.admin.length = 0;
globalThis.__auvdAdminIndexPromise = null;

const raceRes = [makeRes(), makeRes()];
await Promise.all([
  reg(req("POST", { body: { email: "first@example.org", password: "a-long-enough-password" } }), raceRes[0]),
  reg(req("POST", { body: { email: "second@example.org", password: "a-long-enough-password" } }), raceRes[1]),
]);

const winners = raceRes.filter((r) => r.statusCode === 201);
const losers = raceRes.filter((r) => r.statusCode === 403);
assert.equal(
  winners.length,
  1,
  `exactly one racer must win, got ${raceRes.map((r) => r.statusCode).join(", ")}`
);
assert.equal(losers.length, 1, "the other racer must be refused with 403");
assert.deepEqual(losers[0].body, { ok: false, error: "An admin account already exists." });
assert.equal(store.admin.length, 1, "the race must still leave exactly one admin");

console.log("\n✔ All API checks passed.\n");
