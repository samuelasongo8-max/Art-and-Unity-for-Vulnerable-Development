import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ImpactHero from "../components/ImpactHero";
import "./about.css";
import "./our-impact/OurStory.css";

/* Milestone years are data; their labels are translation keys resolved with
   t() on every render so the strip follows the language. */
const storyStatKeys: ReadonlyArray<{ year: string; key: string }> = [
  { year: "2022", key: "ourStory.milestones.one" },
  { year: "2024", key: "ourStory.milestones.two" },
  { year: "2025", key: "ourStory.milestones.three" },
];

function OurStory() {
  const { t } = useTranslation();
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (prefersReducedMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="auvd-story-page about-page">
      {/* Full-bleed hero — markup and styles live in the shared ImpactHero
          component so Work and Pricing reuse the exact same design. */}
      <ImpactHero
        label={t("ourStory.hero.label")}
        heading={t("ourStory.hero.heading")}
        paragraph={t("ourStory.hero.paragraph")}
        buttonText={t("ourStory.hero.button")}
        buttonHref="#story-journey"
        image="/together1.jpg"
        imageAlt={t("ourStory.hero.imageAlt")}
        tagline={t("ourStory.hero.tagline")}
        factCard={{
          label: t("ourStory.hero.factLabel"),
          value: t("ourStory.hero.factValue"),
          caption: t("ourStory.hero.factCaption"),
        }}
        milestones={storyStatKeys.map((stat) => ({ year: stat.year, text: t(stat.key) }))}
      />

      <section className="auvd-story-origin" id="story-journey" aria-labelledby="story-origin-heading">
        <div className="auvd-story-origin-container">
          <div className="auvd-story-origin-collage auvd-story-origin-collage--single">
            <img
              className="auvd-story-origin-image-large"
              src="/Samuel%20Asongo%20image.png"
              alt={t("ourStory.origin.alt")}
            />
          </div>
          <div className="auvd-story-origin-text">
            <p className="auvd-story-origin-eyebrow">{t("ourStory.origin.eyebrow")}</p>
            <h2 id="story-origin-heading">{t("ourStory.origin.title")}</h2>
            <p>
              {t("ourStory.origin.p1")}
            </p>
            <p>
              {t("ourStory.origin.p2")}
            </p>
            <h3 className="auvd-story-origin-founder">{t("ourStory.origin.founder")}</h3>
            <p>
              {t("ourStory.origin.founderBio")}
            </p>
            <blockquote className="auvd-story-origin-quote">
              {t("ourStory.origin.quote")}
            </blockquote>
          </div>
        </div>
      </section>

      {/* Growth and Registration — no images: Bebas title left, copy right. */}
      <section className="auvd-story-section">
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("ourStory.growth.label")}</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">{t("ourStory.growth.title")}</h2>
            <div className="auvd-story-text">
              <p>
                {t("ourStory.growth.p1")}
              </p>
              <p>
                {t("ourStory.growth.p2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where We Are Today — second band (light tint). */}
      <section className="auvd-story-section auvd-story-section--tint auvd-story-section--orange">
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("ourStory.today.label")}</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">{t("ourStory.today.title")}</h2>
            <div className="auvd-story-text">
              <p>
                {t("ourStory.today.p1")}
              </p>
              <p>
                {t("ourStory.today.p2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Milestone — the section's one existing image sits in the
          left collage column; title and paragraphs on the right. */}
      <section className="auvd-story-section">
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("ourStory.partnership.label")}</p>
          <div className="auvd-story-body">
            <div className="auvd-story-gallery auvd-story-gallery--single">
              <img
                className="auvd-story-gallery-item auvd-story-gallery-item--1"
                src="/donation.jpg"
                alt={t("ourStory.partnership.alt")}
              />
            </div>
            <div className="auvd-story-text">
              <h2 className="auvd-story-title">{t("ourStory.partnership.title")}</h2>
              <p>
                {t("ourStory.partnership.p1")}
              </p>
              <p>
                {t("ourStory.partnership.p2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Looking Ahead — fourth band (light tint). */}
      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("ourStory.ahead.label")}</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">{t("ourStory.ahead.title")}</h2>
            <div className="auvd-story-text">
              <p>
                {t("ourStory.ahead.p1")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Belief — was the closing banner inside "Looking Ahead"; now its
          own section with the "Upcoming project (2).jpg" background image. */}
      <section className="auvd-story-belief">
        <img
          className="auvd-story-belief-image"
          src="/Upcoming%20project%20(2).jpg"
          alt=""
          aria-hidden="true"
        />
        <div className="auvd-story-belief-overlay" aria-hidden="true"></div>
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("ourStory.belief.label")}</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">{t("ourStory.belief.title")}</h2>
            <div className="auvd-story-text">
              <p>
                {t("ourStory.belief.p1")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default OurStory;