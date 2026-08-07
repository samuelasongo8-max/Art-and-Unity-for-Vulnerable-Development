import "./TherapeuticApproach.css";
import { Link } from "react-router-dom";
import useRevealClass from "../../hooks/useRevealClass";

function TherapeuticApproach() {
  const sectionRef = useRevealClass("impact-ngo-entered", 0.24);

  return (
    <section
      ref={sectionRef}
      className="programs-section impact-ngo-animated"
    >
      <div className="impact-ngo-content programs-header">
        <h3 className="impact-ngo-title">
          Art as Therapy and Social-Emotional Learning at AUVD in Kakuma
        </h3>
      </div>

      <div className="programs-grid">

        {/* CARD 1 */}

        <article className="program-card">

          <div className="program-image">
            <img
              src="/together1.jpg"
              alt="Art Therapy"
            />
          </div>

          <div className="program-card-body">

            <div className="card-top">

              <span className="program-badge">
                Program
              </span>

              <span className="program-date">
                AUVD
              </span>

            </div>

            <h3 className="program-title">
              Art as Therapy and Social-Emotional Learning
            </h3>

            <p className="card-description">
              This program supports refugees through music,
              visual arts and storytelling, helping participants
              improve emotional well-being, confidence and
              resilience while strengthening community
              relationships.
            </p>

            <Link
              to="/Music"
              className="btn-read-more"
            >
              Read more →
            </Link>

          </div>

        </article>

        {/* CARD 2 */}

        <article className="program-card">

          <div className="program-image">
            <img
              src="/kakuma6.jpg"
              alt="Challenges"
            />
          </div>

          <div className="program-card-body">

            <div className="card-top">

              <span className="program-badge">
                Challenge
              </span>

              <span className="program-date">
                Kakuma
              </span>

            </div>

            <h3 className="program-title">
              Limited Arts Opportunities in Kakuma
            </h3>

            <p className="card-description">
              Many children and youth have little access to
              structured arts education, creative spaces and
              professional mentorship, reducing opportunities
              for healing, creativity and talent development.
            </p>

            <Link
              to="/Music"
              className="btn-read-more"
            >
              Read more →
            </Link>

          </div>

        </article>

        {/* CARD 3 */}

        <article className="program-card">

          <div className="program-image">
            <img
              src="/refugees.jpg"
              alt="Impact"
            />
          </div>

          <div className="program-card-body">

            <div className="card-top">

              <span className="program-badge">
                Impact
              </span>

              <span className="program-date">
                AUVD
              </span>

            </div>

            <h3 className="program-title">
              Art for Healing
            </h3>

            <p className="card-description">
              Music, painting, dance and storytelling create
              safe spaces where refugees process difficult
              experiences, improve mental well-being,
              rebuild confidence and strengthen social
              connections.
            </p>

            <Link
              to="/Music"
              className="btn-read-more"
            >
              Read more →
            </Link>

          </div>

        </article>

      </div>
    </section>
  );
}

export default TherapeuticApproach;