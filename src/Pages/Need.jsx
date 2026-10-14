import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Need.css";

/* "The Need" — a standalone page reached from the Hero "The Need" pill.
   Copy comes from the shared home.need.* i18n keys (already bilingual), so
   it stays in sync with the rest of the site. The fixed navbar is cleared by
   the top padding in Need.css, matching the other full pages. */
function Need() {
  const { t } = useTranslation();

  return (
    <section className="need-page">
      <div className="need-page__inner">
        <header className="need-page__header">
          <h1 className="need-page__title">{t("home.need.title")}</h1>
        </header>

        <div className="need-page__body">
          <p>{t("home.need.p1")}</p>
          <p>{t("home.need.p2")}</p>
          <p>{t("home.need.p3")}</p>

          <Link to="/donate" className="need-page__cta">
            {t("home.need.joinUs")} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Need;
