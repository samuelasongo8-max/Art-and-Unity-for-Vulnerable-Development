import { Trans, useTranslation } from "react-i18next";
import "./VisualArts.css";
import useRevealClass from "../../hooks/useRevealClass";

/* "Visual Arts" — restyled into the Our Impact two-column pattern:
   the existing photo sits in the media column (right — the section keeps
   its original text-left / image-right arrangement via --flip), the heading
   is promoted to the pattern's Bebas Neue title (there is no separate label
   wording in this section), and the two paragraphs use the shared
   Source Sans 3 body styles (src/components/ImpactSections.css, imported
   once via Home.css). Wording is unchanged. */
function VisualArts() {
  const { t } = useTranslation();
  const sectionRef = useRevealClass("content-entered", 0.3);

  return (
    <section className="auvd-story-section auvd-story-section--tint visual-section">
      <div className="auvd-story-container">
        <div className="auvd-story-body auvd-story-body--flip">

          <div className="auvd-story-gallery auvd-story-gallery--single">
            <img
              className="auvd-story-gallery-item auvd-story-gallery-item--1"
              src="/drawing.jpg"
              alt={t("home.visualArts.alt")}
            />
          </div>

          <div ref={sectionRef} className="auvd-story-text visual-text-block content-animated">
            <h2 className="auvd-story-title">{t("home.visualArts.title")}</h2>

            {/* These two paragraphs contain inline markup (bold / highlighted
                runs), so they use <Trans> — the whole sentence is translated as
                one unit while the original spans stay exactly where they were. */}
            <p>
              <Trans
                i18nKey="home.visualArts.p1"
                components={{
                  strong: <span />,
                  em: <span />,
                }}
              />
            </p>

            <p>
              <Trans
                i18nKey="home.visualArts.p2"
                components={{
                  highlight: <span className="visual-highlight" />,
                }}
              />{" "}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default VisualArts;