import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./NeedSection.css";

/* "The Need" — restyled into the Our Impact two-column pattern:
   existing cycling background image in the media column (right, via the
   --flip modifier, alternating from the "Who We Are" section above),
   title + 3 paragraphs + "Join us" link on the left. The old inline
   <style> block (and its underline / rule decorations) is gone; shared
   layout and typography come from the .auvd-story-* classes imported
   once via Home.css. */
function PoolPromoBanner({ backgrounds = ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1400&auto=format&fit=crop'] }) {
  const { t } = useTranslation();
  const [currentBackground, setCurrentBackground] = useState(0);

  useEffect(() => {
    if (backgrounds.length <= 1) return;
    const interval = window.setInterval(() => {
      setCurrentBackground((previous) =>
        previous === backgrounds.length - 1 ? 0 : previous + 1
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <section className="auvd-story-section">
      <div className="auvd-story-container">
        <div className="auvd-story-body auvd-story-body--flip">

          <div className="auvd-story-media">
            <div
              className="promo-image-wrapper"
              role="img"
              aria-label={t("home.need.imageLabel")}
              style={{
                backgroundImage: `url(${backgrounds[currentBackground]})`,
              }}
            ></div>
          </div>

          <div className="auvd-story-text">
            <h2 className="auvd-story-title">{t("home.need.title")}</h2>

            <p>{t("home.need.p1")}</p>

            <p>{t("home.need.p2")}</p>

            <p>{t("home.need.p3")}</p>

            <a href="/donate" className="auvd-cta-link">
              {t("home.need.joinUs")}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default PoolPromoBanner;