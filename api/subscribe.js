/**
 * /api/subscribe — AUVD newsletter signups.
 *
 * SIGNATURE
 * ---------
 * Vercel's Node runtime calls the default export as (req, res) and expects the
 * response to be written on `res`. A handler that RETURNS an object instead of
 * writing to `res` never sends anything, and the browser waits forever — which
 * is exactly the "Sending..." that never finishes. Every path below therefore
 * ends in sendJson(), which always writes a response.
 *
 * ENVIRONMENT (set in Vercel for the Production environment)
 *   BREVO_API_KEY          Brevo API key. Never prefixed with VITE_.
 *   BREVO_DOI_TEMPLATE_ID  numeric id of the double opt-in template.
 *   SITE_URL               public https URL, no trailing slash.
 *
 * TIMING
 * ------
 * Every Brevo call gets AbortSignal.timeout() and the whole request is held
 * under a deadline, so the function always answers well inside Vercel's
 * function limit instead of being cut off with the connection still open.
 */

const BREVO_BASE = "https://api.brevo.com/v3";

const TOPICS = ["education", "music", "dance", "vocational"];

/* Per-call ceiling and the deadline for the whole request. The critical path
   is lists -> contact lookup -> opt-in, so 4s each could reach 12s; the
   deadline below trims the last call so the total stays under 8s. */
const BREVO_CALL_TIMEOUT_MS = 4000;
const TOTAL_BUDGET_MS = 8000;

/* One page is plenty: these are 8 lists and 1 folder. Capped so a future
   account with many lists can never turn this into an endless loop. */
const PAGE_SIZE = 100;
const MAX_PAGES = 3;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Ids are cached for the lifetime of the warm function instance, so only the
   first signup after a cold start talks to Brevo about folders and lists. */
const cache = {
  folderId: null,
  listIds: new Map(), // "news-music-fr" -> id
};

const listName = (topic, lang) => `news-${topic}-${lang}`;

const log = (step, detail = "") => {
  console.log(`[subscribe] ${step}${detail ? ` — ${detail}` : ""}`);
};

/* The deadline is created per request, not per call. */
let deadlineAt = 0;

const remainingMs = () => Math.max(0, deadlineAt - Date.now());

class BrevoError extends Error {
  constructor(message, { status = 0, code = "", timedOut = false } = {}) {
    super(message);
    this.name = "BrevoError";
    this.status = status;
    this.code = code;
    this.timedOut = timedOut;
  }
}

/** Always answers, and never leaks anything about the request to the visitor. */
function sendJson(res, status, body) {
  if (res.headersSent) return;
  try {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
  } catch {
    /* A stubbed res in tests may not implement setHeader. */
  }
  res.status(status).json(body);
}

const GENERIC_ERROR = { ok: false, error: "Something went wrong. Please try again later." };
const SUCCESS = { ok: true };

/**
 * One Brevo call, bounded in time. Logs the status and Brevo's own message on
 * failure so the Vercel log shows exactly which call stopped, never the key.
 */
async function brevo(path, { method = "GET", body } = {}) {
  const budget = Math.min(BREVO_CALL_TIMEOUT_MS, remainingMs());
  if (budget <= 0) {
    throw new BrevoError(`no time budget left for ${method} ${path}`, { timedOut: true });
  }

  /* An AbortController plus a normal setTimeout is used instead of
     AbortSignal.timeout(). AbortSignal.timeout's internal timer is NOT
     referenced, so on Node it does not keep the event loop alive: with nothing
     else pending, the runtime can suspend or tear down the invocation while
     this request is still in flight, which is precisely the "never finishes"
     symptom. A normal setTimeout is referenced, and clearTimeout in `finally`
     keeps it from holding the loop open afterwards. */
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), budget);

  let response;
  try {
    response = await fetch(`${BREVO_BASE}${path}`, {
      method,
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
    });
  } catch (error) {
    const timedOut = controller.signal.aborted || error?.name === "TimeoutError" || error?.name === "AbortError";
    throw new BrevoError(`${method} ${path} ${timedOut ? "timed out" : "network error"}: ${error?.message ?? error}`, {
      timedOut,
    });
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text().catch(() => "");
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    /* Never includes the key, only the status and Brevo's message. */
    throw new BrevoError(
      `${method} ${path} -> HTTP ${response.status}${payload?.message ? ` ${payload.message}` : ""}`,
      { status: response.status, code: payload?.code ?? "" }
    );
  }

  return payload;
}

/** One page of a Brevo collection, with a hard cap on the number of pages. */
async function fetchPaged(path, key) {
  const all = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const offset = page * PAGE_SIZE;
    const separator = path.includes("?") ? "&" : "?";
    const body = await brevo(`${path}${separator}limit=${PAGE_SIZE}&offset=${offset}&sort=asc`);
    const batch = Array.isArray(body?.[key]) ? body[key] : [];
    all.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }
  return all;
}

/**
 * The "AUVD News" folder id, and the ids of the eight news-<topic>-<lang>
 * lists. Folders and lists are fetched once, in parallel, and only the
 * missing entries are created — also in parallel. On a warm instance this
 * whole step is skipped.
 */
