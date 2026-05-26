import { useEffect, useMemo, useState } from "react";
import {
  FaListCheck,
  FaMapLocationDot,
  FaPeopleGroup,
  FaUserGraduate,
} from "react-icons/fa6";
import "./ImpactStatsSection.css";
import useOnceInView from "../../hooks/useOnceInView";

const iconMap = {
  list: <FaListCheck />,
  map: <FaMapLocationDot />,
  people: <FaPeopleGroup />,
  graduate: <FaUserGraduate />,
};

function ImpactStatsSection({ impactStats }) {
  const [sectionRef, isVisible] = useOnceInView(0.25);
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
    <section ref={sectionRef} className={`impactSection ${isVisible ? "impactSection--visible" : ""}`}>
      <div className="impactWrapper">
        <h2 className="impactHeading">Our Impact</h2>
        <p className="impactText">
          Transforming lives through art, healing, and opportunity in Kakuma Refugee Camp
        </p>

        <div className="impactCards">
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