import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Music.css";

const musicTitle = "Music Education & Instrument Training";

const musicActivities = [
  "Vocal training, including singing techniques, voice control, and performance skills.",
  "Guitar classes for children and adults.",
  "Piano lessons for beginners and developing learners.",
  "Ukulele training designed for children.",
  "Instrument instruction covering bass, rhythm, and solo guitar.",
];

const EducationAccess = () => {
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let timeoutId;
    const startDelayMs = 250;
    const typingSpeedMs = 38;

    const startTyping = () => {
      let lastTimestamp = 0;

      const animate = (timestamp) => {
        if (!lastTimestamp) {
          lastTimestamp = timestamp;
        }

        if (timestamp - lastTimestamp >= typingSpeedMs) {
          lastTimestamp = timestamp;
          setTypedChars((previous) => {
            if (previous >= musicTitle.length) {
              return previous;
            }

            return previous + 1;
          });
        }

        animationFrameId = window.requestAnimationFrame(animate);
      };

      animationFrameId = window.requestAnimationFrame(animate);
    };

    timeoutId = window.setTimeout(startTyping, startDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const typedTitle = musicTitle.slice(0, typedChars);
  const isTypingComplete = typedChars >= musicTitle.length;

  return (
    <section className="music-page">
      <div className="music-page__inner">
        <div className="music-page__hero">
          <div className="music-page__headline music-page__headline--animated">
            <p className="music-page__eyebrow music-page__fade music-page__fade--delay-1">Creative Learning</p>
            <h1 className="music-page__title music-page__typing-title" aria-label={musicTitle}>
              {typedTitle}
              <span
                className={`music-page__typing-cursor${isTypingComplete ? " music-page__typing-cursor--done" : ""}`}
                aria-hidden="true"
              >
                |
              </span>
            </h1>
            <p className="music-page__summary">
              We provide comprehensive music training for children and adults, helping
              participants build artistic skills, discipline, confidence, and self-expression
              through instrumental and vocal practice.
            </p>
            <div className="music-page__actions music-page__fade music-page__fade--delay-3">
              <Link className="music-page__cta" to="/contact">
                Join the Program
              </Link>
            </div>
          </div>

          <div className="music-page__visual music-page__visual--animated">
            <img
              src="/guitar2.webp"
              srcSet="/guitar2-sm.webp 720w, /guitar2.webp 1400w"
              sizes="(max-width: 1024px) 88vw, 420px"
              alt="Young participant in AUVD music education"
              className="music-page__image"
              width="420"
              height="525"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className="music-page__content-card music-page__content-card--animated">
          <div className="music-page__section music-page__fade music-page__fade--delay-2">
            <h2 className="music-page__section-title">Activities Include</h2>
            <div className="music-page__divider"></div>
            <ul className="music-page__list">
              {musicActivities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
            <img
              src="/drawing2.webp"
              srcSet="/drawing2-sm.webp 720w, /drawing2.webp 1200w"
              sizes="(max-width: 768px) 100vw, 420px"
              alt="AUVD music activities session"
              className="music-page__section-image music-page__section-image--animated"
              width="420"
              height="315"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="music-page__section music-page__fade music-page__fade--delay-4">
            <h2 className="music-page__section-title">Impact</h2>
            <div className="music-page__divider"></div>
            <p className="music-page__impact">
              Participants build confidence, strengthen emotional expression, and develop
              practical musical skills that can lead to performance, leadership, and income
              opportunities.
            </p>
            <div className="music-page__impact-images">
              <img
                src="/sami.webp"
                srcSet="/sami-sm.webp 480w, /sami.webp 900w"
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 44vw, 240px"
                alt="AUVD participant during a music session"
                className="music-page__impact-image music-page__impact-image--animated music-page__impact-image--delay-1"
                width="520"
                height="292"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/muziki.webp"
                srcSet="/muziki-sm.webp 480w, /muziki.webp 1100w"
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 44vw, 240px"
                alt="AUVD music training activity"
                className="music-page__impact-image music-page__impact-image--animated music-page__impact-image--delay-2"
                width="320"
                height="240"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/violin.webp"
                srcSet="/violin-sm.webp 480w, /violin.webp 900w"
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 44vw, 240px"
                alt="AUVD violin practice session"
                className="music-page__impact-image music-page__impact-image--animated music-page__impact-image--delay-3"
                width="320"
                height="240"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/youth.webp"
                srcSet="/youth-sm.webp 480w, /youth.webp 1100w"
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 44vw, 240px"
                alt="AUVD youth music activity"
                className="music-page__impact-image music-page__impact-image--animated music-page__impact-image--delay-4"
                width="320"
                height="240"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/mataya.webp"
                srcSet="/mataya-sm.webp 480w, /mataya.webp 900w"
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 44vw, 240px"
                alt="AUVD music participant performance moment"
                className="music-page__impact-image music-page__impact-image--animated music-page__impact-image--delay-5"
                width="320"
                height="240"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default EducationAccess;