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
    <section className="our-why-section dance-section">
      <div className="our-why-container">
        <div ref={sectionRef} className="our-why-content">
          <h2 className="walking-text">
            {"Dance".split("").map((char, index) => (
              <span key={`${char}-${index}`}>{char}</span>
            ))}
          </h2>

          <p className="our-why-text">
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

          <button className="read-more-btn" onClick={() => navigate("/dance")} type="button">
            Community dance
          </button>
        </div>
      </div>
    </section>
  );
}

export default DanceSection;