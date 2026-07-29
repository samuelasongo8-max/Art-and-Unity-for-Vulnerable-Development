import "./TherapeuticApproach.css";
import { Link } from "react-router-dom";
import useRevealClass from "../../hooks/useRevealClass";

function TherapeuticApproach() {
  const sectionRef = useRevealClass("impact-ngo-entered", 0.24);

  return (
    <section
      ref={sectionRef}
      className="impact-ngo-section impact-ngo-animated programs-section"
      aria-labelledby="impact-ngo-programs-title"
    >


    
      <div className="impact-ngo-content programs-header">
     
        <h3 id="impact-ngo-programs-title" className="impact-ngo-title">
          Art as Therapy and Social-Emotional Learning at AUVD in Kakuma
        </h3>
         
      </div>
      

      <div className="programs-grid" role="list">
        <article className="program-card" role="listitem">
          <div className="program-image">
            <img src="/together1.jpg" alt="Group art activity at AUVD" />
          </div>
          <div className="program-card-body">

            <h4 className="program-title">Art as Therapy and Social-Emotional Learning</h4>
            <p className="card-description">
              This program is designed to support refugees in Kakuma Refugee Camp by using creative
              expression as a powerful tool for emotional well-being, personal development, and
              social connection. Through music, visual arts, and storytelling, participants reconnect
              with their identities and build resilience.
            </p>
            <Link to="/Music" className="btn-read-more">Explore More</Link>
          </div>
        </article>

        <article className="program-card" role="listitem">
          <div className="program-image">
            <img src="/kakuma6.jpg" alt="Limited resources for arts in Kakuma" />
          </div>
          <div className="program-card-body">
            <span
  className="badge"
  style={{
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: 0
  }}
>
   Challenges
</span>
            <h4 className="program-title">Limited Arts Opportunities in Kakuma</h4>
            <p className="card-description">
              Many children and young people in Kakuma Refugee Camp have little or no access to
              structured arts education, creative spaces, or professional mentorship. This limits
              opportunities for self-expression, talent development, and emotional healing.
            </p>
            <Link to="/Music" className="btn-read-more">Explore More</Link>
          </div>
        </article>

        <article className="program-card" role="listitem">
          <div className="program-image stacked-images">
            <img src="/9.png" alt="Art for healing activity 1" />
            <img src="/refugees.jpg" alt="Art for healing activity 2" />
            <img src="/together6.jpg" alt="Art for healing activity 3" />
          </div>
          <div className="program-card-body">
<span
  className="badge"
  style={{
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: 0
  }}
>
  Impact
</span>
            <h4 className="program-title">Art for Healing</h4>
            <p className="card-description">
              Creative activities such as music, painting, dance, and storytelling provide safe
              spaces where refugees can process difficult experiences, improve mental well-being,
              rebuild confidence, and create stronger community connections through artistic expression.
            </p>
            <Link to="/events" className="btn-read-more">Explore More</Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export default TherapeuticApproach;