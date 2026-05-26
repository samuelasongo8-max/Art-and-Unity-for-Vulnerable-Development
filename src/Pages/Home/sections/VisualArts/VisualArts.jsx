import "./VisualArts.css";
import useRevealClass from "../../hooks/useRevealClass";

function VisualArts() {
  const sectionRef = useRevealClass("why-content-entered", 0.3);

  return (
    <section className="why-section visual-arts-section">
      <div className="why-container">
        <div className="why-image-wrapper">
          <img src="/drawing.jpg" alt="Child exploring visual arts" className="why-image" />
        </div>

        <div ref={sectionRef} className="why-content why-content-animated">
          <h2 className="why-title">Visual Arts</h2>

          <p className="why-text">
            This program uses <span>visual arts</span> as a powerful tool for self-expression,
            emotional healing, and personal development for refugees in Kakuma Refugee Camp.
            Through participatory activities such as <span>drawing, painting, and creative crafts</span>,
            participants are encouraged to explore their inner experiences and communicate
            thoughts and feelings that may be difficult to articulate through words alone.
          </p>

          <p className="why-text">
            <span>
              Art-making provides a safe, non-judgmental space where individuals can reflect,
              create, and connect with themselves and others.
            </span>{" "}
            Research shows that engaging in visual art can help individuals express emotions,
            build confidence, and improve emotional regulation and well-being.
          </p>
        </div>
      </div>
    </section>
  );
}

export default VisualArts;