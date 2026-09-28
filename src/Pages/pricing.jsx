import React from "react";
import { useTranslation } from "react-i18next";
import ImpactHero from "../components/ImpactHero";
import "../components/ImpactSections.css";
import "./pricing.css";

/* Only image paths stay here; every visible string is a translation key
   resolved with t() while rendering, so the page follows the language. The
   two long bullet lists are read back with t(key, { returnObjects: true }). */
const educationFocusAreas = [
  { key: "one", image: "/Education2.jpg" },
  { key: "two", image: "/girls education.webp" },
  { key: "three", image: "/boyss.png" },
  { key: "four", image: "/education88.jpg" },
  { key: "five", image: "/green.jpg" },
  { key: "six", image: "/parent.png" },
];

const Pricing = () => {
  const { t } = useTranslation();

  return (
    <div className="pricing-container">
      {/* Full-bleed hero — the shared ImpactHero component (same design as
          Our Story), with this page's own label, heading, paragraph and
          photo. /Education2.jpg still appears in the grid below. */}
      <div className="pricing-hero-bleed">
        <ImpactHero
          label={t("pricing.hero.label")}
          heading={t("pricing.hero.heading")}
          paragraph={t("pricing.hero.paragraph")}
          image="/Education1.jpg"
          imageAlt={t("pricing.hero.imageAlt")}
        />
      </div>

      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("pricing.focusAreas.label")}</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">
              {t("pricing.focusAreas.title")}
            </h2>
            <div className="auvd-story-text">
              <p>{t("pricing.focusAreas.intro")}</p>
            </div>
          </div>

          <div className="auvd-pricing-grid">
            {educationFocusAreas.map((item) => (
              <article className="auvd-pricing-card" key={item.key}>
                <div className="auvd-pricing-card-media">
                  <img
                    src={item.image}
                    alt={t(`pricing.focusAreas.items.${item.key}.title`)}
                  />
                </div>
                <div className="auvd-pricing-card-content">
                  <h3>{t(`pricing.focusAreas.items.${item.key}.title`)}</h3>
                  <p>{t(`pricing.focusAreas.items.${item.key}.description`)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="auvd-story-section auvd-story-section--orange">
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("pricing.approach.label")}</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">
              {t("pricing.approach.title")}
            </h2>
            <div className="auvd-story-text">
              <p>{t("pricing.approach.intro")}</p>
              <ul className="auvd-pricing-list">
                {t("pricing.approach.items", { returnObjects: true }).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
 
      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("pricing.impact.label")}</p>
          <div className="auvd-story-body">
            <div className="auvd-story-gallery auvd-story-gallery--single">
              <img
                className="auvd-story-gallery-item auvd-story-gallery-item--1"
                src="/education.jpg"
                alt={t("pricing.impact.imageAlt")}
              />
            </div>
            <div className="auvd-story-text">
              <h2 className="auvd-story-title">{t("pricing.impact.title")}</h2>
              <ul className="auvd-pricing-list">
                {t("pricing.impact.items", { returnObjects: true }).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
