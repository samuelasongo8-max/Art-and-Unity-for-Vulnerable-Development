import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useRevealClass from "../../hooks/useRevealClass";
import "./ImpactHighlights.css";

/* Only the image paths live here. The tag, title and text for each card are
   translation keys resolved with t() while rendering, so all four visible
   cards switch language immediately with no reload. */
const donations = [
  { key: "one", img: "donation-1.jpg" },
  { key: "two", img: "/donation-2.jpg" },
  { key: "three", img: "/donation-3.jpg" },
  { key: "four", img: "/donation-4.jpg" },
  { key: "five", img: "/donation-5.jpg" },
];

const PER_PAGE = 4;

function ImpactHighlights() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRevealClass("auvd-donations-section-entered", 0.25);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(donations.length / PER_PAGE);
  const start = page * PER_PAGE;
  const visible = donations.slice(start, start + PER_PAGE);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section
      ref={sectionRef}
      className="auvd-donations-section auvd-donations-section-animated"
    >
      <div className="auvd-donations-inner">
        <div className="auvd-donations-top">
          <div className="auvd-donations-heading">
            <h2>{t("home.donations.titleLine1")}</h2>{" "}
            <h3>{t("home.donations.titleLine2")}</h3>
            <h3 className="auvd-donations-subheading">{t("home.donations.subheading")}</h3>
            <p className="auvd-donations-intro">
              {t("home.donations.intro")}
            </p>
          </div>
                   <button
  className="auvd-donations-viewall"
  type="button"
  onClick={() => navigate("/impact")}
>
  {t("home.donations.viewAll")}
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <path
      d="M9 6l6 6-6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>
        
        </div>

        <div className="auvd-donations-controls">
          <div className="auvd-donations-progress">
            <div
              className="auvd-donations-progress-fill"
              style={{ width: `${((page + 1) / totalPages) * 100}%` }}
            />
          </div>
          <div className="auvd-donations-arrows">
            <button
              type="button"
              className="auvd-donations-arrow"
              onClick={goPrev}
              disabled={page === 0}
              aria-label={t("home.donations.prevLabel")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className={`auvd-donations-arrow${page < totalPages - 1 ? " is-active" : ""}`}
              onClick={goNext}
              disabled={page === totalPages - 1}
              aria-label={t("home.donations.nextLabel")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="auvd-donations-track" key={page}>
          {visible.map((item) => (
            <article
              key={item.key}
              className="auvd-donations-card"
            >
              <div className="auvd-donations-card-img">
                <img src={item.img} alt={t(`home.donations.items.${item.key}.title`)} loading="lazy" />
              </div>
              <span className="auvd-donations-tag">{t(`home.donations.items.${item.key}.tag`)}</span>
              <h4>{t(`home.donations.items.${item.key}.title`)}</h4>
              <p>{t(`home.donations.items.${item.key}.text`)}</p>
            </article>
            
          ))}
        </div>

      </div>
    </section>
  );
}

export default ImpactHighlights;
