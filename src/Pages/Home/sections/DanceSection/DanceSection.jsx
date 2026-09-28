import { useTranslation } from "react-i18next";
import "./DanceSection.css";

/* "Dance" — restyled into the Core Belief contained-background pattern used
   on the Our Story page (.auvd-story-belief): the section height comes from
   its content (no viewport sizing), the existing photo sits behind the
   content as an absolute <img> with object-fit: cover, a dark overlay sits
   between image and content, the section name is the orange label and the
   paragraph is white (Core Belief's color treatment). The four short lines
   are now a small tag row instead of big headings — the fourth one
   ("Community dance") keeps its link to /dance. Wording is unchanged. */
function DanceSection({ navigate, descriptionKey }) {
  const { t } = useTranslation();

  return (
    <section className="dance-section">
      <img
        className="dance-section-image"
        src="/dance77.jpg"
        alt=""
        aria-hidden="true"
      />
      <div className="dance-overlay" aria-hidden="true"></div>

      <div className="dance-content">
        <div className="dance-text-wrapper">
          <h2 className="auvd-story-label dance-heading">{t("home.dance.title")}</h2>

          <p className="dance-description">
            {t(descriptionKey)}
          </p>

          <div className="dance-tags">
            <span className="dance-tag">{t("home.dance.tagOne")}</span>
            <span className="dance-tag">{t("home.dance.tagTwo")}</span>
            <span className="dance-tag">{t("home.dance.tagThree")}</span>
            <button
              className="dance-tag dance-tag--link"
              onClick={() => navigate("/dance")}
              type="button"
            >
              {t("home.dance.tagFour")}
            </button>
          </div>
        </div>

      </div>

      <div className="dance-scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </section>
  );
}

export default DanceSection;
