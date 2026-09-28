#!/usr/bin/env node
/**
 * news:check — validates src/data/news.json.
 *
 * Fails (non-zero exit) on:
 *   1. a duplicate id;
 *   2. an unknown topic;
 *   3. a missing English or French title / body;
 *   4. an invalid or missing date;
 *   5. an image that is declared but missing from public/ (or an image
 *      file that is not reachable from the site).
 *
 * The same check runs at the start of the email script, so a bad file can
 * never reach the point where real mail is sent.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const TOPICS = ["education", "music", "dance", "vocational"];
export const LANGUAGES = ["en", "fr"];

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, "..");
export const NEWS_FILE = path.join(projectRoot, "src", "data", "news.json");
const PUBLIC_DIR = path.join(projectRoot, "public");

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
export function validateNews() {
  const errors = [];

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(NEWS_FILE, "utf8"));
  } catch (error) {
    return { items: [], errors: [`news.json could not be parsed: ${error.message}`] };
  }

  if (!raw || !Array.isArray(raw.items)) {
    return { items: [], errors: ['news.json must have an "items" array.'] };
  }

  const seenIds = new Set();

  raw.items.forEach((item, index) => {
    const at = `items[${index}]`;

    if (!isNonEmptyString(item.id)) {
      errors.push(`${at}: "id" is required and must be a non-empty string.`);
    } else if (seenIds.has(item.id)) {
      errors.push(`${at}: duplicate id "${item.id}". Ids must be unique and permanent.`);
    } else {
      seenIds.add(item.id);
    }

    if (!TOPICS.includes(item.topic)) {
      errors.push(`${at}: unknown topic "${item.topic}". Use one of: ${TOPICS.join(", ")}.`);
    }

    if (!isValidDate(item.date)) {
      errors.push(`${at}: invalid date "${item.date}". Use YYYY-MM-DD, e.g. 2026-08-11.`);
    }

    for (const lang of LANGUAGES) {
      if (!isNonEmptyString(item.title?.[lang])) {
        errors.push(`${at} ("${item.id}"): missing ${lang.toUpperCase()} title.`);
      }

      const body = item.body?.[lang];
      if (!Array.isArray(body) || body.length === 0 || !body.every(isNonEmptyString)) {
        errors.push(
          `${at} ("${item.id}"): missing ${lang.toUpperCase()} body. Use an array of paragraphs, e.g. ["First paragraph."].`
        );
      }
    }

    if (item.notify !== undefined && typeof item.notify !== "boolean") {
      errors.push(`${at} ("${item.id}"): "notify" must be true or false when present.`);
    }

    // An image is optional. When one is declared it must be an absolute
    // /public path (so the same value works in the site and in emails) and
    // the file has to exist.
    if (item.image !== undefined && item.image !== "") {
      if (!isNonEmptyString(item.image) || !item.image.startsWith("/")) {
        errors.push(
          `${at} ("${item.id}"): "image" must start with "/" so it resolves the same way in the site and in emails. Got ${JSON.stringify(item.image)}.`
        );
      } else {
        const relative = item.image.replace(/^\/+/, "");
        if (!fs.existsSync(path.join(PUBLIC_DIR, relative))) {
          errors.push(
            `${at} ("${item.id}"): image file not found in public/ — ${path.join("public", relative)}`
          );
        }
      }
    }

    for (const lang of LANGUAGES) {
      if (item.image && isNonEmptyString(item.image) && item.imageAlt && !isNonEmptyString(item.imageAlt[lang])) {
        errors.push(`${at} ("${item.id}"): has an image but no ${lang.toUpperCase()} imageAlt.`);
      }
    }
  });

  return { items: raw.items, errors };
}

/* Run directly (not when imported by the email script). */
const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (invokedDirectly) {
  const { items, errors } = validateNews();

  if (errors.length) {
    console.error(`✖ news:check — ${errors.length} problem(s) in src/data/news.json\n`);
    for (const error of errors) console.error(`  ${error}`);
    console.error("\n  Fix these, then run: npm run news:check");
    process.exit(1);
  }

  const emails = items.filter((item) => item.notify !== false).length;
  console.log(
    `✔ news:check passed — ${items.length} item(s), ${emails} will be emailed, ${items.length - emails} not emailed (notify: false).`
  );
}
