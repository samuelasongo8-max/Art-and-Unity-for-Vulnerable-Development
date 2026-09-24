import { useEffect, useMemo, useState } from "react";
import {
  FaListCheck,
  FaMapLocationDot,
  FaPeopleGroup,
  FaUserGraduate,
} from "react-icons/fa6";
import "./ImpactStatsSection.css";
import useOnceInView from "../../hooks/useOnceInView";
import useRevealClass from "../../hooks/useRevealClass";

/* "Our Impact" — restyled into the Our Impact two-column pattern, the same
   one the Visual Arts and VET sections use: the existing background photo
   now sits in the media column (right, alternating from the VET section
   above, whose image is on the left), the heading is promoted to the
   pattern's Bebas Neue title (this section has no separate label wording),
   and the existing paragraph uses the shared Source Sans 3 body style
   (src/components/ImpactSections.css, imported once via Home.css). The four
   figures are unchanged and sit under the two-column body. Wording and the
   photo are unchanged. */

const iconMap = {
  list: <FaListCheck />,
  map: <FaMapLocationDot />,
  people: <FaPeopleGroup />,
  graduate: <FaUserGraduate />,
};

function ImpactStatsSection({ impactStats }) {
  const [cardsRef, isVisible] = useOnceInView(0.25);
  const textRef = useRevealClass("content-entered", 0.3);
  const [counts, setCounts] = useState({ reached: 0, programs: 0, trained: 0, camps: 0 });

  const stats = useMemo(
    () => impactStats.map((item) => ({ ...item, icon: iconMap[item.icon] })),
    [impactStats]
  );

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    const durationMs = 3200;
    let animationFrameId;
    const animationStart = performance.now();

    const updateCounts = (now) => {
      const elapsed = now - animationStart;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setCounts({
        reached: Math.round(500 * easedProgress),
        programs: Math.round(7 * easedProgress),
        trained: Math.round(100 * easedProgress),
        camps: Math.max(1, Math.round(1 * easedProgress)),
      });

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(updateCounts);
      }
    };

    animationFrameId = window.requestAnimationFrame(updateCounts);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [isVisible]);

  return (
    <section className="auvd-story-section auvd-story-section--tint impact-section">
      <div className="auvd-story-container">
        <div className="auvd-story-body auvd-story-body--flip">

          {/* Existing photo, now the media column (right) */}
          <div className="auvd-story-gallery auvd-story-gallery--single">
            <img
              className="auvd-story-gallery-item auvd-story-gallery-item--1"
              src="/Upcoming%20project%20%20(2).jpg"
              alt="AUVD community programs"
            />
          </div>

          <div ref={textRef} className="auvd-story-text impact-text-block content-animated">
            <h2 className="auvd-story-title">Our Impact</h2>

            <p>
              Transforming lives through art, healing, and opportunity in Kakuma Refugee Camp
            </p>
          </div>

        </div>

        <div ref={cardsRef} className="impactCards">
          {stats.map((stat, index) => (
            <div
              key={stat.key}
              className={`impactBox ${stat.wide ? "impactBox--wide" : ""} ${
                isVisible ? "impactBox--visible" : ""
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="impactCardHeader">
                <div className="impactIconBadge" aria-hidden="true">
                  {stat.icon}
                </div>
                <h3 className="impactValue">
                  {counts[stat.key]}
                  {stat.suffix}
                </h3>
              </div>
              <h4 className="impactTitle">{stat.title}</h4>
              {stat.info.map((line) => (
                <p key={line} className="impactInfo">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactStatsSection;
