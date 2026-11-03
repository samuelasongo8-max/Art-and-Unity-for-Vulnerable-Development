import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { impacts } from "../OurImpact";
import ImpactGrid from "./ImpactGrid";
import { apiUrl, imageUrl } from "../../utils/api";
import { getDriveImageUrl } from "../../utils/driveImage";

const REPORT_EMAIL = "artandunityforvulnerable.org@gmail.com";

function getDownloadUrl(url) {
  if (!url) return "";

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(driveMatch[1])}`;
  }

  return url;
}

const Report = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadReports = async () => {
      try {
        const response = await fetch(apiUrl("/api/reports"), {
          signal: controller.signal,
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.ok || !Array.isArray(result.reports)) {
          throw new Error(result?.error || `Could not load reports (HTTP ${response.status}).`);
        }
        setReports(result.reports);
      } catch (error) {
        if (error?.name !== "AbortError") {
          setLoadError(error?.message || t("impact.report.loadError"));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadReports();
    return () => controller.abort();
  }, [t]);

  const reportMailto = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(
    t("impact.report.mailSubject")
  )}`;

  if (loading) {
    return (
      <>
        <h2 className="auvd-impact-category">{t("impact.report.heading")}</h2>
        <p className="auvd-impact-empty" role="status">{t("impact.report.loading")}</p>
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <h2 className="auvd-impact-category">{t("impact.report.heading")}</h2>
        <p className="auvd-impact-empty" role="alert">
          {loadError}
        </p>
      </>
    );
  }

  const reportItems = reports.map((report) => ({
    id: report.id,
    category: "Report",
    title: report.title,
    date: report.reportDate,
    showDate: true,
    image: imageUrl(getDriveImageUrl(report.imageUrl)),
    description: report.description,
    reportCategory: report.category,
    fileUrl: getDownloadUrl(report.fileUrl),
    fileName: report.fileName,
  }));
  const allReports = [...impacts.filter((impact) => impact.category === "Report"), ...reportItems];

  if (allReports.length > 0) {
    return <ImpactGrid category="Report" items={allReports} />;
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
