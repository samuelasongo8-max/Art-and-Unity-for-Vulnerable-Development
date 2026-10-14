import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./CommunityUpdates.css";
import { updates } from "../data/updates";

/* The data module is the single source of truth; it is re-exported here so
   the detail page can keep its existing import contract:
   `import { updates, renderBody } from "../components/CommunityUpdates"`. */
export { updates };

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* "Aug 11, 2026" style date for card and detail meta lines. */
export function formatPostDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/* Render one paragraph's inline text: plain string fragments plus
   `[label](url)` links — /path becomes a React Router <Link>, http(s)
   opens in a new tab. */
function renderInline(text) {
  const parts = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const label = match[1];
    const url = match[2];
    parts.push(
      /^https?:\/\//.test(url) ? (
        <a key={key++} href={url} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ) : (
        <Link key={key++} to={url}>
          {label}
        </Link>
      )
    );
    last = re.lastIndex;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts;
}

/* Turn the stored block array ({type:"p"|"ul"|"ol", text|items}) into real
   React elements, so paragraphs and both kinds of lists keep their
   structure on the detail page. */
export function renderBody(blocks) {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((block, i) => {
    if (block.type === "ul" || block.type === "ol") {
      const List = block.type;
      return (
        <List key={i}>
          {(block.items || []).map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </List>
      );
    }
    return <p key={i}>{renderInline(block.text || "")}</p>;
  });
}

/* "Photo coming soon" placeholder for any update with image: null — the
   same 16/9 box as real card images; `big` fills the detail media slot. */
function Placeholder({ label, big }) {
  return (
    <div
      className={`p1-updates-placeholder${big ? " p1-updates-placeholder--big" : ""}`}
      role="img"
      aria-label={label}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M4 8h3l2-2h6l2 2h3v11H4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      <p className="p1-updates-placeholder-text">Photo coming soon</p>
    </div>
  );
}

/* Community Updates & Stories — one component, two layouts:
   Home renders the horizontal carousel (progress bar + arrows);
   /updates passes variant="page" for the full grid. Classes are
   prefixed p1-updates-* so nothing collides elsewhere. */
export default function CommunityUpdates({ variant }) {
  const isPage = variant === "page";
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (el == null) return;
    const card = el.querySelector(".p1-updates-card");
    if (card == null) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (el == null) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  };

  const cards = updates.map((update) => {
    const meta = [update.date ? formatPostDate(update.date) : null, update.place]
      .filter(Boolean)
      .join(" · ");
    return (
      <article className="p1-updates-card" key={update.slug || update.title}>
        <Link to={update.to} className="p1-updates-img-link">
          {update.image ? (
            <img src={update.image} alt={update.alt} loading="lazy" />
          ) : (
            <Placeholder label={update.alt} />
          )}
        </Link>
        <h3>
          <Link to={update.to}>{update.title}</Link>
        </h3>
        {meta ? <p className="p1-updates-card-meta">{meta}</p> : null}
        <p className="p1-updates-card-preview">{update.preview}</p>
        <Link to={update.to} className="p1-updates-readmore">
          {update.readMore || "Read more"} <span aria-hidden="true">›</span>
        </Link>
      </article>
    );
  });

  return (
    <section className={isPage ? "p1-updates p1-updates--page" : "p1-updates"}>
      <div className="p1-updates-head">
        <h2>
          Community<em>Updates &amp; Stories:</em>
        </h2>
        {!isPage && (
          <Link to="/updates/" className="p1-updates-viewall">
            View All
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3 1l4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>

      {!isPage && (
        <div className="p1-updates-controls">
          <div className="p1-updates-progress">
            <span
              className="p1-updates-progress-thumb"
              style={{ left: `calc(${progress} * (100% - 14px))` }}
            />
          </div>
          <div className="p1-updates-arrows">
            <button
              type="button"
              className="p1-updates-arrow"
              aria-label="Previous updates"
              onClick={() => scrollByCard(-1)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M15 5l-7 7 7 7"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="p1-updates-arrow"
              aria-label="Next updates"
              onClick={() => scrollByCard(1)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M9 5l7 7-7 7"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {isPage ? (
        <div className="p1-updates-grid">{cards}</div>
      ) : (
        <div className="p1-updates-track" ref={trackRef} onScroll={handleScroll}>
          {cards}
        </div>
      )}
    </section>
  );
}
