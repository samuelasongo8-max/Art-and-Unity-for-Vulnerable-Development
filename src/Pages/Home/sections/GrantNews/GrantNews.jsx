import { apiUrl, imageUrl } from "../../../../utils/api";
import "./GrantNews.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../utils/i18nFormat";
const grantImage = "/AUVD, Music education grants.png";

/* ==========================================================================
   THE 7-DAY ROTATION
   ==========================================================================
   Only posts the admin created through the Admin Dashboard take part: they come
   straight from GET /api/posts, the same call the public feed makes, so nothing
   is hard-coded and there is no second post system.

   The rule has two halves, and both matter:

     1. ELIGIBILITY — a post joins the rotation once it is at least
        ROTATION_DAYS old. A brand-new post is never shown.
     2. THE ROTATION — eligible posts are read oldest to newest and dealt out
        into consecutive groups of GROUP_SIZE. Which group is on screen is
        decided by the CURRENT DATE, so the page walks forward on its own every
        ROTATION_DAYS.

   Taking the newest four would freeze the same four posts forever, which is why
   the group is indexed by the date rather than sliced off the front.

   All arithmetic is in UTC at midnight, so a post's age does not wobble with the
   visitor's timezone and two visitors always see the same four posts.
   ========================================================================== */

/** How old a post must be before it may appear. */
const ROTATION_DAYS = 7;

/** How many posts are on screen at once. */
const GROUP_SIZE = 4;

const MS_PER_DAY = 86_400_000;

/** "YYYY-MM-DD" -> UTC midnight, or NaN when the value is not a usable date. */
function parseDay(value) {
  const raw = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return Number.NaN;
  const ms = Date.parse(`${raw}T00:00:00Z`);
  return Number.isNaN(ms) ? Number.NaN : ms;
}

/** Today, as UTC midnight. */
function todayUtc(now) {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

/**
 * Chooses the posts on screen right now.
 *
 * @param {Array<{id?:string,date?:string}>} posts every post from GET /api/posts
 * @param {Date} now the current time
 * @returns {Array} at most GROUP_SIZE posts for the current rotation window
 */
export function selectRotationPosts(posts, now = new Date()) {
  const today = todayUtc(now);

  /* Chronological, oldest first, so the groups run forwards in time. `id` breaks
     a tie between posts sharing a date, which keeps the order identical on
     every request and for every visitor — without it, two posts on one day
     could swap places between loads. */
  const ordered = [...(Array.isArray(posts) ? posts : [])]
    .filter((post) => Number.isFinite(parseDay(post?.date)))
    .sort((a, b) => {
      const diff = parseDay(a.date) - parseDay(b.date);
      return diff !== 0 ? diff : String(a.id ?? "").localeCompare(String(b.id ?? ""));
    });

  /* Half 1: nothing younger than the limit can appear. */
  const eligible = ordered.filter(
    (post) => (today - parseDay(post.date)) / MS_PER_DAY >= ROTATION_DAYS
  );
  if (eligible.length === 0) return [];

  /* Half 2: which group is due. The oldest eligible post anchors the schedule, so
     window 0 covers its first week, window 1 the next week, and so on. The
     window index WRAPS with modulo, so the sequence cycles through every group
     and comes back round: with 20 posts it shows 1-4, then 5-8, then 9-12, then
     13-16, then 17-20, then starts again. Wrapping is what keeps the strip
     populated forever — without it a visitor arriving after the last group
     would see nothing at all. */
  const anchor = parseDay(eligible[0].date);
  const elapsedDays = Math.floor((today - anchor) / MS_PER_DAY);
  const groupCount = Math.ceil(eligible.length / GROUP_SIZE);
  const windowIndex = Math.floor(elapsedDays / ROTATION_DAYS) % groupCount;

  const start = windowIndex * GROUP_SIZE;
  return eligible.slice(start, start + GROUP_SIZE);
}

/* ==========================================================================
   LatestUpdates — the automatic four-post strip below the grant.

   It fetches /api/posts, which is the very same data the Admin Dashboard writes
   to MongoDB, and then decides which four belong in the current 7-day window.
   Nothing here is a "featured" flag or a stored id list: the admin publishes a
   post and it takes part on its own once it is old enough.
   ========================================================================== */
function LatestUpdates() {
  const { t, i18n } = useTranslation();

  /* "loading" -> "ready" or "error". The section stays hidden until there is at
     least one eligible post, so a brand-new site shows nothing here rather than
     an empty heading. */
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");

  /* Bumped at each 7-day boundary so the rotation recomputes and picks up
     anything the admin published while the page was open. */
  const [rotationTick, setRotationTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        /* Public, like the feed: no session and no credentials needed.

           This is the SAME endpoint the public posts feed uses, so the posts
           shown here are exactly the ones the admin created, edited and deleted
           through the Admin Dashboard. Nothing is hard-coded and there is no
           second source of posts. */
        const response = await fetch(apiUrl("/api/posts"), { signal: controller.signal });
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
  }, [rotationTick]);

  /* Re-schedule at the next 7-day boundary, not on a per-second timer. Both the
     eligibility rule and the rotation change at midnight UTC, so waking once at
     the next midnight is enough — and it re-runs the fetch, so a post published
     in the meantime is picked up. */
  useEffect(() => {
    const now = new Date();
    const nextMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    const timer = setTimeout(() => setRotationTick((n) => n + 1), Math.max(1000, nextMidnight - Date.now()));
    return () => clearTimeout(timer);
  }, [rotationTick]);

  /* Which four posts belong in the rotation right now. */
  const rotatingPosts = useMemo(() => selectRotationPosts(posts, new Date()), [posts, rotationTick]);

  /* Nothing eligible yet, or the request failed: the whole strip is omitted
     rather than leaving an empty heading above the footer. */
  if (status !== "ready" || rotatingPosts.length === 0) return null;

  return (
    <div className="grant-news__latest">
      <h2 className="grant-news__latest-title">{t("home.grantNews.latestTitle")}</h2>

      <ul className="grant-news__latest-grid">
        {rotatingPosts.map((post) => (
          <li key={post.id} className="grant-news__latest-card">
            <img className="grant-news__latest-image" src={imageUrl(post.image)} alt={post.imageAlt} loading="lazy" />

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