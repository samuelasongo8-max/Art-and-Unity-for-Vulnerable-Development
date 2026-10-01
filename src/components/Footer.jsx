import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaLock } from "react-icons/fa6";
import AdminLoginForm from "./AdminLoginForm";
import "./Footer.css";

const navLinks = [
  { to: "/about", labelKey: "footer.links.about" },
  { to: "/Work", labelKey: "footer.links.work" },
  { to: "/our-impact", labelKey: "footer.links.impact" },
  { to: "/our-impact/blogs", labelKey: "footer.links.resources" },
  { to: "/news", labelKey: "footer.links.news" },
  { to: "/contact", labelKey: "footer.links.contact" },
  { to: "/donate", labelKey: "footer.links.donate" },
];

/* The label is translated through its i18n key, while `value` is the stable
   topic id that is posted to /api/subscribe and used by the newsletter
   scripts. Keeping the id separate from the wording means a translation
   change can never break a subscription. */
const interestOptions = [
  { value: "education", key: "footer.interests.education" },
  { value: "music", key: "footer.interests.music" },
  { value: "dance", key: "footer.interests.dance" },
  { value: "vocational", key: "footer.interests.vocational" },
];

// Social platform names are brand names, not translatable copy, so they stay
// as written; only the aria-label/title need no translation.
const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=61569926836907", icon: "bx bxl-facebook", label: "Facebook" },
  { href: "https://ke.linkedin.com--", icon: "bx bxl-linkedin", label: "LinkedIn" },
  { href: "https://www.instagram.com/art.unityvulnerabledev2024/", icon: "bx bxl-instagram", label: "Instagram" },
  { href: "https://www.youtube.com/@Artandunity-q2q", icon: "bx bxl-youtube", label: "YouTube" },
  { href: "https://www.tiktok.com/@artunity_vulnerabledev", icon: "bx bxl-tiktok", label: "TikTok" },
];

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [message, setMessage] = useState("");

  /* Admin sign-in. The lock icon in the legal row opens a small modal, and
     `adminOpen` is the only state that controls it — there is no separate
     route involved, so nothing about the login is visible to a visitor until
     they deliberately click that one icon. */
  const [adminOpen, setAdminOpen] = useState(false);
  /* Which form the modal is currently showing, reported by AdminLoginForm.
     Used only to decide the modal's own heading. */
  const [adminMode, setAdminMode] = useState("checking");
  const navigate = useNavigate();
  const adminDialogRef = useRef(null);
  /* Remembers where focus was before the modal opened, so Escape and the
     close button can return the visitor exactly where they were. */
  const adminTriggerRef = useRef(null);

  /* Honeypot: a real visitor never sees or fills this. The name is a neutral
     "hp_field" rather than "website" or "url", because browsers and password
     managers autofill fields with those names — an autofilled honeypot would
     make a real visitor look like a bot and silently drop their signup. */
  const honeypotRef = useRef(null);
  /* Milliseconds since the form appeared, posted as `t`. The server treats
     anything under 3 seconds as a bot. */
  const appearedAtRef = useRef(Date.now());

  const toggleInterest = (value) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  /* ----- Admin modal ----- */

  const openAdmin = () => {
    /* The trigger is remembered so focus can be handed back on close. */
    adminTriggerRef.current = document.activeElement;
    setAdminOpen(true);
  };

  const closeAdmin = () => {
    setAdminOpen(false);
    /* Returning focus to the lock icon is what makes the modal usable from the
       keyboard: tabbing continues from where the visitor left off rather than
       from the top of the page. */
    adminTriggerRef.current?.focus?.();
  };

  /* Escape closes the modal, and Tab is kept inside it while it is open. The
     latter is what stops a keyboard user tabbing into the page behind an open
     dialog and losing track of where they are. */
  useEffect(() => {
    if (!adminOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAdmin();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = adminDialogRef.current?.querySelectorAll(
        'button, input, select, textarea, a[href]'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [adminOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Guards against a double submit: the button is also disabled below, but
       Enter-key submits and fast double clicks can still fire twice. */
    if (status === "sending") return;

    const trimmed = email.trim();
    const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);

    if (!looksValid) {
      setStatus("error");
      setMessage(t("footer.subscribe.invalidEmail"));
      return;
    }
    if (interests.length === 0) {
      setStatus("error");
      setMessage(t("footer.subscribe.chooseInterest"));
      return;
    }

    setStatus("sending");
    setMessage(t("footer.subscribe.sending"));

    /* Without this, a request that never settles leaves the button stuck on
       "Sending..." forever. 12s is longer than the function's own 8s budget
       (see api/subscribe.js), so the form always stops before the server's
       own deadline and the visitor is never left waiting. */
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          email: trimmed,
          topics: interests,
          lang: i18n.resolvedLanguage === "fr" ? "fr" : "en",
          hp_field: honeypotRef.current?.value ?? "",
          t: Date.now() - appearedAtRef.current,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "<unreadable>");
        console.error(`[subscribe] HTTP ${response.status} from /api/subscribe: ${text}`);
        setStatus("error");
        setMessage(t("footer.subscribe.error"));
        return;
      }

      /* A rewrite or a proxy can answer 200 with an HTML page instead of JSON,
         so the body is checked before the signup is treated as accepted. */
      let result = null;
      try {
        result = await response.json();
      } catch {
        console.error("[subscribe] HTTP 200 but the body was not JSON — /api may be swallowed by a rewrite");
        setStatus("error");
        setMessage(t("footer.subscribe.error"));
        return;
      }
      if (!result || result.ok !== true) {
        console.error("[subscribe] server did not confirm:", JSON.stringify(result));
        setStatus("error");
        setMessage(t("footer.subscribe.error"));
        return;
      }

      setStatus("success");
      setMessage(t("footer.subscribe.success"));
      setEmail("");
      setInterests([]);
    } catch (error) {
      /* Two different failures end up here. The visitor sees the same generic
         translated message either way — the wording must not change — but the
         console says which one it was, so a timeout is never mistaken for a
         dead server. The typed email and the ticked interests are left alone
         so the visitor can simply press Submit again. */
      const timedOut = error?.name === "AbortError";
      console.error(
        timedOut
          ? "[subscribe] the request timed out after 12s and was cancelled"
          : `[subscribe] network error: ${error?.message ?? error}`
      );
      setStatus("error");
      setMessage(t("footer.subscribe.error"));
    } finally {
      clearTimeout(timer);
      /* Always leaves the sending state, so the button becomes clickable again
         whatever happened. */
      setStatus((current) => (current === "sending" ? "idle" : current));
    }
  };

  return (
    <footer className="footer">
      {/* ===== STAY CONNECTED BAR ===== */}
      <div className="footer-connect">
        <div className="footer-connect-left">
          <span className="footer-connect-kicker">{t("footer.stay")}</span>
          <span className="footer-connect-title">{t("footer.connected")}</span>
        </div>

        <form
          className="footer-connect-right"
          id="stay-connected"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="footer-connect-email">
            <label htmlFor="footer-email">{t("footer.emailLabel")}</label>
            <div className="footer-email-row">
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                aria-describedby={status !== "idle" ? "footer-subscribe-status" : undefined}
              />
              <button
                type="submit"
                className="footer-email-arrow"
                aria-label={t("footer.emailSubmit")}
                disabled={status === "sending"}
              >
                <i className="bx bx-right-arrow-alt"></i>
              </button>
            </div>
          </div>

          <div className="footer-connect-interests">
            <span className="footer-interests-title">{t("footer.interestsTitle")}</span>
            <div className="footer-interests-list">
              {interestOptions.map((interest) => (
                <label className="footer-checkbox" key={interest.value}>
                  <input
                    type="checkbox"
                    checked={interests.includes(interest.value)}
                    onChange={() => toggleInterest(interest.value)}
                  />
                  <span>{t(interest.key)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Honeypot. The label AND the input live inside one container that is
              pushed off-screen, so nothing is visible and nothing is clickable.
              The wrapper is aria-hidden and the input is out of the tab order.
              display:none is deliberately NOT used: some bots skip hidden
              elements, so it is moved off-screen instead. The name is a neutral
              hp_field so no browser autofills it, and no visible "Website"
              label is rendered anywhere. */}
          <div className="footer-hp" aria-hidden="true">
            <input
              id="footer-hp-field"
              name="hp_field"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
              ref={honeypotRef}
            />
          </div>

          <p className="footer-subscribe-note">{t("footer.subscribe.unsubscribeNote")}</p>

          <button type="submit" className="footer-submit-btn" disabled={status === "sending"}>
            {status === "sending" ? t("footer.subscribe.sending") : t("footer.submit")}
          </button>

          <p
            id="footer-subscribe-status"
            className={`footer-subscribe-status footer-subscribe-status--${status}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>

          <p className="footer-subscribe-notice">
            {t("footer.subscribe.notice")}{" "}
            <NavLink to="/privacy">{t("footer.subscribe.privacyLink")}</NavLink>
          </p>
        </form>
      </div>

      {/* ===== DARK LINKS BAR ===== */}
      <div className="footer-bottom">
        <div className="footer-bottom-top">
          <NavLink to="/" className="footer-logo" aria-label="AUVD">
            AUVD
          </NavLink>

          <nav className="footer-bottom-links" aria-label={t("footer.navLabel")}>
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className="footer-bottom-link">
                {t(link.labelKey)}
              </NavLink>
            ))}
          </nav>

          <span className="footer-tagline">{t("footer.tagline")}</span>
        </div>

        <ul className="footer-social-row">
          {socialLinks.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} aria-label={s.label}>
                <i className={s.icon}></i>
              </a>
            </li>
          ))}
        </ul>

        <div className="footer-legal-row">
          <NavLink to="/terms">{t("footer.legal.terms")}</NavLink>
          <span className="footer-legal-divider">|</span>
          <NavLink to="/privacy">{t("footer.legal.privacy")}</NavLink>
          <span className="footer-legal-divider">|</span>
          <NavLink to="/sitemap">{t("footer.legal.sitemap")}</NavLink>

          {/* The admin entry point. Deliberately the quietest thing in the
              footer: a bare lock icon, the same size as the legal links
              beside it, with no visible label. It is a way in for the person
              who maintains the site, not a feature offered to visitors, so it
              is not styled like a call to action. The accessible name still
              says what it is, because an unlabelled icon is unusable with a
              screen reader. */}
          <span className="footer-legal-divider">|</span>
          <button
            type="button"
            className="footer-admin-link"
            onClick={openAdmin}
            aria-label={t("footer.admin.open")}
            title={t("footer.admin.open")}
          >
            <FaLock aria-hidden="true" />
          </button>
        </div>

        {/* The admin sign-in modal. Rendered only while it is open, so nothing
            about the login is in the DOM for a visitor who never clicks the
            lock icon. */}
        {adminOpen ? (
          <div
            className="footer-admin-overlay"
            onClick={closeAdmin}
            role="presentation"
          >
            <div
              className="footer-admin-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="footer-admin-modal-title"
              ref={adminDialogRef}
              /* A click inside the dialog must not bubble up to the overlay,
                  or closing the modal would also register as a click on the
                  field being typed in. */
              onClick={(event) => event.stopPropagation()}
            >
              <div className="footer-admin-modal-head">
                <h2 className="footer-admin-modal-title" id="footer-admin-modal-title">
                  {/* Hidden in register and "already exists" modes, because the
                      form draws its own heading there. Showing both would read as
                      a contradiction. */}
                  {adminMode === "register" || adminMode === "exists"
                    ? null
                    : t("footer.admin.title")}
                </h2>
                <button
                  type="button"
                  className="footer-admin-close"
                  onClick={closeAdmin}
                  aria-label={t("footer.admin.close")}
                >
                  <i className="bx bx-x" aria-hidden="true"></i>
                </button>
              </div>

              {/* On success the modal goes straight to the dashboard. The
                  session is an httpOnly cookie set by the server, so there is
                  no token to carry across by hand. Whichever form the form
                  itself decides to show — register or login — this is where it
                  goes on success. */}
              <AdminLoginForm
                onModeChange={setAdminMode}
                onSuccess={() => {
                  setAdminOpen(false);
                  navigate("/admin/post");
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </footer>
  );
};

export default Footer;