import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./WhoWeAre.css";

/* "Who We Are" — restyled into the Our Impact two-column pattern:
   existing rotating image in the media column (left; the section after
   the Donations grid puts its image on the right, so the sides
   alternate), title + 3 paragraphs + "Read more" link on the right.
   Layout and typography come from the shared .auvd-story-* classes
   (src/components/ImpactSections.css, imported once via Home.css). */
function WhoWeAre() {
  const { t } = useTranslation();
  const images = ["/donation.jpg", "/drawing.jpg", "/emotional1.jpg"];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="auvd-story-section auvd-story-section--tint">
      <div className="auvd-story-container">
        <div className="auvd-story-body">

          <div className="auvd-story-gallery auvd-story-gallery--single">
            <img
              className="auvd-story-gallery-item auvd-story-gallery-item--1"
              src={images[activeImageIndex]}
              alt={t("home.whoWeAre.imageAlt")}
            />
          </div>

          <div className="auvd-story-text">
            <h2 className="auvd-story-title">{t("home.whoWeAre.title")}</h2>
            <p>{t("home.whoWeAre.p1")}</p>
            <p>{t("home.whoWeAre.p2")}</p>
            <p>{t("home.whoWeAre.p3")}</p>

            <Link to="/about" className="auvd-cta-link">
              {t("home.whoWeAre.readMore")}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default WhoWeAre;