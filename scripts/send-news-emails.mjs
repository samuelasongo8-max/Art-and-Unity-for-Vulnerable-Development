#!/usr/bin/env node
/**
 * send-news-emails — emails news that has never been emailed before.
 *
 * Runs on GitHub Actions after a successful PRODUCTION Vercel deployment.
 * There is no dashboard and no database: Resend's own broadcast list is the
 * record of what has already gone out.
 *
 * HOW "ALREADY SENT" IS TRACKED
 * -----------------------------
 * Every broadcast this script creates is named
 *
 *     news|<topic>|<ids>
 *
 * where the ids are the news items covered by that broadcast. Before sending,
 * the script lists every existing broadcast and reads the ids back out of
 * those names, so an item is never emailed twice. Resend's GET /broadcasts
 * returns a `name` field for every broadcast, so the same trick the Brevo
 * version used still works and NO extra log file has to be kept in the repo.
 * A committed sent-log.json would be easy to forget to commit, and a run from
 * a stale checkout would then re-send everything.
 *
 * Editing an item in news.json does not change its id and therefore does not
 * resend it; to send something again, publish a NEW item with a NEW id.
 *
 * An item with "notify": false is never emailed.
 *
 * WHO RECEIVES WHAT
 * -----------------
 * Each broadcast is sent to the "AUVD News" segment (required by the Resend
 * broadcasts API) AND scoped to that topic's Resend Topic. Resend therefore
 * does the topic filtering itself: only contacts who ticked that box on the
 * footer form — and who have not since unsubscribed — are mailed. Nobody has
 * to be added to a list by hand.
 *
 * LANGUAGE
 * --------
 * Resend segments can only be created through the API with a name; their
 * filter conditions are set in the dashboard. There is therefore no API-only
 * way to build "music AND language = fr" segments, so this script sends ONE
 * broadcast per topic containing the English version followed by the French
 * version, each under its own language heading. A subscriber who only reads
 * one language scrolls past the other; nobody receives a mail in a language
 * they did not ask for AND in the one they did.
 *
 * UNSUBSCRIBE
 * -----------
 * Resend's own placeholder {{{RESEND_UNSUBSCRIBE_URL}}} is used in the
 * footer. Resend replaces it with a per-contact link, and clicking it opens
 * the preference page where the contact can turn individual topics off or
 * unsubscribe from everything. Nothing here has to track that.
 *
 * DRY RUN
 * --------
 * --dry-run makes no create and no send calls at all. It writes the HTML of
 * every email it would have sent into email-previews/ so the wording and the
 * layout can be checked before anything leaves the building.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateNews, TOPICS } from "./validate-news.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, "..");
const PREVIEW_DIR = path.join(projectRoot, "email-previews");
const CONFIG_FILE = path.join(projectRoot, "src", "data", "resend-config.json");

const RESEND_BASE = "https://api.resend.com";
const ORANGE = "#ff6600";
const NAVY = "#12395f";
const MUTED = "#52606d";

/* Resend's free plan allows 100 emails a day and 3,000 a month. Warn rather
   than block, so a legitimate larger send is still possible on a paid plan. */
const DAILY_SEND_LIMIT = 100;
const MONTHLY_SEND_LIMIT = 3000;

const CAMPAIGN_PREFIX = "news";

/* Resend's documented liquid placeholder for the per-contact unsubscribe URL. */
const UNSUBSCRIBE_URL = "{{{RESEND_UNSUBSCRIBE_URL}}}";

const DRY_RUN = process.argv.includes("--dry-run");

const dry = (message) => {
  if (DRY_RUN) console.log(`  [dry-run] ${message}`);
};

const fail = (message) => {
  console.error(`\n✖ ${message}`);
  process.exit(1);
};

/* ------------------------------------------------------------------ *
 * Wording and content helpers
 * ------------------------------------------------------------------ */

const WORDING = {
  en: {
    readMore: "Read more on our website",
    donate: "Donate today",
    unsubscribe: "Unsubscribe",
    receiving: (topic) =>
      `You are receiving this email because you subscribed to AUVD news about ${topic}.`,
    newFrom: (topic) => `New from AUVD: ${topic}`,
    languageHeading: "English",
    otherLanguage: "This message is also available in French below.",
  },
  fr: {
    readMore: "Lire la suite sur notre site",
    donate: "Faire un don",
    unsubscribe: "Se désabonner",
    receiving: (topic) =>
      `Vous recevez cet e-mail parce que vous êtes abonné aux actualités d'AUVD sur ${topic}.`,
    newFrom: (topic) => `Nouveau chez AUVD : ${topic}`,
    languageHeading: "Français",
    otherLanguage: "Ce message est également disponible en anglais ci-dessus.",
  },
};

