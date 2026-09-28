import { useTranslation } from "react-i18next";
import { impacts } from "../OurImpact";
import ImpactGrid from "./ImpactGrid";

/* /our-impact/report — Report entries only.

   While the impacts array holds no entry with category "Report", this page shows
   a notice with a contact address instead of the card grid. As soon as Report
   entries are added to the array in OurImpact.jsx, the normal grid renders here
   again with no code changes needed. */

const REPORT_EMAIL = "artandunityforvulnerable.org@gmail.com";

const Report = () => {
  const { t } = useTranslation();
  const hasReportEntries = impacts.some((impact) => impact.category === "Report");

  /* The mailto subject is translated too, and URL-encoded so the accented
     French subject reaches the mail client intact. */
  const reportMailto = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(
    t("impact.report.mailSubject")
  )}`;

  if (hasReportEntries) {
    return <ImpactGrid category="Report" items={impacts} />;
  }

  return (
    <>
      <h2 className="auvd-impact-category">{t("impact.report.heading")}</h2>

      <div className="auvd-impact-notice" role="status">
        <h3 className="auvd-impact-notice-title">{t("impact.report.noticeTitle")}</h3>
        <p className="auvd-impact-notice-text">
          {t("impact.report.noticeTextBefore")}{" "}
          <a className="auvd-impact-notice-link" href={reportMailto}>
            {REPORT_EMAIL}
          </a>{" "}
          {t("impact.report.noticeTextAfter")}
        </p>
      </div>
    </>
  );
};

export default Report;
