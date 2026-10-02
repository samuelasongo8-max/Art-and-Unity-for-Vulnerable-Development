#!/usr/bin/env node
/**
 * create-admin — ONE-TIME setup. You run it yourself, locally, once.
 *
 * There is no public registration endpoint, and there is no admin UI that can
 * create an account. This script IS the only way the single admin account
 * comes into existence, which is the point: nobody can sign themselves up.
 *
 * WHAT IT DOES
 * ------------
 * Reads MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD from .env.local, hashes
 * the password with bcrypt at cost factor 12, and inserts one document into
 * the "admin" collection: { email, passwordHash }.
 *
 * WHY COST 12
 * -----------
 * 12 is roughly 250ms per comparison on server hardware, which is slow enough
 * to make offline cracking expensive and fast enough that a login still feels
 * instant. It is also the current bcrypt default, so this stays honest if the
 * library's default ever moves.
 *
 * IT REFUSES TO RUN TWICE
 * -----------------------
 * If any document already exists in the collection the script stops and prints
 * why. It will not create a second admin, and it will not overwrite the
 * existing one — silently replacing the only login would be a far worse
 * outcome than making you look in the database first. To change the password,
 * use scripts/reset-admin-password.mjs.
 *
 * SECURITY
 * --------
 * The password is never printed, and neither is the hash it produces. The
 * connection string is never printed either. The script only ever echoes the
 * email address it used.
 *
 * HOW TO RUN (Node 20.6 or newer for --env-file):
 *
 *   1. Put your values in .env.local (create it from .env.local.example):
 *
 *        MONGODB_URI=...
 *        ADMIN_EMAIL=you@example.org
 *        ADMIN_PASSWORD=...
 *
 *   2. Then run:
 *
 *        npm run admin:create
 *
 * .env.local is already ignored by .gitignore (the ".env*" rule), so nothing
 * here is ever committed.
 */
import bcrypt from "bcryptjs";
import { connectOnce, ADMIN_COLLECTION } from "../backends/lib/db.js";

/** bcrypt work factor. See the note at the top. */
const COST = 12;

const log = (message) => console.log(`[create-admin] ${message}`);

const fail = (message, hint) => {
  console.error(`\n✖ create-admin — ${message}\n`);
  if (hint) console.error(`  ${hint}\n`);
  process.exit(1);
};

const email = String(process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD ?? "");

/* Every variable is checked BEFORE connecting, so a typo cannot leave a
   half-finished connection behind. Only the variable NAMES are ever named. */
const missing = ["MONGODB_URI", "ADMIN_EMAIL", "ADMIN_PASSWORD"].filter(
  (name) => !String(process.env[name] ?? "").trim()
);
if (missing.length) {
  fail(
    `missing env var(s): ${missing.join(", ")}`,
    "Add them to .env.local — copy .env.local.example and fill it in — then run again.\n" +
      "  ADMIN_EMAIL and ADMIN_PASSWORD are used ONLY here, never by a deployed API route."
  );
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  fail("ADMIN_EMAIL is not a valid email address.", "Check the value in .env.local.");
}

/* A short password would be stored correctly but be trivially guessable, so it
   is refused here rather than quietly accepted. */
if (password.length < 12) {
  fail(
    "ADMIN_PASSWORD is shorter than 12 characters.",
    "Use a long, unique password. This is the only account on the site, so it is worth a real one.\n" +
      "  (Its length is not printed, only checked.)"
  );
}

let client;
try {
  log("connecting to MongoDB…");
  ({ client, db } = await connectOnce());
  log("connected");

  const admins = db.collection(ADMIN_COLLECTION);

  /* The guard: exactly one admin, ever. Checked before any insert. */
  const existing = await admins.findOne({}, { projection: { email: 1 } });

  if (existing) {
    console.error("\n✖ create-admin — an admin account already exists. Nothing was changed.\n");
    console.error(`  The collection already holds: ${existing.email}`);
    console.error("\n  This script creates the ONE account and refuses to add a second, because a");
    console.error("  second admin would mean two valid logins, which is the opposite of the point.\n");
    console.error("  To change the password, run:  npm run admin:reset\n");
    process.exit(1);
  }

  log("hashing the password (bcrypt, cost 12)…");
  const passwordHash = await bcrypt.hash(password, COST);
  /* The hash is deliberately not logged. */

  const document = { email, passwordHash, createdAt: new Date() };
  await admins.insertOne(document);

  /* The email is safe to echo: the owner typed it, and it is already the key
     of the one document in the collection. The hash never appears. */
  console.log(`\n✔ Admin created: ${document.email}\n`);
  console.log("  You can now log in from the small lock icon in the site footer.");
  console.log("  ADMIN_EMAIL and ADMIN_PASSWORD are not needed anywhere else, and should NOT be");
  console.log("  set in Vercel — only MONGODB_URI, JWT_SECRET and JWT_EXPIRES_IN belong there.\n");
} catch (error) {
  /* The message is scrubbed of any mongodb:// URI before printing, because a
     connection error can otherwise echo the connection string back. */
  const message = String(error?.message ?? error).replace(/mongodb(\+srv)?:\/\/\S+/gi, "[mongodb uri redacted]");
  fail(`could not create the admin: ${message}`, "Check MONGODB_URI in .env.local and that your IP is allowed in Atlas.");
} finally {
  /* Always closes the connection, so the script can exit instead of hanging. */
  if (client) await client.close();
}
