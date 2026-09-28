#!/usr/bin/env node
/**
 * test:subscribe — proves api/subscribe.js ALWAYS answers.
 *
 * The bug this guards against: a handler that RETURNS an object instead of
 * writing to Vercel's `res`. No response is ever sent, so the browser waits
 * forever and the form sits on "Sending...".
 *
 * Every case below calls the real handler with a fake req/res and a stubbed
 * global fetch, and asserts that a response came back. The real Brevo API is
 * never contacted.
 */
import handler from "../api/subscribe.js";

export const GOOD_ENV = {
  BREVO_API_KEY: "test-key-not-real",
  BREVO_DOI_TEMPLATE_ID: "42",
  SITE_URL: "https://example.org",
};

export const VALID_BODY = {
  email: "visitor@example.com",
  topics: ["music"],
  lang: "en",
  hp_field: "",
  t: 5000,
};

/** Stand-in for Vercel's response object. */
export function makeRes() {
  return {
    statusCode: null,
    body: null,
    headersSent: false,
    headers: {},
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      this.headersSent = true;
      return this;
    },
  };
}

export const jsonResponse = (payload, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => JSON.stringify(payload),
});

/** The eight news-<topic>-<lang> lists, as Brevo would return them. */
export const existingLists = () => {
  const lists = [];
  for (const topic of ["education", "music", "dance", "vocational"]) {
    for (const lang of ["en", "fr"]) {
      lists.push({ id: lists.length + 100, name: `news-${topic}-${lang}`, folderId: 7 });
    }
  }
  return lists;
};

export const existingFolder = { folders: [{ id: 7, name: "AUVD News" }] };

/** A stub that records its calls so a test can assert nothing was called. */
export function makeFetchStub(routes) {
  const calls = [];
  const stub = async (url, options = {}) => {
    calls.push({ url, method: options.method ?? "GET" });
    return routes(url, options, calls.length);
  };
  stub.calls = calls;
  return stub;
}

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

/** Runs the handler with the environment, body and fetch stub in place. */
async function call({ env = GOOD_ENV, body = VALID_BODY, method = "POST", fetchImpl }) {
  const savedEnv = { ...process.env };
  process.env = { ...process.env, ...env };
  for (const key of Object.keys(GOOD_ENV)) {
    if (!env[key]) delete process.env[key];
  }

  const realFetch = globalThis.fetch;
  const realLog = console.log;
  globalThis.fetch = fetchImpl;
  let logged = "";
  console.log = (...args) => { logged += args.join(" "); };

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

  return { res, elapsed, thrown, logged };
}

/** Asserts a response was written, plus whatever the case expects. */
async function scenario(name, options, expect = {}) {
  const { res, elapsed, thrown, logged } = await call(options);
  const answered = res.headersSent && res.statusCode !== null;

  check(`${name} — no exception escaped`, thrown === null, thrown ? String(thrown.message) : "");
  check(`${name} — a response was written on res`, answered, answered ? `status ${res.statusCode}` : "NOTHING SENT — this is the hang");
  if (expect.status !== undefined && answered) {
    check(`${name} — status ${expect.status}`, res.statusCode === expect.status, `got ${res.statusCode}`);
  }
  if (expect.body && answered) {
    check(`${name} — body is correct`, expect.body(res.body), JSON.stringify(res.body));
  }
  if (expect.under !== undefined) {
    check(`${name} — answered within ${expect.under}ms`, elapsed < expect.under, `${elapsed}ms`);
  }
  if (expect.noCalls) {
    check(`${name} — Brevo was never contacted`, options.fetchImpl.calls.length === 0, `${options.fetchImpl.calls.length} call(s)`);
  }
  if (expect.logIncludes) {
    check(`${name} — log names the missing variable, not its value`,
      logged.includes(expect.logIncludes) && !logged.includes("test-key-not-real"),
      logged.trim());
  }
  return { res, elapsed, calls: options.fetchImpl.calls ?? [] };
}

/* A realistic Brevo: folder and lists exist, contact is unknown, so the
   double opt-in endpoint is the one that answers. */
const healthyBrevo = (url) => {
  if (url.includes("/contacts/folders")) return jsonResponse(existingFolder);
  if (url.includes("/contacts/lists")) return jsonResponse({ lists: existingLists() });
  if (url.includes("doubleOptinConfirmation")) return jsonResponse({}, 201);
  if (/\/contacts\/[^/?]+$/.test(url)) return jsonResponse({ message: "Contact does not exist" }, 404);
  return jsonResponse({ id: 1 }, 201);
};


