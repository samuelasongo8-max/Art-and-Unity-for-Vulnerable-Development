import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { updates as allUpdates, renderBody } from "../components/CommunityUpdates";
import "./UpdateDetail.css";

/* Per-update object-position so each photo's subject stays visible inside
   the 420px cover box. Faces sit high in the frame → "center 25%". */
const IMAGE_POSITIONS = {
  "2025-donation": "center center",
  "shoe-that-grows-kismayo-light-academy": "center 25%",
  "student-survey-update": "center 25%",
  "friday-music-community": "center 25%",
  "leader-is-growing-nafme": "center 25%",
};

/* "photo coming soon" placeholder reused from the section's markup (the icon
   and text match the card placeholder; the big variant fills the detail
   media slot). Uses the same p1-updates-* classes defined in the CSS. */
function Placeholder({ label }) {
  return (
    <div className="p1-updates-placeholder p1-updates-placeholder--big" role="img" aria-label={label}>
      <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 8h3l2-2h6l2 2h3v11H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      <p className="p1-updates-placeholder-text">Photo coming soon</p>
    </div>
  );
}

export default function UpdateDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const [update, setUpdate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const found = allUpdates.find((u) => u.slug === slug);
    if (found) {
      setUpdate(found);
      setError(null);
    } else {
      setUpdate(null);
      setError("Update not found");
    }
  }, [slug]);

  // Scroll to top when a new detail page opens (matches the source).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  if (error) {
    return (
      <div className="p1-update-detail-page">
        <div className="p1-update-detail__error">{error}</div>
        <Link to="/updates" className="p1-update-detail__back-link">
          ← Back to all updates
        </Link>
      </div>
    );
  }

  if (!update) return null;

  const meta = [update.date, update.place].filter(Boolean).join(" · ");

  return (
    <div className="p1-update-detail-page">
      <div className="p1-update-detail__breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link to="/updates">Updates</Link>
        <span aria-hidden="true">›</span>
        <span className="p1-update-detail__breadcrumb-title">{update.title}</span>
      </div>

      <figure className="p1-update-detail__media">
        {update.image ? (
          <img
            src={update.image}
            alt={update.alt}
            className="p1-update-detail__media-image"
            style={{ objectPosition: IMAGE_POSITIONS[slug] || "center center" }}
          />
        ) : (
          <Placeholder label={update.alt} />
        )}
      </figure>

      <div className="p1-update-detail">
        <h1 className="p1-update-detail__title">{update.title}</h1>

        {meta ? <div className="p1-update-detail__meta">{meta}</div> : null}

        <div className="p1-update-detail__body">{renderBody(update.body)}</div>

        <Link to="/updates" className="p1-update-detail__back-link">
          ← Back to all updates
        </Link>
      </div>
    </div>
  );
}
