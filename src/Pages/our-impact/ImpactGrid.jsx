import {
  FaCalendarDays,
  FaChartColumn,
  FaFileLines,
  FaNewspaper,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
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

/* Icon + singular type used on each card for a given category. */
const impactCategories = {
  News: { type: "News", Icon: FaNewspaper },
  Report: { type: "Report", Icon: FaChartColumn },
};

// TODO: Update these category definitions if AUVD adds new impact categories.
const findCategory = (key) => impactCategories[key] || { type: key, Icon: FaFileLines };

/* ==========================================================================
   Weeks-ago helper — every card counts in whole weeks and is recomputed from
   today's date on each render, so the text moves up on its own every week
   ("This week", "1 week ago", "5 weeks ago"). Never months or years.
   ========================================================================== */
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const formatWeeksAgo = (isoDate) => {
  if (!isoDate) {
    return "";
  }

  const timestamp = new Date(isoDate).getTime();

  if (Number.isNaN(timestamp)) {
    return "";
  }

  const weeks = Math.floor((Date.now() - timestamp) / WEEK_IN_MS);

  if (weeks < 1) {
    return "This week";
  }

  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
};

const filterByCategory = (items, category) =>
  category === "All" ? items : items.filter((item) => item.category === category);

const ImpactGrid = ({ category, items }) => {
  const visibleImpacts = filterByCategory(items, category);

  return (
    <>
      <h2 className="auvd-impact-category">{category}</h2>

      {visibleImpacts.length === 0 ? (
        <p className="auvd-impact-empty">Nothing here yet.</p>
      ) : (
        <div className="auvd-impact-grid">
          {visibleImpacts.map((entry) => {
            const {
              id,
              title,
              buttonLink,
              category: itemCategory,
              metaLabel,
              date,
              excerpt,
              tag,
              image,
              alt,
              imageFit,
            } = entry;
            const meta = findCategory(itemCategory);
            const TypeIcon = meta.Icon;
            const weeksAgo = formatWeeksAgo(date);
            /* Card 1 keeps its logo uncropped; everything else defaults to "cover". */
            const imageClass = `auvd-impact-card-image${
              imageFit === "contain" ? " auvd-impact-card-image--contain" : ""
            }`;
            const metaText = [metaLabel, weeksAgo].filter(Boolean).join(" · ");

            // TODO: Wrap this card in a <Link> once detail pages exist.
            // Entries with buttonLink show a "Learn more" button instead of
            // the title; the rest of the card (including the image alt, which
            // falls back to the title) is unchanged. Only the button is
            // clickable — never the whole card.
            const imageAlt = alt || title;
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
                      {meta.type}
                    </span>
                  </p>

                  {tag && <span className="auvd-impact-card-tag">{tag}</span>}

                  {buttonLink ? (
                    <Link
                      className="auvd-impact-card-button"
                      to={buttonLink}
                      aria-label="Learn more about the community music grant"
                    >
                      Learn more
                    </Link>
                  ) : (
                    <h3 className="auvd-impact-card-title">{title}</h3>
                  )}

                  {excerpt && <p className="auvd-impact-card-excerpt">{excerpt}</p>}
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
