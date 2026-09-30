import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./AdminLoginForm.css";

/* ==========================================================================
   AdminLoginForm — the one form behind the admin entry point.

   It is rendered in two places: inside the small modal opened by the lock icon
   in the footer, and on its own at /admin/login (where the dashboard sends
   anyone who is not signed in). One component, so the two can never drift.

   WHICH FORM SHOWS IS DECIDED BY THE SERVER, NOT BY THE PAGE
   ----------------------------------------------------------
   On mount it asks GET /api/admin/setup-status whether the single admin
   account exists yet, and shows one of two forms:

     hasAdmin: false  ->  "Create your admin account" (email, password,
                         confirm password, "Create account")
     hasAdmin: true   ->  "Log in" (email, password, "Log in")

   Nothing renders until that answer arrives, so a visitor never sees the
   register form flash past before the login form replaces it — and, more
   importantly, never sees a "create account" form once an account exists.

   THE SERVER IS STILL THE AUTHORITY
   ---------------------------------
   This switch is a convenience, not a security control. Someone can call
   /api/admin/register directly at any time; it answers 403 the moment an
   account exists. Hiding the button is courtesy, the 403 is the rule. That is
   why the race below is handled rather than ignored: if a 403 comes back the
   form re-checks the status and switches to login by itself, which is exactly
   what should happen when someone else created the account a moment earlier.

   FAILING SAFE
   ------------
   If setup-status cannot be reached, the register form stays hidden and an
   error is shown. Defaulting the other way would put a "create your account"
   form in front of someone whose account already exists.

   WHY NO "FORGOT PASSWORD" LINK
   -----------------------------
   There is exactly one account and it can only be created once. A lost
   password is reset from the machine with `npm run admin:reset`; there is no
   mailbox to send a reset to. Offering a recovery link that cannot work would
   be worse than offering none.

   SECURITY
   --------
   The session is an httpOnly cookie set by the server, so there is no token in
   JavaScript to steal and nothing is written to localStorage. `credentials:
   "include"` is what makes the browser store and resend that cookie; without
   it the form would appear to succeed and then fail on the next request.
   ========================================================================== */

/** Must match MIN_PASSWORD_LENGTH in api/admin/register.js. */
const MIN_PASSWORD_LENGTH = 10;

