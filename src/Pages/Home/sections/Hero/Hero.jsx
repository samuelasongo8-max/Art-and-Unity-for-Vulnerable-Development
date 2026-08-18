import { useEffect, useState } from "react";
import "./Hero.css";

function Hero({ navigate, heroTitleParts, slides }) {
  const heroTitleFull = `${heroTitleParts.before}${heroTitleParts.highlight}${heroTitleParts.after}`;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Slideshow rotation
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((previous) => (previous === slides.length - 1 ? 0 : previous + 1));
    }, 4000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  // Typing effect
  useEffect(() => {
    let typingInterval;
    const startDelay = window.setTimeout(() => {
      typingInterval = window.setInterval(() => {
        setTypedChars((previous) => {
          if (previous >= heroTitleFull.length) {
            window.clearInterval(typingInterval);
            return previous;
          }
          return previous + 1;
        });
      }, 55);
    }, 250);

    return () => {
      window.clearTimeout(startDelay);
      window.clearInterval(typingInterval);
    };
  }, [heroTitleFull.length]);

  // Entrance fade-in, matching AUVD hero timing
  useEffect(() => {
    const t = window.setTimeout(() => setLoaded(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  const beforeLength = heroTitleParts.before.length;
  const highlightLength = heroTitleParts.highlight.length;
  const typedBefore = heroTitleParts.before.slice(0, Math.min(typedChars, beforeLength));
  const typedHighlight = heroTitleParts.highlight.slice(
    0,
    Math.max(0, Math.min(typedChars - beforeLength, highlightLength))
  );
  const typedAfter = heroTitleParts.after.slice(
    0,
    Math.max(0, typedChars - beforeLength - highlightLength)
  );
  const isTypingComplete = typedChars >= heroTitleFull.length;

  return (
    <header
      className={`auvd-hero ${loaded ? "is-loaded" : ""}`}
      style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
    >
      <div className="auvd-content">
        <span className="auvd-white"> Art &amp; Unity for Vulnerable Development</span>

        <h1 className="auvd-headline typing-text" aria-label={heroTitleFull}>
          {typedBefore}
          <em>{typedHighlight}</em>
          {typedAfter}
          <span
            className={`typing-cursor${isTypingComplete ? " is-complete" : ""}`}
            aria-hidden="true"
          >
            |
          </span>
        </h1>

        <p className="auvd-sub">
          Art and Unity for Vulnerable Development (AUVD) is a refugee-led organization
          transforming lives in Kakuma Refugee Camp through creativity, skills development,
          and inclusive community programs.
        </p>

        <div className="auvd-cta-row">
          <button className="auvd-cta" onClick={() => navigate("/about")} type="button">
            Learn more about us
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="auvd-cta-secondary" onClick={() => navigate("/Work")} type="button">
            Explore more
          </button>
          <button
            className="auvd-cta-secondary"
            onClick={() => navigate("/Vocational")}
            type="button"
          >
            Share your creativity
          </button>
          <button className="auvd-cta-secondary" onClick={() => navigate("/Music")} type="button">
            Music education
          </button>
          <button className="auvd-cta-secondary" onClick={() => navigate("/dance")} type="button">
            Community dance
          </button>
        </div>

        <ul className="auvd-social-links" aria-label="Social media links">
          <li>
            <a
              className="auvd-social-link auvd-social-facebook"
              href="https://www.facebook.com/profile.php?id=61569926836907"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              aria-label="Facebook"
            >
              <i className="bx bxl-facebook"></i>
            </a>
          </li>
          <li>
            <a
              className="auvd-social-link auvd-social-linkedin"
              href="https://ke.linkedin.com--"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <i className="bx bxl-linkedin"></i>
            </a>
          </li>
          <li>
            <a
              className="auvd-social-link auvd-social-instagram"
              href="https://www.instagram.com/art.unityvulnerabledev2024/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              aria-label="Instagram"
            >
              <i className="bx bxl-instagram"></i>
            </a>
          </li>
          <li>
            <a
              className="auvd-social-link auvd-social-youtube"
              href="https://www.youtube.com/@Artandunity-q2q"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              aria-label="YouTube"
            >
              <i className="bx bxl-youtube"></i>
            </a>
          </li>
          <li>
            <a
              className="auvd-social-link auvd-social-tiktok"
              href="https://www.tiktok.com/@artunity_vulnerabledev"
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok"
              aria-label="TikTok"
            >
              <i className="bx bxl-tiktok"></i>
            </a>
          </li>
        </ul>
      </div>

      
    </header>
  );
}

export default Hero;