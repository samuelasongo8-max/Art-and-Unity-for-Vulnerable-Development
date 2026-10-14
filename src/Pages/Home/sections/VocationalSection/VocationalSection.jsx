import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./VocationalSection.css";

/* "Vocational Education Training (VET)" — the source project's Get Involved
   split banner: the clear photo on the left half (here: the existing
   fading image carousel, same order and 4.2s timing), the same photo as
   the section background washed to white on the right half, and the text
   panel with Bebas Neue heading, short blue line, body copy and a square
   button. Target content kept unchanged (title, paragraph, "Explore
   more" → /Work#livelihoods-women). Classes are p1-vet-* only. */
function VocationalSection({ navigate, vocationalImages }) {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImage((previous) =>
        previous === vocationalImages.length - 1 ? 0 : previous + 1
      );
    }, 4200);

    return () => window.clearInterval(interval);
  }, [vocationalImages.length]);

  return (
    <section
      className="p1-vet"
      style={{
        backgroundImage: `url("${vocationalImages[currentImage].src}")`,
      }}
    >
      <div className="p1-vet__photo">
        <img
          key={vocationalImages[currentImage].src}
          src={vocationalImages[currentImage].src}
          alt={t(vocationalImages[currentImage].altKey)}
          className="p1-vet__img vocational-image-fade"
        />
      </div>

      <div className="p1-vet__wash" aria-hidden="true" />

      <div className="p1-vet__panel">
        <div className="p1-vet__text">
          <h2 className="p1-vet__heading">{t("home.vocational.title")}</h2>
          <span className="p1-vet__divider" aria-hidden="true" />

          <p className="p1-vet__body">{t("home.vocational.paragraph")}</p>

          <button
            className="p1-vet__btn"
            onClick={() => navigate("/Work#livelihoods-women")}
            type="button"
          >
            {t("home.vocational.explore")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default VocationalSection;