const AdminLoginForm = ({ onSuccess, onModeChange }) => {
  const { t } = useTranslation();

  /* "checking" -> neither form is shown yet. "unavailable" -> the status check
     failed, so no form is shown at all. Only "register" and "login" render. */
  const [mode, setMode] = useState("checking");
  const [statusError, setStatusError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * Asks the server which form to show, and switches to it.
   *
   * Used on mount AND after a 403 from register, which is why it lives here
   * rather than inline in the effect.
   *
   * @returns {Promise<boolean|null>} hasAdmin, or null if the check failed.
   */
  const checkSetup = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/setup-status", { credentials: "include" });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result || result.ok !== true || typeof result.hasAdmin !== "boolean") {
        throw new Error(`HTTP ${response.status}`);
      }

      setMode(result.hasAdmin ? "login" : "register");
      setStatusError("");
      /* Tells the modal or page which heading to draw, so it never shows
         "Admin sign in" above a "Create your admin account" form. */
      onModeChange?.(result.hasAdmin ? "login" : "register");
      return result.hasAdmin;
    } catch (error) {
      console.error(`[admin] could not read the setup status: ${error?.message ?? error}`);
      setMode("unavailable");
      onModeChange?.("unavailable");
      setStatusError(t("footer.admin.statusError"));
      return null;
    }
  }, [t, onModeChange]);

  useEffect(() => {
    checkSetup().catch(() => null);
  }, [checkSetup]);

  /* ---- LOGIN: POST /api/admin/login ---- */
  const handleLogin = async (event) => {
    event.preventDefault();

    /* Guards a double submit: the button is disabled below, but pressing
       Enter twice quickly can still fire the handler again. */
    if (busy) return;

    setBusy(true);
    setMessage("");

    /* A long enough budget that a slow bcrypt comparison (cost 12 is
       deliberately slow) is never mistaken for a failure. */
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        /* The cookie is httpOnly, so the ONLY way it travels is with the
           request. This is required, not optional. */
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result || result.ok !== true) {
        /* The server sends one generic message for every kind of failure —
           wrong email, wrong password, or locked out — and it is shown here
           verbatim. Nothing on this page hints at which one it was. */
        setMessage(result?.error || t("footer.admin.error"));
        return;
      }

      /* Success. The password is dropped from state immediately so it is not
         left in memory behind a form that is about to disappear. */
      setPassword("");
      onSuccess?.();
    } catch (error) {
      setMessage(
        error?.name === "AbortError" ? t("footer.admin.timeout") : t("footer.admin.error")
      );
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  };

  /* ---- REGISTER: POST /api/admin/register ---- */
  const handleRegister = async (event) => {
    event.preventDefault();
    if (busy) return;

    /* Both checked here for a clear message before a round trip. The server
       checks the same two things and is what actually decides. */
    if (password.length < MIN_PASSWORD_LENGTH) {
      setMessage(t("footer.admin.passwordTooShort", { count: MIN_PASSWORD_LENGTH }));
      return;
    }
    if (password !== confirm) {
      setMessage(t("footer.admin.mismatch"));
      return;
    }

    setBusy(true);
    setMessage("");

    /* Generous, because this request does a full bcrypt hash (cost 12, about a
       quarter of a second) before it can answer. */
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 403) {
        /* Someone created the account between this form being shown and this
           being submitted — the race. Say why, then re-check so the form
           switches to login on its own instead of leaving a dead button. */
        setMessage(result?.error || t("footer.admin.exists"));
        setPassword("");
        setConfirm("");
        await checkSetup();
        return;
      }

      if (!response.ok || !result || result.ok !== true) {
        setMessage(result?.error || t("footer.admin.error"));
        return;
      }

      /* Creating the account also signed us in — the server set the same
         cookie a login would — so the dashboard opens with no second step. */
      setPassword("");
      setConfirm("");
      onSuccess?.();
    } catch (error) {
      setMessage(
        error?.name === "AbortError" ? t("footer.admin.timeout") : t("footer.admin.error")
      );
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  };

  /* ---- RENDER ----
     Three states, and the first two render no form at all. Showing a form
     before the server has said which one is correct would mean flashing the
     register form at someone whose account already exists. */
  if (mode === "checking") {
    return (
      <p className="auvd-admin-message" role="status">
        {t("footer.admin.checking")}
      </p>
    );
  }

  if (mode === "unavailable") {
    return (
      <p className="auvd-admin-message auvd-admin-message--error" role="alert">
        {statusError}
      </p>
    );
  }

  if (mode === "register") {
    return (
      <form className="auvd-admin-form" onSubmit={handleRegister} noValidate>
        {/* The heading lives INSIDE the form rather than in the modal or the
            page, because only the form knows which mode it settled on. That
            way "Create your admin account" and "Admin sign in" can never be
            shown together. The page's own <h1> above is the document heading;
            this is a subheading, so <h2> is correct. */}
        <h2 className="auvd-admin-form-title">{t("footer.admin.registerTitle")}</h2>
        <p className="auvd-admin-hint">{t("footer.admin.onceOnly")}</p>

        <div className="auvd-admin-field">
          <label htmlFor="auvd-admin-email">{t("footer.admin.email")}</label>
          <input
            id="auvd-admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={busy}
          />
        </div>

        <div className="auvd-admin-field">
          <label htmlFor="auvd-admin-password">{t("footer.admin.password")}</label>
          <input
            id="auvd-admin-password"
            type="password"
            /* "new-password" rather than "current-password": this is the one
               moment a password is being chosen, and browsers offer to
               generate and save one for exactly this case. */
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={busy}
          />
          {/* Stated before submitting, not only in the error afterwards, so
              the requirement is never a surprise. Matches the server rule. */}
          <p className="auvd-admin-hint">
            {t("footer.admin.passwordHint", { count: MIN_PASSWORD_LENGTH })}
          </p>
        </div>

        <div className="auvd-admin-field">
          <label htmlFor="auvd-admin-confirm">{t("footer.admin.confirmPassword")}</label>
          <input
            id="auvd-admin-confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            disabled={busy}
          />
        </div>

        <p className="auvd-admin-message" role="alert" aria-live="assertive">
          {message}
        </p>

        <button type="submit" className="auvd-admin-submit" disabled={busy}>
          {busy ? t("footer.admin.creating") : t("footer.admin.create")}
        </button>
      </form>
    );
  }

  /* mode === "login" — the original form, unchanged. */
  return (
    <form className="auvd-admin-form" onSubmit={handleLogin} noValidate>
      <div className="auvd-admin-field">
        <label htmlFor="auvd-admin-email">{t("footer.admin.email")}</label>
        <input
          id="auvd-admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={busy}
        />
      </div>

      <div className="auvd-admin-field">
        <label htmlFor="auvd-admin-password">{t("footer.admin.password")}</label>
        <input
          id="auvd-admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={busy}
        />
      </div>

      <p className="auvd-admin-message" role="alert" aria-live="assertive">
        {message}
      </p>

      <button type="submit" className="auvd-admin-submit" disabled={busy}>
        {busy ? t("footer.admin.submitting") : t("footer.admin.submit")}
      </button>
    </form>
  );
};

export default AdminLoginForm;