#!/usr/bin/env node
/**
 * send-news-emails — emails news that has never been emailed before.
 *
 * Runs on GitHub Actions after a successful PRODUCTION Vercel deployment.
 * There is no dashboard and no database: Brevo's own campaign list is the
 * record of what has already gone out.
 *
 * HOW "ALREADY SENT" IS TRACKED
 * -----------------------------
 * Every campaign this script creates is named
 *
 *     news|<topic>|<lang>|<id1>,<id2>
 *
 * where the ids are the news items covered by that campaign. Before sending,
 * the script lists every existing campaign and reads the ids back out of
 * those names, so an item is never emailed twice. Editing an item in
 * news.json does not change its id and therefore does not resend it; to send
 * something again, publish a NEW item with a NEW id.
 *
 * An item with "notify": false is never emailed.
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
import { validateNews, TOPICS, LANGUAGES } from "./validate-news.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, "..");
const PREVIEW_DIR = path.join(projectRoot, "email-previews");

const BREVO_BASE = "https://api.brevo.com/v3";
const ORANGE = "#ff6600";
const NAVY = "#12395f";
const MUTED = "#52606d";

/* Brevo's free plan allows 300 emails per day. Warn rather than block, so a
   legitimate larger send is still possible on a paid plan. */
const DAILY_SEND_LIMIT = 300;

