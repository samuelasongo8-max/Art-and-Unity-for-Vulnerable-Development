import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ImpactHero from "../components/ImpactHero";
import { formatLongDate } from "../utils/i18nFormat";
import "./Events.css";

/* ==========================================================================
   Only image paths and the per-event translation-key prefix live here. Each
   date is stored as an ISO string and rendered with Intl for the active
   language ("October 5, 2025" becomes "5 octobre 2025"), and every title,
   theme, poster line, description and alt text is resolved with t() while
   rendering, so the page follows the language with no reload.
   ========================================================================== */
const workshopEvents = [
  { key: "one", date: "2025-10-05", image: "/muziki.jpg", variant: "poster" },
  {
    key: "two",
    date: "2025-10-10",
    galleryImages: [
      { src: "/ani1.jpg", altKey: "events.workshops.two.gallery.one", featured: true },
      { src: "/mental.jpg", altKey: "events.workshops.two.gallery.two" },
      { src: "/mental2.jpg", altKey: "events.workshops.two.gallery.three" },
      { src: "/menatal3.jpg", altKey: "events.workshops.two.gallery.four" },
      { src: "/Sharmante1.jpg", altKey: "events.workshops.two.gallery.five" },
    ],
  },
  { key: "three", date: "2025-10-16", image: "/furaha.jpg" },
];

const impactPointKeys = [
  "events.impact.points_one",
  "events.impact.points_two",
  "events.impact.points_three",
  "events.impact.points_four",
];

function Events() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const revealedElements = Array.from(document.querySelectorAll("[data-reveal]"));

    if (revealedElements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const isMentalHealthDay = (key) => key === "two";

  return (
    <section className="events-page">
      {/* Full-bleed hero — the shared ImpactHero component (the exact design
          Pricing uses), carrying this page's own heading, intro paragraph and
          photo. The old hero had no button, fact card or milestones, so none
          are added. */}
      <div className="auvd-events-hero-bleed">
        <ImpactHero
          heading={t("events.hero.heading")}
          paragraph={t("events.hero.paragraph")}
          image="/mental.jpg"
          imageAlt={t("events.hero.imageAlt")}
        />
      </div>

      <div className="auvd-events-container">

        {/* Overview — the Our Impact section pattern: label (no rule), then a
            two-column body with the image collage on the left. */}
        <section id="events-overview" className="auvd-events-section auvd-events-section--white" data-reveal>
          <p className="events-section-label">{t("events.overview.label")}</p>
          <div className="auvd-events-body">
            <div className="auvd-events-collage auvd-events-collage--single">
              <img src="/youth peace.jpg" alt={t("events.overview.alt")} />
            </div>
            <div className="auvd-events-text">
              <h2 className="auvd-events-title">{t("events.overview.title")}</h2>
              <p>{t("events.overview.p1")}</p>
              <p>{t("events.overview.p2")}</p>
            </div>
          </div>
        </section>

        {workshopEvents.map((event, index) => (
          <section
            key={event.key}
            className={`auvd-events-section${index % 2 === 0 ? " auvd-events-section--flip" : ""}${
              isMentalHealthDay(event.key) ? " auvd-events-section--white" : ""
            }`}
            data-reveal
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <p className="event-story-date">{formatLongDate(event.date, i18n.language)}</p>
            <div className="auvd-events-body">
              <div className={`auvd-events-collage auvd-events-collage--${event.galleryImages ? "five" : "single"}`}>
                {event.galleryImages
                  ? event.galleryImages.map((image) => (
                      <img key={image.src} src={image.src} alt={t(image.altKey)} />
                    ))
                  : event.variant === "poster"
                    ? (
                      <div className="event-story-image event-story-image-poster">
                        <img src={event.image} alt={t(`events.workshops.${event.key}.alt`)} />
                        {t(`events.workshops.${event.key}.posterHeadline`) ? (
                          <div className="event-story-poster-copy">
                            <h4>{t(`events.workshops.${event.key}.posterHeadline`)}</h4>
                            <p>{t(`events.workshops.${event.key}.posterDetails`)}</p>
                          </div>
                        ) : null}
                      </div>
                    )
                    : <img src={event.image} alt={t(`events.workshops.${event.key}.alt`)} />}
              </div>

              <div className="auvd-events-text">
                <h2 className="auvd-events-title">{t(`events.workshops.${event.key}.title`)}</h2>
                <h3 className="event-story-theme">{t(`events.workshops.${event.key}.theme`)}</h3>
                <p>{t(`events.workshops.${event.key}.description`)}</p>
              </div>
            </div>
          </section>
        ))}

                {/* Impact — the page's own dark blue band kept as the section
            background; section label and title on the left, closing
            paragraphs and quote on the right. */}
                <section
                  className="auvd-events-section auvd-events-impact events-reveal"
                  data-reveal
                >
                  <div className="auvd-events-body">
                    <div className="auvd-events-impact-head">
                      <p className="events-section-label">{t("events.impact.label")}</p>
                      <h2 className="auvd-events-title">{t("events.impact.title")}</h2>
                    </div>
                    <div className="auvd-events-text">
                      <ul className="impact-list">
                        {impactPointKeys.map((key) => (
                          <li key={key}>{t(key)}</li>
                        ))}
                      </ul>

                      <div className="events-closing">
                <p>{t("events.impact.p1")}</p>
                <p>{t("events.impact.p2")}</p>
                <blockquote>{t("events.impact.quote")}</blockquote>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Events;
