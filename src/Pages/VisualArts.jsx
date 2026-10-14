import { Trans, useTranslation } from "react-i18next";
import "./VisualArts.css";

/* "Visual Arts" — a standalone page reached from the Hero "Visual Art" pill.
   Copy comes from the shared home.visualArts.* i18n keys (already bilingual,
   with inline emphasis), so it stays in sync with the rest of the site.
   The fixed navbar is cleared by the top padding in VisualArts.css, matching
   the other full pages. */
function VisualArts() {
  const { t } = useTranslation();

  return (
    <section className="va-page">
      <div className="va-page__inner">
        <div className="va-page__media">
          <img src="/drawing.jpg" alt={t("home.visualArts.alt")} />
        </div>

        <div className="va-page__body">
          <h1 className="va-page__title">{t("home.visualArts.title")}</h1>

          {/* These two paragraphs contain inline markup (bold / highlighted
              runs), so they use <Trans> — the whole sentence is translated as
              one unit while the original spans stay exactly where they were. */}
          <p>
            <Trans
              i18nKey="home.visualArts.p1"
              components={{
                strong: <span className="va-em" />,
                em: <span className="va-em" />,
              }}
            />
          </p>

          <p>
            <Trans
              i18nKey="home.visualArts.p2"
              components={{ highlight: <span className="va-highlight" /> }}
            />{" "}
          </p>
        </div>
      </div>
    </section>
  );
}

export default VisualArts;
