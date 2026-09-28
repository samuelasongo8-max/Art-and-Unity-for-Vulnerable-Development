import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Dance.css";
import speakers from "../../assets/speakers.webp";

/* ==========================================================================
   Dance — restyled into the AUVD design system used by Our Story, Our Impact,
   Work and Pricing: the --impact-* palette (blue accent, navy headings,
   surface/band alternation), Bebas Neue section titles, Source Sans 3 body,
   1200px container, 4-8px radii, and blue/white buttons.

   Content, images, routes and behaviour are unchanged: same copy, the same
   speakers.webp + /miodern dance.jpg imagery, the same scroll-to-program and
   /contact#creative-arts-application destinations, the same typed description
   and reveal animations.

   The local Dance.mp4 clip (served from /Dance.mp4) replaces the former
   TikTok iframe, and the hero's "Learn More About the Programs" link to /Work
   has been removed.
   ========================================================================== */
const Dance = () => {
  const { t } = useTranslation();
  // The typing animation is driven by the TRANSLATED description, so it types
  // out the French text when the language changes.
  const danceDescriptionText = t("danceProgram.description");
  const danceHeroContentRef = useRef(null);
  const academyContentRef = useRef(null);
  const [isDanceDescriptionVisible, setIsDanceDescriptionVisible] = useState(false);
  const [danceDescriptionTypedChars, setDanceDescriptionTypedChars] = useState(0);

  // Start the typewriter over whenever the description changes language, so a
  // French sentence is typed from the first letter instead of resuming at
  // whatever character the English one happened to stop on.
  useEffect(() => {
    setDanceDescriptionTypedChars(0);
  }, [danceDescriptionText]);

  useEffect(() => {
    const sectionElement = danceHeroContentRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("dance-hero__content--entered");
        setIsDanceDescriptionVisible(true);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isDanceDescriptionVisible || danceDescriptionTypedChars >= danceDescriptionText.length) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setDanceDescriptionTypedChars((previous) => previous + 1);
    }, 18);

    return () => window.clearTimeout(timeoutId);
  /* Depend on the description ITSELF, not just its length: if the French and
     English strings happened to have the same length the effect would not
     re-run and the guard above would compare the new text against a stale
     counter. */
  }, [danceDescriptionText, danceDescriptionTypedChars, isDanceDescriptionVisible]);

  useEffect(() => {
    const sectionElement = academyContentRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("dance-program--entered");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="dance-page">
      {/* ------------------------------------------------------------------
          HERO - full-bleed photo with the left-weighted navy overlay and
          1200px container used across the AUVD pages.
         ------------------------------------------------------------------ */}
      <section
        className="dance-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(8, 20, 36, 0.92) 0%, rgba(8, 20, 36, 0.78) 34%, rgba(8, 20, 36, 0.34) 62%, rgba(8, 20, 36, 0) 84%), url(${speakers})`,
        }}
      >
        <div className="dance-hero__inner">
          <div
            ref={danceHeroContentRef}
            className="dance-hero__content dance-hero__content--animated"
          >
            <p className="dance-eyebrow">{t("danceProgram.eyebrow")}</p>

            <h1 className="dance-hero__title">{t("danceProgram.title")}</h1>

            <p className="dance-hero__text">
              {danceDescriptionText.slice(0, danceDescriptionTypedChars)}
            </p>

            <div className="dance-hero__actions">
              <button
                type="button"
                className="dance-btn dance-btn--primary"
                onClick={() =>
                  academyContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {t("danceProgram.button")}
              </button>
            </div>

            <div className="dance-activities">
              <h2 className="dance-activities__title">{t("danceProgram.activitiesTitle")}</h2>

              <ul className="dance-activities__list">
                <li>{t("danceProgram.activities.one")}</li>
                <li>{t("danceProgram.activities.two")}</li>
                <li>{t("danceProgram.activities.three")}</li>
                <li>{t("danceProgram.activities.four")}</li>
                <li>{t("danceProgram.activities.five")}</li>
              </ul>

              <div className="dance-zigzag">
                <svg
                  className="dance-zigzag__icon"
                  viewBox="0 0 100 40"
                  aria-hidden="true"
                  focusable="false"
                >
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
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          PROGRAM - image banner, then the tinted band carrying the existing
          Dance Training Program copy, details, join link and video.
         ------------------------------------------------------------------ */}
      <section className="dance-program-section">
        <div className="dance-banner">
          <img src={speakers} alt={t("danceProgram.bannerAlt")} />
          <div className="dance-banner__overlay"></div>
        </div>

        <div className="dance-band dance-band--surface">
          <div
            ref={academyContentRef}
            className="dance-container dance-program dance-program--animated"
          >
            <h2 className="dance-title dance-title--highlight">
              {t("danceProgram.programTitle")}
            </h2>

            <div className="dance-copy">
              <p>
                {t("danceProgram.programP1")}
              </p>

              <p>
                {t("danceProgram.programP2")}
              </p>

              <p>
                {t("danceProgram.programP3")}
              </p>

              <p>
                {t("danceProgram.programP4")}
              </p>
            </div>

            <div className="dance-divider"></div>

            <h3 className="dance-subtitle dance-subtitle--highlight">
              {t("danceProgram.subtitle")}
            </h3>

            <div className="dance-facts">
              <p>
                <strong>{t("danceProgram.durationLabel")}</strong> {t("danceProgram.durationValue")}
              </p>
              <p>
                <strong>{t("danceProgram.locationLabel")}</strong> {t("danceProgram.locationValue")}
              </p>
            </div>

            <Link
              className="dance-btn dance-btn--primary dance-join"
              to="/contact#creative-arts-application"
            >
              {t("danceProgram.join")}
            </Link>

            <p className="dance-closing">
              {t("danceProgram.closing")}
            </p>

            <section className="dance-video" aria-label={t("danceProgram.videoLabel")}>
              <video
                className="dance-video__player"
                controls
                preload="metadata"
                playsInline
              >
                <source src="/Dance.mp4" type="video/mp4" />
                {t("danceProgram.videoFallback")}
              </video>
            </section>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          FEATURE IMAGE - the existing modern-dance photo and its caption.
         ------------------------------------------------------------------ */}
      <section className="dance-band dance-band--white">
        <div className="dance-container">
          <figure className="dance-feature">
            <img src="/miodern dance.jpg" alt={t("danceProgram.featureAlt")} />
            <figcaption className="dance-feature__overlay">
              <p>
                {t("danceProgram.featureCaption")}
              </p>
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
};

export default Dance;