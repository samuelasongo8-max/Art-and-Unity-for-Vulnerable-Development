/**
 * admin-db-stub — the fake database used by test-admin-api.mjs.
 *
 * test-admin-api.mjs installs a loader hook that resolves every import of
 * lib/db.js to THIS file, so the real driver is never loaded and no connection
 * is ever attempted. The state lives on globalThis because the module registry
 * and the test are two separate module graphs.
 */

const store = { admin: [], posts: [], login_attempts: [] };
globalThis.__auvdTestStore = store;

let idCounter = 1;
const nextId = () => `id${String(idCounter++).padStart(2, "0")}`;

const matches = (row, filter) =>
  Object.entries(filter).every(([key, value]) => String(row[key]) === String(value));

/**
 * The in-memory stand-in must be able to model the two things that make
 * "exactly one admin" work in the real database:
 *
 *  1. A unique `_id` — MongoDB enforces this natively, so a second insert of
 *     the same _id is rejected with a duplicate-key error.
 *  2. A unique index on `singleton` — the second line of defence, which catches
 *     a document inserted some other way.
 *
 * Both are reproduced here, or the test for the most important rule in the
 * system would be testing a fake rather than the real behaviour.
 */
const uniqueIndex = { fields: null };

const violatesUnique = (rows, candidate) => {
  /* MongoDB treats a missing field as null for a unique index, so a document
     without `singleton` still occupies the single slot. Only documents that
     actually carry the field are subject to that index — a "posts" document
     has no singleton field and no unique index on it, so it must not collide
     with every other post inserted before it. */
  if (rows.some((row) => String(row._id) === String(candidate._id))) return true;
  if (candidate.singleton === undefined) return false;
  return rows.some((row) => (row.singleton ?? null) === candidate.singleton);
};

const duplicateKeyError = () => {
  const error = new Error("E11000 duplicate key error collection: admin");
  error.code = 11000;
  return error;
};

const makeCollection = (rows) => ({
  async createIndex(spec, options = {}) {
    if (options.unique) uniqueIndex.fields = Object.keys(spec);
    return options.name ?? "index";
  },
  async findOne(filter) {
    return rows.find((row) => matches(row, filter)) ?? null;
  },
  /* The real driver returns a cursor that chains `.sort()`, `.limit()` and
     `.skip()` before `.toArray()`. The stub reproduces that chain so a route
     written against the real API works unchanged. */
  find(filter = {}) {
    let out = rows.filter((row) => matches(row, filter));

    const cursor = {
      sort(spec) {
        for (const [field, direction] of Object.entries(spec)) {
          out = [...out].sort((a, b) => {
            if (a[field] === b[field]) return 0;
            return (a[field] > b[field] ? 1 : -1) * (direction < 0 ? -1 : 1);
          });
        }
        return cursor;
      },
      limit() {
        return cursor;
      },
      skip() {
        return cursor;
      },
      async toArray() {
        return out;
      },
    };

    return cursor;
  },
  async countDocuments() {
    return rows.length;
  },
  async insertOne(doc) {
    if (violatesUnique(rows, doc)) throw duplicateKeyError();
    rows.push({ ...doc, _id: doc._id ?? nextId() });
  },
  async insertMany(docs) {
    for (const doc of docs) rows.push({ ...doc, _id: doc._id ?? nextId() });
  },
  async updateOne(filter, update) {
    const row = rows.find((r) => matches(r, filter));
    if (row) Object.assign(row, update.$set);
    else rows.push({ ...filter, ...update.$set });
  },
  async findOneAndUpdate(filter, update) {
    const row = rows.find((r) => matches(r, filter));
    if (row) Object.assign(row, update.$set);
    return row ?? null;
  },
  async deleteOne(filter) {
    const index = rows.findIndex((r) => matches(r, filter));
    if (index >= 0) rows.splice(index, 1);
    return { deletedCount: index >= 0 ? 1 : 0 };
  },
});

export const ADMIN_COLLECTION = "admin";
export const POSTS_COLLECTION = "posts";
export const LOGIN_ATTEMPTS_COLLECTION = "login_attempts";

export function safeMessage(error) {
  return String(error?.message ?? error)
    .replace(/mongodb(\+srv)?:\/\/\S+/gi, "[mongodb uri redacted]")
    .slice(0, 300);
}

export async function getDb() {
  return { collection: (name) => makeCollection(store[name]) };
}

/* Present so an accidental import does not crash; the tests never call it. */
export async function connectOnce() {
  throw new Error("connectOnce() is not available in the test stub");
}