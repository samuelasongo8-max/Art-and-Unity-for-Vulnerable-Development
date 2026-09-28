import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import "./FeaturedVideo.css";
import useRevealClass from "../../hooks/useRevealClass";
import ToggleSection from "../../../../components/ToggleSection";


// Importing images properly in React (Ensure these match your path/assets structure)
import img1 from "/Upcoming project  (2).jpg";
import img2 from "/Upcoming project 1 (1).jpg";
import img3 from "/Upcoming project 3.jpg";

/* Only the images live here — the quote and the author line for each slide
   are translation keys resolved with t() while rendering, so the slider
   switches language immediately with no reload. */
const testimonialsData = [
  {
    key: "one",
    image: img1,
  },
  {
    key: "two",
    image: img2,
  },
  {
    key: "three",
    image: img3,
  },
];

function FeaturedVideo({ partnerLinks }) {
  const { t } = useTranslation();
  const sectionRef = useRevealClass("video-entered", 0.3);

  // Testimonial slider state
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <>
      {/* Vel Lewis video — Our Impact two-column pattern: video left (the
          "Empowering young voices" section above has its video on the
          right, so the sides alternate), title + paragraph on the right. */}
      <section className="auvd-story-section">
        <div className="auvd-story-container">
          <div className="auvd-story-body">

            <div className="auvd-story-media">
              <div className="auvd-story-media-frame">
                <iframe
                  src="https://www.youtube.com/embed/SmUvSuejKjE?start=382"
                  title={t("home.featuredVideo.velLewis.iframeTitle")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="auvd-story-text">
              <h2 className="auvd-story-title">
                {t("home.featuredVideo.velLewis.title")}
              </h2>
              <p>
                {t("home.featuredVideo.velLewis.paragraph")}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Music Across Youth Peace Week — Our Impact two-column pattern:
          video on the right (alternating from the section above), copy
          with partner links, stat line and the upcoming-events panel on
          the left. */}
      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <div ref={sectionRef} className="auvd-story-body auvd-story-body--flip">

            <div className="auvd-story-media">
              <div className="auvd-story-media-frame">
                <iframe
                  className="video-frame"
                  src="https://www.youtube.com/embed/KC_okHjsXRw?start=2"
                  title={t("home.featuredVideo.peaceWeek.iframeTitle")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="auvd-story-text">
              <h2 className="auvd-story-title">{t("home.featuredVideo.peaceWeek.title")}</h2>
              {/* The sentence contains two partner links, so it uses <Trans>:
                  the whole clause is translated as one unit and the link
                  destinations (partnerLinks.f2f / .tsf) stay exactly as they
                  were. Only the words around them change language. */}
              <p>
                <Trans
                  i18nKey="home.featuredVideo.peaceWeek.paragraph"
                  components={{
                    f2f: <a className="video-partner-link" href={partnerLinks?.f2f} target="_blank" rel="noreferrer" />,
                    tsf: <a className="video-partner-link" href={partnerLinks?.tsf} target="_blank" rel="noreferrer" />,
                  }}
                />
              </p>

              <div className="video-actions">
                <a
                  className="auvd-outbound-link"
                  href="https://www.youtube.com/watch?v=KC_okHjsXRw&t=2s"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("home.featuredVideo.peaceWeek.openOnYouTube")}
                </a>
              </div>

              {/* Small stat line: bold label + value */}
              <p className="peace-week-stat">
                <strong>2025</strong> <span>|</span> <span>{t("home.featuredVideo.peaceWeek.statLabel")}</span>
              </p>

              {/* Distinct light panel so the upcoming events block never
                  blends into the surrounding body copy */}
              <section className="peace-week-events">
                <ToggleSection title={t("home.featuredVideo.peaceWeek.upcomingTitle")}>
                  <div className="event-card">
                    <h3>{t("home.featuredVideo.peaceWeek.upcomingHeading")}</h3>
                    <p>
                      {t("home.featuredVideo.peaceWeek.upcomingText")}
                    </p>
                  </div>
                </ToggleSection>
              </section>
            </div>

          </div>
        </div>
      </section>

      {/* Section 2: Overlapping Testimonial Slider */}
      <section className="featured-video-section">
 {/* Section 3: Upcoming Project */}

      <section className="upcoming-section">

        <h2 className="section-main-title">{t("home.featuredVideo.upcoming.title")}</h2>

        <h5 className="section-subtitle">{t("home.featuredVideo.upcoming.itemOne")}</h5>

        <h5 className="section-subtitle">{t("home.featuredVideo.upcoming.itemTwo")}</h5>
      </section>



        <div className="testimonial-container">

          {/* Left: Image Box */}
          <div className="testimonial-image-wrapper">
            <img src={currentTestimonial.image} alt={t(`home.featuredVideo.testimonials.${currentTestimonial.key}.author`)} />
          </div>

          {/* Right: Content Box (Overlapping) */}
          <div className="testimonial-content-wrapper">
            <div className="testimonial-quote-container">
              <span className="quote-icon">&ldquo;</span>
              <p className="testimonial-text">{t(`home.featuredVideo.testimonials.${currentTestimonial.key}.text`)}</p>
              <p className="testimonial-author">{t(`home.featuredVideo.testimonials.${currentTestimonial.key}.author`)}</p>
            </div>

            {/* Navigation Controls */}
            <div className="testimonial-nav">
              <button className="nav-btn" onClick={handlePrev} aria-label={t("home.featuredVideo.prevLabel")}>
                &#10094;
              </button>
              <button className="nav-btn" onClick={handleNext} aria-label={t("home.featuredVideo.nextLabel")}>
                &#10095;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Upcoming Project */}
    <section>
    <button
        className="testimonial-action-btn"
        onClick={() => window.location.href = '/portfolio#top'}
    >
         {t("home.featuredVideo.learnMoreShoes")}
    </button>
</section>

    </>
  );
}

export default FeaturedVideo;