import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const navLinks = [
  { to: "/about", label: "About Us" },
  { to: "/Work", label: "Our Work" },
  { to: "/blogs", label: "Resources" },
  { to: "/contact", label: "Contact" },
  { to: "/about/story", label: "Our Story" },
  { to: "/donate", label: "Donate" },
];

const interestOptions = [
  "Education",
  "Music Program",
  "Dance Program",
  "Vocational Training",
];

const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=61569926836907", icon: "bx bxl-facebook", label: "Facebook" },
  { href: "https://ke.linkedin.com--", icon: "bx bxl-linkedin", label: "LinkedIn" },
  { href: "https://www.instagram.com/art.unityvulnerabledev2024/", icon: "bx bxl-instagram", label: "Instagram" },
  { href: "https://www.youtube.com/@Artandunity-q2q", icon: "bx bxl-youtube", label: "YouTube" },
  { href: "https://www.tiktok.com/@artunity_vulnerabledev", icon: "bx bxl-tiktok", label: "TikTok" },
];

const Footer = () => {
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
          <span className="footer-connect-kicker">stay</span>
          <span className="footer-connect-title">CONNECTED</span>
        </div>

        <form className="footer-connect-right" onSubmit={handleSubmit}>
          <div className="footer-connect-email">
            <label htmlFor="footer-email">What's your email? *</label>
            <div className="footer-email-row">
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
              />
              <button type="submit" className="footer-email-arrow" aria-label="Submit email">
                <i className="bx bx-right-arrow-alt"></i>
              </button>
            </div>
          </div>

          <div className="footer-connect-interests">
            <span className="footer-interests-title">What are your interests?</span>
            <div className="footer-interests-list">
              {interestOptions.map((interest) => (
                <label className="footer-checkbox" key={interest}>
                  <input
                    type="checkbox"
                    checked={interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                  />
                  <span>{interest}</span>
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

          <nav className="footer-bottom-links" aria-label="Footer">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className="footer-bottom-link">
                {link.label}
              </NavLink>
            ))}
          </nav>

          <span className="footer-tagline">Art &amp; Unity</span>
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
          <NavLink to="/terms">Terms of Use</NavLink>
          <span className="footer-legal-divider">|</span>
          <NavLink to="/privacy">Privacy Policy</NavLink>
          <span className="footer-legal-divider">|</span>
          <NavLink to="/sitemap">Sitemap</NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;