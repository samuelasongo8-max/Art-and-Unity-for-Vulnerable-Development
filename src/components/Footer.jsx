import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

  /* Honeypot: a real visitor never sees or fills this. */
  const websiteRef = useRef(null);
  /* Milliseconds since the form appeared, posted as `t`. The server treats
     anything under 3 seconds as a bot. */
  const appearedAtRef = useRef(Date.now());

  const toggleInterest = (value) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          topics: interests,
          lang: i18n.resolvedLanguage === "fr" ? "fr" : "en",
          website: websiteRef.current?.value ?? "",
          t: Date.now() - appearedAtRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`subscribe responded ${response.status}`);
      }

      setStatus("success");
      setMessage(t("footer.subscribe.success"));
      setEmail("");
      setInterests([]);
    } catch {
      setStatus("error");
      setMessage(t("footer.subscribe.error"));
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

          {/* Honeypot: pushed off-screen and out of the tab order, so only
              an automated bot will ever fill it in. */}
          <div className="footer-hp" aria-hidden="true">
            <label htmlFor="footer-website">Website</label>
            <input
              id="footer-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              ref={websiteRef}
            />
          </div>

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
        </div>
      </div>
    </footer>
  );
};

export default Footer;