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
    <section className="vocational">
      <div className="vocational-text-content">
        <h2 className="vocational-title">Vocational Education Training (VET)</h2>
        <p className="vocational-text">
          Our Vocational Education and Training (VET) programs empower youth, women, and
          vulnerable community members with practical skills for self-reliance and personal
          development.
        </p>

        <button
          className="btn-go-about vocational-explore-btn"
          onClick={() => navigate("/Work#livelihoods-women")}
          type="button"
        >
          Explore more
        </button>
      </div>

      <img
        key={vocationalImages[currentImage].src}
        src={vocationalImages[currentImage].src}
        alt={vocationalImages[currentImage].alt}
        className="vocational-image vocational-image-fade"
      />
    </section>
  );
}

export default VocationalSection;