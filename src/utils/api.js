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