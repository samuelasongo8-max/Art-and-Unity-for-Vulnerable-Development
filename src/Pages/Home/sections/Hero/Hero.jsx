import { useEffect, useState } from "react";
import "./Hero.css";

function Hero({ navigate, heroTitleParts, slides }) {
  const heroTitleFull = `${heroTitleParts.before}${heroTitleParts.highlight}${heroTitleParts.after}`;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((previous) => (previous === slides.length - 1 ? 0 : previous + 1));
    }, 4000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

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
    <section
      className="hero hero-section together-hero-bg"
      style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
    >
      <div className="hero-caption hero-card">
        <div className="hero-copy">
          <div className="lock">
            <h2 className="typing-text hero-title" aria-label={heroTitleFull}>
              {typedBefore}
              <span>{typedHighlight}</span>
              {typedAfter}
              <span
                className={`typing-cursor${isTypingComplete ? " is-complete" : ""}`}
                aria-hidden="true"
              >
                |
              </span>
            </h2>
          </div>

          <p className="hero-description">
            Art and Unity for Vulnerable Development (AUVD) is a refugee-led organization
            transforming lives in Kakuma Refugee Camp through creativity, skills development,
            and inclusive community programs.
          </p>

          <div className="hero-actions">
            <button className="btn-go-about" onClick={() => navigate("/about")} type="button">
              Learn more About us
            </button>
            <button className="btn-go-about" onClick={() => navigate("/Work")} type="button">
              Explore More
            </button>
            <button
              className="btn-go-about"
              onClick={() => navigate("/Vocational")}
              type="button"
            >
              Share Your Creativity
            </button>
            <button className="btn-go-about" onClick={() => navigate("/Music")} type="button">
              Music Education
            </button>
            <button className="btn-go-about" onClick={() => navigate("/dance")} type="button">
              Community dance
            </button>
          </div>

          <ul className="hero-social-links" aria-label="Social media links">
            <li>
              <a
                className="hero-social-link hero-social-facebook"
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
                className="hero-social-link hero-social-linkedin"
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
                className="hero-social-link hero-social-instagram"
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
                className="hero-social-link hero-social-youtube"
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
                className="hero-social-link hero-social-tiktok"
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
      </div>
    </section>
  );
}

export default Hero;