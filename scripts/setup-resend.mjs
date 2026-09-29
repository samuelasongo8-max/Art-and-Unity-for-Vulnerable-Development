#!/usr/bin/env node
/**
 * setup-resend — ONE-TIME setup. Run it yourself, locally, once.
 *
 * WHAT IT CREATES, AND WHY
 * -----------------------
 * 1. FOUR TOPICS, one per newsletter topic (education, music, dance,
 *    vocational). A Resend Topic is the native way to record "which topics
 *    did this person tick". The alternative — a custom contact property
 *    holding a comma-separated list — cannot be filtered on when sending, so
 *    a Topic is strictly better here: Resend can scope a Broadcast to it, and
 *    it drives the preference page a contact sees after clicking unsubscribe.
 *
 *    default_subscription is set to "opt_out" ON PURPOSE. The default of
 *    "opt_in" means "everyone receives this unless they opt out", which would
 *    mail every contact in the account the moment the first broadcast goes
 *    out. "opt_out" means "only people who explicitly ticked this box", which
 *    is what the footer form does.
 *
 * 2. ONE SEGMENT called "AUVD News". POST /broadcasts requires a segment_id,
 *    and a segment created with no conditions contains every contact in the
 *    account. The per-topic narrowing is done by the broadcast's topic_id, so
 *    a single segment is all that is needed.
 *
 * It writes their ids to src/data/resend-config.json, which is committed like
 * the rest of the data files. Those ids are not secrets.
 *
 * Re-running it is safe: anything that already exists is reused, not
 * duplicated, and the committed file is the starting point.
 *
 * HOW TO RUN (Node 20.6 or newer for --env-file):
 *
 *   1. Put your key in .env.local  (create it if it does not exist):
 *
 *        RESEND_API_KEY=re_your-real-key-here
 *
 *   2. Then run:
 *
 *        node --env-file=.env.local scripts/setup-resend.mjs
 *
 * .env.local is already ignored by .gitignore (the "*.local" rule), so the
 * key is never committed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, "..");
const OUT_FILE = path.join(projectRoot, "src", "data", "resend-config.json");

const RESEND_BASE = "https://api.resend.com";
const SEGMENT_NAME = "AUVD News";
const TOPICS = ["education", "music", "dance", "vocational"];

/* Topic names are what a contact sees on the unsubscribe preference page, so
   they are plain English rather than the raw ids used in the code. */
const TOPIC_NAMES = {
  education: "AUVD News - Education",
  music: "AUVD News - Music",
  dance: "AUVD News - Dance",
  vocational: "AUVD News - Vocational Training",
};

const TOPIC_DESCRIPTIONS = {
  education: "AUVD news about education.",
  music: "AUVD news about the music programme.",
  dance: "AUVD news about the dance programme.",
  vocational: "AUVD news about vocational training.",
};

const CALL_TIMEOUT_MS = 20000;

const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
if (!apiKey) {
  console.error(
    "✖ RESEND_API_KEY is not set.\n\n" +
      "  Create .env.local in the project root containing:\n" +
      "    RESEND_API_KEY=re_your-key-here\n\n" +
      "  Then run:  node --env-file=.env.local scripts/setup-resend.mjs"
  );
  process.exit(1);
}

