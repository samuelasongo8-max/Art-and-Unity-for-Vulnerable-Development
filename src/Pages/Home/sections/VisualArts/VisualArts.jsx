import "./VisualArts.css";
import useRevealClass from "../../hooks/useRevealClass";

function VisualArts() {
  const sectionRef = useRevealClass("content-entered", 0.3);

  return (
    <section className="visual-section">
      <div className="visual-container">
        <div ref={sectionRef} className="visual-text-block content-animated">
          <h2 className="visual-title">Visual Arts</h2>

          <p className="visual-text">
            This program uses <span>visual arts</span> as a powerful tool for self-expression,
            emotional healing, and personal development for refugees in Kakuma Refugee Camp.
            Through participatory activities such as <span>drawing, painting, and creative crafts</span>,
            participants are encouraged to explore their inner experiences and communicate
            thoughts and feelings that may be difficult to articulate through words alone.
          </p>

          <p className="visual-text">
            <span className="visual-highlight">
              Art-making provides a safe, non-judgmental space where individuals can reflect,
              create, and connect with themselves and others.
            </span>
            Research shows that engaging in visual art can help individuals express emotions,
            build confidence, and improve emotional regulation and well-being.
          </p>
        </div>

        <div className="visual-image-block">
          <img
            src="/drawing.jpg"
            alt="Child exploring visual arts"
            className="visual-image"
          />
        </div>
      </div>
      
    </section>
  );
}

export default VisualArts;