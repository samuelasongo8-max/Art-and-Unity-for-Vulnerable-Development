import React, { useState } from "react";
import "./FeaturedVideo.css";
import useRevealClass from "../../hooks/useRevealClass";

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


    author: "-Target Reach: 2,000 Children & Youth ",


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