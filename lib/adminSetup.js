/**
 * lib/adminSetup.js — the "exactly one admin, ever" rule, in one place.
 *
 * THE PROBLEM THIS SOLVES
 * -----------------------
 * The obvious way to write a register endpoint is:
 *
 *     if (await admins.findOne({})) return alreadyExists();
 *     await admins.insertOne(doc);
 *
 * That has a race. Two requests arriving at the same instant — two browser
 * tabs, or a retry firing twice — can both run the findOne before either
 * insert lands, both see an empty collection, and both insert. You end up with
 * two admins and two working logins, which is exactly what this system exists
 * to prevent. A check cannot close a race that happens after the check.
 *
 * THE FIX: MAKE THE WRITE ITSELF UNCONDITIONAL
 * --------------------------------------------
 * Two independent mechanisms, because they cover different cases:
 *
 * 1. A FIXED `_id` of "admin" on every document. MongoDB enforces a unique
 *    `_id` natively, in the storage engine, with no index to create and
 *    nothing that can fail to be set up. Two concurrent inserts of the same
 *    `_id` cannot both succeed — one is rejected with a duplicate-key error.
 *    This is what closes the race.
 *
 * 2. A UNIQUE index on `singleton: 1`, as a second line of defence. This one
 *    catches an account that was created some other way and carries a
 *    different `_id` — for example one seeded by scripts/create-admin.mjs
 *    before this endpoint existed. A unique index treats a missing field as
 *    null, so that document occupies the single allowed slot too, and a
 *    second one collides with it.
 *
 * The findOne check below is still done first, but only to return the
 * friendly 403 quickly and to skip the expensive bcrypt hash. It is a UX
 * shortcut, not the guarantee — mechanisms 1 and 2 are the guarantee.
 *
 * The index is created lazily on first use and cached on globalThis, so it
 * costs one round trip per cold start rather than one per request. Creating an
 * index that already exists is a no-op, so this is safe to run every time.
 */
import { ADMIN_COLLECTION } from "./db.js";

/** The constant value every admin document carries. See the note above. */
export const SINGLETON = 1;

/** MongoDB's duplicate-key error code. */
const DUPLICATE_KEY = 11000;

const log = (step, detail = "") => {
  console.log(`[admin-setup] ${step}${detail ? ` — ${detail}` : ""}`);
};

/**
 * Creates the unique index, once per warm function instance.
 *
 * Failures are logged but NOT thrown: if the index cannot be created (an older
 * deployment, a permissions quirk) the endpoint still works, it just falls back
 * to the findOne check alone. Losing the index should degrade the guarantee,
 * never break registration outright.
 */
function ensureSingletonIndex(collection) {
  if (!globalThis.__auvdAdminIndexPromise) {
    globalThis.__auvdAdminIndexPromise = collection
      .createIndex({ singleton: SINGLETON }, { unique: true, name: "admin_singleton_unique" })
      .then(() => true)
      .catch((error) => {
        /* Reset so a later request can retry rather than being stuck with the
           failure for the lifetime of the instance. */
        globalThis.__auvdAdminIndexPromise = null;
        log("index not created, falling back to the findOne check only", error?.message ?? error);
        return false;
      });
  }

  return globalThis.__auvdAdminIndexPromise;
}

/**
 * Is the single admin account already created?
 *
 * Used by /api/admin/setup-status (to decide which form to show) and by
 * /api/admin/register (to answer 403 without wasting a bcrypt hash).
 *
 * `findOne` with a projection reads a single document and never the whole
 * collection, and no field is returned to the caller.
 *
 * @returns {Promise<boolean>}
 */
export async function hasAdmin(db) {
  const existing = await db.collection(ADMIN_COLLECTION).findOne({}, { projection: { _id: 1 } });
  return existing !== null;
}

/**
 * Inserts the one and only admin document.
 *
 * @returns {Promise<{ ok: true } | { ok: false, reason: "exists" }>}
 *          `exists` means the database rejected the write because an admin is
 *          already there — which is the answer, not an error to report.
 */
export async function insertAdmin(db, { email, passwordHash }) {
  const admins = db.collection(ADMIN_COLLECTION);

  await ensureSingletonIndex(admins);

  const document = {
    _id: "admin",
    email,
    passwordHash,
    createdAt: new Date(),
    /* The field the unique index is built on. See the note at the top. */
    singleton: SINGLETON,
  };

  try {
    await admins.insertOne(document);
    return { ok: true };
  } catch (error) {
    /* The index did its job: a second account can never be created, however
       the two requests were interleaved. */
    if (error?.code === DUPLICATE_KEY) {
      return { ok: false, reason: "exists" };
    }
    throw error;
  }
}