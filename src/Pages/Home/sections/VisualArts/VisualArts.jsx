import "./VisualArts.css";
import useRevealClass from "../../hooks/useRevealClass";

/* "Visual Arts" — restyled into the Our Impact two-column pattern:
   the existing photo sits in the media column (right — the section keeps
   its original text-left / image-right arrangement via --flip), the heading
   is promoted to the pattern's Bebas Neue title (there is no separate label
   wording in this section), and the two paragraphs use the shared
   Source Sans 3 body styles (src/components/ImpactSections.css, imported
   once via Home.css). Wording is unchanged. */
function VisualArts() {
  const sectionRef = useRevealClass("content-entered", 0.3);

  return (
    <section className="auvd-story-section auvd-story-section--tint visual-section">
      <div className="auvd-story-container">
        <div className="auvd-story-body auvd-story-body--flip">

          <div className="auvd-story-gallery auvd-story-gallery--single">
            <img
              className="auvd-story-gallery-item auvd-story-gallery-item--1"
              src="/drawing.jpg"
              alt="Child exploring visual arts"
            />
          </div>

          <div ref={sectionRef} className="auvd-story-text visual-text-block content-animated">
            <h2 className="auvd-story-title">Visual Arts</h2>

            <p>
              This program uses <span>visual arts</span> as a powerful tool for self-expression,
              emotional healing, and personal development for refugees in Kakuma Refugee Camp.
              Through participatory activities such as <span>drawing, painting, and creative crafts</span>,
              participants are encouraged to explore their inner experiences and communicate
              thoughts and feelings that may be difficult to articulate through words alone.
            </p>

            <p>
              <span className="visual-highlight">
                Art-making provides a safe, non-judgmental space where individuals can reflect,
                create, and connect with themselves and others.
              </span>{" "}
              Research shows that engaging in visual art can help individuals express emotions,
              build confidence, and improve emotional regulation and well-being.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default VisualArts;