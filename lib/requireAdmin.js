/**
 * lib/requireAdmin.js — the single gate in front of every write.
 *
 * There is exactly one admin and no public registration, so the only question
 * any protected endpoint asks is "does this request carry a valid admin
 * session?". This module answers it, in ONE place, so a new endpoint cannot
 * accidentally forget the check.
 *
 * THE CONTRACT FOR CALLERS
 * -----------------------
 * Call it FIRST, before reading a body, touching the database, or doing any
 * other work. On success it returns the admin's email. On any failure it has
 * ALREADY written a 401 to the response and returns null, so the caller's
 * whole pattern is:
 *
 *     const email = requireAdmin(req, res);
 *     if (!email) return;
 *
 * The session is a JWT in an httpOnly cookie, so the browser's JavaScript can
 * never read the token — not on the admin's machine, not through an XSS bug.
 * That is the whole reason the token is never kept in localStorage.
 *
 * SECURITY
 * --------
 * The token is never returned in a JSON body and never logged, neither the
 * token itself nor its contents. Only the FACT that a verification failed is
 * recorded, never the value that was checked.
 */
import jwt from "jsonwebtoken";

/** The single cookie name used for the admin session. */
export const ADMIN_COOKIE = "auvd_admin";

/** Default lifetime, matching jsonwebtoken's own "7d" shorthand. */
const DEFAULT_EXPIRES_IN = "7d";

/** The signing secret, or "" when it is not configured. The value is never logged. */
function getSecret() {
  return String(process.env.JWT_SECRET ?? "").trim();
}

/**
 * Reads one cookie out of the raw `Cookie` request header.
 *
 * The header is parsed by hand rather than with a cookie library because the
 * shape is trivial, it keeps the dependency list (and the function bundle)
 * small, and `req.cookies` is not populated identically across every runtime.
 *
 * @returns {string} the raw value, or "" when the cookie is absent.
 */
function readCookie(req, name) {
  const header = req?.headers?.cookie;
  if (!header || typeof header !== "string") return "";

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;

    const key = part.slice(0, separator).trim();
    if (key !== name) continue;

    try {
      /* decodeURIComponent because browsers percent-encode values; the
         try/catch covers a malformed escape, which must not throw here. */
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return part.slice(separator + 1).trim();
    }
  }

  return "";
}

/**
 * Verifies the admin cookie and returns the admin's email.
 *
 * Call this before anything else in a protected handler. Returns null (having
 * already answered 401) when the cookie is missing, the secret is not
 * configured, or the token is missing, expired or tampered with.
 *
 * @returns {string|null} the admin email, or null.
 */
export function requireAdmin(req, res) {
  const token = readCookie(req, ADMIN_COOKIE);
  if (!token) {
    sendJson(res, 401, { ok: false, error: "Not authenticated" });
    return null;
  }

  const secret = getSecret();
  if (!secret) {
    /* A misconfigured deployment is a server fault, not a bad request, and it
       is said plainly in the log (the variable NAME only) so it is fixable.
       The visitor still gets a plain 401, which reveals nothing. */
    console.error("[auth] JWT_SECRET is not set — add it in Vercel for Production, then redeploy");
    sendJson(res, 401, { ok: false, error: "Not authenticated" });
    return null;
  }

  let claims;
  try {
    /* verify() checks the signature AND the expiry, and throws on either. The
       decoded claims are used only to read the email back out. */
    claims = jwt.verify(token, secret);
  } catch {
    /* Deliberately vague: an expired token and a forged one are reported
       identically, so the response cannot be used to probe the secret. Neither
       the token nor its contents are logged. */
    sendJson(res, 401, { ok: false, error: "Not authenticated" });
    return null;
  }

  const email = typeof claims?.email === "string" ? claims.email.trim() : "";
  if (!email) {
    sendJson(res, 401, { ok: false, error: "Not authenticated" });
    return null;
  }

  return email;
}

/**
 * Signs the session token for a successful login.
 *
 * The payload holds the admin's email and nothing else: no password, no hash,
 * no role table, and no flags a compromised client could flip.
 *
 * @returns {string} the signed JWT. The CALLER sets it as an httpOnly cookie
 *          and must never place it in a JSON response body.
 */
export function signAdminToken(email) {
  return jwt.sign({ email }, getSecret(), { expiresIn: getExpiresIn() });
}

/** Writes the session cookie. HttpOnly keeps it away from JavaScript, SameSite
 *  Strict means it is not attached to any cross-site request, and Secure means
 *  it is only ever sent over HTTPS. */
export function setAdminCookie(res, token) {
  res.setHeader("Set-Cookie", buildAdminCookie(token));
}

/** Clears the session cookie by expiring it immediately (maxAge 0). */
export function clearAdminCookie(res) {
  res.setHeader("Set-Cookie", buildAdminCookie("", 0));
}

function buildAdminCookie(value, maxAgeSeconds) {
  const parts = [
    `${ADMIN_COOKIE}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
  ];

  if (typeof maxAgeSeconds === "number") {
    /* Max-Age=0 is what actually deletes the cookie in every modern browser;
       the past-dated Expires is set alongside it for older ones. */
    parts.push(`Max-Age=${maxAgeSeconds}`);
    parts.push(`Expires=${new Date(0).toUTCString()}`);
  } else {
    const days = cookieLifetimeDays();
    parts.push(`Max-Age=${Math.max(1, Math.floor(days * 24 * 60 * 60))}`);
  }

  return parts.join("; ");
}

/**
 * The cookie lifetime in days, derived from JWT_EXPIRES_IN so the cookie and
 * the token inside it expire together. jsonwebtoken's shorthand is
 * "<number><unit>" (s / m / h / d), which is all this needs to understand.
 */
function cookieLifetimeDays() {
  const match = /^(\d+(?:\.\d+)?)\s*([smhd])$/i.exec(getExpiresIn());
  if (!match) return 7; // Unrecognised format: fall back to jsonwebtoken's own default.

  const amount = Number(match[1]);
  const perDay = { s: 86400, m: 1440, h: 24, d: 1 }[match[2].toLowerCase()];
  return amount / perDay;
}

/** The configured token lifetime, e.g. "7d". */
export function getExpiresIn() {
  const configured = String(process.env.JWT_EXPIRES_IN ?? "").trim();
  return configured || DEFAULT_EXPIRES_IN;
}

/** Shared JSON writer, so every admin route answers in the same shape. */
export function sendJson(res, status, body) {
  if (res.headersSent) return;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  /* Auth answers must never be cached by a proxy or the browser. */
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}