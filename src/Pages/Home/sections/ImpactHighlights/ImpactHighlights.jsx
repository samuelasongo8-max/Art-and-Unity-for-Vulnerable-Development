import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useRevealClass from "../../hooks/useRevealClass";
import "./ImpactHighlights.css";

/* ==========================================================================
   "Music That Reached Kakuma" — the Music Instrument Donations section,
   restyled to the clean, typographic "How we measure" look: a centred title,
   a generous intro, then the milestones as simple text entries divided by
   thin rules, and one clean text CTA. No icons, no cards, no busy decoration.
   All visible text comes from the locale (home.donations.*) so it stays
   bilingual; only facts already in the project are used.
   ========================================================================== */

const cards = [
  { key: "one", image: "/donation-2.jpg" },
  { key: "two", image: "/donation-5.jpg" },
  { key: "three", image: "/donation-4.jpg" },
];

function ImpactHighlights() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRevealClass("auvd-donations-section-entered", 0.25);

  return (
    <section
      ref={sectionRef}
      className="auvd-donations-section auvd-donations-section-animated"
    >
      <div className="auvd-donations-inner">
        <p className="auvd-donations-eyebrow">
          {t("home.donations.titleLine1")} {t("home.donations.titleLine2")}
        </p>
        <h2 className="auvd-donations-title">{t("home.donations.subheading")}</h2>
        <p className="auvd-donations-intro">{t("home.donations.intro")}</p>

        <div className="auvd-donations-grid">
          {cards.map((card) => (
            <article key={card.key} className="auvd-donations-card">
              <img
                className="auvd-donations-card-image"
                src={card.image}
                alt={t(`home.donations.items.${card.key}.title`)}
                loading="lazy"
              />
              <p className="auvd-donations-tag">{t(`home.donations.items.${card.key}.tag`)}</p>
              <h3 className="auvd-donations-card-title">{t(`home.donations.items.${card.key}.title`)}</h3>
              <p className="auvd-donations-card-text">{t(`home.donations.items.${card.key}.text`)}</p>
            </article>
          ))}
        </div>

        <div className="auvd-donations-cta">
          <button
            className="auvd-donations-viewall"
            type="button"
            onClick={() => navigate("/impact")}
          >
            {t("home.donations.viewAll")}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ImpactHighlights;