const CAMPAIGN_PREFIX = "news";
const FOLDER_NAME = "AUVD News";

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
  },
  fr: {
    readMore: "Lire la suite sur notre site",
    donate: "Faire un don",
    unsubscribe: "Se désabonner",
    receiving: (topic) =>
      `Vous recevez cet e-mail parce que vous êtes abonné aux actualités d'AUVD sur ${topic}.`,
    newFrom: (topic) => `Nouveau chez AUVD : ${topic}`,
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

/* Must match api/subscribe.js exactly: both sides derive the name the same
   way, so the two can never drift apart. */
const listName = (topic, lang) => `news-${topic}-${lang}`;

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
 * Brevo API
 * ------------------------------------------------------------------ */

let apiKey = "";

async function brevo(path, { method = "GET", body } = {}) {
  const response = await fetch(`${BREVO_BASE}${path}`, {
    method,
    headers: {
      "api-key": apiKey,
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
    fail(
      `Brevo ${method} ${path} responded ${response.status}` +
        `${payload?.message ? `: ${payload.message}` : ""}`
    );
  }

  return payload;
}

/** Every campaign Brevo knows about, following pagination. */
async function fetchAllCampaigns() {
  const campaigns = [];
  const limit = 50;
  let offset = 0;

  for (;;) {
    const page = await brevo(
      `/emailCampaigns?limit=${limit}&offset=${offset}&sort=asc&excludeHtmlContent=true`
    );
    const batch = page?.campaigns ?? [];
    campaigns.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
  }

  return campaigns;
}

/** All contact lists, keyed by name. */
async function fetchListsByName() {
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

  return new Map(lists.map((list) => [list.name, list]));
}

/** The "AUVD News" folder id, or null when it does not exist yet. */
async function findFolderId() {
  const page = await brevo("/contacts/folders?limit=100&offset=0&sort=asc");
  const folder = (page?.folders ?? []).find((entry) => entry.name === FOLDER_NAME);
  if (folder) return folder.id;
  dry(`folder "${FOLDER_NAME}" does not exist yet — the subscribe function creates it on the first signup`);
  return null;
}


/* ------------------------------------------------------------------ *
 * Email HTML

   Table based with inline CSS, 600px wide, system fonts only: no external
   fonts, images or scripts, because many mail clients block them and the
   message has to survive a plain-text-only reader.

   The unsubscribe link is required by law and by the Gmail/Yahoo one-click
   sender rules. Brevo replaces the {{ unsubscribe }} tag with the real
   per-contact unsubscribe URL when it sends the campaign.
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

function buildEmail({ items, topic, lang, siteUrl }) {
  const words = WORDING[lang];
  const topicName = TOPIC_NAMES[lang][topic];

  return `<!DOCTYPE html>
<html lang="${lang}">
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
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items
            .map((item) => itemBlock(item, lang, siteUrl))
            .join("")}
          </table>
        </td></tr>

        <tr><td style="padding:20px 24px 28px 24px;border-top:1px solid #dde5ee;">
          <p style="margin:0 0 10px 0;font-family:${STACK};font-size:13px;line-height:1.6;
                    color:${MUTED};">
            ${escapeHtml(words.receiving(topicName))}
          </p>
          <p style="margin:0;font-family:${STACK};font-size:13px;line-height:1.6;">
            <a href="{{ unsubscribe }}" style="color:${NAVY};text-decoration:underline;">${escapeHtml(
    words.unsubscribe
  )}</a>
          </p>
        </td></tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;
}

function buildText({ items, topic, lang, siteUrl }) {
  const words = WORDING[lang];
  const topicName = TOPIC_NAMES[lang][topic];

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

  const lines = [`AUVD — ${topicName}`, "=".repeat(40), ""];
  blocks.forEach((block, index) => {
    if (index > 0) lines.push("");
    lines.push(block);
  });
  lines.push("", "-".repeat(40));
  lines.push(words.receiving(topicName));
  lines.push(`${words.unsubscribe}: {{ unsubscribe }}`);

  return lines.join("\n");
}


/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

function readEnv(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

const { items, errors } = validateNews();
if (errors.length) {
  console.error("✖ news.json is not valid, so nothing was sent:\n");
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

const siteUrl = readEnv("SITE_URL").replace(/\/+$/, "");
const senderEmail = readEnv("BREVO_SENDER_EMAIL");
const senderName = readEnv("BREVO_SENDER_NAME");
apiKey = readEnv("BREVO_API_KEY");

console.log(DRY_RUN ? "▶ send-news-emails (DRY RUN — no email will be sent)" : "▶ send-news-emails");
console.log(`  news.json: ${items.length} item(s)`);

if (!DRY_RUN) {
  const missing = [
    ["SITE_URL", siteUrl],
    ["BREVO_SENDER_EMAIL", senderEmail],
    ["BREVO_SENDER_NAME", senderName],
    ["BREVO_API_KEY", apiKey],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
  if (missing.length) fail(`Missing environment variable(s): ${missing.join(", ")}`);
}

/* notify defaults to true, so only an explicit false is excluded. */
const candidates = items.filter((item) => item.notify !== false);

if (candidates.length === 0) {
  console.log("  No item is marked for emailing (they are all notify: false). Nothing to do.");
  process.exit(0);
}

/* ---- Which items have already been emailed? ---- */

let alreadySent = new Set();
let existingLists = new Map();

if (!DRY_RUN) {
  const campaigns = await fetchAllCampaigns();
  for (const campaign of campaigns) {
    const name = campaign?.name ?? "";
    if (!name.startsWith(`${CAMPAIGN_PREFIX}|`)) continue;
    const parts = name.split("|");
    if (parts.length < 4) continue;
    for (const id of parts[3].split(",")) {
      if (id) alreadySent.add(id);
    }
  }
  console.log(`  ${alreadySent.size} item id(s) already recorded in existing campaigns.`);
  existingLists = await fetchListsByName();
  await findFolderId();
} else {
  /* In a dry run the campaign history is unknown, so nothing counts as sent
     and the output shows what a first real run would do. */
  console.log("  Dry run: assuming no item has been emailed yet.");
}

const fresh = candidates.filter((item) => !alreadySent.has(item.id));

if (fresh.length === 0) {
  console.log("  Everything eligible has already been emailed. Nothing to do.");
  process.exit(0);
}

console.log(`  ${fresh.length} new item(s): ${fresh.map((item) => item.id).join(", ")}`);

/* ---- Group by topic, then one email per topic per language ---- */

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

  for (const lang of LANGUAGES) {
    const name = `${CAMPAIGN_PREFIX}|${topic}|${lang}|${ids.join(",")}`;
    const list = existingLists.get(listName(topic, lang));
    const recipientCount = list?.totalSubscribers ?? 0;
    estimatedRecipients += recipientCount;

    const subject =
      ordered.length === 1
        ? pick(ordered[0].title, lang)
        : WORDING[lang].newFrom(TOPIC_NAMES[lang][topic]);

    const previewUrl = siteUrl || "https://example.org";
    const html = buildEmail({ items: ordered, topic, lang, siteUrl: previewUrl });
    const text = buildText({ items: ordered, topic, lang, siteUrl: previewUrl });

    let campaignId = null;
    let action;

    if (DRY_RUN) {
      fs.mkdirSync(PREVIEW_DIR, { recursive: true });
      const file = path.join(PREVIEW_DIR, `${topic}-${lang}.html`);
      fs.writeFileSync(file, html, "utf8");
      fs.writeFileSync(file.replace(/\.html$/, ".txt"), text, "utf8");
      action = "preview";
      dry(
        recipientCount === 0
          ? `no subscribers on ${listName(topic, lang)} — a real run records a draft and never sends`
          : `would email ${recipientCount} subscriber(s) of ${listName(topic, lang)}`
      );
    } else if (recipientCount === 0) {
      /* Nobody is subscribed yet. The campaign is still created as a DRAFT so
         the ids are recorded, and this item is therefore never sent later to
         people who subscribe after it was published. */
      const created = await brevo("/emailCampaigns", {
        method: "POST",
        body: {
          name,
          subject,
          htmlContent: html,
          textContent: text,
          sender: { name: senderName, email: senderEmail },
        },
      });
      campaignId = created?.id ?? null;
      action = "draft (no subscribers)";
    } else {
      const created = await brevo("/emailCampaigns", {
        method: "POST",
        body: {
          name,
          subject,
          htmlContent: html,
          textContent: text,
          sender: { name: senderName, email: senderEmail },
          recipientListIds: [list.id],
        },
      });
      campaignId = created?.id ?? null;
      await brevo(`/emailCampaigns/${campaignId}/sendNow`, { method: "POST" });
      action = "sent";
    }

    rows.push({
      topic,
      language: lang,
      items: ids.length,
      recipients: recipientCount,
      campaignId: campaignId ?? "—",
      action,
    });
    console.log(
      `  ${topic}/${lang}: ${ids.length} item(s), ${recipientCount} recipient(s) — ${action}`
    );
  }
}

if (rows.length === 0) {
  console.log("  Nothing grouped into a sendable email.");
  process.exit(0);
}


/* ---- Summary ---- */

console.log("\nSummary");
console.log("-".repeat(78));
console.log(
  ["topic".padEnd(12), "lang".padEnd(5), "items".padStart(5), "recips".padStart(7), "campaign".padStart(9), "result"].join(" ")
);
console.log("-".repeat(78));
for (const row of rows) {
  console.log(
    [
      row.topic.padEnd(12),
      row.language.padEnd(5),
      String(row.items).padStart(5),
      String(row.recipients).padStart(7),
      String(row.campaignId).padStart(9),
      row.action,
    ].join(" ")
  );
}
console.log("-".repeat(78));
console.log(`Total recipients this run: ${estimatedRecipients}`);

if (estimatedRecipients > DAILY_SEND_LIMIT) {
  console.log(
    `\n⚠ WARNING: ${estimatedRecipients} emails in one run is over the Brevo free plan's ` +
      `${DAILY_SEND_LIMIT}-per-day limit. Brevo will start refusing the surplus today.`
  );
}

console.log(DRY_RUN ? "\n✔ Dry run finished. No campaign was created and no email was sent." : "\n✔ Done.");

