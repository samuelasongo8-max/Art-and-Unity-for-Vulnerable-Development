import ToggleSection from "../../../../components/ToggleSection";
import "./ProgramsToggleSection.css";

function ProgramsToggleSection() {
  return (
    <section className="program-toggle-section">
      <ToggleSection title="🎭 Art as Therapy and Social-Social Emotional Learning at AUVD in Kakuma Refugee Camp ">
        <div className="therapy-toggle-content">
          <p>
            In response to the unique challenges faced by refugee children and youth in Kakuma
            Refugee Camp, we have developed a holistic and <span>culturally responsive program</span>
            that integrates Social-Emotional Learning (SEL), creative arts therapy principles, and
            mindfulness practices within a trauma-informed framework.
          </p>
          <p>
            Our programs promote <strong>healing, unity, creativity, and sustainable development</strong>{" "}
            in marginalized communities.
          </p>

          <div className="therapy-toggle-gallery" aria-label="Emotional healing program images">
            <div className="therapy-toggle-gallery__frame">
              <img
                src="/emotional1.jpg"
                alt="Children participating in emotional healing activities"
                className="therapy-toggle-gallery__image therapy-toggle-gallery__image--1"
              />
              <img
                src="/emotional2.jpg"
                alt="Refugee youth in a supportive emotional learning session"
                className="therapy-toggle-gallery__image therapy-toggle-gallery__image--2"
              />
              <img
                src="/emotional3.jpg"
                alt="Creative therapy activity with children and youth"
                className="therapy-toggle-gallery__image therapy-toggle-gallery__image--3"
              />
              <img
                src="/emotional4.jpg"
                alt="Community healing and emotional support program moment"
                className="therapy-toggle-gallery__image therapy-toggle-gallery__image--4"
              />
            </div>
          </div>
        </div>
      </ToggleSection>

      <ToggleSection title="Limited Arts Opportunities in Kakuma">
        <div className="camp">
          <div className="content">
            <h1>Limited Art Opportunities in Kakuma Refugee Camp</h1>
            <div className="zigzag-wrapper">
              <svg className="zigzag-icon" viewBox="0 0 100 40">
                <polyline
                  points="5,30 20,10 35,30 50,10 65,30 80,10 95,30"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p>
              Despite the rich creativity and talent found within Kakuma Refugee Camp, many
              children, youth, women, and vulnerable individuals continue to face serious
              limitations in accessing artistic and creative opportunities. Resources, training
              spaces, mentorship, art materials, and platforms for creative growth remain
              extremely limited.
            </p>
            <p>
              Through our programs in Arts, Healing & Psychosocial Well-being, Education, Youth
              Development & Empowerment, Livelihoods & Women Economic Empowerment, Peacebuilding &
              Community Inclusion, and Humanitarian Outreach & Basic Needs Support, we aim to
              address these gaps by creating safe, inclusive, and empowering spaces for learning,
              creativity, healing, and community engagement.
            </p>
            <div className="divider"></div>
          </div>
        </div>
      </ToggleSection>
    </section>
  );
}

export default ProgramsToggleSection;