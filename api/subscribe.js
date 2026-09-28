/**
 * /api/subscribe — AUVD newsletter subscriptions.
 *
 * Vercel runs this file as a serverless function (the /api folder is the
 * free-plan function directory), so the Brevo API key never reaches the
 * browser. The only environment variables used are:
 *
 *   BREVO_API_KEY          Brevo "API keys" (never prefix with VITE_)
 *   BREVO_DOI_TEMPLATE_ID  numeric id of the Double Opt-In template
 *   SITE_URL               public https URL of the site, no trailing slash
 *
 * Flow: validate -> make sure the "AUVD News" folder and the eight
 * news-<topic>-<lang> lists exist -> subscribe through Brevo's double
 * opt-in endpoint, which sends the confirmation email and puts the
 * unsubscribe link on every message.
 *
 * The response is deliberately identical for every accepted request, so the
 * endpoint can never be used to discover whether an address is subscribed.
 */

const BREVO_BASE = "https://api.brevo.com/v3";

const TOPICS = ["education", "music", "dance", "vocational"];
const LANGUAGES = ["en", "fr"];

const FOLDER_NAME = "AUVD News";

/* Lists live in a folder, and the topic/language list name is the contract
   shared with scripts/send-news-emails.mjs, so both derive it the same way. */
const listName = (topic, lang) => `news-${topic}-${lang}`;

/* Cached for the lifetime of this function instance. A warm instance reuses
   the ids instead of re-listing folders and lists on every signup. */
const idCache = {
  folderId: null,
  lists: new Map(), // "news-music-fr" -> id
};

/* The one and only success body. Anything a visitor can trigger must look
   the same whether or not the address was already known to Brevo. */
const SUCCESS_BODY = { ok: true };

const json = (status, body) => ({
  statusCode: status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(body),
});

const success = () => json(200, SUCCESS_BODY);

const failure = () =>
  json(500, { ok: false, error: "Something went wrong. Please try again later." });

/* Deliberately terse: enough to find the fault, never enough to leak the key. */
const logError = (message, error) => {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`[subscribe] ${message}: ${detail}`);
};

async function brevo(path, { method = "GET", body } = {}) {
  const response = await fetch(`${BREVO_BASE}${path}`, {
    method,
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const error = new Error(
      `Brevo ${method} ${path} responded ${response.status}${payload?.message ? `: ${payload.message}` : ""}`
    );
    error.status = response.status;
    throw error;
  }

  return payload;
}

/** Every list in the account, following pagination. */
async function fetchAllLists() {
  const lists = [];
  const limit = 100;
  let offset = 0;

  for (;;) {
    const page = await brevo(`/contacts/lists?limit=${limit}&offset=${offset}&sort=asc`);
    const batch = page?.lists ?? [];
    lists.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
  }

  return lists;
}

/** The "AUVD News" folder id, created once if it is not there yet. */
async function ensureFolder() {
  if (idCache.folderId) return idCache.folderId;

  const page = await brevo("/contacts/folders?limit=100&offset=0&sort=asc");
  const existing = (page?.folders ?? []).find((folder) => folder.name === FOLDER_NAME);
  if (existing) {
    idCache.folderId = existing.id;
    return existing.id;
  }

  const created = await brevo("/contacts/folders", { method: "POST", body: { name: FOLDER_NAME } });
  idCache.folderId = created.id;
  return created.id;
}


/**
 * Every list id the project needs: the eight news-<topic>-<lang> lists, in
 * the "AUVD News" folder. Anything missing is created and cached.
 */
async function ensureLists() {
  const wanted = new Set();
  for (const topic of TOPICS) {
    for (const lang of LANGUAGES) {
      wanted.add(listName(topic, lang));
    }
  }

  const missing = [...wanted].filter((name) => !idCache.lists.has(name));
  if (missing.length === 0) {
    return idCache.lists;
  }

  const folderId = await ensureFolder();
  const existing = await fetchAllLists();

  for (const name of missing) {
    const found = existing.find((list) => list.name === name && list.folderId === folderId);
    if (found) {
      idCache.lists.set(name, found.id);
      continue;
    }
    const created = await brevo("/contacts/lists", { method: "POST", body: { name, folderId } });
    idCache.lists.set(name, created.id);
  }

  return idCache.lists;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Add a contact that already exists to a list, without re-confirming. */
async function addToList(listId, email) {
  await brevo(`/contacts/lists/${listId}/contacts/add`, {
    method: "POST",
    body: { emails: [email] },
  });
}

/**
 * Look the contact up. Returns null when the address is unknown to Brevo.
 * Brevo's contact payload carries no "double opt-in confirmed" flag, so an
 * existing, non-blacklisted address is treated as someone who can be added
 * straight to the new lists without a second confirmation email.
 */
async function findContact(email) {
  try {
    return await brevo(`/contacts/${encodeURIComponent(email)}`);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed." });
  }

  /* Honeypot and timing checks come first and answer exactly like success,
     so a bot learns nothing from the difference. */
  let payload;
  try {
    payload = request.body && typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  } catch {
    return success();
  }
  if (!payload || typeof payload !== "object") return success();

  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return success();
  }

  /* A form submitted faster than a person could read it is a bot. */
  const elapsed = Number(payload.t);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 3000) {
    return success();
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const topics = Array.isArray(payload.topics) ? payload.topics : [];
  const lang = payload.lang === "fr" ? "fr" : "en";

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return json(400, { ok: false, error: "Invalid email address." });
  }

  const chosen = [...new Set(topics.filter((topic) => TOPICS.includes(topic)))];
  if (chosen.length === 0) {
    return json(400, { ok: false, error: "No topics selected." });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const siteUrl = (process.env.SITE_URL || "").replace(/\/+$/, "");

  if (!apiKey || !Number.isFinite(templateId) || !siteUrl) {
    logError("missing BREVO_API_KEY, BREVO_DOI_TEMPLATE_ID or SITE_URL");
    return failure();
  }

  try {
    const lists = await ensureLists();
    const listIds = chosen.map((topic) => {
      const id = lists.get(listName(topic, lang));
      if (!id) throw new Error(`list ${listName(topic, lang)} was not created`);
      return id;
    });

    const contact = await findContact(email);

    if (contact) {
      const blacklisted = contact.isBlacklisted === true || contact.emailBlacklisted === true;
      if (blacklisted) {
        /* Previously unsubscribed: honour it and change nothing. Still a
           normal success response, so the visitor cannot infer their state. */
        return success();
      }

      for (const listId of listIds) {
        await addToList(listId, email);
      }
      return success();
    }

    await brevo("/contacts/doubleOptinConfirmation", {
      method: "POST",
      body: {
        email,
        includeListIds: listIds,
        templateId,
        redirectionUrl: `${siteUrl}/news?subscribed=1`,
      },
    });

    return success();
  } catch (error) {
    logError("subscription failed", error);
    return failure();
  }
}
