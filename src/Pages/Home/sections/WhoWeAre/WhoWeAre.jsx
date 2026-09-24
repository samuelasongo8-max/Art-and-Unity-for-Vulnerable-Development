import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./WhoWeAre.css";

/* "Who We Are" — restyled into the Our Impact two-column pattern:
   existing rotating image in the media column (left; the section after
   the Donations grid puts its image on the right, so the sides
   alternate), title + 3 paragraphs + "Read more" link on the right.
   Layout and typography come from the shared .auvd-story-* classes
   (src/components/ImpactSections.css, imported once via Home.css). */
function WhoWeAre() {
  const images = ["/donation.jpg", "/drawing.jpg", "/emotional1.jpg"];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="auvd-story-section auvd-story-section--tint">
      <div className="auvd-story-container">
        <div className="auvd-story-body">

          <div className="auvd-story-gallery auvd-story-gallery--single">
            <img
              className="auvd-story-gallery-item auvd-story-gallery-item--1"
              src={images[activeImageIndex]}
              alt="AUVD community work"
            />
          </div>

          <div className="auvd-story-text">
            <h2 className="auvd-story-title">Who We Are</h2>
            <p>
              Art and Unity for Vulnerable Development (AUVD) is a nonprofit Community-Based Organization (CBO) and Refugee-Led Organization (RLO) based in Kakuma Refugee Camp, Kenya. Founded in 2022 and formally registered in 2025, AUVD works to empower vulnerable communities including refugees, women, youth, and persons with disabilities.
            </p>
            <p>
              Our organization was created in response to the social and economic challenges faced by displaced populations. We believe that art and creativity are powerful tools for healing, education, and transformation.
            </p>
            <p>
              Today, AUVD stands as a growing organization in Kakuma, dedicated to nurturing talent, promoting social cohesion, and advancing sustainable development.
            </p>

            <Link to="/about" className="auvd-cta-link">
              Read more
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default WhoWeAre;