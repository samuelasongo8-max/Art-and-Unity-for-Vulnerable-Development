import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Music.css";

const musicTitle = "Music Education & Instrument Training";

const musicActivityKeys = [
  "music.activities.one",
  "music.activities.two",
  "music.activities.three",
  "music.activities.four",
  "music.activities.five"
];

const EducationAccess = () => {
  const { t } = useTranslation();
  // The typing animation is driven by the TRANSLATED title, so it types out
  // the French title when the language changes.
  const musicTitle = t("music.title");
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let timeoutId;
    const startDelayMs = 250;
    const typingSpeedMs = 38;

    /* `musicTitle` is a dependency, not an empty array: the loop below closes
       over the title and stops at its length, so on a language change the
       effect has to re-run with the new string. Otherwise the loop keeps the
       FRENCH title's length and truncates the English title mid-word. */
    setTypedChars(0);

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
  }, [musicTitle]);

  const typedTitle = musicTitle.slice(0, typedChars);
  const isTypingComplete = typedChars >= musicTitle.length;

  return (
    <section className="music-page">
      <div className="music-page__inner">
        <div className="music-page__hero">
          <div className="music-page__headline music-page__headline--animated">
            <p className="music-page__eyebrow music-page__fade music-page__fade--delay-1">{t("music.eyebrow")}</p>
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
              {t("music.summary")}
            </p>
            <div className="music-page__actions music-page__fade music-page__fade--delay-3">
              <Link className="music-page__cta" to="/contact">
                {t("music.join")}
              </Link>
            </div>
          </div>

          <div className="music-page__visual music-page__visual--animated">
            <img
              src="/guitar2.webp"
              srcSet="/guitar2-sm.webp 720w, /guitar2.webp 1400w"
              sizes="(max-width: 1024px) 88vw, 420px"
              alt={t("music.heroAlt")}
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
            <h2 className="music-page__section-title">{t("music.activitiesTitle")}</h2>
            <div className="music-page__divider"></div>
            <ul className="music-page__list">
              {musicActivityKeys.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
            <img
              src="/drawing2.webp"
              srcSet="/drawing2-sm.webp 720w, /drawing2.webp 1200w"
              sizes="(max-width: 768px) 100vw, 420px"
              alt={t("music.activitiesAlt")}
              className="music-page__section-image music-page__section-image--animated"
              width="420"
              height="315"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="music-page__section music-page__fade music-page__fade--delay-4">
            <h2 className="music-page__section-title">{t("music.impactTitle")}</h2>
            <div className="music-page__divider"></div>
            <p className="music-page__impact">
              {t("music.impactText")}
            </p>
            <div className="music-page__impact-images">
              <img
                src="/sami.webp"
                srcSet="/sami-sm.webp 480w, /sami.webp 900w"
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 44vw, 240px"
                alt={t("music.altOne")}
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
                alt={t("music.altTwo")}
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
                alt={t("music.altThree")}
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
                alt={t("music.altFour")}
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
                alt={t("music.altFive")}
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