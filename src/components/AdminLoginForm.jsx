import { apiUrl } from "../utils/api";
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
     failed, so no form is shown at all. "login" and "register" render the two
     forms, and "exists" is the notice shown when someone asks to create an
     account that already exists.

     The DEFAULT is always "login". That is a deliberate change from simply
     mirroring hasAdmin: the page is a login page, so it opens on the login form
     and offers "Create New Account" as a deliberate second step. Previously a
     fresh site opened straight on the register form, which meant a visitor with
     an existing account could be shown the wrong form first. */
  const [mode, setMode] = useState("checking");
  const [statusError, setStatusError] = useState("");

  /* Whether the server is currently accepting NEW registrations. This is what
     the "Create New Account" button follows.

     TEMPORARY (local testing): it comes from setup-status's `allowRegistration`,
     which stays true with ALLOW_MULTIPLE_ADMINS=true even once an account
     exists. Previously this was `hasAdmin`, which made the button impossible to
     use on any site that already had an admin. Null means "not answered yet",
     which is why the form shows its loading state until then. */
  const [allowRegistration, setAllowRegistration] = useState(null);

  /* Whether an admin account already exists, kept separately because the two
     answers mean different things: `hasAdmin` drives the "this can only be done
     once" note, while `allowRegistration` drives the button. In one-admin mode
     they are opposites; in multi-admin mode both are true at once. */
  const [hasAdminAccount, setHasAdminAccount] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * Asks the server whether the single admin account exists yet.
   *
   * Used on mount AND after a 403 from register, which is why it lives here
   * rather than inline in the effect.
   *
   * It always lands on the LOGIN form. hasAdmin decides only what the
   * "Create New Account" button will do when it is pressed — it does not decide
   * which form is shown first. See the note on `hasAdmin` above.
   *
   * @returns {Promise<boolean|null>} whether registration is open, or null if
   *          the check failed.
   */
  const checkSetup = useCallback(async () => {
    try {
      const response = await fetch(apiUrl("/api/admin/setup-status"), { credentials: "include" });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result || result.ok !== true || typeof result.hasAdmin !== "boolean") {
        /* Recorded before the throw so the console shows WHY: the HTTP status
           and whatever the server said. This is the line to read first when
           this fails on a live site — a 404 here means the function was never
           deployed, while a 500 means it ran but the server is not configured
           (usually a missing MONGODB_URI). */
        console.error(
          `[admin] setup-status returned HTTP ${response.status}: ${JSON.stringify(result)}`
        );

        /* A failure is remembered as a status code rather than thrown away, so
           the message shown on screen can distinguish the two cases that need
           completely different fixes. */
        const failure = new Error(`HTTP ${response.status}`);
        failure.status = response.status;
        throw failure;
      }

      /* The server decides whether registration is open. The fallback keeps an
         older deployment (one that does not send `allowRegistration`) working:
         it falls back to the original `!hasAdmin` rule. */
      const allow =
        typeof result.allowRegistration === "boolean"
          ? result.allowRegistration
          : !result.hasAdmin;

      setAllowRegistration(allow);
      setHasAdminAccount(result.hasAdmin);
      setMode("login");
      setStatusError("");
      /* Tells the modal or page which heading to draw, so it never shows
         "Admin sign in" above a "Create New Admin Account" form. */
      onModeChange?.("login");

      /* Whether registration is currently OPEN — which is what the 403 handler
         below needs to tell "registration closed" apart from "that email is
         already taken". Returns null when the check failed. */
      return allow;
    } catch (error) {
      /* Three different failures land here — a real network error, the thrown
         HTTP error above, and a malformed body — and they are reported
         differently because they are fixed in different places. */
      const status = error?.status ?? null;

      if (status === 404) {
        console.error(
          "[admin] setup-status returned 404 — the /api/admin/setup-status function is not deployed " +
            "at this address. On Vercel check that the api/ directory was built as functions; " +
            "locally check that the API server is running (npm run dev:server)."
        );
      } else if (status === 500) {
        console.error(
          "[admin] setup-status returned 500 — the function ran but the server could not reach its " +
            "database. Check that MONGODB_URI is set in this environment."
        );
      } else {
        console.error(
          `[admin] could not read the setup status: ${error?.message ?? error}`
        );
      }

      setMode("unavailable");
      onModeChange?.("unavailable");
      /* Each case gets its own message: a 404 says the endpoint is missing, a
         500 says it is there but broken, and anything else says we could not
         reach it. All three name a next step, so the form never fails silently. */
      setStatusError(
        status === 404
          ? t("footer.admin.statusNotDeployed")
          : status === 500
            ? t("footer.admin.statusServerError")
            : t("footer.admin.statusError")
      );
      return null;
    }
  }, [t, onModeChange]);

  useEffect(() => {
    checkSetup().catch(() => null);
  }, [checkSetup]);

  /* ---- MOVING BETWEEN THE TWO FORMS ----
     Two small handlers rather than inline setMode calls, so the rule about what
     "Create New Account" is allowed to do lives in exactly one place. */

  /** Opens the registration form. */
  const showRegister = () => {
    setMessage("");
    setPassword("");
    setConfirm("");
    setMode("register");
    onModeChange?.("register");
  };

  /** Returns to the login form, discarding anything typed into the register form. */
  const showLogin = () => {
    setMessage("");
    setPassword("");
    setConfirm("");
    setMode("login");
    onModeChange?.("login");
  };

  /**
   * The "Create New Account" button.
   *
   * Opens the registration form when the server is accepting new registrations.
   * When it is not — the normal one-admin situation, where an account already
   * exists — it shows the "already exists" notice and a way back to login,
   * rather than a form the server would answer 403 to.
   *
   * TEMPORARY (local testing): with ALLOW_MULTIPLE_ADMINS=true the server keeps
   * `allowRegistration` true, so this opens the register form even though an
   * admin already exists. Turning the flag off restores the notice automatically,
   * because this reads the server's answer rather than deciding anything itself.
   *
   * `allowRegistration === null` means setup-status has not answered yet; in that
   * case the form is still showing its loading state, so this cannot be pressed.
   * The check is here anyway so a future caller cannot open the form blind.
   *
   * This is CONVENIENCE ONLY. The real rule lives in api/admin/register.js,
   * which refuses a second account no matter what this button decides.
   */
  const handleCreateNewAccount = () => {
    if (allowRegistration) {
      showRegister();
      return;
    }

    setMessage("");
    setMode("exists");
    onModeChange?.("exists");
  };

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
      const response = await fetch(apiUrl("/api/admin/login"), {
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
      const response = await fetch(apiUrl("/api/admin/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 403) {
        setPassword("");
        setConfirm("");

        /* TEMPORARY (local testing): a 403 means different things in the two
           modes, and telling the wrong one would be confusing.

             - One-admin mode: an account already exists, so registration is
               closed. The race, or a stale page.
             - Multi-admin mode: registration is OPEN, and the only reason for a
               403 is that this exact email address already has an account.

           Re-checking the status tells us which, because allowRegistration is
           still true in the second case. So the form is only replaced by the
           "already exists" notice when registration is genuinely closed;
           otherwise the address-taken message is shown and the form stays put
           so a different address can be tried straight away. */
        const stillOpen = await checkSetup();

        if (stillOpen) {
          setMode("register");
          onModeChange?.("register");
          setMessage(result?.error || t("footer.admin.exists"));
          return;
        }

        setMode("exists");
        onModeChange?.("exists");
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
    /* An error with no way out of it is a dead end, so this offers a retry.
       That matters in practice: the most common cause is a momentary network
       failure or a deployment that had not finished, and both clear on their
       own without the visitor having to reload the whole page. */
    return (
      <div className="auvd-admin-status">
        <p className="auvd-admin-message auvd-admin-message--error" role="alert">
          {statusError}
        </p>
        <button
          type="button"
          className="auvd-admin-secondary-btn"
          onClick={() => {
            /* Back to "checking" first, so the component immediately shows
               "Checking..." instead of leaving a dead button on screen. */
            setMode("checking");
            onModeChange?.("checking");
            checkSetup().catch(() => null);
          }}
        >
          {t("footer.admin.tryAgain")}
        </button>
      </div>
    );
  }

  /* The account already exists, so registration is closed. Shown when someone
     presses "Create New Account" on a site that already has an admin, and after
     the server refuses a registration with 403. It is a notice rather than an
     error: nothing has gone wrong, there is simply nothing left to create, so
     the way out is the login form, not a retry. */
  if (mode === "exists") {
    return (
      <div className="auvd-admin-status">
        <h2 className="auvd-admin-form-title">{t("footer.admin.existsTitle")}</h2>
        <p className="auvd-admin-hint">{t("footer.admin.existsBody")}</p>
        <button type="button" className="auvd-admin-secondary-btn" onClick={showLogin}>
          {t("footer.admin.goToLogin")}
        </button>
      </div>
    );
  }

  if (mode === "register") {
    return (
      <form className="auvd-admin-form" onSubmit={handleRegister} noValidate>
        {/* The heading lives INSIDE the form rather than in the modal or the
            page, because only the form knows which mode it settled on. That
            way "Create New Admin Account" and "Admin Login" can never be shown
            together. The page's own <h1> above is the document heading; this is
            a subheading, so <h2> is correct. */}
        <h2 className="auvd-admin-form-title">{t("footer.admin.registerTitle")}</h2>
        <p className="auvd-admin-hint">{t("footer.admin.registerSubtitle")}</p>
        {/* TEMPORARY (local testing): "this can only be done once" is only true
            in one-admin mode. While ALLOW_MULTIPLE_ADMINS=true the server accepts
            more accounts, so stating it here would be a lie — and it is the kind
            that makes someone believe they are already signed in when they are
            not. The note is simply omitted in that mode. */}
        {allowRegistration && hasAdminAccount ? null : (
          <p className="auvd-admin-hint">{t("footer.admin.onceOnly")}</p>
        )}

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

        {/* The way back. Without it, someone who opened this form by mistake
            would have to reload the page to get to the login form. */}
        <div className="auvd-admin-switch">
          <p className="auvd-admin-switch-text">{t("footer.admin.haveAccountPrompt")}</p>
          <button type="button" className="auvd-admin-switch-btn" onClick={showLogin}>
            {t("footer.admin.submit")}
          </button>
        </div>
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

      {/* The way to the registration form. On a site that already has an admin
          this does not open a register form — handleCreateNewAccount shows the
          "already exists" notice instead, because a second account can never be
          created. The server enforces that either way. */}
      <div className="auvd-admin-switch">
        <p className="auvd-admin-switch-text">{t("footer.admin.noAccountPrompt")}</p>
        <button type="button" className="auvd-admin-switch-btn" onClick={handleCreateNewAccount}>
          {t("footer.admin.createNewAccount")}
        </button>
      </div>
    </form>
  );
};

export default AdminLoginForm;