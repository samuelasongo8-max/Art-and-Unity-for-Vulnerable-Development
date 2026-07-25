import React from 'react';

const FeaturedVideo = () => {
    return (
        <div>FeaturedVideo</div>
    )
}

export default FeaturedVideo;
import React, { useState } from "react";
import "./FeaturedVideo.css";
import useRevealClass from "../../hooks/useRevealClass";

// Importing images properly in React (Ensure these match your path/assets structure)
import img1 from "/samuel.png";
import img2 from "/bilbwa.png";
import img3 from "/kamikazi Rehema.png";

const testimonialsData = [
  {
    image: img1,
    text: "Working with AUVD has made me a part of endless stories, of human generosity, of compassion. It changed the way I look at life. It is the need of the hour to stand up and take responsibility.",
    author: "- Samuel Asongo, Chairperson",
  },
  {
    image: img2,
    text: "The dedication of this organization is remarkable. Seeing the direct impact on local communities inspires me to continue supporting their mission every single day.",
    author: "- Matayo Bilibwa, Vice Chairperson",
  },
  {
    image: img3,
    text: "Being involved allowed me to witness genuine change firsthand. Transparency, empathy, and active participation define everything they achieve.",
    author: "- Kamikazi Rehema, Treasurer",
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
      {/* Section 1: Featured Video */}
      <section className="video-section">
        <div ref={sectionRef} className="video video-animated">
          <div className="video-copy">
            <p className="video-kicker">Featured Video</p>
            <h2>Music Across Youth Peace Week</h2>
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
            <a
              className="video-link"
              href="https://www.youtube.com/watch?v=KC_okHjsXRw&t=2s"
              target="_blank"
              rel="noreferrer"
            >
              Open on YouTube
            </a>
          </div>

          <div className="video-frame-wrapper">
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
      </section>

      {/* Section 2: Overlapping Testimonial Slider */}
      <section className="featured-video-section">
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
      <section className="upcoming-section">
        
      </section>
    </>
  );
}

export default FeaturedVideo;