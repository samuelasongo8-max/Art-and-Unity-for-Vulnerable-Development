import { useEffect, useState } from "react";
import "./DanceSection.css";
import useOnceInView from "../../hooks/useOnceInView";

function DanceSection({ navigate, danceParagraphs }) {
  const [sectionRef, isVisible] = useOnceInView(0.3);
  const [typedChars, setTypedChars] = useState({ first: 0, second: 0 });

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    if (typedChars.first < danceParagraphs.first.length) {
      const timeoutId = window.setTimeout(() => {
        setTypedChars((previous) => ({ ...previous, first: previous.first + 1 }));
      }, 18);

      return () => window.clearTimeout(timeoutId);
    }

    if (typedChars.second < danceParagraphs.second.length) {
      const timeoutId = window.setTimeout(() => {
        setTypedChars((previous) => ({ ...previous, second: previous.second + 1 }));
      }, 18);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [danceParagraphs.first.length, danceParagraphs.second.length, isVisible, typedChars.first, typedChars.second]);

  return (
    <section className="dance-section">
      <div className="dance-overlay"></div>
      <div ref={sectionRef} className="dance-content">
        <div className="dance-text-wrapper">
          <h2 className="dance-title">
            {"Dance".split("").map((char, index) => (
              <span key={`${char}-${index}`}>{char}</span>
            ))}
          </h2>

          <p className="dance-description">
            {danceParagraphs.first.slice(0, typedChars.first)} In an environment where many youth
            face stress, trauma, unemployment, and limited recreational opportunities, dance
            creates hope, inspiration, and a sense of belonging. AUVD uses dance not only as
            entertainment, but also as a pathway for empowerment, resilience, and community
            connection.
          </p>

          <div className="dance-highlights">
            <h3>Move with purpose and Dance with confidence.</h3>
            <h3>Express yourself through dance and creativity.</h3>
            <h3>Where talent meets opportunity.</h3>
          </div>

          <button className="dance-btn" onClick={() => navigate("/dance")} type="button">
            Community dance
          </button>
        </div>

        <div className="dance-scroll-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default DanceSection;