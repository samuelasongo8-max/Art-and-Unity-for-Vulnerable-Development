import { apiUrl, imageUrl } from "../../utils/api";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHeart, FaPaperPlane } from "react-icons/fa6";
import { formatDate } from "../../utils/i18nFormat";
import { hasHtml, sanitizeRichHtml, toPlainText } from "../../utils/richText";
import avatar from "../../assets/logo1.png";
import SafeImage from "../../components/SafeImage";
import "./Post.css";

/* ==========================================================================
   /our-impact/post — the social-media feed, rendered Instagram-style.

   Lives inside OurImpactLayout, so the "Impacts" heading and the sidebar stay
   in place exactly as they do for News, Blogs and Report. It is a completely
   separate page from the News sub page: this one reads ONLY the posts API and
   never touches the impacts array, so nothing here can change the News cards
   or any other sub page.

   Every class is .auvd-post*, a prefix used nowhere else in the project, so no
   existing rule can cascade into this feed.

   ENTRY SHAPE (GET /api/posts):
     id, date (YYYY-MM-DD), topic, image, imageAlt, caption, paragraph.

   DATA SOURCE
   -----------
   The entries are fetched from GET /api/posts on mount rather than imported
   from src/data/moments.json, so a post added or edited in the admin
   dashboard appears here straight away. src/data/moments.json was migrated
   into the database by scripts/migrate-moments.mjs and is now only a backup.

   The feed uses an equal-height responsive grid, topic filters and searchable
   previews while retaining the existing Instagram-inspired card design.
   ========================================================================== */

/* The five chips, in the order they are shown. "all" is a local sentinel, not
   a topic, so it is kept out of the topic list below. */
const FILTERS = [
  { value: "all", labelKey: "impact.post.filters.all" },
  { value: "education", labelKey: "impact.post.filters.education" },
  { value: "music", labelKey: "impact.post.filters.music" },
  { value: "dance", labelKey: "impact.post.filters.dance" },
  { value: "vocational", labelKey: "impact.post.filters.vocational" },
];

/* One feed entry. Unlike the old Moments section there is NO featured post and
   no alternating sides: every post is the same size and style, which is how a
   real social feed reads. The topic tag resolves its own short label because
   "Vocational Training" is too long to sit behind a "#". */
const Post = ({ entry, language, showMoreLabel, showLessLabel }) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand =
    toPlainText(`${entry.caption || ""} ${entry.paragraph || ""}`).length > 120;

  return (
    <article className={`auvd-post-card${expanded ? " auvd-post-card--expanded" : ""}`}>
      <header className="auvd-post-head">
        {/* The logo is decorative next to the visible "AUVD" name, so it carries
            an empty alt rather than repeating the account name to a screen
            reader. */}
        <img className="auvd-post-avatar" src={avatar} alt="" />
        <span className="auvd-post-account" lang="en">
          AUVD
        </span>
        {/* <time> keeps the machine-readable ISO value while the visible text is
            formatted in the active language, like everywhere else on the site. */}
        <time className="auvd-post-date" dateTime={entry.date}>
          {formatDate(entry.date, language, { timeZone: "UTC" })}
        </time>
      </header>

      <SafeImage
        className="auvd-post-image"
        src={imageUrl(entry.image)}
        alt={entry.imageAlt}
        fallbackLabel={entry.imageUnavailable}
      />

      {/* Decorative only. There is no backend, no like counter and no share
          target, so these are <span>s and NOT buttons: rendering them as
          <button> would advertise an interaction that does nothing. Wire them up
          only when a real endpoint exists. */}
      <p className="auvd-post-actions" aria-hidden="true">
        <FaHeart className="auvd-post-action-icon" />
        <FaPaperPlane className="auvd-post-action-icon" />
      </p>

      <div className="auvd-post-body">
        {/* An h3 so every post is reachable by heading, but styled as ordinary
            body text because Instagram sets it that way: the account name runs
            bold inline, then the caption in normal weight. */}
        <h3 className="auvd-post-caption">
          <span className="auvd-post-caption-account" lang="en">
            AUVD
          </span>{" "}
          {entry.caption}
        </h3>

        {/* The Paragraph field became a rich-text editor, so a saved post may
            carry HTML. hasHtml() keeps every post written as plain text on the
            original `{entry.paragraph}` line, rendered as text exactly as before;
            only genuine HTML is passed through the allow-list sanitizer and
            injected. The class is unchanged either way, so the card keeps its
            existing design. */}
        {hasHtml(entry.paragraph) ? (
          <div
            className="auvd-post-paragraph"
            dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(entry.paragraph) }}
          />
        ) : (
          <p className="auvd-post-paragraph">{entry.paragraph}</p>
        )}

        {canExpand ? (
          <button
            type="button"
            className="auvd-post-expand"
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? showLessLabel : showMoreLabel}
          </button>
        ) : null}

        <p className="auvd-post-topic">#{entry.topicLabel}</p>
      </div>
    </article>
  );
};

