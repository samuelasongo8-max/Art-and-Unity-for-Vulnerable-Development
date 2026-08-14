import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRevealClass from "../../hooks/useRevealClass";
import "./ImpactHighlights.css";

const donations = [
  {
    tag: "2025 - Delivery",
    title: " Our First Major Instrument Donation",
    text: "In 2025, AUVD received its first major donation of musical instruments from the Transylvanian Symphony Foundation.",
    




    img: "/public/donation-1.jpg", 
  },
  {
    tag: "Partnership",
    title: "Continuing the Support",
    text: " Later in 2025, through the support of the Transylvanian Symphony Foundation in partnership with Hungry for Music,.",
    img: "/public/donation-2.jpg",
  },
  {
    tag: "Community",
    title: "Music Reaches Every Corner",
    text: "Dozens of children and youth gathered with their new instruments, from violins to keyboards, ready to start learning together.",
    img: "/public/donation-3.jpg",
  },
  {
    tag: "First Notes",
    title: "A New Ukulele, A New Start",
    text: "For many children, this was the first instrument they had ever held. Small moments like this build confidence and joy.",
    img: "/public/donation-4.jpg",
  },
  {
    tag: "Celebration",
    title: "Certificates and Gratitude",
    text: "The donation was marked with a small ceremony, honoring the partnership that made the new music program possible.",
    img: "/public/donation-5.jpg",
  },


];

const PER_PAGE = 4;

function ImpactHighlights() {
  const navigate = useNavigate();
  const sectionRef = useRevealClass("auvd-donations-section-entered", 0.25);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(donations.length / PER_PAGE);
  const start = page * PER_PAGE;
  const visible = donations.slice(start, start + PER_PAGE);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section
      ref={sectionRef}
      className="auvd-donations-section auvd-donations-section-animated"
    >
      <div className="auvd-donations-inner">
        <div className="auvd-donations-top">
          <div className="auvd-donations-heading">
            <h2>Music Instrument</h2>
            <h3>Donations:</h3>   
            <h3 style={{ color: "#0d53d4", fontSize: "2rem", fontWeight: 700 }}>
  Music That Reached Kakuma
</h3>
  Our music education journey grew through the generosity of partners who believed that every young person deserves an opportunity to learn, create, and express themselves through music.
          </div>
                   <button
  className="auvd-donations-viewall"
  type="button"
  onClick={() => navigate("/impact")}
>
  View All
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <path
      d="M9 6l6 6-6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>
        
        </div>

        <div className="auvd-donations-controls">
          <div className="auvd-donations-progress">
            <div
              className="auvd-donations-progress-fill"
              style={{ width: `${((page + 1) / totalPages) * 100}%` }}
            />
          </div>
          <div className="auvd-donations-arrows">
            <button
              type="button"
              className="auvd-donations-arrow"
              onClick={goPrev}
              disabled={page === 0}
              aria-label="Previous donations"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className={`auvd-donations-arrow${page < totalPages - 1 ? " is-active" : ""}`}
              onClick={goNext}
              disabled={page === totalPages - 1}
              aria-label="Next donations"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="auvd-donations-track" key={page}>
          {visible.map((item, i) => (
            <article
              key={item.title}
              className="auvd-donations-card"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="auvd-donations-card-img">
                <img src={item.img} alt={item.title} loading="lazy" />
              </div>
              <span className="auvd-donations-tag">{item.tag}</span>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
            
          ))}
        </div>

      </div>
    </section>
  );
}

export default ImpactHighlights;
