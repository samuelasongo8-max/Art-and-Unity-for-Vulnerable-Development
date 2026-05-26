import React, { useEffect, useRef } from "react";
import { FaBullseye, FaEye, FaHandsHoldingCircle, FaPeopleGroup, FaSeedling } from "react-icons/fa6";
import "./About.css";

const beneficiaries = [
  "Refugees and displaced populations",
  "Women and girls",
  "Youth and children",
  "Persons with disabilities",
  "Host community members",
];

const beneficiaryImages = [
  { src: "/together1.jpg", alt: "Community gathering in Kakuma" },
  { src: "/class.jpg", alt: "Classroom learning activity" },
  { src: "/dance77.jpg", alt: "Dance activity with youth" },
  { src: "/Education1.jpg", alt: "Education support moment" },
  { src: "/education88.jpg", alt: "Students participating in education program" },
  { src: "/mental.jpg", alt: "Mental health and psychosocial support activity" },
];

const EducationAccess = () => {
  const aboutStoryCopyRef = useRef(null);

  useEffect(() => {
    const sectionElement = aboutStoryCopyRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("about-story-copy-entered");
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="about-kicker">About AUVD</p>
          <h1>Creative empowerment for vulnerable communities in Kakuma.</h1>
          <p className="about-intro">
            Art and Unity for Vulnerable Development (AUVD) is a nonprofit community-based and
            refugee-led organization working in Kakuma Refugee Camp, Kenya. Since 2022, AUVD has
            supported refugees, women, youth, children, and persons with disabilities through arts,
            skills development, and inclusive community programs.
          </p>
        </div>

        <div className="about-hero-panel">
          <p className="about-panel-label">Founded</p>
          <strong>2022</strong>
          <p>Formally registered in 2025 to expand healing, education, and livelihoods support.</p>
        </div>
      </section>

      <section className="mission-section">
        <div className="child mission-grid">
          <div className="mission card-accent-blue">
            <div className="about-card-icon">
              <FaBullseye />
            </div>
            <h2>Our Mission</h2>
            <p>
              Empower vulnerable communities through creative arts, inclusive education, psychosocial
              support, and sustainable development opportunities.
            </p>
          </div>

          <div className="vision card-accent-gold">
            <div className="about-card-icon">
              <FaEye />
            </div>
            <h2>Our Vision</h2>
            <p>
              A peaceful and inclusive community where vulnerable individuals thrive through art,
              education, dignity, and sustainable livelihoods.
            </p>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div ref={aboutStoryCopyRef} className="about-story-copy about-story-copy-animated">
          <p className="about-section-label">Who We Are</p>
          <h2>Building hope through art, learning, and community action.</h2>
          <p>
            AUVD was established in response to the social and economic challenges faced by displaced
            and marginalized populations in Kakuma Refugee Camp and surrounding host communities.
            We believe art and creativity are powerful tools for healing, empowerment, education,
            and social transformation.
          </p>
          <p>
            Through music, dance, visual arts, and community development programs, AUVD creates safe
            spaces where people can develop confidence, strengthen their well-being, and build pathways
            toward greater social and economic inclusion.
          </p>
        </div>

        <div className="about-goals-card">
          <div className="about-goal-header">
            <div className="about-card-icon about-card-icon-goal">
              <FaHandsHoldingCircle />
            </div>
            <p className="about-section-label">Our Goal</p>
          </div>
          <h3>Resilient and empowered communities</h3>
          <p>
            Our goal is to create resilient and empowered vulnerable populations in Kakuma Refugee Camp
            and host communities by improving mental well-being, strengthening livelihood skills, and
            expanding opportunities for economic and social inclusion through arts-based training and
            community development programs.
          </p>
          <p>
            AUVD remains committed to promoting dignity, creativity, equality, and peaceful coexistence
            among diverse communities.
          </p>
        </div>
      </section>

      <section className="why-container">
        <div className="why-wrapper">
          <div className="doctor-section">
            <div className="doctor-slideshow" aria-label="AUVD beneficiary gallery">
              {beneficiaryImages.map((image, index) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  className="doctor-slide"
                  style={{ animationDelay: `${index * 5}s` }}
                />
              ))}
            </div>
          </div>

          <div className="content-section">
            <p className="about-section-label">Target Beneficiaries</p>
            <h4>Who We Serve</h4>
            <p className="desc">
              AUVD programs are designed to meet people where they are and strengthen dignity,
              healing, inclusion, and opportunity across the community.
            </p>

            <div className="beneficiary-grid">
              {beneficiaries.map((item, index) => (
                <div key={item} className="feature feature-card">
                  <div className="icon beneficiary-icon">
                    {index % 2 === 0 ? <FaPeopleGroup /> : <FaSeedling />}
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default EducationAccess;
