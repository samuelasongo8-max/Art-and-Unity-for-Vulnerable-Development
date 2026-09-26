import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Footer.css";

const navLinks = [
  { to: "/about", labelKey: "footer.links.about" },
  { to: "/Work", labelKey: "footer.links.work" },
  { to: "/our-impact", labelKey: "footer.links.impact" },
  { to: "/our-impact/blogs", labelKey: "footer.links.resources" },
  { to: "/contact", labelKey: "footer.links.contact" },
  { to: "/donate", labelKey: "footer.links.donate" },
];

// Stored as translation keys so the checkbox labels follow the language.
// The raw value is still what gets submitted, keeping the payload stable.
const interestOptions = [
  { value: "Education", key: "footer.interests.education" },
  { value: "Music Program", key: "footer.interests.music" },
  { value: "Dance Program", key: "footer.interests.dance" },
  { value: "Vocational Training", key: "footer.interests.vocational" },
];

const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=61569926836907", icon: "bx bxl-facebook", label: "Facebook" },
  { href: "https://ke.linkedin.com--", icon: "bx bxl-linkedin", label: "LinkedIn" },
  { href: "https://www.instagram.com/art.unityvulnerabledev2024/", icon: "bx bxl-instagram", label: "Instagram" },
  { href: "https://www.youtube.com/@Artandunity-q2q", icon: "bx bxl-youtube", label: "YouTube" },
  { href: "https://www.tiktok.com/@artunity_vulnerabledev", icon: "bx bxl-tiktok", label: "TikTok" },
];

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState([]);

  const toggleInterest = (value) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // hook up to your newsletter service here
    console.log({ email, interests });
  };

  return (
    <footer className="footer">
      {/* ===== STAY CONNECTED BAR ===== */}
      <div className="footer-connect">
        <div className="footer-connect-left">
          <span className="footer-connect-kicker">{t("footer.stay")}</span>
          <span className="footer-connect-title">{t("footer.connected")}</span>
        </div>

        <form className="footer-connect-right" onSubmit={handleSubmit}>
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
              />
              <button type="submit" className="footer-email-arrow" aria-label={t("footer.emailSubmit")}>
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

          <button type="submit" className="footer-submit-btn">
            Submit
          </button>
        </form>
      </div>

      {/* ===== DARK LINKS BAR ===== */}
      <div className="footer-bottom">
        <div className="footer-bottom-top">
          <NavLink to="/" className="footer-logo">
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