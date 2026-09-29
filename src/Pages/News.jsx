import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/i18nFormat";
import news from "../data/news.json";
import "./News.css";

/* Section order and ids are fixed here rather than derived from the data, so
   an empty or missing topic still renders its heading and its "no news"
   message, and so /news#vocational always resolves. */
const SECTIONS = [
  { id: "education", labelKey: "news.topics.education.label", titleKey: "news.topics.education.title" },
  { id: "music", labelKey: "news.topics.music.label", titleKey: "news.topics.music.title" },
  { id: "dance", labelKey: "news.topics.dance.label", titleKey: "news.topics.dance.title" },
  { id: "vocational", labelKey: "news.topics.vocational.label", titleKey: "news.topics.vocational.title" },
];

/* News copy is authored per language. A missing translation falls back to
   English rather than rendering a blank. */
const localized = (field, lang) => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
};

const paragraphsOf = (field, lang) => {
  const list = field?.[lang]?.length ? field[lang] : field?.en;
  return Array.isArray(list) ? list.filter(Boolean) : [];
};

const byNewestFirst = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

function News() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.resolvedLanguage === "fr" ? "fr" : "en";

  const itemsByTopic = useMemo(() => {
    const grouped = {};
    for (const section of SECTIONS) {
      grouped[section.id] = news.items
        .filter((item) => item.topic === section.id)
        .sort(byNewestFirst);
    }
    return grouped;
  }, []);

  /* /news#<id> — the id sits on the item itself, so the browser does the
     scrolling. This only nudges it, because the page mounts after the
     navigation has already happened. */
  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      target.scrollIntoView();
    }
  }, [location.hash]);

  const renderBody = (item) =>
    paragraphsOf(item.body, lang).map((paragraph, index) => <p key={index}>{paragraph}</p>);

  const renderDonate = () => (
    <Link className="auvd-news__donate" to="/donate">
      {t("news.donateCta")}
    </Link>
  );

  const renderCard = (item) => (
    <article className="auvd-news-card" key={item.id} id={item.id}>
      {item.image ? (
        <img className="auvd-news-card__image" src={item.image} alt={localized(item.imageAlt, lang)} />
      ) : null}
      <div className="auvd-news-card__body">
        <time className="auvd-news-card__date" dateTime={item.date}>
          {formatDate(item.date, lang)}
        </time>
        <h3 className="auvd-news-card__title">{localized(item.title, lang)}</h3>
        <div className="auvd-news-card__text">{renderBody(item)}</div>
        {renderDonate()}
      </div>
    </article>
  );

  const renderFeatured = (item) => (
    <article className="auvd-news-featured" key={item.id} id={item.id}>
      {item.image ? (
        <div className="auvd-news-featured__media">
          <img className="auvd-news-featured__image" src={item.image} alt={localized(item.imageAlt, lang)} />
        </div>
      ) : null}
      <div className="auvd-news-featured__body">
        <time className="auvd-news-featured__date" dateTime={item.date}>
          {formatDate(item.date, lang)}
        </time>
        <h3 className="auvd-news-featured__title">{localized(item.title, lang)}</h3>
        <div className="auvd-news-featured__text">{renderBody(item)}</div>
        {renderDonate()}
      </div>
    </article>
  );

  return (
    <div className="auvd-news">
      <section className="auvd-news-hero">
        <div className="auvd-news-hero__inner">
          <p className="auvd-news-hero__label">{t("news.hero.label")}</p>
          <h1 className="auvd-news-hero__title">{t("news.hero.title")}</h1>
          <p className="auvd-news-hero__intro">{t("news.hero.intro")}</p>
          <a className="auvd-news-hero__cta" href="#stay-connected">
            {t("news.hero.cta")}
          </a>
        </div>
      </section>

      <nav className="auvd-news-topics" aria-label={t("news.topicsNav.label")}>
        {SECTIONS.map((section) => (
          <a key={section.id} className="auvd-news-topics__link" href={`#${section.id}`}>
            {t(section.titleKey)}
          </a>
        ))}
      </nav>

      {SECTIONS.map((section, index) => {
        const items = itemsByTopic[section.id];
        const [featured, ...rest] = items;

        return (
          <section
            key={section.id}
            id={section.id}
            className={`auvd-news-section ${index % 2 === 1 ? "auvd-news-section--tint" : ""}`}
          >
            <div className="auvd-news-section__inner">
              <header className="auvd-news-section__header">
                <p className="auvd-news-section__label">{t(section.labelKey)}</p>
                <h2 className="auvd-news-section__title">{t(section.titleKey)}</h2>
              </header>

              {items.length === 0 ? (
                <p className="auvd-news-section__empty">{t("news.empty")}</p>
              ) : (
                <>
                  {featured ? renderFeatured(featured) : null}
                  {rest.length ? <div className="auvd-news-grid">{rest.map(renderCard)}</div> : null}
                </>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default News;
