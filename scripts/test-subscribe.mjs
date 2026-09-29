#!/usr/bin/env node
/**
 * test:subscribe — proves api/subscribe.js always answers, and that the normal
 * path is at most TWO Resend calls.
 *
 * The real Resend API is never contacted: global fetch is stubbed for every
 * case. src/data/resend-config.json is read by the function from disk, so the
 * test swaps in plausible topic ids for the duration of the run and restores
 * the real file in a finally block.
 *
 *   npm run test:subscribe
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import handler from "../api/subscribe.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, "..");
const CONFIG_FILE = path.join(projectRoot, "src", "data", "resend-config.json");

/* Plausible-looking uuids standing in for the four real topic ids. */
const STUB_TOPIC_IDS = {
  education: "11111111-1111-4111-8111-111111111111",
  music: "22222222-2222-4222-8222-222222222222",
  dance: "33333333-3333-4333-8333-333333333333",
  vocational: "44444444-4444-4444-8444-444444444444",
};

let passed = 0;
let failed = 0;
const check = (name, condition, detail = "") => {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

const GOOD_ENV = {
  RESEND_API_KEY: "test-key-not-real",
  RESEND_FROM: "AUVD News <news@example.org>",
  SITE_URL: "https://example.org",
};

const VALID_BODY = { email: "visitor@example.com", topics: ["music"], lang: "en", hp_field: "", t: 5000 };

/** Stand-in for Vercel's response object. */
function makeRes() {
  return {
    statusCode: null, body: null, headersSent: false, headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(c) { this.statusCode = c; return this; },
    json(p) { this.body = p; this.headersSent = true; return this; },
  };
}

const jsonResponse = (payload, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => JSON.stringify(payload),
});

/** Stub that also records the request body and auth header, for assertions. */
function makeFetchStub(routes) {
  const calls = [];
  const stub = async (url, options = {}) => {
    let body = null;
    try {
      body = options.body ? JSON.parse(options.body) : null;
    } catch {
      body = options.body ?? null;
    }
    calls.push({ url, method: options.method ?? "GET", body, auth: options.headers?.Authorization });
    return routes(url, options, calls.length, body);
  };
  stub.calls = calls;
  return stub;
}

async function call({ env = GOOD_ENV, body = VALID_BODY, method = "POST", fetchImpl }) {
  const savedEnv = { ...process.env };
  process.env = { ...process.env, ...env };
  for (const key of Object.keys(GOOD_ENV)) if (!env[key]) delete process.env[key];

  const realFetch = globalThis.fetch;
  const realLog = console.log;
  globalThis.fetch = fetchImpl;
  let logged = "";
  console.log = (...a) => { logged += a.join(" "); };

  const res = makeRes();
  const started = Date.now();
  let thrown = null;
  try {
    await handler({ method, body, headers: {} }, res);
  } catch (error) {
    thrown = error;
  }

  const elapsed = Date.now() - started;
  console.log = realLog;
  globalThis.fetch = realFetch;
  process.env = savedEnv;
  return { res, elapsed, thrown, logged, calls: fetchImpl.calls ?? [] };
}

async function scenario(name, options, expect = {}) {
  const { res, elapsed, thrown, logged, calls } = await call(options);
  const answered = res.headersSent && res.statusCode !== null;

  check(`${name} — no exception escaped`, thrown === null, thrown ? String(thrown.message) : "");
  check(`${name} — a response was written on res`, answered, answered ? `status ${res.statusCode}` : "NOTHING SENT");
  if (expect.status !== undefined && answered) {
    check(`${name} — status ${expect.status}`, res.statusCode === expect.status, `got ${res.statusCode}`);
  }
  if (expect.code && answered) {
    check(`${name} — code "${expect.code}"`, res.body?.code === expect.code, JSON.stringify(res.body));
  }
  if (expect.ok !== undefined && answered) {
    check(`${name} — ok is ${expect.ok}`, res.body?.ok === expect.ok, JSON.stringify(res.body));
  }
  if (expect.calls !== undefined) {
    check(`${name} — made ${expect.calls} Resend call(s)`, calls.length === expect.calls,
      calls.map((c) => `${c.method} ${new URL(c.url).pathname}`).join(", "));
  }
  if (expect.noCalls) check(`${name} — Resend was never contacted`, calls.length === 0, `${calls.length} call(s)`);
  if (expect.under !== undefined) check(`${name} — answered within ${expect.under}ms`, elapsed < expect.under, `${elapsed}ms`);
  if (expect.logIncludes) {
    check(`${name} — log names it, never the key`,
      logged.includes(expect.logIncludes) && !logged.includes("test-key-not-real"), logged.trim());
  }
  if (expect.logHides) {
    check(`${name} — the full email is never logged`, !logged.includes("visitor@example.com"), logged.trim());
  }
  return { res, elapsed, calls, logged };
}

