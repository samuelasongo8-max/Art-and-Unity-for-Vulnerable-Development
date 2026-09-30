/**
 * A loader hook that points every import of lib/db.js at admin-db-stub.mjs.
 *
 * ES module namespaces are frozen, so the test cannot simply reassign
 * getDb on the real module. Redirecting the specifier itself is the supported
 * way to substitute a module, and it keeps lib/db.js free of any test-only
 * code — the production file contains no knowledge that this hook exists.
 */
const STUB = new URL("./admin-db-stub.mjs", import.meta.url).href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith("lib/db.js")) {
    return { url: STUB, shortCircuit: true, format: "module" };
  }
  return nextResolve(specifier, context);
}