const PostFeed = () => {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(apiUrl("/api/posts"), { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        /* Checked rather than trusted: a rewrite or proxy can answer 200 with
           an HTML page, and `posts` must be an array before it is sorted. */
        if (!result || result.ok !== true || !Array.isArray(result.posts)) {
          throw new Error("unexpected response shape");
        }

        setPosts(result.posts);
        setStatus("ready");
      } catch (error) {
        /* An abort is this component unmounting (the visitor navigated away),
           which is not a failure and must not set an error state on a page
           that is no longer on screen. */
        if (error?.name === "AbortError") return;

        console.error(`[post] could not load the feed: ${error?.message ?? error}`);
        setStatus("error");
      }
    };

    load();

    return () => controller.abort();
  }, [requestNumber]);

  const allPosts = useMemo(
    () =>
      [...posts]
        /* Newest first, the order a social feed is read in. The API already
           sorts this way; sorting again is what keeps the order correct and
           stable if the two ever disagree. The array is copied first so the
           state is never mutated. */
        .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
        /* The topic tag is resolved once here, not inside every card. */
        .map((entry) => ({
          ...entry,
          topicLabel: t(`impact.post.topics.${entry.topic}`),
          imageUnavailable: t("common.imageUnavailable"),
        })),
    [posts, t]
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(i18n.resolvedLanguage);

    return allPosts.filter((entry) => {
      const matchesTopic = activeFilter === "all" || entry.topic === activeFilter;
      const searchableText = `${entry.caption} ${toPlainText(entry.paragraph)} ${entry.topicLabel}`
        .toLocaleLowerCase(i18n.resolvedLanguage);

      return matchesTopic && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [allPosts, activeFilter, i18n.resolvedLanguage, query]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setVisibleCount(6);
  };

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
    setVisibleCount(6);
  };

  const retryFetch = () => {
    setStatus("loading");
    setRequestNumber((current) => current + 1);
  };

  const loadingContent = (
    <div className="auvd-post-state" role="status" aria-label={t("impact.post.loading")}>
      <span className="auvd-post-spinner" aria-hidden="true" />
      <span>{t("impact.post.loading")}</span>
    </div>
  );

  return (
    <>
      {/* The shared sub-page heading (Lora with the orange rule beneath it), so
          Post sits in line with News, Blogs and Report. */}
      <h2 className="auvd-impact-category">{t("impact.post.heading")}</h2>

      <p className="auvd-post-intro">{t("impact.post.intro")}</p>

      {/* A group of toggle buttons, not tabs: the feed stays in place below
          and the chips only change what it contains. */}
      <div
        className="auvd-post-filters"
        role="group"
        aria-label={t("impact.post.filtersLabel")}
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              className={`auvd-post-filter${isActive ? " auvd-post-filter--active" : ""}`}
              aria-pressed={isActive}
              onClick={() => handleFilterChange(filter.value)}
            >
              {t(filter.labelKey)}
            </button>
          );
        })}
      </div>

      <label className="auvd-post-search">
        <span>{t("impact.post.searchLabel")}</span>
        <input
          type="search"
          value={query}
          onChange={handleSearchChange}
          placeholder={t("impact.post.searchPlaceholder")}
        />
      </label>

      <div className="auvd-post-feed">
        {status === "loading" ? (
          loadingContent
        ) : status === "error" ? (
          <div className="auvd-post-state" role="alert">
            <p>{t("impact.post.error")}</p>
            <button type="button" className="auvd-post-retry" onClick={retryFetch}>
              {t("common.retry")}
            </button>
          </div>
        ) : visiblePosts.length === 0 ? (
          <p className="auvd-post-empty">
            {query.trim() ? t("impact.post.noResults") : t("impact.post.empty")}
          </p>
        ) : (
          <>
            {visiblePosts.map((entry) => (
              <Post
                key={entry.id}
                entry={entry}
                language={i18n.language}
                showMoreLabel={t("impact.post.showMore")}
                showLessLabel={t("impact.post.showLess")}
              />
            ))}
            {filteredPosts.length > visiblePosts.length ? (
              <button
                type="button"
                className="auvd-post-retry auvd-post-load-more"
                onClick={() => setVisibleCount((count) => count + 6)}
              >
                {t("common.loadMore")}
              </button>
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default PostFeed;