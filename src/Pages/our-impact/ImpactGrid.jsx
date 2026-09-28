import {
  FaCalendarDays,
  FaChartColumn,
  FaFileLines,
  FaNewspaper,
} from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { formatDate, useWeeksAgo } from "../../utils/i18nFormat";
import "../OurImpact.css";

/* ==========================================================================
   Shared impact grid — used by the All, News and Report sub pages.

   The `category` prop decides both the small heading above the grid and which
   entries are rendered:
     - "All"    -> every entry in the array (News + Report)
     - "News"   -> News entries only
     - "Report" -> Report entries only

   Blogs are rendered by Blogs.jsx on /our-impact/blogs and are deliberately
   NOT part of the impacts array, so they never show up in this grid.
   ========================================================================== */

/* Icon + singular type used on each card for a given category. The visible
   type name is a translation key, so it follows the language. */
const impactCategories = {
  News: { typeKey: "impact.grid.categoryNews", Icon: FaNewspaper },
  Report: { typeKey: "impact.grid.categoryReport", Icon: FaChartColumn },
};

// TODO: Update these category definitions if AUVD adds new impact categories.
const findCategory = (key) => impactCategories[key] || { typeKey: null, Icon: FaFileLines };

const filterByCategory = (items, category) =>
  category === "All" ? items : items.filter((item) => item.category === category);

const ImpactGrid = ({ category, items }) => {
  const { t, i18n } = useTranslation();
  const weeksAgo = useWeeksAgo();
  const visibleImpacts = filterByCategory(items, category);

  return (
    <>
      <h2 className="auvd-impact-category">
        {category === "All" ? t("impact.grid.categoryAll") : t(`impact.grid.category${category}`)}
      </h2>

      {visibleImpacts.length === 0 ? (
        <p className="auvd-impact-empty">{t("impact.grid.empty")}</p>
      ) : (
        <div className="auvd-impact-grid">
          {visibleImpacts.map((entry) => {
            const {
              id,
              titleKey,
              buttonLink,
              category: itemCategory,
              metaDateKey,
              metaRead,
              date,
              excerptKey,
              tagKey,
              image,
              altKey,
              imageFit,
            } = entry;
            const meta = findCategory(itemCategory);
            const TypeIcon = meta.Icon;
            const title = titleKey ? t(titleKey) : "";

            /* The meta row is rebuilt from parts so each one can be localized:
               the date with Intl (13 August 2026 -> 13 août 2026), the read
               time with a plural key (4 min read -> 4 min de lecture) and the
               weeks-ago label with a plural key (5 weeks ago -> il y a 5
               semaines). */
            const metaParts = [];
            if (metaDateKey) {
              // The first card carries a full ISO date rather than a month.
              metaParts.push(metaDateKey === "impact.items.one.date"
                ? formatDate(date, i18n.language)
                : t(metaDateKey));
            }
            if (metaRead) {
              metaParts.push(t("impact.grid.minRead", { count: metaRead }));
            }
            const weeks = weeksAgo(date);
            if (weeks) {
              metaParts.push(weeks);
            }
            const metaText = metaParts.join(" · ");

            /* Card 1 keeps its logo uncropped; everything else defaults to "cover". */
            const imageClass = `auvd-impact-card-image${
              imageFit === "contain" ? " auvd-impact-card-image--contain" : ""
            }`;

            // TODO: Wrap this card in a <Link> once detail pages exist.
            // Entries with buttonLink show a "Learn more" button instead of
            // the title; the rest of the card (including the image alt, which
            // falls back to the title) is unchanged. Only the button is
            // clickable — never the whole card.
            const imageAlt = altKey ? t(altKey) : title;
            return (
              <article key={id} className="auvd-impact-card">
                {image ? (
                  <img className={imageClass} src={image} alt={imageAlt} />
                ) : (
                  <div
                    className={`${imageClass} auvd-impact-card-image--empty`}
                    aria-hidden="true"
                  />
                )}

                <div className="auvd-impact-card-body">
                  <p className="auvd-impact-card-meta">
                    {metaText && (
                      <span className="auvd-impact-card-meta-item">
                        <FaCalendarDays
                          className="auvd-impact-card-meta-icon"
                          aria-hidden="true"
                        />
                        {metaText}
                      </span>
                    )}
                    <span className="auvd-impact-card-meta-item">
                      <TypeIcon className="auvd-impact-card-meta-icon" aria-hidden="true" />
                      {meta.typeKey ? t(meta.typeKey) : itemCategory}
                    </span>
                  </p>

                  {tagKey && <span className="auvd-impact-card-tag">{t(tagKey)}</span>}

                  {buttonLink ? (
                    <Link
                      className="auvd-impact-card-button"
                      to={buttonLink}
                      aria-label={t("impact.grid.learnMoreLabel")}
                    >
                      {t("impact.grid.learnMore")}
                    </Link>
                  ) : (
                    <h3 className="auvd-impact-card-title">{title}</h3>
                  )}

                  {excerptKey && <p className="auvd-impact-card-excerpt">{t(excerptKey)}</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ImpactGrid;
