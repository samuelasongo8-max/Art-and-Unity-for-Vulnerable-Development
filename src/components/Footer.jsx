import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const footerSections = [
  {
    title: "Explore",
    links: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About AUVD" },
      { to: "/Work", label: "Our Work" },
      { to: "/events", label: "Events" },
      { to: "/blogs", label: "Blogs" },
    ],
  },
  {
    title: "Programs",
    links: [
      { to: "/pricing", label: "Education" },
      { to: "/portfolio", label: "Outreach" },
      { to: "/Music", label: "Music Program" },
      { to: "/dance", label: "Dance Program" },
      { to: "/Vocational", label: "Artist submission form" },
    ],
  },
  {
    title: "Connect",
    links: [
      { to: "/donate", label: "Support AUVD" },
      { to: "/contact", label: "Contact Us" },
      { to: "/about/team", label: "Leadership Team" },
      { to: "/about/story", label: "Our Story" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-shell footer-shell-animated">
        <div className="footer-topbar footer-reveal footer-reveal-topbar">
          <div className="footer-brand-lockup">
            <span className="footer-kicker">Art and Unity for Vulnerable Development</span>
            <h2>Building healing, education, and opportunity in Kakuma.</h2>
          </div>

          <NavLink to="/donate" className="footer-primary-cta">
            Support AUVD
          </NavLink>
        </div>

      <div className="footer-grid">
        <div className="footer-column footer-brand footer-reveal footer-reveal-brand">
          <h4>AUVD</h4>
          <p>
            Art and Unity for Vulnerable Development is a refugee-led organization advancing
            healing, education, creativity, and opportunity in Kakuma Refugee Camp.
          </p>
          <div className="footer-contact-list">
            <a className="footer-contact-item" href="tel:+254784062882">
              <i className="bx bx-phone"></i>
              <span>(+254) 784062882</span>
               <span>(+254) 102930604</span>
            </a>
            <a className="footer-contact-item" href="mailto:artandunityforvulnerable.org@gmail.com">
              <i className="bx bx-envelope"></i>
              <span>artandunityforvulnerable.org@gmail.com</span>
            </a>
          </div>
          <div className="footer-mini-links">
            <NavLink to="/blogs" className="footer-chip">Latest stories</NavLink>
            <NavLink to="/events" className="footer-chip">Upcoming events</NavLink>
          </div>
        </div>

        {footerSections.map((section) => (
          <div
            className="footer-column footer-reveal footer-reveal-column"
            key={section.title}
            style={{ "--footer-delay": `${0.22 + footerSections.indexOf(section) * 0.1}s` }}
          >
            <h4>{section.title}</h4>
            <nav className="footer-link-group" aria-label={section.title}>
              {section.links.map((link) => (
                <NavLink key={link.to} to={link.to} className="footer-btn">
                  <span>{link.label}</span>
                  <i className="bx bx-right-arrow-alt"></i>
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="sub-footer footer-reveal footer-reveal-subfooter">
        <div className="sub-footer-copy">
         
          <p>© 2026 All rights reserved.</p>
        </div>

        <ul className="social-network">
          <li>
            <a className="footer-social-link footer-social-facebook" href="https://www.facebook.com/profile.php?id=61569926836907" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">
              <i className="bx bxl-facebook"></i>
            </a>
          </li>
          <li>
            <a className="footer-social-link footer-social-linkedin" href="https://ke.linkedin.com--" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
              <i className="bx bxl-linkedin"></i>
            </a>
          </li>
        
          <li>
            <a className="footer-social-link footer-social-instagram" href="https://www.instagram.com/art.unityvulnerabledev2024/" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
              <i className="bx bxl-instagram"></i>
            </a>
          </li>
          <li>
            <a className="footer-social-link footer-social-youtube" href="https://www.youtube.com/@Artandunity-q2q" target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="YouTube">
              <i className="bx bxl-youtube"></i>
            </a>
          </li>
          <li>
            <a className="footer-social-link footer-social-tiktok" href="https://www.tiktok.com/@artunity_vulnerabledev" target="_blank" rel="noopener noreferrer" title="TikTok" aria-label="TikTok">
              <i className="bx bxl-tiktok"></i>
            </a>
          </li>
        </ul>
        
      </div>
      </div>
    </footer>
  );
};

export default Footer;
