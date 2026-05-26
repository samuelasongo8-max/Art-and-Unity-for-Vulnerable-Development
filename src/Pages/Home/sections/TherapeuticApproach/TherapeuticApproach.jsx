import "./TherapeuticApproach.css";
import useRevealClass from "../../hooks/useRevealClass";

function TherapeuticApproach() {
  const sectionRef = useRevealClass("impact-ngo-entered", 0.24);

  return (
    <section
      ref={sectionRef}
      className="impact-ngo-section impact-ngo-animated"
      aria-labelledby="impact-ngo-section-title"
    >
      <div className="impact-ngo-content">
        <h3 id="impact-ngo-section-title" className="impact-ngo-title">
          Within this program, we use creative expression as a therapeutic approach to:
        </h3>

        <h4 className="impact-ngo-subtitle">
          Creative expression that supports healing, confidence, and belonging
        </h4>

        <p className="impact-ngo-text">
          Creative expression is used intentionally to create safe, supportive spaces where
          children and youth can process difficult experiences, rebuild confidence, and grow
          through guided artistic activities.
        </p>

        <ul className="impact-ngo-list">
          {[
            "Support emotional healing and reduce stress.",
            "Encourage healthy expression of difficult feelings and personal experiences.",
            "Strengthen self-awareness, confidence, and emotional regulation.",
            "Foster social connection, empathy, and peer support.",
            "Restore hope, identity, and a stronger sense of belonging.",
          ].map((item, index) => (
            <li key={item}>
              <span className="impact-toggle-point-number">{index + 1}</span>
              <span className="impact-toggle-point-text">{item}</span>
            </li>
          ))}
        </ul>

        <p className="impact-ngo-summary">
          By integrating art with inclusive and participatory learning approaches, AUVD creates
          environments where marginalized children and youth feel valued, heard, and connected.
        </p>
      </div>

      <figure className="impact-ngo-media">
        <div className="impact-ngo-image-shell">
          <div className="impact-ngo-image-stack impact-ngo-image-stack-single">
            <img
              src="/together1.jpg"
              alt="Children and youth participating in a therapeutic group session"
              className="impact-ngo-image impact-ngo-image-slide impact-ngo-image-slide-primary"
            />
            <img
              src="/together2.jpg"
              alt="Creative expression activity with children and youth"
              className="impact-ngo-image impact-ngo-image-slide impact-ngo-image-slide-secondary"
            />
          </div>
        </div>
        <figcaption className="impact-ngo-caption">
          Creative healing sessions and community support moments in safe, structured spaces.
        </figcaption>
      </figure>
    </section>
  );
}

export default TherapeuticApproach;