async function resend(pathname, { method = "GET", body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(`${RESEND_BASE}${pathname}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(`${method} ${pathname} failed: ${error?.message ?? error}`);
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
    const detail = payload?.message ?? payload?.name ?? "";
    throw new Error(
      `${method} ${pathname} -> HTTP ${response.status}${detail ? ` ${detail}` : ""}\n` +
        "  Check RESEND_API_KEY is correct and active (Resend dashboard -> API Keys)."
    );
  }
  return payload;
}

/** Resend list endpoints answer { data: [...] } with has_more for paging. */
async function listAll(pathname) {
  const all = [];
  let url = pathname;
  for (;;) {
    const page = await resend(url);
    const batch = Array.isArray(page?.data) ? page.data : [];
    all.push(...batch);
    if (!page?.has_more || batch.length === 0) break;
    /* Resend pages forwards using the last id of the previous page. */
    const separator = url.includes("?") ? "&" : "?";
    url = `${pathname}${separator}after=${encodeURIComponent(batch[batch.length - 1].id)}`;
  }
  return all;
}

/* Start from the committed file so a re-run keeps ids that are still valid. */
let config = {
  segmentId: "",
  segmentName: SEGMENT_NAME,
  topics: Object.fromEntries(TOPICS.map((topic) => [topic, ""])),
  topicNames: { ...TOPIC_NAMES },
};
if (fs.existsSync(OUT_FILE)) {
  try {
    const previous = JSON.parse(fs.readFileSync(OUT_FILE, "utf8"));
    config = {
      ...config,
      ...previous,
      topics: { ...config.topics, ...(previous.topics ?? {}) },
      topicNames: { ...TOPIC_NAMES, ...(previous.topicNames ?? {}) },
    };
    console.log(`Read existing ids from ${path.relative(projectRoot, OUT_FILE)}`);
  } catch {
    console.log("Could not parse the existing resend-config.json; starting fresh.");
  }
}

console.log("\nLooking up what already exists in Resend...\n");

/* ---- The four topics ---- */

const existingTopics = await listAll("/topics");

for (const topic of TOPICS) {
  const name = TOPIC_NAMES[topic];
  const found = existingTopics.find((entry) => entry?.name === name);

  if (config.topics[topic] && !found) {
    /* The id is committed but the topic is gone (deleted, or a new account). */
    console.log(`  ${name}: committed id is stale, creating it again`);
    const created = await resend("/topics", {
      method: "POST",
      body: { name, description: TOPIC_DESCRIPTIONS[topic], default_subscription: "opt_out" },
    });
    config.topics[topic] = created.id;
    existingTopics.push({ id: created.id, name });
    continue;
  }

  if (found) {
    config.topics[topic] = found.id;
    console.log(`  ${name}: already exists (${found.id}, default_subscription=${found.default_subscription})`);
    if (found.default_subscription === "opt_in") {
      console.log(
        "    ⚠ This topic is opt_in, which would send it to EVERY contact.\n" +
          "      Delete it in the Resend dashboard and run this script again."
      );

/* ---- Verify, then write ---- */

const missing = [...TOPICS.filter((topic) => !config.topics[topic]), !config.segmentId && "segment"].filter(Boolean);
if (missing.length) {
  console.error(`\n✖ Nothing was written. Missing: ${missing.join(", ")}`);
  process.exit(1);
}

const ordered = {
  _note:
    "Resend ids, written by scripts/setup-resend.mjs. These are NOT secrets and are meant to be committed. api/subscribe.js reads the four topic ids and scripts/send-news-emails.mjs reads the segment id, so a signup or a send never has to create anything. Until you run the setup script the placeholder values below are empty strings, and both scripts refuse to run rather than failing obscurely.",
  segmentId: config.segmentId,
  segmentName: SEGMENT_NAME,
  topics: Object.fromEntries(TOPICS.map((topic) => [topic, config.topics[topic]])),
  topicNames: { ...TOPIC_NAMES },
};

fs.writeFileSync(OUT_FILE, `${JSON.stringify(ordered, null, 2)}\n`, "utf8");

console.log(`\n✔ Wrote ${path.relative(projectRoot, OUT_FILE)}:`);
console.log(`    ${"segment".padEnd(24)} ${ordered.segmentId}`);
for (const topic of TOPICS) {
  console.log(`    ${topic.padEnd(24)} ${ordered.topics[topic]}`);
}

console.log(
  "\nThese ids are not secret and should be committed. Nothing else to do here.\n" +
    "Note: a Resend segment created through the API has no conditions, so it contains\n" +
    "every contact in the account. That is intentional — each broadcast is narrowed\n" +
    "to one of the four topics above."
);

    }
    continue;
  }

  console.log(`  ${name}: creating`);
  const created = await resend("/topics", {
    method: "POST",
    body: { name, description: TOPIC_DESCRIPTIONS[topic], default_subscription: "opt_out" },
  });
  config.topics[topic] = created.id;
  existingTopics.push({ id: created.id, name });
}

/* ---- The one segment every broadcast is sent through ---- */

const existingSegments = await listAll("/segments");
const existingSegment = existingSegments.find((entry) => entry?.name === SEGMENT_NAME);

if (existingSegment) {
  config.segmentId = existingSegment.id;
  console.log(`\n  Segment "${SEGMENT_NAME}": already exists (${existingSegment.id})`);
} else {
  console.log(`\n  Segment "${SEGMENT_NAME}": creating`);
  const created = await resend("/segments", { method: "POST", body: { name: SEGMENT_NAME } });
  config.segmentId = created.id;
  console.log(`    created (${created.id})`);
}

/* ---- Verify, then write ---- */

const missing = [
  ...TOPICS.filter((topic) => !config.topics[topic]),
  !config.segmentId && "segmentId",
].filter(Boolean);

if (missing.length) {
  console.error(`\n✖ Nothing was written. Missing: ${missing.join(", ")}`);
  process.exit(1);
}

const ordered = {
  _note:
    "Resend ids, written by scripts/setup-resend.mjs. These are NOT secrets and are meant to be committed. api/subscribe.js reads the four topic ids and scripts/send-news-emails.mjs reads the segment id, so a signup or a send never has to create anything. Until you run the setup script the placeholder values below are empty strings, and both scripts refuse to run rather than failing obscurely.",
  segmentId: config.segmentId,
  segmentName: SEGMENT_NAME,
  topics: Object.fromEntries(TOPICS.map((topic) => [topic, config.topics[topic]])),
  topicNames: { ...TOPIC_NAMES },
};

fs.writeFileSync(OUT_FILE, `${JSON.stringify(ordered, null, 2)}\n`, "utf8");

console.log(`\n✔ Wrote ${path.relative(projectRoot, OUT_FILE)}:`);
console.log(`    ${"segmentId".padEnd(24)} ${ordered.segmentId}`);
for (const topic of TOPICS) {
  console.log(`    ${topic.padEnd(24)} ${ordered.topics[topic]}`);
}

console.log(
  "\nThese ids are not secret and should be committed. Nothing else to do here.\n" +
    "Note: a Resend segment created through the API has no conditions, so it holds\n" +
    "every contact in the account. That is intentional — each broadcast is narrowed\n" +
    "to one of the four topics above."
);

