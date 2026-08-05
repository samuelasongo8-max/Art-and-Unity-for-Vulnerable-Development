import { useEffect, useState } from "react";
import "./VocationalSection.css";

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
    <section className="split-info-section vocational-section">
      <div className="split-container">
        
        {/* Left Column: Image with Fading Carousel */}
        <div className="split-image-col">
          <img
            key={vocationalImages[currentImage].src}
            src={vocationalImages[currentImage].src}
            alt={vocationalImages[currentImage].alt}
            className="vocational-image-fade"
          />
        </div>

        {/* Right Column: Content */}
        <div className="split-content-col">
          <h2 className="split-title">Vocational Education Training (VET)</h2>
          <div className="title-underline"></div>

          <p className="split-description">
            Our Vocational Education and Training (VET) programs empower youth, women, and
            vulnerable community members with practical skills for self-reliance and personal
            development.
          </p>

          <div className="split-action-block">
            <button
              className="split-btn vocational-explore-btn"
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