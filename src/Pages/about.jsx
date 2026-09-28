import { useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { FaBullseye, FaEye, FaHandsHoldingCircle, FaPeopleGroup, FaSeedling } from "react-icons/fa6";
import { Link } from "react-router-dom";
import ImpactHero from "../components/ImpactHero";
import "../components/ImpactSections.css";
import "./about.css";

/* About page — every word, link and image is unchanged.
   The hero is the shared ImpactHero (the same design as Our Story, Work,
   Pricing, Events and Our Impact) carrying this page's own heading, paragraph,
   photo and Founded panel; the sections below follow the Our Impact band
   pattern already used by Visual Arts / VET / Our Impact: a small bold label
   (no rule under it), a Bebas Neue title, Source Sans 3 body copy and two
   columns wherever there is an image. */

/* Only image paths stay here. Alt text and the beneficiary list are translation
   keys resolved with t() on every render, so the whole page — including the
   rotating gallery captions a screen reader reads — follows the language. */
const beneficiaryImages = [
  { src: "/together1.jpg", altKey: "about.beneficiaries.images.one" },
  { src: "/class.jpg", altKey: "about.beneficiaries.images.two" },
  { src: "/dance77.jpg", altKey: "about.beneficiaries.images.three" },
  { src: "/Education1.jpg", altKey: "about.beneficiaries.images.four" },
  { src: "/education88.jpg", altKey: "about.beneficiaries.images.five" },
  { src: "/mental.jpg", altKey: "about.beneficiaries.images.six" },
];

/* The two photos this page's Mission slideshow already used, kept on the page
   side by side under the Mission / Vision cards. */
const missionImages = [
  { src: "/Upcoming project 1 (1).jpg", altKey: "about.beneficiaries.images.one" },
  { src: "/AUVD.education.jpg", altKey: "about.beneficiaries.images.two" },
];

const EducationAccess = () => {
  const { t } = useTranslation();
  const aboutStoryCopyRef = useRef(null);

  useEffect(() => {
    const sectionElement = aboutStoryCopyRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("about-text-reveal-entered");
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-page">
      {/* HERO — the shared full-bleed hero: photo behind the fixed nav at the
          very top of the page, dark gradient overlay, Anton heading, Roboto
          copy. This page has no hero button, so none is rendered. */}
      <div className="about-hero-bleed">
        <ImpactHero
          heading={t("about.hero.heading")}
          paragraph={t("about.hero.paragraph")}
          image="/together1.jpg"
          imageAlt={t("about.hero.imageAlt")}
          factCard={{
            label: t("about.hero.factLabel"),
            value: t("about.hero.factValue"),
            caption: t("about.hero.factCaption"),
              
          }}
        />
      </div>
      {/* MISSION & VISION — two short statements side by side as two clean
          cards: label above, statement below, equal widths, one per row on
          mobile. Not the two-column image layout. The two photos this section
          already used stay on the page, side by side under the cards. */}
      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <div className="about-mv-grid">
            <article className="about-mv-card about-mv-card--mission">
              <div className="about-mv-icon" aria-hidden="true">
                <FaBullseye />
              </div>
              <p className="auvd-story-label">{t("about.missionVision.missionLabel")}</p>
              <p className="about-mv-text">
                {t("about.missionVision.missionText")}
              </p>
            </article>

            <article className="about-mv-card">
              <div className="about-mv-icon" aria-hidden="true">
                <FaEye />
              </div>
              <p className="auvd-story-label">{t("about.missionVision.visionLabel")}</p>
              <p className="about-mv-text">
                {t("about.missionVision.visionText")}
              </p>
            </article>
          </div>

          <div className="about-mv-strip">
            {missionImages.map((image) => (
              <img
                key={image.src}
                className="about-mv-strip-item"
                src={image.src}
                alt={t(image.altKey)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE — this section has no photo, so the title takes the
          narrower left column and the two paragraphs the right one. */}
      <section className="auvd-story-section">
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("about.whoWeAre.label")}</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">
              {t("about.whoWeAre.title")}
            </h2>
            <div ref={aboutStoryCopyRef} className="auvd-story-text about-text-reveal">
              <p>{t("about.whoWeAre.p1")}</p>
              <p>{t("about.whoWeAre.p2")}</p>
              {/* The third paragraph contains a link to Samuel's profile, so it
                  uses <Trans>: the whole sentence is translated as one unit
                  while the link and its destination stay exactly as they were. */}
              <p>
                <Trans
                  i18nKey="about.whoWeAre.p3"
                  components={{
                    link: <Link to="/about/samuel-asongo" className="about-leadership-link" />,
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="auvd-story-section auvd-story-section--tint" aria-labelledby="about-leadership-heading">
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("about.leadership.label")}</p>
          <div className="auvd-story-body">
            <h2 id="about-leadership-heading" className="auvd-story-title auvd-story-title--lead">
              {t("about.leadership.title")}
            </h2>
            <div className="about-leadership-grid">
              <article className="about-leadership-card">
                <h3>Samuel Asongo</h3>
                <p>{t("about.leadership.samuelRole")}</p>
                <Link to="/about/samuel-asongo">{t("about.leadership.readProfile")}</Link>
              </article>
              <article className="about-leadership-card">
                <h3>Matayo Bilibwa</h3>
                <p>{t("about.leadership.matayoRole")}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* OUR GOAL — the same two-column pattern, again with no photo, so the
          title sits in the narrower left column. */}
      <section className="auvd-story-section auvd-story-section--tint auvd-story-section--orange">
        <div className="auvd-story-container">
          <div className="about-label-row">
            <div className="about-goal-icon" aria-hidden="true">
              <FaHandsHoldingCircle />
            </div>
            <p className="auvd-story-label">{t("about.goal.label")}</p>
          </div>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">
              {t("about.goal.title")}
            </h2>
            <div className="auvd-story-text">
              <p>{t("about.goal.p1")}</p>
              <p>{t("about.goal.p2")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TARGET BENEFICIARIES — this section has a photo (the page's existing
          six-image gallery), so it uses the two-column layout: gallery on the
          left, title, intro and beneficiary list in the text column. */}
      <section className="auvd-story-section">
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("about.beneficiaries.label")}</p>
          <div className="auvd-story-body">
            <div
              className="auvd-story-gallery auvd-story-gallery--single about-beneficiary-gallery"
              aria-label={t("about.beneficiaries.galleryLabel")}
            >
              {beneficiaryImages.map((image, index) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={t(image.altKey)}
                  className="about-beneficiary-slide"
                  style={{ animationDelay: `${index * 5}s` }}
                />
              ))}
            </div>

            <div className="auvd-story-text">
              <h2 className="auvd-story-title">{t("about.beneficiaries.title")}</h2>
              <p>{t("about.beneficiaries.intro")}</p>

              {/* The beneficiary list is stored as an array and read back with
                  t(key, { returnObjects: true }) on every render, so it
                  switches language immediately without a reload. */}
              <ul className="about-beneficiary-list">
                {t("about.beneficiaries.list", { returnObjects: true }).map((item, index) => (
                  <li key={item} className="about-beneficiary-item">
                    <span className="about-beneficiary-icon" aria-hidden="true">
                      {index % 2 === 0 ? <FaPeopleGroup /> : <FaSeedling />}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default EducationAccess;
