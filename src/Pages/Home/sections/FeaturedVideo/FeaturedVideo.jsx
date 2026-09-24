import React, { useState } from "react";
import "./FeaturedVideo.css";
import useRevealClass from "../../hooks/useRevealClass";
import ToggleSection from "../../../../components/ToggleSection";


// Importing images properly in React (Ensure these match your path/assets structure)
import img1 from "/Upcoming project  (2).jpg";
import img2 from "/Upcoming project 1 (1).jpg";
import img3 from "/Upcoming project 3.jpg";

const testimonialsData = [
  {
    image: img1,
    text: "In partnership with Because International, AUVD will soon distribute the shoe That Grows to Vulnerable Children, helping protect their health, improve school attendence, and promote dignity.",
    author: "- Statsu: Coming Soon School: Kismayo Light Academy, Location: Kakuma 2, Zone 1, Block 6",
       buttonText: "View Initiative",
          buttonLink: "#",

  },
  {
    image: img2,
    text: "More than a shoe distribution, this initiative is about protecting children's health, improving school attendance, and restoring dignity. The Shoe That Grows expands up to five sizes, allowing children to safely walk, learn, and play for years.",
    author: "- Coming Soon",
  },
  {
    image: img3,
    text: "Empowering refugee children and youth through music, storytelling, creative expression, and healing. | Partner : The Bridge Life Music Career Advancement, Inc",


    author: "-Target Reach: 2,000 Children & Youth in Kakuma refugee Camp, Kenya",

  },
];

function FeaturedVideo({ partnerLinks }) {
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
                  title="Vel Lewis Debuts New Music And Shares His Global Journey"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="auvd-story-text">
              <h2 className="auvd-story-title">
                Vel Lewis Debuts New Music And Shares His Global Journey
              </h2>
              <p>
                Partnership with Art and Unity for Vulnerable Development (AUVD) and how we
                organized Youth Peace Week workshops.
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
                  title="AUVD YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="auvd-story-text">
              <h2 className="auvd-story-title">Music Across Youth Peace Week</h2>
              <p>
                Art and Unity for Vulnerable Development (AUVD), in partnership with{" "}
                <a className="video-partner-link" href={partnerLinks?.f2f} target="_blank" rel="noreferrer">
                  F2F Music Foundation
                </a>
                , UnityNet International, Andrew Network - AHIAGBA TV, and{" "}
                <a className="video-partner-link" href={partnerLinks?.tsf} target="_blank" rel="noreferrer">
                  Transylvanian Symphony Foundation
                </a>
                , successfully delivered three impactful workshops during Youth Peace Week in Kakuma
                Refugee Camp.
              </p>

              <div className="video-actions">
                <a
                  className="auvd-outbound-link"
                  href="https://www.youtube.com/watch?v=KC_okHjsXRw&t=2s"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open on YouTube
                </a>
              </div>

              {/* Small stat line: bold label + value */}
              <p className="peace-week-stat">
                <strong>2025</strong> <span>|</span> <span>3 Workshops Conducted</span>
              </p>

              {/* Distinct light panel so the upcoming events block never
                  blends into the surrounding body copy */}
              <section className="peace-week-events">
                <ToggleSection title="2026 UPCOMING EVENTS">
                  <div className="event-card">
                    <h3>No Events Scheduled Yet</h3>
                    <p>
                      We are currently planning our upcoming community activities,
                      workshops, performances, and outreach programs.
                      Please check back soon or follow our updates to stay informed
                      about future events.
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

        <h2 className="section-main-title">Our Upcoming Initiative</h2>

        <h5 className="section-subtitle">.Because International Shoe Distribution</h5>

        <h5 className="section-subtitle">.The Right to Be Free Project</h5>
      </section>



        <div className="testimonial-container">

          {/* Left: Image Box */}
          <div className="testimonial-image-wrapper">
            <img src={currentTestimonial.image} alt={currentTestimonial.author} />
          </div>

          {/* Right: Content Box (Overlapping) */}
          <div className="testimonial-content-wrapper">
            <div className="testimonial-quote-container">
              <span className="quote-icon">&ldquo;</span>
              <p className="testimonial-text">{currentTestimonial.text}</p>
              <p className="testimonial-author">{currentTestimonial.author}</p>
            </div>

            {/* Navigation Controls */}
            <div className="testimonial-nav">
              <button className="nav-btn" onClick={handlePrev} aria-label="Previous Testimonial">
                &#10094;
              </button>
              <button className="nav-btn" onClick={handleNext} aria-label="Next Testimonial">
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
         Learn more about the shoes that Grow
    </button>
</section>

    </>
  );
}

export default FeaturedVideo;