async function ensureLists() {
  const wanted = [];
  for (const topic of TOPICS) {
    for (const lang of ["en", "fr"]) {
      wanted.push(listName(topic, lang));
    }
  }
  if (wanted.every((name) => cache.listIds.has(name))) {
    return cache.listIds;
  }

  const [folders, lists] = await Promise.all([
    fetchPaged("/contacts/folders", "folders"),
    fetchPaged("/contacts/lists", "lists"),
  ]);

  const folder = folders.find((entry) => entry?.name === "AUVD News");
  let folderId = cache.folderId ?? folder?.id ?? null;

  if (!folderId) {
    const created = await brevo("/contacts/folders", { method: "POST", body: { name: "AUVD News" } });
    folderId = created?.id ?? null;
    cache.folderId = folderId;
    log("created folder", `id=${folderId}`);
  }

  const missing = wanted.filter((name) => !lists.some((list) => list?.name === name));

  if (missing.length) {
    const created = await Promise.all(
      missing.map((name) => brevo("/contacts/lists", { method: "POST", body: { name, folderId } }))
    );
    for (let index = 0; index < missing.length; index += 1) {
      const id = created[index]?.id;
      if (id) cache.listIds.set(missing[index], id);
    }
    log("created lists", `${missing.length} (${missing.join(", ")})`);
  }

  for (const list of lists) {
    if (list?.id && list?.name && wanted.includes(list.name) && !cache.listIds.has(list.name)) {
      cache.listIds.set(list.name, list.id);
    }
  }

  log("lists ready", `${cache.listIds.size}/8`);
  return cache.listIds;
}

/** null when the address is unknown to Brevo. */
async function findContact(email) {
  try {
    return await brevo(`/contacts/${encodeURIComponent(email)}`);
  } catch (error) {
    if (error.status === 404) {
      log("contact lookup", "not found (new subscriber)");
      return null;
    }
    throw error;
  }
}


/** Vercel calls this as (req, res). Every branch answers. */
export default async function handler(req, res) {
  deadlineAt = Date.now() + TOTAL_BUDGET_MS;

  try {
    if (req.method !== "POST") {
      log("rejected", `method ${req.method}`);
      return sendJson(res, 405, { ok: false, error: "Method not allowed." });
    }

    /* Environment first, so a missing variable is an instant clear 500 rather
       than a long chain of failing Brevo calls. Only the NAMES are logged. */
    const missing = ["BREVO_API_KEY", "BREVO_DOI_TEMPLATE_ID", "SITE_URL"].filter(
      (name) => !String(process.env[name] ?? "").trim()
    );
    if (missing.length) {
      log("misconfigured", `missing env var(s): ${missing.join(", ")}`);
      return sendJson(res, 500, GENERIC_ERROR);
    }

    const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
    if (!Number.isFinite(templateId)) {
      log("misconfigured", "BREVO_DOI_TEMPLATE_ID is not a number");
      return sendJson(res, 500, GENERIC_ERROR);
    }

    let payload = req.body;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch {
        return sendJson(res, 400, { ok: false, error: "Invalid request body." });
      }
    }
    if (!payload || typeof payload !== "object") {
      return sendJson(res, 400, { ok: false, error: "Invalid request body." });
    }

    /* Honeypot. The form sends the neutral "hp_field"; the old "website" key is
       still honoured so a stale cached page cannot make a real visitor look
       like a bot. Both are read independently, because hp_field is present but
       empty on a normal submission and must not mask a filled legacy key. */
    const honeypot =
      String(payload.hp_field ?? "").trim() || String(payload.website ?? "").trim();
    if (honeypot) {
      log("honeypot filled", "ignored silently");
      return sendJson(res, 200, SUCCESS);
    }

    /* A form filled in faster than a person could read it is a bot. */
    const elapsed = Number(payload.t);
    if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 3000) {
      log("submitted too fast", `${elapsed}ms`);
      return sendJson(res, 200, SUCCESS);
    }

    const email = String(payload.email ?? "").trim().toLowerCase();
    const topics = Array.isArray(payload.topics) ? payload.topics : [];
    const lang = payload.lang === "fr" ? "fr" : "en";

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      log("rejected", "invalid email");
      return sendJson(res, 400, { ok: false, error: "Invalid email address." });
    }

    const chosen = [...new Set(topics.filter((topic) => TOPICS.includes(topic)))];
    if (chosen.length === 0) {
      log("rejected", "no topics selected");
      return sendJson(res, 400, { ok: false, error: "No topics selected." });
    }

    log("start", `${chosen.join("+")}/${lang}`);

    const lists = await ensureLists();
    const listIds = chosen.map((topic) => {
      const id = lists.get(listName(topic, lang));
      if (!id) throw new BrevoError(`list ${listName(topic, lang)} missing`);
      return id;
    });

    const contact = await findContact(email);

    if (contact) {
      const blacklisted = contact.isBlacklisted === true || contact.emailBlacklisted === true;
      if (blacklisted) {
        /* Previously unsubscribed: honour it, change nothing, and still answer
           normally so the visitor cannot infer their own state. */
        log("blacklisted", "unsubscribed contact, no change");
        return sendJson(res, 200, SUCCESS);
      }

      await Promise.all(
        listIds.map((listId) => brevo(`/contacts/lists/${listId}/contacts/add`, {
          method: "POST",
          body: { emails: [email] },
        }))
      );
      log("added existing contact", `${listIds.length} list(s)`);
      return sendJson(res, 200, SUCCESS);
    }

    await brevo("/contacts/doubleOptinConfirmation", {
      method: "POST",
      body: {
        email,
        includeListIds: listIds,
        templateId,
        redirectionUrl: `${String(process.env.SITE_URL).replace(/\/+$/, "")}/news?subscribed=1`,
      },
    });

    log("double opt-in sent", `${listIds.length} list(s)`);
    return sendJson(res, 200, SUCCESS);
  } catch (error) {
    const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError" || error?.timedOut;
    /* The message carries the step and Brevo's status/message, never the key. */
    log("failed", `${error?.message ?? error}`);
    return sendJson(res, timedOut ? 504 : 500, GENERIC_ERROR);
  }
}

