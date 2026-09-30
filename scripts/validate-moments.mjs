#!/usr/bin/env node
/**
 * moments:check — validates src/data/moments.json.
 *
 * Fails (non-zero exit) on:
 *   1. a duplicate id;
 *   2. an unknown topic;
 *   3. a missing required field (id, date, topic, image, imageAlt, caption,
 *      paragraph);
 *   4. an invalid or missing date;
 *   5. an image that is not under /moments/ or whose file is missing from
 *      public/moments/.
 *
 * Deliberately separate from news:check — moments.json is its own feed and
 * nothing about the existing News items may be affected by it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const TOPICS = ["education", "music", "dance", "vocational"];

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, "..");
export const MOMENTS_FILE = path.join(projectRoot, "src", "data", "moments.json");
const PUBLIC_DIR = path.join(projectRoot, "public");
const MOMENTS_DIR = path.join(PUBLIC_DIR, "moments");

/* Required on every entry. `_note` is optional (it is the replace-me marker). */
const REQUIRED_FIELDS = ["id", "date", "topic", "image", "imageAlt", "caption", "paragraph"];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const isValidDate = (value) => {
  if (!isNonEmptyString(value) || !ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  // Rejects overflow dates such as 2026-02-31, which Date would roll over.
  return parsed.toISOString().slice(0, 10) === value;
};

/**
 * @returns {{ items: Array, errors: string[] }}
 */
export function validateMoments() {
  const errors = [];

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(MOMENTS_FILE, "utf8"));
  } catch (error) {
    return { items: [], errors: [`moments.json could not be parsed: ${error.message}`] };
  }

  if (!raw || !Array.isArray(raw.items)) {
    return { items: [], errors: ['moments.json must have an "items" array.'] };
  }

  const seenIds = new Set();

  raw.items.forEach((item, index) => {
    const at = `items[${index}]`;

    for (const field of REQUIRED_FIELDS) {
      if (!isNonEmptyString(item[field])) {
        errors.push(`${at}: "${field}" is required and must be a non-empty string.`);
      }
    }

    if (item.id !== undefined) {
      if (isNonEmptyString(item.id)) {
        if (seenIds.has(item.id)) {
          errors.push(`${at}: duplicate id "${item.id}". Ids must be unique and permanent.`);
        } else {
          seenIds.add(item.id);
        }
      }
    }

    if (!TOPICS.includes(item.topic)) {
      errors.push(`${at}: unknown topic ${JSON.stringify(item.topic)}. Use one of: ${TOPICS.join(", ")}.`);
    }

    if (!isValidDate(item.date)) {
      errors.push(`${at}: invalid date ${JSON.stringify(item.date)}. Use YYYY-MM-DD, e.g. 2026-08-15.`);
    }

    /* A caption is a headline, not a sentence: it must not end in a full stop,
       which is the cheapest way to catch a restated paragraph. */
    if (isNonEmptyString(item.caption) && /[.!?]\s*$/.test(item.caption)) {
      errors.push(
        `${at} ("${item.id}"): "caption" should be a short headline, not a full sentence. Drop the full stop.`
      );
    }

    /* Every image has to live in public/moments/ so the feed owns its own
       assets and can never collide with the existing News images. */
    if (item.image !== undefined && isNonEmptyString(item.image)) {
      if (!item.image.startsWith("/moments/")) {
        errors.push(
          `${at} ("${item.id}"): "image" must live in /moments/ so the feed keeps its own images. Got ${JSON.stringify(item.image)}.`
        );
      } else {
        const relative = item.image.replace(/^\/+/, "");
        if (!fs.existsSync(path.join(PUBLIC_DIR, relative))) {
          errors.push(
            `${at} ("${item.id}"): image file not found — ${path.join("public", relative)}`
          );
        }
      }
    }
  });

  return { items: raw.items, errors };
}

/* Run directly (not when imported by a test). */
const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (invokedDirectly) {
  const { items, errors } = validateMoments();

  if (errors.length) {
    console.error(`✖ moments:check — ${errors.length} problem(s) in src/data/moments.json\n`);
    for (const error of errors) console.error(`  ${error}`);
    console.error("\n  Fix these, then run: npm run moments:check");
    process.exit(1);
  }

  const placeholders = items.filter((item) => isNonEmptyString(item._note)).length;
  console.log(
    `✔ moments:check passed — ${items.length} moment(s), ${placeholders} still carrying a placeholder _note.`
  );
}
