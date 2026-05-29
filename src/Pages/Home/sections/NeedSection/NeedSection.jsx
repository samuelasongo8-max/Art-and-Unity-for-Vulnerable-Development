import { useEffect, useState } from "react";
import "./NeedSection.css";
import useRevealClass from "../../hooks/useRevealClass";

function NeedSection({ backgrounds }) {
  const [currentBackground, setCurrentBackground] = useState(0);
  const contentRef = useRevealClass("why-content-entered", 0.3);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentBackground((previous) =>
        previous === backgrounds.length - 1 ? 0 : previous + 1
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <section
      ref={contentRef}
      className="why-section need-section why-content-animated"
      style={{
        backgroundImage: `linear-gradient(rgba(20, 24, 31, 0.74), rgba(20, 24, 31, 0.54)), url(${backgrounds[currentBackground]})`,
      }}
    >
      <div className="why-container why-container-no-image">
        <div className="why-content">
          <h2 className="why-title walking-text why11">
            {"The Need".split("").map((char, index) => (
              <span key={`${char}-${index}`}>{char}</span>
            ))}
          </h2>

          <div className="why-text">
            <div className="zigzag-wrapper">
              <svg className="zigzag-icon" viewBox="0 0 100 40">
                <polyline
                  points="5,30 20,10 35,30 50,10 65,30 80,10 95,30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div id="why">
              Refugees face extraordinary challenges before, during, and after displacement
              including conflict, loss of home and loved ones, prolonged uncertainty, and
              stressful living conditions in camps and settlements. These experiences often take a
              significant emotional and psychological toll, increasing the risk of mental health
              and psychosocial distress. Forced displacement places refugees under prolonged stress
              that affects emotional well-being, social functioning, and overall quality of life.
              <br />
              <br />
              Despite remarkable resilience, many refugees do not have access to mental health and
              psychosocial support services. In most refugee settings, specialized professionals
              like counselors and therapists are scarce or unavailable, and mainstream services
              often do not reach those who need them most.
              <br />
              <br />
              This gap leaves vulnerable individuals especially children, youth, women, and trauma
              survivors without safe, culturally relevant spaces to process emotions, rebuild
              confidence, and strengthen social connections.
            </div>
          </div>
        </div>
      </div>

      <p className="part2">
        At AUVD, we believe that creative and community driven support systems are essential in
        addressing these challenges. By integrating arts, creative expression, and psychosocial
        support into community programs, we help refugees heal, connect, and thrive while
        promoting emotional well-being, resilience, and positive social transformation.
      </p>
    </section>
  );
}

export default NeedSection;