console.log("test:subscribe — every path must answer\n");

/* The cold-start case must run FIRST, while the module's id cache is still
   empty, because a warm instance legitimately skips the folder and list
   calls. Every later scenario therefore also doubles as the "warm" test. */
const creatingStub = makeFetchStub((url, options) => {
  if (url.includes("/contacts/folders")) {
    if (options.method === "POST") return jsonResponse({ id: 55 }, 201);
    return jsonResponse({ folders: [] });
  }
  if (url.includes("/contacts/lists")) {
    if (options.method === "POST") return jsonResponse({ id: 900 + creatingStub.calls.length }, 201);
    return jsonResponse({ lists: [] });
  }
  if (url.includes("doubleOptinConfirmation")) return jsonResponse({}, 201);
  if (/\/contacts\/[^/?]+$/.test(url)) return jsonResponse({ message: "not found" }, 404);
  return jsonResponse({ id: 1 }, 201);
});
await scenario("0. cold instance: nothing exists yet, so it is created", {
  fetchImpl: creatingStub,
}, { status: 200, body: (b) => b.ok === true });
check("0. cold instance — the folder and the eight lists were created",
  creatingStub.calls.length >= 10,
  `${creatingStub.calls.length} Brevo call(s): ${creatingStub.calls.map((c) => `${c.method} ${new URL(c.url).pathname}`).join(", ")}`);

// 1. Happy path
await scenario("1. Brevo accepts a new subscriber", {
  fetchImpl: makeFetchStub(healthyBrevo),
}, { status: 200, body: (b) => b.ok === true });

// 2. Existing, already-confirmed contact is added to the lists directly
await scenario("2. existing confirmed contact", {
  fetchImpl: makeFetchStub((url) => {
    if (url.includes("/contacts/add")) return jsonResponse({ contacts: { success: ["visitor@example.com"] } }, 201);
    if (url.includes("/contacts/folders")) return jsonResponse(existingFolder);
    if (url.includes("/contacts/lists")) return jsonResponse({ lists: existingLists() });
    if (/\/contacts\/[^/?]+$/.test(url)) return jsonResponse({ email: "visitor@example.com", isBlacklisted: false });
    return jsonResponse({ id: 1 }, 201);
  }),
}, { status: 200, body: (b) => b.ok === true });

// 3. Previously unsubscribed: silently ignored, nothing changed
await scenario("3. blacklisted contact", {
  fetchImpl: makeFetchStub((url) => {
    if (url.includes("/contacts/folders")) return jsonResponse(existingFolder);
    if (url.includes("/contacts/lists")) return jsonResponse({ lists: existingLists() });
    if (/\/contacts\/[^/?]+$/.test(url)) return jsonResponse({ email: "visitor@example.com", isBlacklisted: true });
    return jsonResponse({ id: 1 }, 201);
  }),
}, { status: 200, body: (b) => b.ok === true, noCalls: false });



// 3b. Blacklisted: prove no list was modified even though the call succeeded.
const blacklistedStub = makeFetchStub((url) => {
  if (url.includes("/contacts/folders")) return jsonResponse(existingFolder);
  if (url.includes("/contacts/lists")) return jsonResponse({ lists: existingLists() });
  if (url.includes("/contacts/add")) return jsonResponse({ contacts: { success: ["visitor@example.com"] } }, 201);
  if (/\/contacts\/[^/?]+$/.test(url)) return jsonResponse({ email: "visitor@example.com", isBlacklisted: true });
  return jsonResponse({ id: 1 }, 201);
});
await call({ fetchImpl: blacklistedStub });
check("3b. blacklisted contact — no list was changed",
  !blacklistedStub.calls.some((c) => c.url.includes("/contacts/add")),
  `${blacklistedStub.calls.length} Brevo call(s), none of them an add`);

// 4. Brevo answers 400
await scenario("4. Brevo returns 400", {
  fetchImpl: makeFetchStub((url) => {
    if (url.includes("/contacts/folders")) return jsonResponse(existingFolder);
    if (url.includes("/contacts/lists")) return jsonResponse({ lists: existingLists() });
    if (url.includes("doubleOptinConfirmation")) return jsonResponse({ message: "Bad request", code: "invalid_parameter" }, 400);
    if (/\/contacts\/[^/?]+$/.test(url)) return jsonResponse({ message: "not found" }, 404);
    return jsonResponse({}, 201);
  }),
}, { status: 500, body: (b) => b.ok === false && typeof b.error === "string" });

