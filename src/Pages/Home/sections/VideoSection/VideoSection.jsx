import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./VideoSection.css";

/* "Empowering Young Voices Through Music" — CMA-Foundation-style video
   gallery. Three compact cards in a row; each is a 16:9 YouTube thumbnail
   with a category ribbon and a circular play button. Clicking a card swaps
   the thumbnail for the embedded player (autoplay on, ?start= preserved).

   The section heading + intro reuse the existing home.video.* keys; the
   per-card copy lives in home.videoGallery.* so it translates with the site.
   Video 3 (Global Innovation Challenge) is the video that already existed in
   this section. */
const videos = [
  {
    id: "SmUvSuejKjE",
    start: 382,
    tone: "orange",
    titleKey: "home.videoGallery.velLewis.title",
    descKey: "home.videoGallery.velLewis.description",
    ribbonKey: "home.videoGallery.velLewis.ribbon",
  },
  {
    id: "KC_okHjsXRw",
    start: 2,
    tone: "blue",
    titleKey: "home.videoGallery.peaceWeek.title",
    descKey: "home.videoGallery.peaceWeek.description",
    ribbonKey: "home.videoGallery.peaceWeek.ribbon",
  },
  {
    id: "omWzt2QkaJE",
    start: 0,
    tone: "navy",
    titleKey: "home.videoGallery.innovation.title",
    descKey: "home.videoGallery.innovation.description",
    ribbonKey: "home.videoGallery.innovation.ribbon",
  },
];

function VideoSection() {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(null);

  return (
    <section className="p1-gallery">
      <div className="p1-gallery__inner">
        <header className="p1-gallery__head">
          <h2 className="p1-gallery__title">{t("home.video.title")}</h2>
          <p className="p1-gallery__intro">{t("home.video.paragraph")}</p>
        </header>

        <div className="p1-gallery__grid">
          {videos.map((video) => {
            const isActive = activeId === video.id;
            return (
              <article className="p1-card" key={video.id}>
                <div className="p1-card__media">
                  <span className={`p1-card__ribbon p1-card__ribbon--${video.tone}`}>
                    {t(video.ribbonKey)}
                  </span>

                  {isActive ? (
                    <iframe
                      className="p1-card__frame"
                      src={`https://www.youtube.com/embed/${video.id}?start=${video.start}&autoplay=1&rel=0`}
                      title={t(video.titleKey)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      className="p1-card__thumb"
                      onClick={() => setActiveId(video.id)}
                      aria-label={`${t("home.videoGallery.playLabel")}: ${t(video.titleKey)}`}
                    >
                      <img
                        className="p1-card__img"
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={t(video.titleKey)}
                        loading="lazy"
                        onError={(event) => {
                          const img = event.currentTarget;
                          if (img.dataset.fallback !== "1") {
                            img.dataset.fallback = "1";
                            img.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                          }
                        }}
                      />
                      <span className="p1-card__play" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" focusable="false">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </button>
                  )}
                </div>

                <div className="p1-card__body">
                  <h3 className="p1-card__title">{t(video.titleKey)}</h3>
                  <p className="p1-card__desc">{t(video.descKey)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default VideoSection;