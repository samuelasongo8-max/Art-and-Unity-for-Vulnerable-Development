import { useTranslation } from "react-i18next";
import "./ImpactStatsSection.css";

/* "Our Impact" — the source project's Our Impact banner design: the photo
   with the hand-painted frame and brush strokes on the left, the title and
   text in the middle, and the 2x2 statistics grid on the right. The
   target's own content is kept: heading, paragraph, the four figures
   (with the Core Programs list and the info lines). The source's "See our
   impact" button is skipped — the target section has no button.
   The previous count-up animation and icons are part of the old design
   and were removed with it (the source banner is static). */
function ImpactStatsSection({ impactStats }) {
  const { t } = useTranslation();

  return (
    <section className="p1-impact">
      <div className="p1-impact-inner">
        <div className="p1-impact__photo" aria-hidden="true">
          <span className="p1-impact__stroke p1-impact__stroke--1" />
          <span className="p1-impact__stroke p1-impact__stroke--2" />
          <span className="p1-impact__stroke p1-impact__stroke--3" />
          <span className="p1-impact__stroke p1-impact__stroke--4" />
          <img
            className="p1-impact__img"
            src="/Upcoming%20project%20%20(2).jpg"
            alt={t("home.impactStats.alt")}
            loading="lazy"
          />
        </div>

        <div className="p1-impact__text">
          <h2>{t("home.impactStats.title")}</h2>
          <p>{t("home.impactStats.paragraph")}</p>
        </div>

        <dl className="p1-impact-stats">
          {impactStats.map((stat) => (
            <div key={stat.key} className="p1-impact-stat">
              <dt>
                {t(stat.titleKey)}
                {stat.infoKeys && stat.infoKeys.length > 0
                  ? stat.infoKeys.map((key) => (
                      <span className="p1-impact-stat__info" key={key}>
                        {t(key)}
                      </span>
                    ))
                  : null}
              </dt>
              <dd>
                {stat.value}
                {stat.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default ImpactStatsSection;
