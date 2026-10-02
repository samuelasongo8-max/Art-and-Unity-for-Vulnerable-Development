/**
 * src/utils/api.js — the ONE place the frontend decides where the backend lives.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site used to call "/api/..." directly, which worked only because the
 * frontend and the backend shared an origin. With the backend deployed
 * separately on Render, a bare "/api/..." would hit the Vercel frontend and
 * 404. Every call now goes through apiUrl(), so pointing the site at a
 * different backend is a one-variable change.
 *
 * LOCAL DEVELOPMENT IS UNCHANGED
 * ------------------------------
 * When VITE_API_URL is not set, apiUrl("/api/posts") returns exactly
 * "/api/posts" — the same relative path as before, which the Vite dev proxy
 * still forwards to the local server. Nothing about local work changes.
 *
 * SECRETS
 * -------
 * Only a public origin may be used here. VITE_* variables are INLINED INTO THE
 * BUILT JAVASCRIPT and are readable by anyone who opens the page, so a
 * MONGODB_URI, JWT_SECRET or RESEND_API_KEY must never be placed here. Those
 * stay on the server, read with process.env inside backends/.
 */

/**
 * The backend origin used when VITE_API_URL is not set in the build.
 *
 * This is a FALLBACK, not a replacement: a set VITE_API_URL always wins, so the
 * environment variable remains the proper way to configure this and nothing needs
 * changing when the backend moves.
 *
 * It exists because Vite inlines VITE_* values at BUILD time. If the variable is
 * absent from the deployment's environment, every request silently falls back to
 * a relative "/api/..." path — which on Vercel resolves to the frontend's own
 * domain instead of the API, and the feed quietly renders nothing. Making the
 * default explicit turns that invisible failure into a working site.
 *
 * SECURITY: this is a public origin, nothing more. No secret belongs here.
 */
const FALLBACK_API_BASE = "https://auvds-backend.onrender.com";

/**
 * The backend origin from the environment, without a trailing slash.
 */
const configuredBase = String(import.meta.env?.VITE_API_URL ?? "").trim();

export const API_BASE_URL = (configuredBase || FALLBACK_API_BASE).replace(/\/+$/, "");

/**
 * Builds the full URL for a backend path.
 *
 * @param {string} path an API path such as "/api/news". A leading slash is added
 *   when missing, so the result never contains a double slash.
 * @returns {string}
 */
export function apiUrl(path) {
  const suffix = String(path ?? "");
  const normalised = suffix.startsWith("/") ? suffix : `/${suffix}`;
  return `${API_BASE_URL}${normalised}`;
}

/**
 * Resolves a stored image value to a URL the browser can actually load.
 *
 * WHY THIS IS NEEDED
 * -------------------
 * A post's image is stored as a path such as "/uploads/post-....jpg". That path
 * is relative, so a browser renders it against the FRONTEND's domain — and the
 * frontend does not serve those files, only the backend does. The image silently
 * fails to load. This resolves such a path against the backend instead.
 *
 * The rules, in order:
 *   1. An absolute http(s) URL is returned UNCHANGED. This is what the backend
 *      now stores for new uploads, and it also covers any external image, so no
 *      unrelated URL is ever rewritten.
 *   2. A path under /uploads/ is resolved against the backend base — these are
 *      the files the backend owns.
 *   3. Anything else (e.g. "/moments/dance-class.jpg") is returned unchanged.
 *      Those are the site's own images, shipped in public/ and served by the
 *      frontend, so the backend origin would break them.
 *
 * @param {string} value the stored image value
 * @returns {string} a URL usable in an <img src>
 */
export function imageUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  /* 1. already absolute (including protocol-relative "//host/..."). */
  if (/^(https?:)?\/\//i.test(raw)) return raw;
  if (/^(data:|blob:)/i.test(raw)) return raw;

  /* 2. an uploaded file, which lives on the backend. */
  if (raw.startsWith("/uploads/")) return apiUrl(raw);

  /* 3. a site image, served by the frontend itself. */
  return raw;
}