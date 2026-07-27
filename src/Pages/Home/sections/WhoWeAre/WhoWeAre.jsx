import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WhoWeAre.css";

function WhoWeAre() {
  const navigate = useNavigate();
  const images = ["/donation.jpg", "/drawing.jpg", "/emotional1.jpg"];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <div className="testimonial-content-wrapper">
        <div>
          <h2 className="who-we-are-title">Who We Are</h2>
          <p className="who-we-are-text">
            Art and Unity for Vulnerable Development (AUVD) is a nonprofit Community-Based Organization (CBO) and Refugee-Led Organization (RLO) based in Kakuma Refugee Camp, Kenya. Founded in 2022 and formally registered in 2025, AUVD works to empower vulnerable communities including refugees, women, youth, and persons with disabilities.
          </p>
          <p className="who-we-are-text">
            Our organization was created in response to the social and economic challenges faced by displaced populations. We believe that art and creativity are powerful tools for healing, education, and transformation.
          </p>
          <p className="who-we-are-text">
            Today, AUVD stands as a growing organization in Kakuma, dedicated to nurturing talent, promoting social cohesion, and advancing sustainable development.
          </p>
        </div>

        <div className="testimonial-btn-container">
          <button
            className="testimonial-action-btn"
            onClick={() => navigate("/about")}
          >
            Read more
          </button>
        </div>
        </div>

        <div className="testimonial-image-wrapper">
          <img src={images[activeImageIndex]} alt="AUVD community work" />
        </div>
      </div>
    </section>
  );
}

export default WhoWeAre;