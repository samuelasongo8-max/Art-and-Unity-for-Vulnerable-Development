import { useTranslation } from "react-i18next";
import "./StoriesNews.css";

/* ==========================================================================
   "Stories & News" — three themed cards (Story / News / Report).
   Ported from the source project's design and re-skinned with the Project 1
   2026 palette (blue #1f76be / orange #ff6600 / navy #12395f). Cards are not
   linked; each shows a "Will be updated soon" notice. All visible text comes
   from the locale (storiesNews.*) so the section stays bilingual.
   ========================================================================== */

export default function StoriesNews() {
  const { t } = useTranslation();

  const posts = [
    {
      theme: "blue",
      image: "/donation-2.jpg",
      imageAlt: "Musical instruments delivered to AUVD in 2025",
      labelKey: "storiesNews.cards.story.label",
      titleKey: "storiesNews.cards.story.title",
      textKey: "storiesNews.cards.story.text",
      icon: (
        <svg
          viewBox="0 0 32 32"
          width="32"
          height="32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="5" y="7" width="22" height="14" rx="2" />
          <path d="M3 24h26" />
          <path d="M12.5 11.5 10 14l2.5 2.5" />
          <path d="M19.5 11.5 22 14l-2.5 2.5" />
          <path d="M16.8 11l-1.6 6" />
        </svg>
      ),
    },
    {
      theme: "orange",
      image: "/donation-5.jpg",
      imageAlt:
        "Instruments donated through the Transylvanian Symphony Foundation and Hungry for Music",
      labelKey: "storiesNews.cards.news.label",
      titleKey: "storiesNews.cards.news.title",
      textKey: "storiesNews.cards.news.text",
      icon: (
        <svg
          viewBox="0 0 32 32"
          width="32"
          height="32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6 13h5l13-6v18l-13-6H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" />
          <path d="M11 18v3a2 2 0 0 0 2 2h1" />
          <path d="M27.5 13c1.4 1.2 1.4 5.8 0 7" />
        </svg>
      ),
    },
    {
      theme: "navy",
      image: "/drawing2-sm.webp",
      imageAlt: "Children and youth with their new instruments in Kakuma",
      labelKey: "storiesNews.cards.report.label",
      titleKey: "storiesNews.cards.report.title",
      textKey: "storiesNews.cards.report.text",
      icon: (
        <svg
          viewBox="0 0 32 32"
          width="32"
          height="32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M8 4.5h10.5L24 10v17.5H8z" />
          <path d="M18.5 4.5V10H24" />
          <path d="M11.5 23v-3" />
          <path d="M15.5 23v-7" />
          <path d="M19.5 23v-5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="auvd-stories">
      <i className="auvd-stories-brush auvd-stories-brush--blue" aria-hidden="true" />
      <i className="auvd-stories-brush auvd-stories-brush--orange" aria-hidden="true" />
      <i className="auvd-stories-brush auvd-stories-brush--navy" aria-hidden="true" />

      <div className="auvd-stories-inner">
        <h2 className="auvd-stories-title">
          {t("storiesNews.titleA")}{" "}
          <span className="auvd-stories-amp">{t("storiesNews.titleAmp")}</span>{" "}
          {t("storiesNews.titleB")}
        </h2>

        <div className="auvd-stories-grid">
          {posts.map((post) => (
            <article
              key={post.titleKey}
              className={`auvd-story-card auvd-story-card--${post.theme}`}
            >
              <img
                className="p1-donations-img"
                src={post.image}
                alt={post.imageAlt}
                loading="lazy"
              />
              <span className="auvd-story-icon" aria-hidden="true">
                {post.icon}
              </span>
              <p className="auvd-story-label">{t(post.labelKey)}</p>
              <h3 className="auvd-story-title">{t(post.titleKey)}</h3>
              <p className="auvd-story-text">{t(post.textKey)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
