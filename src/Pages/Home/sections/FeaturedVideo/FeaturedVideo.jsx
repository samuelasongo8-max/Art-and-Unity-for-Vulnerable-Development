import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./FeaturedVideo.css";


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

function FeaturedVideo() {
  const { t } = useTranslation();

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
      {/* "Our Upcoming Initiative" — restyled into the clean "How we measure"
          split-image pattern: a full-bleed photo on the left and an
          overlapping blue card on the right (serif heading + generous body
          text). The testimonial carousel is preserved, so the photo, text and
          status line all follow the ❮ / ❯ controls. */}
      <section className="p1-upcoming">
        <div className="p1-upcoming__image-wrap">
          <img
            className="p1-upcoming__image"
            src={currentTestimonial.image}
            alt={t(`home.featuredVideo.testimonials.${currentTestimonial.key}.author`)}
          />
        </div>

        <div className="p1-upcoming__card">
          <h2 className="p1-upcoming__title">{t("home.featuredVideo.upcoming.title")}</h2>
          <p className="p1-upcoming__subtitle">{t("home.featuredVideo.upcoming.itemOne")}</p>
          <p className="p1-upcoming__subtitle">{t("home.featuredVideo.upcoming.itemTwo")}</p>

          <p className="p1-upcoming__text">
            {t(`home.featuredVideo.testimonials.${currentTestimonial.key}.text`)}
          </p>
          <p className="p1-upcoming__author">
            {t(`home.featuredVideo.testimonials.${currentTestimonial.key}.author`)}
          </p>

          <div className="p1-upcoming__nav">
            <button className="p1-upcoming__btn" onClick={handlePrev} aria-label={t("home.featuredVideo.prevLabel")}>
              &#10094;
            </button>
            <button className="p1-upcoming__btn" onClick={handleNext} aria-label={t("home.featuredVideo.nextLabel")}>
              &#10095;
            </button>
          </div>

          <a className="p1-upcoming__learn" href="/portfolio#top">
            {t("home.featuredVideo.learnMoreShoes")}
          </a>
        </div>
      </section>

    </>
  );
}

export default FeaturedVideo;