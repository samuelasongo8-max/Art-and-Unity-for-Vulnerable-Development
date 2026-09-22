import { impacts } from "../OurImpact";
import ImpactGrid from "./ImpactGrid";

/* /our-impact/report — Report entries only.

   While the impacts array holds no entry with category "Report", this page shows
   a notice with a contact address instead of the card grid. As soon as Report
   entries are added to the array in OurImpact.jsx, the normal grid renders here
   again with no code changes needed. */

const REPORT_EMAIL = "artandunityforvulnerable.org@gmail.com";
const REPORT_MAILTO = `mailto:${REPORT_EMAIL}?subject=Report%20request`;

const Report = () => {
  const hasReportEntries = impacts.some((impact) => impact.category === "Report");

  if (hasReportEntries) {
    return <ImpactGrid category="Report" items={impacts} />;
  }

  return (
    <>
      <h2 className="auvd-impact-category">Report</h2>

      <div className="auvd-impact-notice" role="status">
        <h3 className="auvd-impact-notice-title">Our report is under preparation</h3>
        <p className="auvd-impact-notice-text">
          We have the report, but it has not yet been published on our website because we
          are updating the site. Our team is working to add it to this page. If you would
          like it in the meantime, please contact us by email at{" "}
          <a className="auvd-impact-notice-link" href={REPORT_MAILTO}>
            {REPORT_EMAIL}
          </a>{" "}
          and our team will send it to you for your review.
        </p>
      </div>
    </>
  );
};

export default Report;