/* A brand new address: the lookup 404s, then the contact is created. */
const newContact = () => jsonResponse({ message: "Contact not found" }, 404);

console.log("test:subscribe — every path must answer, and the normal path is at most TWO calls\n");


/* Swap in plausible topic ids for the run; the real file is restored below. */
const originalConfigFile = fs.readFileSync(CONFIG_FILE, "utf8");
try {
  fs.writeFileSync(
    CONFIG_FILE,
    `${JSON.stringify({
      _note: "stubbed by scripts/test-subscribe.mjs",
      segmentId: "55555555-5555-4555-8555-555555555555",
      segmentName: "AUVD News",
      topics: STUB_TOPIC_IDS,
      topicNames: {},
    }, null, 2)}\n`,
    "utf8"
  );

  // 1. A brand new subscriber: GET (404) then POST /contacts. Two calls.
  const createOk = makeFetchStub((url) =>
    /\/contacts\/[^/?]+$/.test(url) ? newContact() : jsonResponse({ object: "contact", id: "abc" }, 201));
  await scenario("1. new subscriber is created immediately", { fetchImpl: createOk },
    { status: 200, ok: true, calls: 2, logHides: true });
  check("1. no confirmation email — the contact is POSTed straight away",
    createOk.calls[1]?.method === "POST" && createOk.calls[1]?.url.endsWith("/contacts"),
    `${createOk.calls[1]?.method} ${createOk.calls[1]?.url}`);
  check("1. the new contact is opted in to the chosen topic",
    Array.isArray(createOk.calls[1]?.body?.topics) &&
      createOk.calls[1].body.topics[0]?.id === STUB_TOPIC_IDS.music &&
      createOk.calls[1].body.topics[0]?.subscription === "opt_in",
    JSON.stringify(createOk.calls[1]?.body));
  check("1. the key is a bearer header, never in the body",
    createOk.calls[1]?.auth === "Bearer test-key-not-real" &&
      !JSON.stringify(createOk.calls[1]?.body).includes("test-key-not-real"),
    String(createOk.calls[1]?.auth));

  // 2. An existing, still-subscribed contact: GET then PATCH topics. Two calls.
  //    This is the "submitting twice adds topics rather than replacing them" case.
  const existing = makeFetchStub((url, options) => {
    if (options.method === "PATCH") return jsonResponse({ object: "contact_topics", id: STUB_TOPIC_IDS.music });
    if (/\/contacts\/[^/?]+$/.test(url)) return jsonResponse({ id: "abc", email: "visitor@example.com", unsubscribed: false });
    return jsonResponse({}, 201);
  });
  await scenario("2. existing contact has the new topic added", { fetchImpl: existing },
    { status: 200, ok: true, calls: 2, logHides: true });
  check("2. the update is a PATCH to the contact's topics",
    existing.calls[1]?.method === "PATCH" && existing.calls[1]?.url.endsWith("/topics"),
    `${existing.calls[1]?.method} ${existing.calls[1]?.url}`);
  check("2. only the chosen topic is sent, and the old ones are left alone",
    existing.calls[1]?.body?.length === 1 && existing.calls[1].body[0]?.id === STUB_TOPIC_IDS.music,
    JSON.stringify(existing.calls[1]?.body));
  check("2. adding a topic never opts the contact out of anything",
    !JSON.stringify(existing.calls[1]?.body).includes("opt_out"),
    JSON.stringify(existing.calls[1]?.body));

  // 2b. A second submission with DIFFERENT topics adds rather than replaces.
  const second = makeFetchStub((url, options) => {
    if (options.method === "PATCH") return jsonResponse({ object: "contact_topics", id: STUB_TOPIC_IDS.dance });
    if (/\/contacts\/[^/?]+$/.test(url)) return jsonResponse({ id: "abc", email: "visitor@example.com", unsubscribed: false });
    return jsonResponse({}, 201);
  });
  await call({ body: { ...VALID_BODY, topics: ["dance", "vocational"] }, fetchImpl: second });
  check("2b. two topics chosen at once are both sent as opt_in",
    second.calls[1]?.body?.length === 2 &&
      second.calls[1].body.every((entry) => entry.subscription === "opt_in") &&
      second.calls[1].body.map((e) => e.id).sort().join() ===
        [STUB_TOPIC_IDS.dance, STUB_TOPIC_IDS.vocational].sort().join(),
    JSON.stringify(second.calls[1]?.body));

  // 3. A contact who unsubscribed: nothing is changed, but the answer is the
  //     same generic success, so the API never reveals they are on the list.
  const unsubscribed = makeFetchStub((url, options) => {
    if (options.method === "PATCH") return jsonResponse({}, 200);
    return jsonResponse({ id: "abc", email: "visitor@example.com", unsubscribed: true });
  });
  await scenario("3. an unsubscribed contact is left alone", { fetchImpl: unsubscribed },
    { status: 200, ok: true, calls: 1 });
  check("3. nothing was written for an unsubscribed contact",
    !unsubscribed.calls.some((c) => c.method === "POST" || c.method === "PATCH"),
    unsubscribed.calls.map((c) => c.method).join(", "));

  // 4. Resend fails.
  await scenario("4. Resend returns 500", {
    fetchImpl: makeFetchStub(() => jsonResponse({ message: "Internal server error" }, 500)),
  }, { status: 500, ok: false, calls: 1 });

  await scenario("4b. Resend rejects the API key", {
    fetchImpl: makeFetchStub(() => jsonResponse({ message: "API key is invalid" }, 401)),
  }, { status: 500, ok: false, calls: 1 });

  // 5. Resend never answers: must be cut loose inside the budget.
  const neverAnswers = makeFetchStub((_url, options) => new Promise((_r, reject) => {
    const signal = options.signal;
    if (!signal) return; // no signal at all would hang forever
    signal.addEventListener("abort", () => {
      const error = new Error("aborted");
      error.name = "TimeoutError";
      reject(error);
    });
  }));
  await scenario("5. Resend never answers", { fetchImpl: neverAnswers }, { status: 504, under: 9000 });

  // 6. A missing environment variable, for each of the three.
  for (const missing of ["RESEND_API_KEY", "RESEND_FROM", "SITE_URL"]) {
    await scenario(`6. missing ${missing}`, {
      env: { ...GOOD_ENV, [missing]: "" },
      fetchImpl: makeFetchStub(newContact),
    }, { status: 500, code: "config", noCalls: true, logIncludes: missing });
  }

  // 7. Validation, answered before any Resend call.
  await scenario("7. invalid email", {
    body: { ...VALID_BODY, email: "not-an-email" }, fetchImpl: makeFetchStub(newContact),
  }, { status: 400, code: "email", noCalls: true });

  await scenario("7b. no topics", {
    body: { ...VALID_BODY, topics: [] }, fetchImpl: makeFetchStub(newContact),
  }, { status: 400, code: "topics", noCalls: true });

  await scenario("7c. GET instead of POST", {
    method: "GET", fetchImpl: makeFetchStub(newContact),
  }, { status: 405, code: "method", noCalls: true });

  // 8. Honeypot and the too-fast rule — same generic success, no Resend calls.
  await scenario("8. filled honeypot (hp_field)", {
    body: { ...VALID_BODY, hp_field: "http://spam.example" }, fetchImpl: makeFetchStub(newContact),
  }, { status: 200, ok: true, noCalls: true });

  await scenario("8b. filled honeypot (legacy website key)", {
    body: { ...VALID_BODY, hp_field: "", website: "http://spam.example" }, fetchImpl: makeFetchStub(newContact),
  }, { status: 200, ok: true, noCalls: true });

  await scenario("8c. submitted in under 3s", {
    body: { ...VALID_BODY, t: 500 }, fetchImpl: makeFetchStub(newContact),
  }, { status: 200, ok: true, noCalls: true });

  // 9. An unknown topic is dropped, but a valid one alongside it still works.
  const mixed = makeFetchStub((url) =>
    /\/contacts\/[^/?]+$/.test(url) ? newContact() : jsonResponse({ id: "abc" }, 201));
  await call({ body: { ...VALID_BODY, topics: ["music", "not-a-topic"] }, fetchImpl: mixed });
  check("9. an unknown topic is dropped, the valid one is kept",
    mixed.calls[1]?.body?.topics?.length === 1 && mixed.calls[1].body.topics[0]?.id === STUB_TOPIC_IDS.music,
    JSON.stringify(mixed.calls[1]?.body?.topics));

  // 10. French is accepted.
  const french = makeFetchStub((url) =>
    /\/contacts\/[^/?]+$/.test(url) ? newContact() : jsonResponse({ id: "abc" }, 201));
  await call({ body: { ...VALID_BODY, lang: "fr" }, fetchImpl: french });
  check("10. a French signup is accepted", french.calls.length === 2, `${french.calls.length} call(s)`);

  // 11. Setup has not been run yet: refuse clearly instead of failing obscurely.
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ _note: "test", topics: {} }, null, 2), "utf8");
  await scenario("11. setup-resend has not been run yet", {
    fetchImpl: makeFetchStub(newContact),
  }, { status: 500, code: "config", noCalls: true, logIncludes: "setup-resend" });
} finally {
  fs.writeFileSync(CONFIG_FILE, originalConfigFile, "utf8");
  check("12. the real resend-config.json was restored",
    fs.readFileSync(CONFIG_FILE, "utf8") === originalConfigFile);
}

console.log(`\n${"-".repeat(62)}`);
console.log(`${passed} passed, ${failed} failed`);
console.log(`${"-".repeat(62)}`);
if (failed > 0) {
  console.log("\n✖ test:subscribe FAILED");
  process.exit(1);
}
console.log("\n✔ test:subscribe passed — the function answers in every case.");
