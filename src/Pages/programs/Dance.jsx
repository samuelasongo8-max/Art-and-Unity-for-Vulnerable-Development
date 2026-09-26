import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
  const danceDescriptionText =
    "Through Art for Healing Program, We uses dance and movement as a powerful form of non-verbal expression to support emotional healing, physical well-being, and social connection among refugees in Kakuma Refugee Camp.";
  const danceHeroContentRef = useRef(null);
  const academyContentRef = useRef(null);
  const [isDanceDescriptionVisible, setIsDanceDescriptionVisible] = useState(false);
  const [danceDescriptionTypedChars, setDanceDescriptionTypedChars] = useState(0);

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
  }, [danceDescriptionText.length, danceDescriptionTypedChars, isDanceDescriptionVisible]);

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
            <p className="dance-eyebrow">Art for Healing Program</p>

            <h1 className="dance-hero__title">Dance</h1>

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
                Community Dance
              </button>
            </div>

            <div className="dance-activities">
              <h2 className="dance-activities__title">Activities include:</h2>

              <ul className="dance-activities__list">
                <li>Traditional and contemporary dance</li>
                <li>Creative movement and expression</li>
                <li>Group choreography and performances</li>
                <li>Safer and more inclusive schools</li>
                <li>Cultural dance exchange and community showcases</li>
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
          <img src={speakers} alt="Chezacheza team" />
          <div className="dance-banner__overlay"></div>
        </div>

        <div className="dance-band dance-band--surface">
          <div
            ref={academyContentRef}
            className="dance-container dance-program dance-program--animated"
          >
            <h2 className="dance-title dance-title--highlight">
              Dance Training Program
            </h2>

            <div className="dance-copy">
              <p>
                Dance Training Program is a 3-month creative and empowerment initiative
                designed to support children and youth in Kakuma Refugee Camp through
                dance, artistic expression, and personal development.
              </p>

              <p>
                The program provides participants with a safe and inclusive environment
                where they can develop their talents, improve physical fitness, build
                confidence, and strengthen teamwork and social interaction skills. Through
                dance and movement, participants are encouraged to express themselves
                creatively while promoting emotional well-being and cultural exchange.
              </p>

              <p>
                The program runs for 3 months, giving participants consistent time to
                learn, practice, grow in confidence, and engage in performance activities
                throughout the training period.
              </p>

              <p>
                The Dance Training Program also creates opportunities for young people to
                showcase their talents through community performances, creative events, and
                cultural activities that promote unity and positive community engagement
                in Kakuma Refugee Camp.
              </p>
            </div>

            <div className="dance-divider"></div>

            <h3 className="dance-subtitle dance-subtitle--highlight">
              3-Month Dance Training Program
            </h3>

            <div className="dance-facts">
              <p>
                <strong>Program Duration:</strong> 3 Months
              </p>
              <p>
                <strong>Location:</strong> Kakuma Refugee Camp, Kenya
              </p>
            </div>

            <Link
              className="dance-btn dance-btn--primary dance-join"
              to="/contact#creative-arts-application"
            >
              Join the Program
            </Link>

            <p className="dance-closing">
              Join AUVD's Dance Program and become part of a creative space where talent,
              confidence, and opportunity grow together.
            </p>

            <section className="dance-video" aria-label="Dance program video">
              <video
                className="dance-video__player"
                controls
                preload="metadata"
                playsInline
              >
                <source src="/Dance.mp4" type="video/mp4" />
                Your browser does not support the video tag.
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
            <img src="/miodern dance.jpg" alt="Modern dance" />
            <figcaption className="dance-feature__overlay">
              <p>
                Dance is more than performance it is a pathway to confidence, creativity,
                unity, and opportunity for young people in Kakuma Refugee Camp
              </p>
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
};

export default Dance;