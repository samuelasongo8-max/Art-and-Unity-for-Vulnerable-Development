import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./DonateBanner.css";

/* ==========================================================================
   Donate banner — a full-width photo banner with a solid brand-blue overlay,
   centred white heading + paragraph, and two square uppercase buttons
   (a filled white "DONATE" and a white-outline "Partner with us"). It sits
   flush against the footer (no bottom gap), matching the source project's
   design, re-skinned with the Project 1 2026 palette and fonts.

   All visible text comes from the locale (donateBanner.*) so it stays
   bilingual. Links point only to routes that already exist in the target
   (/donate and /contact — the same destination the Get Involved "Partner"
   card uses, since there is no dedicated partner page here).
   ========================================================================== */

export default function DonateBanner() {
  const { t } = useTranslation();

  return (
    <section className="auvd-donate-banner">
      <div className="auvd-donate-banner__inner">
        <h2 className="auvd-donate-banner__title">{t("donateBanner.title")}</h2>
        <p className="auvd-donate-banner__text">{t("donateBanner.text")}</p>
        <p className="auvd-donate-banner__text">{t("donateBanner.text2")}</p>
        <div className="auvd-donate-banner__actions">
          <Link
            to="/donate"
            className="auvd-donate-banner__btn auvd-donate-banner__btn--donate"
          >
            {t("donateBanner.donate")}
          </Link>
          <Link
            to="/contact"
            className="auvd-donate-banner__btn auvd-donate-banner__btn--outline"
          >
            {t("donateBanner.partner")}
          </Link>
        </div>
      </div>
    </section>
  );
}
