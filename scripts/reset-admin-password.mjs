#!/usr/bin/env node
/**
 * reset-admin-password — change the ONE admin's password, locally, by hand.
 *
 * create-admin.mjs refuses to touch an account that already exists, so this is
 * the companion script for the one situation it deliberately cannot cover:
 * the password needs changing. It looks up the single admin by
 * ADMIN_EMAIL, re-hashes ADMIN_PASSWORD at cost 12, and stores the new hash.
 *
 * It can ONLY change the password. There is no way to add an admin, remove
 * one, or change the email, which keeps the "exactly one account" rule true
 * no matter how many times this is run.
 *
 * HOW TO RUN:
 *
 *   1. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local to the NEW values.
 *   2. Run:  npm run admin:reset
 *
 * SECURITY
 * --------
 * The password and the resulting hash are never printed. The script confirms
 * which account was updated by email, and nothing else.
 */
import bcrypt from "bcryptjs";
import { connectOnce, ADMIN_COLLECTION } from "../lib/db.js";

/** bcrypt work factor, matching create-admin.mjs. */
const COST = 12;

const log = (message) => console.log(`[admin:reset] ${message}`);

const fail = (message, hint) => {
  console.error(`\n✖ admin:reset — ${message}\n`);
  if (hint) console.error(`  ${hint}\n`);
  process.exit(1);
};

const email = String(process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD ?? "");

const missing = ["MONGODB_URI", "ADMIN_EMAIL", "ADMIN_PASSWORD"].filter(
  (name) => !String(process.env[name] ?? "").trim()
);
if (missing.length) {
  fail(
    `missing env var(s): ${missing.join(", ")}`,
    "Add them to .env.local, then run again."
  );
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  fail("ADMIN_EMAIL is not a valid email address.", "Check the value in .env.local.");
}

if (password.length < 12) {
  fail(
    "ADMIN_PASSWORD is shorter than 12 characters.",
    "Use a long, unique password."
  );
}

let client;
try {
  log("connecting to MongoDB…");
  ({ client, db } = await connectOnce());
  log("connected");

  const admins = db.collection(ADMIN_COLLECTION);
  const existing = await admins.findOne({ email });

  /* The email must match the account exactly, otherwise this would silently
     do nothing and leave the old password in place — a confusing failure. */
  if (!existing) {
    const any = await admins.findOne({}, { projection: { email: 1 } });
    console.error("\n✖ admin:reset — no admin account matches that ADMIN_EMAIL. Nothing was changed.\n");
    if (any) {
      console.error(`  The account in the database is: ${any.email}`);
      console.error("  Set ADMIN_EMAIL in .env.local to that address and run again.\n");
    } else {
      console.error("  There is no admin at all yet. Run this first:  npm run admin:create\n");
    }
    process.exit(1);
  }

  log("hashing the new password (bcrypt, cost 12)…");
  const passwordHash = await bcrypt.hash(password, COST);

  /* Only passwordHash is written. `updatedAt` records the change, and
     `mustChangePassword` lets the dashboard prompt for a fresh one later. */
  await admins.updateOne(
    { _id: existing._id },
    { $set: { passwordHash, updatedAt: new Date(), mustChangePassword: false } }
  );

  console.log(`\n✔ Password updated for: ${email}\n`);
  console.log("  Use the new password to log in. Any existing session stays valid until its");
  console.log("  token expires, which is why changing a password is best done from a private machine.\n");
} catch (error) {
  const message = String(error?.message ?? error).replace(/mongodb(\+srv)?:\/\/\S+/gi, "[mongodb uri redacted]");
  fail(`could not update the password: ${message}`, "Check MONGODB_URI in .env.local.");
} finally {
  if (client) await client.close();
}