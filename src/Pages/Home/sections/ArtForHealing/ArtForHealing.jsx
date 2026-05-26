import "./ArtForHealing.css";
import useRevealClass from "../../hooks/useRevealClass";

function ArtForHealing({ navigate }) {
  const sectionRef = useRevealClass("impact-text-entered", 0.3);

  return (
    <section className="impact-section">
      <div className="impact-wrapper">
        <div ref={sectionRef} className="impact-text-area impact-text-animated">
          <h2 className="impact-heading">🎨 Art for Healing</h2>
          <div className="impact-paragraph-group">
            <p className="impact-paragraph">
              This program is designed to support refugees in Kakuma Refugee Camp by using
              creative expression as a powerful tool for emotional well-being, personal
              development, and social connection.
            </p>
            <p className="impact-paragraph">
              Through structured activities in music, visual arts, and storytelling, participants
              are able to share their experiences, reconnect with their identities, and develop a
              stronger sense of belonging within their community.
            </p>
            <p className="impact-paragraph">
              These creative spaces not only encourage self-expression, but also strengthen
              resilience and foster positive social interaction among diverse groups.
            </p>
          </div>

          <button
            type="button"
            className="impact-explore-button"
            onClick={() => navigate("/Music")}
          >
            Explore More
          </button>
        </div>
      </div>
    </section>
  );
}

export default ArtForHealing;