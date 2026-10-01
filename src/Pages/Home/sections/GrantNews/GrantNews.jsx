import "./GrantNews.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../utils/i18nFormat";
const grantImage = "/AUVD, Music education grants.png";

/* ==========================================================================
   LatestUpdates — the automatic four-post strip below the grant.

   It fetches /api/posts/featured, which has already done all of the deciding:
   which posts are at least two weeks old, newest first, capped at four. This
   component only draws what it is given, so the selection cannot drift from what
   the server thinks and there is no second copy of the date rule to keep in
   sync.

   Nothing here is a "featured" flag or a stored id list. The admin publishes a
   post and this changes on its own once the post is two weeks old.
   ========================================================================== */
function LatestUpdates() {
  const { t, i18n } = useTranslation();

  /* "loading" -> "ready" or "error". The section stays hidden until there is at
     least one eligible post, so a brand-new site shows nothing here rather than
     an empty heading. */
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        /* Public, like the feed: no session and no credentials needed. */
        const response = await fetch("/api/posts/featured", { signal: controller.signal });
        const result = await response.json().catch(() => null);

        if (!response.ok || !result || result.ok !== true || !Array.isArray(result.posts)) {
          throw new Error(`HTTP ${response.status}`);
        }

        setPosts(result.posts);
        setStatus("ready");
      } catch (error) {
        /* The visitor navigating away mid-request is not a failure. */
        if (error?.name === "AbortError") return;
        console.error(`[latest-updates] could not load: ${error?.message ?? error}`);
        setStatus("error");
      }
    };

    load();
    return () => controller.abort();
  }, []);

  /* Nothing eligible yet, or the request failed: the whole strip is omitted
     rather than leaving an empty heading above the footer. */
  if (status !== "ready" || posts.length === 0) return null;

  return (
    <div className="grant-news__latest">
      <h2 className="grant-news__latest-title">{t("home.grantNews.latestTitle")}</h2>

      <ul className="grant-news__latest-grid">
        {posts.map((post) => (
          <li key={post.id} className="grant-news__latest-card">
            <img className="grant-news__latest-image" src={post.image} alt={post.imageAlt} loading="lazy" />

            <p className="grant-news__latest-date">{formatDate(post.date, i18n.language)}</p>

            <h3 className="grant-news__latest-caption">{post.caption}</h3>

            {/* The post's own paragraph, trimmed to a short excerpt rather than
                truncated mid-word by the browser. */}
            <p className="grant-news__latest-excerpt">
              {post.paragraph.length > 140 ? `${post.paragraph.slice(0, 140).trimEnd()}…` : post.paragraph}
            </p>

            {/* There is no per-post page: posts are read on the public feed at
                /our-impact/post, which is where this already-existing route
                takes the reader. Inventing a detail route here would mean new
                routing and a new page for content the feed already shows. */}
            <Link className="grant-news__latest-link" to="/our-impact/post">
              {t("home.grantNews.latestLink")} <span aria-hidden="true">›</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Community Music Grant — restyled into the Our Impact layout pattern:
   label row (date + location) at the top with no rule under it, then a
   two-column body: image left, text right. Typography comes from the
   shared pattern classes imported once via Home.css. */
function GrantNews() {
  const { t, i18n } = useTranslation();

  return (
    <section className="grant-news" aria-labelledby="grant-news-title">
      <div className="grant-news__inner">

        {/* Label row: date + location, small bold uppercase, no rule.
            The date is formatted with Intl for the active language, so
            "11 August 2026" becomes "11 août 2026" in French. */}
        <p className="grant-news__label">
          <span className="grant-news__date">
            {formatDate(t("home.grantNews.date"), i18n.language)}
          </span>
          <span className="grant-news__location">
            {t("home.grantNews.location")}
          </span>
        </p>

        <div className="grant-news__grid">

          {/* Left: image */}
          <div className="grant-news__media" aria-label={t("home.grantNews.imageLabel")}>
            <img
              className="grant-news__image"
              src={grantImage}
              alt={t("home.grantNews.imageAlt")}
            />
          </div>

          {/* Right: content */}
          <div className="grant-news__content">

            <h1 id="grant-news-title" className="grant-news__title">
              {t("home.grantNews.title")}
            </h1>

            <p className="grant-news__body">
              {t("home.grantNews.p1")}
            </p>

            <p className="grant-news__body">
              {t("home.grantNews.p2")}
            </p>

            <Link
              to="/news/daddario-community-music-grant"
              className="grant-news__link"
            >
              {t("home.grantNews.link")} <span aria-hidden="true">›</span>
            </Link>
          </div>

        </div>

        {/* The automatic four-post strip. Added at the BOTTOM of this section, with
            the existing grant content above it completely untouched. */}
        <LatestUpdates />
      </div>
    </section>
  );
}

export default GrantNews;