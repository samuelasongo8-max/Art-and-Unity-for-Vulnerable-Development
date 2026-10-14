import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./PartnersSection.css";
import useRevealClass from "../../hooks/useRevealClass";

/* Partner logo files live in public/. Each card keeps the exact `className`
   the data defines; that class maps to its logo file here, so the partners,
   their order and their links are unchanged. Rendering uses a real <img> so
   the logo can use object-fit: contain and zoom on hover. File names that
   contain spaces are URI-encoded. */
const LOGO_SRC = {
  tsf: "/tsf.png",
  f2f: "/f2f.png",
  enrichment: "/enrichment.png",
  cammo: "/cammo.png",
  hungry: encodeURI("/hungry for music.png"),
  because: "/because.png",

};

/* How many partner cards are visible per "page" of the carousel. */
const PER_PAGE = 3;

function PartnersSection({ partnerCards }) {
  const { t } = useTranslation();
  const introRef = useRevealClass("partners-copy-entered", 0.3);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(partnerCards.length / PER_PAGE));
  const start = page * PER_PAGE;
  const visible = partnerCards.slice(start, start + PER_PAGE);

  const goPrev = () => setPage((current) => (current - 1 + totalPages) % totalPages);
  const goNext = () => setPage((current) => (current + 1) % totalPages);

  return (
    <section className="partners-section">
      <div className="container">
        <div ref={introRef} className="partners-copy partners-copy-animated">
          <h1 className="partners-heading">{t("home.partners.heading")}</h1>
          <p className="partners-subheading">{t("home.partners.subheading")}</p>
        </div>

        <div className="partners-grid">
          {visible.map((card) => {
            const src = LOGO_SRC[card.className];
            return (
              <a
                key={card.href}
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className={`partner-card ${card.className}`}
                aria-label={card.label}
              >
                <span className="partner-card__frame">
                  {src ? (
                    <img
                      className="partner-card__logo"
                      src={src}
                      alt={card.label}
                      loading="lazy"
                    />
                  ) : card.text ? (
                    <span>{card.text}</span>
                  ) : null}
                </span>
                <span className="partner-card__name">{card.label}</span>
              </a>
            );
          })}
        </div>

        <div className="partners-nav">
          <button
            type="button"
            className="partners-arrow"
            onClick={goPrev}
            aria-label={t("home.partners.prev")}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <span className="partners-counter">
            {page + 1} / {totalPages}
          </span>

          <button
            type="button"
            className="partners-arrow"
            onClick={goNext}
            aria-label={t("home.partners.next")}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