// 5. Brevo answers 500
await scenario("5. Brevo returns 500", {
  fetchImpl: makeFetchStub((url) => {
    if (url.includes("/contacts/folders")) return jsonResponse(existingFolder);
    if (url.includes("/contacts/lists")) return jsonResponse({ lists: existingLists() });
    if (url.includes("doubleOptinConfirmation")) return jsonResponse({ message: "Internal server error" }, 500);
    if (/\/contacts\/[^/?]+$/.test(url)) return jsonResponse({ message: "not found" }, 404);
    return jsonResponse({}, 201);
  }),
}, { status: 500, body: (b) => b.ok === false });

// 6. Brevo never answers — must be cut loose by the abort signal
const neverAnswers = makeFetchStub((_url, options) => new Promise((_resolve, reject) => {
  const signal = options.signal;
  if (!signal) return; // no signal at all would hang forever: that is the bug
  signal.addEventListener("abort", () => {
    const error = new Error("The operation was aborted.");
    error.name = "TimeoutError";
    reject(error);
  });
}));
await scenario("6. Brevo never answers", {
  fetchImpl: neverAnswers,
}, { status: 504, under: 9000 });

// 7. A missing environment variable must fail fast and name the variable
for (const missing of ["BREVO_API_KEY", "BREVO_DOI_TEMPLATE_ID", "SITE_URL"]) {
  const env = { ...GOOD_ENV, [missing]: "" };
  await scenario(`7. missing ${missing}`, {
    env,
    fetchImpl: makeFetchStub(healthyBrevo),
  }, { status: 500, body: (b) => b.ok === false, noCalls: true, logIncludes: missing });
}

// 8-10. Validation, answered before any Brevo call
await scenario("8. invalid email", {
  body: { ...VALID_BODY, email: "not-an-email" },
  fetchImpl: makeFetchStub(healthyBrevo),
}, { status: 400, body: (b) => b.ok === false, noCalls: true });

await scenario("9. no topics selected", {
  body: { ...VALID_BODY, topics: [] },
  fetchImpl: makeFetchStub(healthyBrevo),
}, { status: 400, body: (b) => b.ok === false, noCalls: true });

await scenario("10. GET instead of POST", {
  method: "GET",
  fetchImpl: makeFetchStub(healthyBrevo),
}, { status: 405, body: (b) => b.ok === false, noCalls: true });

// 11. Honeypot
await scenario("11. filled honeypot (hp_field)", {
  body: { ...VALID_BODY, hp_field: "http://spam.example" },
  fetchImpl: makeFetchStub(healthyBrevo),
}, { status: 200, body: (b) => b.ok === true, noCalls: true });

// 11b. The old "website" key is still honoured, so a stale cached page cannot
//      autofill a real visitor into being discarded.
await scenario("11b. filled honeypot (legacy website key)", {
  body: { ...VALID_BODY, hp_field: "", website: "http://spam.example" },
  fetchImpl: makeFetchStub(healthyBrevo),
}, { status: 200, body: (b) => b.ok === true, noCalls: true });

// 12. Submitted faster than a human could
await scenario("12. submitted in under 3s", {
  body: { ...VALID_BODY, t: 500 },
  fetchImpl: makeFetchStub(healthyBrevo),
}, { status: 200, body: (b) => b.ok === true, noCalls: true });

// 13. Unparseable body
await scenario("13. body is not valid JSON", {
  body: "this is not json",
  fetchImpl: makeFetchStub(healthyBrevo),
}, { status: 400, body: (b) => b.ok === false, noCalls: true });

// 14. After the cold start above, the ids are cached in module memory, so a
//     following request must not re-read folders and lists.
const warmStub = makeFetchStub(healthyBrevo);
await scenario("14. warm instance reuses the cached ids", {
  fetchImpl: warmStub,
}, { status: 200, body: (b) => b.ok === true });
check("14. warm instance — folders and lists were not fetched or created again",
  !warmStub.calls.some((c) => c.url.includes("/contacts/folders") || c.url.includes("/contacts/lists")),
  `${warmStub.calls.length} Brevo call(s): ${warmStub.calls.map((c) => `${c.method} ${new URL(c.url).pathname}`).join(", ")}`);

console.log(`\n${"-".repeat(62)}`);
console.log(`${passed} passed, ${failed} failed`);
console.log(`${"-".repeat(62)}`);

if (failed > 0) {
  console.log("\n✖ test:subscribe FAILED");
  process.exit(1);
}
console.log("\n✔ test:subscribe passed — the function answers in every case.");

