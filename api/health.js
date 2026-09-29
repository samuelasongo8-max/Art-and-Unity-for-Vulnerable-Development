/**
 * ============================================================
 *  TEMPORARY DEBUG ENDPOINT — DELETE BEFORE THE SITE IS "DONE"
 * ============================================================
 *
 * /api/health exists only to diagnose why the signup form was failing. It
 * reports the Node version and whether each required variable is PRESENT.
 * It never returns a variable's value, only true/false, and it never calls
 * Resend.
 *
 * Once the newsletter is confirmed working, delete this file.
 */
export default function handler(req, res) {
  const present = (name) => {
    const value = process.env[name];
    return typeof value === "string" && value.trim().length > 0;
  };

  const env = {
    RESEND_API_KEY: present("RESEND_API_KEY"),
    RESEND_FROM: present("RESEND_FROM"),
    SITE_URL: present("SITE_URL"),
  };

  console.log("[health] node", process.version, JSON.stringify(env));

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ok: true, node: process.version, env });
}
