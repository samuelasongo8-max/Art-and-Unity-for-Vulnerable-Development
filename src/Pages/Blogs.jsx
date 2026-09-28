import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./Blogs.css";

/* Only image paths and the story key live here. The category line, title,
   description and alt text are all translation keys resolved with t() while
   rendering, so the carousel follows the language with no reload. */
const musicStories = [
  {
    key: "one",
    metaDateKey: "impact.items.two.metaDate",
    metaRead: 4,
    image: "/Youth peace week.jpg",
    link: "/events#events-overview",
  },
  {
    key: "two",
    metaDateKey: "impact.items.three.metaDate",
    metaRead: 3,
    image: "/donation.jpg",
    link: "/donation",
  },
  {
    key: "three",
    tagKey: "impact.items.four.tag",
    image: "/violin.jpg",
    link: "/music",
  },
  {
    key: "four",
    tagKey: "impact.items.five.tag",
    image: "/donation-2.jpg",
    link: "/music",
  },
];

function getVisibleStoryCount() {
  if (typeof window === "undefined") {
    return 3;
  }

  if (window.innerWidth <= 640) {
    return 1;
  }

  if (window.innerWidth <= 900) {
    return 2;
  }

  return 3;
}

function Blogs() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleStoryCount, setVisibleStoryCount] = useState(getVisibleStoryCount);
  const lastIndex = musicStories.length - visibleStoryCount;

  useEffect(() => {
    const handleResize = () => {
      setVisibleStoryCount(getVisibleStoryCount());
      setCurrentIndex((index) => Math.min(index, musicStories.length - getVisibleStoryCount()));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showPrevious = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const showNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, lastIndex));
  };

  /* The category line is rebuilt from parts so each can be localized: the
     month with a plain key, the read time with a plural key ("4 min read"
     becomes "4 min de lecture") and the tag as written. */
  const categoryFor = (story) => {
    const parts = [];
    if (story.metaDateKey) {
      parts.push(t(story.metaDateKey));
    }
    if (story.metaRead) {
      parts.push(t("impact.grid.minRead", { count: story.metaRead }));
    }
    if (story.tagKey) {
      parts.push(t(story.tagKey));
    }
    return parts.join(" · ");
  };

  return (
    <main className="blogs-page">
      <section className="blogs-hero" aria-labelledby="blogs-heading">
        <div className="blogs-hero-inner">
          <div className="blogs-editorial-header">
           <div className="blogs-editorial-copy">
  {/* <p className="blogs-eyebrow">Music Instrument Donations:</p> */}
  <h1 id="blogs-heading" className="blogs-heading">{t("blogs.hero.title")}</h1>
  <p className="blogs-intro">
    {t("blogs.hero.intro")}
  </p>
   <Link className="blogs-view-all" to="/news/daddario-community-music-grant">
              {t("blogs.hero.viewAll")} <span aria-hidden="true">→</span>
            </Link>
</div>

  
  </div>
    </div>
  </section>
    
      <section className="blogs-editorial" aria-labelledby="blogs-heading">
        <div className="blogs-carousel-heading">
          <div className="blogs-progress" aria-hidden="true">
            <span style={{ width: `${((currentIndex + 1) / (lastIndex + 1)) * 100}%` }} />
          </div>
          <div className="blogs-carousel-controls" aria-label={t("blogs.carousel.label")}>
            <button
              type="button"  
              className="blogs-carousel-button"
              onClick={showPrevious}
              disabled={currentIndex === 0}   
              aria-label={t("blogs.carousel.previousAlt")}
            >
              <span aria-hidden="true">←</span> {t("blogs.carousel.previous")}
            </button>
            <button
              type="button"
              className="blogs-carousel-button"
              onClick={showNext}
              disabled={currentIndex === lastIndex}
              aria-label={t("blogs.carousel.nextAlt")}
            >
              {t("blogs.carousel.next")} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <div className="blogs-carousel" aria-live="polite">
          <div className="blogs-carousel-track" style={{ "--blogs-index": currentIndex }}>
            {musicStories.map((story) => (
              <article className="blogs-story-card" key={story.key}>
                <img
                  className="blogs-story-image"
                  src={story.image}
                  alt={t(`blogs.stories.${story.key}.alt`)}
                />
                <div className="blogs-story-copy">
                  <span className="blogs-story-category">{categoryFor(story)}</span>
                  <h2>{t(`blogs.stories.${story.key}.title`)}</h2>
                  <p>{t(`blogs.stories.${story.key}.description`)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        

      </section>
    </main>
  );
}

export default Blogs;