const TOPIC_NAMES = {
  en: {
    education: "Education",
    music: "Music Program",
    dance: "Dance Program",
    vocational: "Vocational Training",
  },
  fr: {
    education: "Éducation",
    music: "Programme musique",
    dance: "Programme de danse",
    vocational: "Formation professionnelle",
  },
};

/** The topic name in both languages, for the bilingual email header. */
const bilingualTopicName = (topic) => `${TOPIC_NAMES.en[topic]} / ${TOPIC_NAMES.fr[topic]}`;

const pick = (field, lang) => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
};

const paragraphs = (field, lang) => {
  const list = field?.[lang]?.length ? field[lang] : field?.en;
  return Array.isArray(list) ? list.filter(Boolean) : [];
};

/* The same day-month-year wording the site itself uses in the active
   language, so an email and the page never disagree about a date. */
const formatDate = (isoDate, lang) =>
  new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));

/** First paragraph, cut on a word boundary to about `max` characters. */
const excerpt = (text, max = 280) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* ------------------------------------------------------------------ *
 * Resend API
 * ------------------------------------------------------------------ */

let apiKey = "";

async function resend(pathname, { method = "GET", body } = {}) {
  const response = await fetch(`${RESEND_BASE}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

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
    fail(
      `Resend ${method} ${pathname} responded ${response.status}` +
        `${payload?.message ? `: ${payload.message}` : ""}`
    );
  }

  return payload;
}

/** Every broadcast Resend knows about, following its `after` pagination. */
async function fetchAllBroadcasts() {
  const broadcasts = [];
  let url = "/broadcasts?limit=100";

  for (;;) {
    const page = await resend(url);
    const batch = Array.isArray(page?.data) ? page.data : [];
    broadcasts.push(...batch);
    if (!page?.has_more || batch.length === 0) break;
    url = `/broadcasts?limit=100&after=${encodeURIComponent(batch[batch.length - 1].id)}`;
  }

  return broadcasts;
}

/**
 * How many contacts are really subscribed to a topic.
 *
 * There is no per-topic count endpoint, so this walks the segment's contacts
 * and asks for each one's topics. The segment holds every contact in the
 * account, which on a site of this size is a short list, and the walk happens
 * once per run rather than once per broadcast.
 *
 * The count is only used to choose between "send" and "record a draft" and to
 * warn about the free-plan limit, so a contact whose lookup fails counts as
 * subscribed: over-counting is harmless, under-counting would silently skip a
 * real send.
 */
async function countTopicSubscribers(segmentId, topicId) {
  const contacts = [];
  let url = `/segments/${segmentId}/contacts?limit=100`;

  for (;;) {
    const page = await resend(url);
    const batch = Array.isArray(page?.data) ? page.data : [];
    contacts.push(...batch);
    if (!page?.has_more || batch.length === 0) break;
    url = `/segments/${segmentId}/contacts?limit=100&after=${encodeURIComponent(batch[batch.length - 1].id)}`;
  }

  let count = 0;
  for (const contact of contacts) {
    if (contact?.unsubscribed === true) continue;
    try {
      const topics = await resend(`/contacts/${encodeURIComponent(contact.email)}/topics`);
      const list = Array.isArray(topics?.data) ? topics.data : [];
      if (list.some((entry) => entry?.id === topicId && entry?.subscription === "opt_in")) count += 1;
    } catch {
      count += 1;
    }
  }
  return count;
}


/* ------------------------------------------------------------------ *
 * Email HTML

   Table based with inline CSS, 600px wide, system fonts only: no external
   fonts, images or scripts, because many mail clients block them and the
   message has to survive a plain-text-only reader.

   The unsubscribe link is required by law and by the Gmail/Yahoo one-click
   sender rules. Resend replaces the {{{RESEND_UNSUBSCRIBE_URL}}} liquid tag
   with the real per-contact unsubscribe URL when it sends the broadcast, and
   handles the preference page and the List-Unsubscribe header behind it.
   ------------------------------------------------------------------ */

const STACK = `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif`;

function itemBlock(item, lang, siteUrl) {
  const words = WORDING[lang];
  const first = paragraphs(item.body, lang)[0] ?? "";

  const image = item.image
    ? `
      <tr><td style="padding:0 0 14px 0;">
        <a href="${siteUrl}/news#${item.id}" style="text-decoration:none;">
          <img src="${siteUrl}${item.image}" width="600" alt="${escapeHtml(
      pick(item.imageAlt, lang)
    )}" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
        </a>
      </td></tr>`
    : "";

  return `
      <tr><td style="padding:0 0 8px 0;font-family:${STACK};font-size:13px;font-weight:700;
                     text-transform:uppercase;letter-spacing:0.08em;color:${MUTED};">
        ${escapeHtml(formatDate(item.date, lang))}
      </td></tr>
      <tr><td style="padding:0 0 10px 0;font-family:${STACK};font-size:26px;line-height:1.2;
                     font-weight:700;color:${NAVY};">
        ${escapeHtml(pick(item.title, lang))}
      </td></tr>
      <tr><td style="padding:0 0 16px 0;font-family:${STACK};font-size:16px;line-height:26px;
                     color:#1f2933;">
        ${escapeHtml(excerpt(first))}
      </td></tr>${image}
      <tr><td style="padding:0 0 12px 0;">
        <a href="${siteUrl}/news#${item.id}" style="font-family:${STACK};font-size:15px;
           font-weight:700;color:${NAVY};text-decoration:underline;">${escapeHtml(words.readMore)}</a>
      </td></tr>
      <tr><td style="padding:0 0 32px 0;">
        <a href="${siteUrl}/donate" style="display:inline-block;padding:0 22px;height:40px;
           line-height:40px;background:${ORANGE};color:#ffffff;font-family:${STACK};
           font-size:15px;font-weight:700;text-transform:uppercase;
           text-decoration:none;">${escapeHtml(words.donate)}</a>
      </td></tr>`;
}

/** One language section: a heading, then every item in that language. */
function languageSection(items, lang, siteUrl) {
  const words = WORDING[lang];
  return `
        <tr><td style="padding:0 0 6px 0;font-family:${STACK};font-size:12px;font-weight:700;
                       text-transform:uppercase;letter-spacing:0.08em;color:${MUTED};">
          ${escapeHtml(words.languageHeading)}
        </td></tr>
        <tr><td style="padding:0 0 10px 0;font-family:${STACK};font-size:13px;line-height:1.6;
                       color:${MUTED};">
          ${escapeHtml(words.otherLanguage)}
        </td></tr>
        <tr><td style="padding:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items
            .map((item) => itemBlock(item, lang, siteUrl))
            .join("")}</table>
        </td></tr>`;
}

function buildEmail({ items, topic, siteUrl }) {
  const topicName = bilingualTopicName(topic);

  /* Both languages, English first, separated by a rule. */
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(topicName)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:#ffffff;">
    <tr><td align="center" style="padding:0;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
             style="width:100%;max-width:600px;background:#ffffff;font-family:${STACK};">

        <tr><td style="background:${ORANGE};padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family:${STACK};font-size:22px;font-weight:700;color:#ffffff;">AUVD</td>
              <td align="right" style="font-family:${STACK};font-size:15px;font-weight:700;
                         color:#ffffff;text-transform:uppercase;letter-spacing:0.04em;">
                ${escapeHtml(topicName)}
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding:28px 24px 8px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${languageSection(items, "en", siteUrl)}
            <tr><td style="padding:0 0 8px 0;border-top:1px solid #dde5ee;"></td></tr>
            ${languageSection(items, "fr", siteUrl)}
          </table>
        </td></tr>

        <tr><td style="padding:20px 24px 28px 24px;border-top:1px solid #dde5ee;">
          <p style="margin:0 0 10px 0;font-family:${STACK};font-size:13px;line-height:1.6;
                    color:${MUTED};">
            ${escapeHtml(`${WORDING.en.receiving(TOPIC_NAMES.en[topic])} / ${WORDING.fr.receiving(TOPIC_NAMES.fr[topic])}`)}
          </p>
          <p style="margin:0;font-family:${STACK};font-size:13px;line-height:1.6;">
            <a href="${UNSUBSCRIBE_URL}" style="color:${NAVY};text-decoration:underline;">${escapeHtml(
    `${WORDING.en.unsubscribe} / ${WORDING.fr.unsubscribe}`
  )}</a>
          </p>
        </td></tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;
}

function buildText({ items, topic, siteUrl }) {
  const section = (lang) => {
    const words = WORDING[lang];
    const blocks = items.map((item) => {
      const first = paragraphs(item.body, lang)[0] ?? "";
      return [
        formatDate(item.date, lang),
        pick(item.title, lang),
        "",
        excerpt(first),
        "",
        `${words.readMore}: ${siteUrl}/news#${item.id}`,
        `${words.donate}: ${siteUrl}/donate`,
      ].join("\n");
    });
    return [`### ${words.languageHeading} ###`, "", ...blocks].join("\n");
  };

  const lines = [
    `AUVD — ${bilingualTopicName(topic)}`,
    "=".repeat(40),
    "",
    section("en"),
    "",
    "-".repeat(40),
    "",
    section("fr"),
    "",
    "-".repeat(40),
    `${WORDING.en.receiving(TOPIC_NAMES.en[topic])} / ${WORDING.fr.receiving(TOPIC_NAMES.fr[topic])}`,
    `${WORDING.en.unsubscribe} / ${WORDING.fr.unsubscribe}: ${UNSUBSCRIBE_URL}`,
  ];

  return lines.join("\n");
}


