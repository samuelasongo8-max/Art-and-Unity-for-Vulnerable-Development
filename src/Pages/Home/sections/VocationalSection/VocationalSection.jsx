import { useEffect, useState } from "react";
import "./VocationalSection.css";

/* "Vocational Education Training (VET)" — restyled into the Our Impact
   two-column pattern: the existing fading image carousel sits in the media
   column (left, as before), and the Bebas Neue title + Source Sans 3
   paragraph + the unchanged "Explore more" action (same destination,
   styled like the site's other links) sit in the right column. Layout
   comes from the shared .auvd-story-* classes (imported via Home.css). */
function VocationalSection({ navigate, vocationalImages }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImage((previous) =>
        previous === vocationalImages.length - 1 ? 0 : previous + 1
      );
    }, 4200);

    return () => window.clearInterval(interval);
  }, [vocationalImages.length]);

  return (
    <section className="auvd-story-section vocational-section">
      <div className="auvd-story-container">
        <div className="auvd-story-body">

          {/* Existing image carousel in the media column (left) */}
          <div className="auvd-story-gallery auvd-story-gallery--single">
            <img
              key={vocationalImages[currentImage].src}
              src={vocationalImages[currentImage].src}
              alt={vocationalImages[currentImage].alt}
              className="auvd-story-gallery-item auvd-story-gallery-item--1 vocational-image-fade"
            />
          </div>

          <div className="auvd-story-text">
            <h2 className="auvd-story-title">
              Vocational Education Training (VET)
            </h2>

            <p>
              Our Vocational Education and Training (VET) programs empower youth, women, and
              vulnerable community members with practical skills for self-reliance and personal
              development.
            </p>

            <button
              className="auvd-cta-link vocational-explore-btn"
              onClick={() => navigate("/Work#livelihoods-women")}
              type="button"
            >
              Explore more
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default VocationalSection;