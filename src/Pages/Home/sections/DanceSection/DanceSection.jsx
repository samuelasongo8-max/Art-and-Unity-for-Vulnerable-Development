import "./DanceSection.css";

/* "Dance" — restyled into the Core Belief contained-background pattern used
   on the Our Story page (.auvd-story-belief): the section height comes from
   its content (no viewport sizing), the existing photo sits behind the
   content as an absolute <img> with object-fit: cover, a dark overlay sits
   between image and content, the section name is the orange label and the
   paragraph is white (Core Belief's color treatment). The four short lines
   are now a small tag row instead of big headings — the fourth one
   ("Community dance") keeps its link to /dance. Wording is unchanged. */
function DanceSection({ navigate, danceParagraphs }) {
  return (
    <section className="dance-section">
      <img
        className="dance-section-image"
        src="/dance77.jpg"
        alt=""
        aria-hidden="true"
      />
      <div className="dance-overlay" aria-hidden="true"></div>

      <div className="dance-content">
        <div className="dance-text-wrapper">
          <h2 className="auvd-story-label dance-heading">Dance</h2>

          <p className="dance-description">
            {`${danceParagraphs.first} In an environment where many youth face stress, trauma, unemployment, and limited recreational opportunities, dance creates hope, inspiration, and a sense of belonging. AUVD uses dance not only as entertainment, but also as a pathway for empowerment, resilience, and community connection.`}
          </p>

          <div className="dance-tags">
            <span className="dance-tag">Move with purpose and Dance with confidence.</span>
            <span className="dance-tag">Express yourself through dance and creativity.</span>
            <span className="dance-tag">Where talent meets opportunity.</span>
            <button
              className="dance-tag dance-tag--link"
              onClick={() => navigate("/dance")}
              type="button"
            >
              Community dance
            </button>
          </div>
        </div>

      </div>

      <div className="dance-scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </section>
  );
}

export default DanceSection;