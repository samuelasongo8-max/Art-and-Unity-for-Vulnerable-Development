import { useTranslation } from "react-i18next";
import { formatLongDate } from "../utils/i18nFormat";
import "./DaddarioCommunityMusicGrant.css";

const grantImage = "/Foundation_Logo_Lockup.png";
const grantDate = "2026-08-15";

function DaddarioCommunityMusicGrant() {
  const { t, i18n } = useTranslation();

  return (
    <>
    <article className="daddario-grant-article">
<div className="daddario-grant-article__container">
        <header className="daddario-grant-article__header">
<p className="daddario-grant-article__date">{formatLongDate(grantDate, i18n.language)}</p>
<p className="daddario-grant-article__location">{t("grant.location")}</p>
<h1 className="daddario-grant-article__title">
            {t("grant.title")}
    </h1>
        </header>

        <div className="daddario-grant-article__image-wrap">
    <img
            className="daddario-grant-article__image"
            src={grantImage}
            alt={t("grant.alt")}
    />
        </div>

        <div className="daddario-grant-article__content">
    <p>
            {t("grant.p1")}
        </p>

        <p>
            {t("grant.p2")}
    </p>
        </div>
    </div>
    </article>

    <section className="auvd-music-donation-right-section">
<div className="auvd-music-donation-right-container">

    {/* LEFT — CONTENT */}
    <div className="auvd-music-donation-right-content">

    <span className="auvd-music-donation-right-label">
    {t("grant.label")}
    </span>

    <h2>
        {t("grant.titleBefore")} <span>{t("grant.titleAfter")}</span>
    </h2>

    <div className="auvd-music-donation-right-line"></div>
          <p>
        $1,500
        {t("grant.amountOne")}

        {t("grant.amountOneConnector")}

        $500
        {t("grant.amountTwo")}

        <strong>{t("grant.totalOne")}</strong>
        <strong>{t("grant.totalTwo")}</strong>

      </p>

    <p className="auvd-music-donation-right-intro">
       {t("grant.quoteOne")}

{t("grant.quoteTwo")}


{t("grant.quoteThree")}


      </p>

    </div>

    {/* RIGHT — IMAGE */}
    <div className="auvd-music-donation-right-image">
      <img
        src="/Back20.jpg"
        alt={t("grant.imageAlt")}
      />
    </div>

  </div>
</section>
    </>
  );
}

export default DaddarioCommunityMusicGrant;
