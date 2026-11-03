import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiUrl } from "../utils/api";
import SafeImage from "../components/SafeImage";
import { toCommunityUpdate, updates as allUpdates, renderBody } from "../components/communityUpdatesContent";
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
  const { t } = useTranslation();
  const staticUpdate = allUpdates.find((item) => item.slug === slug);
  const [databaseUpdate, setDatabaseUpdate] = useState(null);
  const [loadedSlug, setLoadedSlug] = useState(null);
  const [detailStatus, setDetailStatus] = useState("loading");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;

    if (staticUpdate) {
      setDatabaseUpdate(null);
      setLoadedSlug(slug);
      setDetailStatus("ready");
      return () => {
        cancelled = true;
      };
    }

    const loadUpdate = async () => {
      setDetailStatus("loading");
      setDatabaseUpdate(null);
      try {
        const response = await fetch(
          apiUrl(`/api/updates/${encodeURIComponent(slug || "")}`),
          { cache: "no-store" }
        );
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.ok || !result.update) {
          throw new Error(result?.error || `Could not load this update (HTTP ${response.status}).`);
        }

        if (!cancelled) {
          setDatabaseUpdate(toCommunityUpdate(result.update));
          setLoadedSlug(slug);
          setDetailStatus("ready");
        }
      } catch (error) {
        if (!cancelled) {
          console.error(`[updates] could not load "${slug}": ${error?.message ?? error}`);
          setLoadedSlug(slug);
          setDetailStatus("error");
        }
      }
    };

    loadUpdate();
    return () => {
      cancelled = true;
    };
  }, [slug, staticUpdate]);

  const update = staticUpdate || (loadedSlug === slug ? databaseUpdate : null);

  if (!update && (detailStatus === "loading" || loadedSlug !== slug)) {
    return (
      <div className="p1-update-detail-page">
        <p role="status">Loading update...</p>
      </div>
    );
  }

  if (!update) {
    return (
      <div className="p1-update-detail-page">
        <div className="p1-update-detail__error">
          {detailStatus === "error" ? "Update not found or unavailable." : t("notFound.heading")}
        </div>
        <Link to="/updates" className="p1-update-detail__back-link">
          ← Back to all updates
        </Link>
      </div>
    );
  }

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
          <SafeImage
            src={update.image}
            alt={update.alt}
            className="p1-update-detail__media-image"
            style={{ objectPosition: IMAGE_POSITIONS[slug] || "center center" }}
            fallbackLabel={t("common.imageUnavailable")}
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