/** Segment and topic ids written by scripts/setup-resend.mjs. */
let config = { segmentId: "", topics: {} };

function loadConfig() {
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch (error) {
    config = { segmentId: "", topics: {} };
    dry(`could not read ${path.relative(projectRoot, CONFIG_FILE)} (${error?.message ?? error})`);
  }
}

/** The Resend topic id for a topic, or "" when setup has not been run. */
const topicIdFor = (topic) => String(config?.topics?.[topic] ?? "").trim();

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

function readEnv(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

const { items, errors } = validateNews();
loadConfig();
if (errors.length) {
  console.error("✖ news.json is not valid, so nothing was sent:\n");
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

const siteUrl = readEnv("SITE_URL").replace(/\/+$/, "");
const from = readEnv("RESEND_FROM");
apiKey = readEnv("RESEND_API_KEY");

console.log(DRY_RUN ? "▶ send-news-emails (DRY RUN — no email will be sent)" : "▶ send-news-emails");
console.log(`  news.json: ${items.length} item(s)`);

if (!DRY_RUN) {
  const missing = [
    ["SITE_URL", siteUrl],
    ["RESEND_FROM", from],
    ["RESEND_API_KEY", apiKey],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
  if (missing.length) fail(`Missing environment variable(s): ${missing.join(", ")}`);

  if (!String(config?.segmentId ?? "").trim()) {
    fail(
      "src/data/resend-config.json has no segmentId.\n" +
        "  Run:  node --env-file=.env.local scripts/setup-resend.mjs"
    );
  }
}

/* notify defaults to true, so only an explicit false is excluded. */
const candidates = items.filter((item) => item.notify !== false);

if (candidates.length === 0) {
  console.log("  No item is marked for emailing (they are all notify: false). Nothing to do.");
  process.exit(0);
}



/* ---- Which items have already been emailed? ---- */

let alreadySent = new Set();

if (!DRY_RUN) {
  const broadcasts = await fetchAllBroadcasts();
  for (const broadcast of broadcasts) {
    const name = broadcast?.name ?? "";
    if (!name.startsWith(`${CAMPAIGN_PREFIX}|`)) continue;
    const parts = name.split("|");
    if (parts.length < 3) continue;
    for (const id of parts[2].split(",")) {
      if (id) alreadySent.add(id);
    }
  }
  console.log(`  ${alreadySent.size} item id(s) already recorded in existing broadcasts.`);
} else {
  /* In a dry run the broadcast history is unknown, so nothing counts as sent
     and the output shows what a first real run would do. */
  console.log("  Dry run: assuming no item has been emailed yet.");
}

const fresh = candidates.filter((item) => !alreadySent.has(item.id));

if (fresh.length === 0) {
  console.log("  Everything eligible has already been emailed. Nothing to do.");
  process.exit(0);
}

console.log(`  ${fresh.length} new item(s): ${fresh.map((item) => item.id).join(", ")}`);

/* ---- Group by topic, then one email per topic ---- */

const byTopic = new Map();
for (const item of fresh) {
  if (!byTopic.has(item.topic)) byTopic.set(item.topic, []);
  byTopic.get(item.topic).push(item);
}

const rows = [];
let estimatedRecipients = 0;

for (const topic of TOPICS) {
  const topicItems = byTopic.get(topic);
  if (!topicItems || topicItems.length === 0) continue;

  /* Newest first inside the email as well. */
  const ordered = [...topicItems].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const ids = ordered.map((item) => item.id);
  const name = `${CAMPAIGN_PREFIX}|${topic}|${ids.join(",")}`;
  const topicId = topicIdFor(topic);

  if (!DRY_RUN && !topicId) {
    fail(
      `No Resend topic id for "${topic}" in src/data/resend-config.json.\n` +
        "  Run:  node --env-file=.env.local scripts/setup-resend.mjs"
    );
  }

  /* Resend does the topic filtering itself. The count is only used to decide
     between a real send and a recorded draft, and to warn about the limit. */
  const recipientCount = DRY_RUN ? 0 : await countTopicSubscribers(config.segmentId, topicId);
  estimatedRecipients += recipientCount;

  const subject =
    ordered.length === 1
      ? pick(ordered[0].title, "en")
      : WORDING.en.newFrom(TOPIC_NAMES.en[topic]);

  const previewUrl = siteUrl || "https://example.org";
  const html = buildEmail({ items: ordered, topic, siteUrl: previewUrl });
  const text = buildText({ items: ordered, topic, siteUrl: previewUrl });

  let broadcastId = null;
  let action;

  if (DRY_RUN) {
    fs.mkdirSync(PREVIEW_DIR, { recursive: true });
    const file = path.join(PREVIEW_DIR, `${topic}.html`);
    fs.writeFileSync(file, html, "utf8");
    fs.writeFileSync(file.replace(/\.html$/, ".txt"), text, "utf8");
    action = "preview";
    dry(`would send ${ordered.length} item(s) to this topic's subscribers`);
  } else {
    /* POST /broadcasts requires a segment_id; topic_id narrows it to the
       people who ticked this topic on the footer form. `name` records which
       news ids went out, so nothing is ever emailed twice. */
    const created = await resend("/broadcasts", {
      method: "POST",
      body: {
        name,
        segment_id: config.segmentId,
        topic_id: topicId,
        from,
        subject,
        html,
        text,
        /* Nobody is subscribed yet: keep it as a draft so the ids are still
           recorded and this news is never sent later to people who subscribe
           after it was published. */
        send: recipientCount > 0,
      },
    });
    broadcastId = created?.id ?? null;
    action = recipientCount > 0 ? "sent" : "draft (no subscribers)";
  }

  rows.push({ topic, items: ids.length, recipients: recipientCount, broadcastId: broadcastId ?? "—", action });
  console.log(`  ${topic}: ${ids.length} item(s), ${recipientCount} recipient(s) — ${action}`);
}

if (rows.length === 0) {
  console.log("  Nothing grouped into a sendable email.");
  process.exit(0);
}


/* ---- Summary ---- */

console.log("\nSummary");
console.log("-".repeat(78));
console.log(
  ["topic".padEnd(12), "items".padStart(5), "recips".padStart(7), "broadcast".padStart(9), "result"].join(" ")
);
console.log("-".repeat(78));
for (const row of rows) {
  console.log(
    [
      row.topic.padEnd(12),
      String(row.items).padStart(5),
      String(row.recipients).padStart(7),
      String(row.broadcastId).padStart(9),
      row.action,
    ].join(" ")
  );
}
console.log("-".repeat(78));
console.log(`Total recipients this run: ${estimatedRecipients}`);

if (estimatedRecipients > DAILY_SEND_LIMIT) {
  console.log(
    `\n⚠ WARNING: ${estimatedRecipients} emails in one run is over the Resend free plan's ` +
      `${DAILY_SEND_LIMIT}-per-day limit. Resend will start refusing the surplus today.`
  );
}
if (estimatedRecipients > MONTHLY_SEND_LIMIT) {
  console.log(
    `⚠ WARNING: ${estimatedRecipients} emails in one run is also over the free plan's ` +
      `${MONTHLY_SEND_LIMIT}-per-month limit.`
  );
}

console.log(DRY_RUN ? "\n✔ Dry run finished. No broadcast was created and no email was sent." : "\n✔ Done.");
