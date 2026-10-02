#!/usr/bin/env node
/**
 * migrate-moments — ONE-TIME migration. Run it yourself, locally, once.
 *
 * The public feed at /our-impact/post used to read src/data/moments.json
 * directly, as a file committed to the repository. It now reads MongoDB, so
 * the posts have to be moved into the "posts" collection before the page has
 * anything to show. This script does that and nothing else.
 *
 * WHAT IT COPIES
 * --------------
 * Each entry's date, topic, image, imageAlt, caption and paragraph — the exact
 * fields the feed renders. The old string `id` is preserved as `legacyId` so
 * the original identifiers survive, and `_note` (the "replace me" marker on
 * the placeholder entries) is deliberately NOT copied: it is an instruction to
 * a human, not content.
 *
 * The file itself is left completely untouched. It stays in the repository as
 * a backup of what the feed used to show, and it is still what
 * `npm run moments:check` validates. Nothing reads it any more once this
 * script has run.
 *
 * RUNNING IT TWICE
 * -----------------
 * It refuses to run against a non-empty "posts" collection unless you pass
 * --skip-existing. Without that flag it stops, because a second run would
 * duplicate every post and the feed would show each Moment twice. The
 * --skip-existing run instead inserts only the entries whose `legacyId` is not
 * already there, so it is safe to repeat.
 *
 * HOW TO RUN:
 *
 *   1. MONGODB_URI in .env.local.
 *   2. Then:  npm run moments:migrate
 *
 * SECURITY
 * --------
 * The connection string is never printed. Nothing sensitive is read from the
 * file — it is public page content by definition.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ObjectId } from "mongodb";
import { connectOnce, POSTS_COLLECTION } from "../backends/lib/db.js";
import { validatePost } from "../backends/lib/postValidation.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, "..");
const MOMENTS_FILE = path.join(projectRoot, "src", "data", "moments.json");

const log = (message) => console.log(`[migrate-moments] ${message}`);

const fail = (message, hint) => {
  console.error(`\n✖ migrate-moments — ${message}\n`);
  if (hint) console.error(`  ${hint}\n`);
  process.exit(1);
};

/* --skip-existing makes a repeat run additive instead of refusing. */
const skipExisting = process.argv.includes("--skip-existing");

if (!String(process.env.MONGODB_URI ?? "").trim()) {
  fail("MONGODB_URI is not set.", "Add it to .env.local, then run again.");
}

/* Read and parse the file BEFORE connecting, so a bad file never opens a
   database connection it has no use for. */
let entries;
try {
  const raw = JSON.parse(fs.readFileSync(MOMENTS_FILE, "utf8"));
  if (!raw || !Array.isArray(raw.items)) {
    fail('src/data/moments.json does not contain an "items" array.', "Check the file's shape.");
  }
  entries = raw.items;

let client;
try {
  log("connecting to MongoDB…");
  ({ client, db } = await connectOnce());
  log("connected");

  const posts = db.collection(POSTS_COLLECTION);
  const existingCount = await posts.countDocuments();

  if (existingCount > 0 && !skipExisting) {
    console.error(`\n✖ migrate-moments — the "posts" collection already holds ${existingCount} document(s).`);
    console.error("  Nothing was changed.\n");
    console.error("  Running it again would duplicate every post and the feed would show each Moment");
    console.error("  twice, so it stops here on purpose.\n");
    console.error("  If you are adding only the missing entries, run:  npm run moments:migrate -- --skip-existing");
    console.error("  To start completely fresh, empty the \"posts\" collection first.\n");
    process.exit(1);
  }

  /* Validate every entry with the SAME rules the API will apply, so nothing
     the feed could not display ever lands in the database. Failures are
     reported per entry rather than aborting the whole migration silently. */
  const prepared = [];
  const rejected = [];

  entries.forEach((entry, index) => {
    const { ok, value, errors } = validatePost(entry);
    if (!ok) {
      rejected.push(`  items[${index}]${entry?.id ? ` ("${entry.id}")` : ""}: ${errors.join(" ")}`);
      return;
    }

    const now = new Date();
    prepared.push({
      _id: new ObjectId(),
      ...value,
      /* The old string id is kept for reference only — the feed and the
         dashboard both address posts by the MongoDB `_id`. */
      legacyId: typeof entry.id === "string" ? entry.id : undefined,
      createdAt: now,
      updatedAt: now,
    });
  });

  if (rejected.length) {
    console.error(`\n✖ migrate-moments — ${rejected.length} of ${entries.length} entries are not valid:`);
    for (const line of rejected) console.error(line);
    console.error("\n  Nothing was inserted. Fix src/data/moments.json (or run `npm run moments:check`");
    console.error("  to see the same problems) and run this again.\n");
    process.exit(1);
  }

  let toInsert = prepared;

  /* In --skip-existing mode, drop anything already present, matched on the
     preserved legacyId, so re-running never creates a duplicate. */
  if (existingCount > 0) {
    const known = new Set(
      (await posts.find({}, { projection: { legacyId: 1 } }).toArray())
        .map((doc) => doc.legacyId)
        .filter(Boolean)
    );
    toInsert = prepared.filter((doc) => !known.has(doc.legacyId));

    if (toInsert.length === 0) {
      console.log(`\n✔ All ${entries.length} post(s) are already in the database. Nothing to do.\n`);
      process.exit(0);
    }
  }

  await posts.insertMany(toInsert);

  console.log(`\n✔ Migrated ${toInsert.length} of ${entries.length} post(s) from src/data/moments.json\n`);
  console.log("  You can keep src/data/moments.json in the repository as a backup of what the feed");
  console.log("  used to show — nothing reads it any more. /our-impact/post now reads MongoDB, so");
  console.log("  anything you change in the dashboard appears there immediately.\n");
  console.log("  Next: redeploy, then check the feed before adding a real post of your own.\n");
} catch (error) {
  const message = String(error?.message ?? error).replace(/mongodb(\+srv)?:\/\/\S+/gi, "[mongodb uri redacted]");
  fail(`migration failed: ${message}`, "Check MONGODB_URI in .env.local.");
} finally {
  if (client) await client.close();
}

} catch (error) {
  fail(`could not read ${MOMENTS_FILE}: ${error.message}`, "Is the file still there?");
}

if (entries.length === 0) {
  console.log("\n✔ Nothing to migrate — src/data/moments.json has no items.\n");
  process.exit(0);
}
