import "./GrantNews.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../utils/i18nFormat";
const grantImage = "/AUVD, Music education grants.png";

/* Community Music Grant — restyled into the Our Impact layout pattern:
   label row (date + location) at the top with no rule under it, then a
   two-column body: image left, text right. Typography comes from the
   shared pattern classes imported once via Home.css. */
function GrantNews() {
  const { t, i18n } = useTranslation();

  return (
    <section className="grant-news" aria-labelledby="grant-news-title">
      <div className="grant-news__inner">

        {/* Label row: date + location, small bold uppercase, no rule.
            The date is formatted with Intl for the active language, so
            "11 August 2026" becomes "11 août 2026" in French. */}
        <p className="grant-news__label">
          <span className="grant-news__date">
            {formatDate(t("home.grantNews.date"), i18n.language)}
          </span>
          <span className="grant-news__location">
            {t("home.grantNews.location")}
          </span>
        </p>

        <div className="grant-news__grid">

          {/* Left: image */}
          <div className="grant-news__media" aria-label={t("home.grantNews.imageLabel")}>
            <img
              className="grant-news__image"
              src={grantImage}
              alt={t("home.grantNews.imageAlt")}
            />
          </div>

          {/* Right: content */}
          <div className="grant-news__content">

            <h1 id="grant-news-title" className="grant-news__title">
              {t("home.grantNews.title")}
            </h1>

            <p className="grant-news__body">
              {t("home.grantNews.p1")}
            </p>

            <p className="grant-news__body">
              {t("home.grantNews.p2")}
            </p>

            <Link
              to="/news/daddario-community-music-grant"
              className="grant-news__link"
            >
              {t("home.grantNews.link")} <span aria-hidden="true">›</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default GrantNews;