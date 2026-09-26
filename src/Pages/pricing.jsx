import React from "react";
import ImpactHero from "../components/ImpactHero";
import "../components/ImpactSections.css";
import "./pricing.css";

const educationFocusAreas = [
  {
    title: "Access to Learning",
    image: "/Education2.jpg",
    description:
      "We focus on making education more accessible for children and young people who face barriers to learning, including those out of school or at risk of dropping out.",
  },
  {
    title: "Girls' Education & Retention",
    image: "/girls education.webp",
    description:
      "We support girls to stay in school by addressing challenges such as early marriage, poverty, and limited learning support.",
  },
  {
    title: "Boys' Learning & Participation",
    image: "/boyss.png",
    description:
      "We help boys stay engaged in school and improve their academic performance through mentorship, guidance, and positive participation.",
  },
  {
    title: "Safe & Inclusive Learning Spaces",
    image: "/education88.jpg",
    description:
      "We work to create safe, welcoming, and inclusive spaces for all learners, including children with disabilities.",
  },
  {
    title: "Reducing Dropout Rates",
    image: "/green.jpg",
    description:
      "We identify learners at risk of dropping out and provide support to help them remain in school or successfully return.",
  },
  {
    title: "Community-Based Education",
    image: "/parent.png",
    description:
      "We involve parents, teachers, and local leaders to build stronger community support systems around education.",
  },
];

const approachItems = [
  "Community learning spaces",
  "Creative learning through drama, music, storytelling, and art",
  "Mentorship and peer learning",
  "Partnerships with schools and community leaders",
  "Youth-led education activities",
];

const impactItems = [
  "More children staying in school",
  "Lower dropout rates",
  "Better learning outcomes",
  "Safer and more inclusive schools",
  "Stronger community support for education",
];

const Pricing = () => {
  return (
    <div className="pricing-container">
      {/* Full-bleed hero — the shared ImpactHero component (same design as
          Our Story), with this page's own label, heading, paragraph and
          photo. /Education2.jpg still appears in the grid below. */}
      <div className="pricing-hero-bleed">
        <ImpactHero
          label="Education Program"
          heading="Inclusive Learning for All"
        paragraph="We support inclusive and quality learning for vulnerable children and youth in Kakuma Refugee Camp and nearby host communities. Through education, creativity, and community support, we help reduce dropout rates and improve learning outcomes for all."
        image="/Education1.jpg"
        imageAlt="Children learning in a classroom"
      />
      </div>

      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <p className="auvd-story-label">Focus Areas</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">How AUVD strengthens education access</h2>
            <div className="auvd-story-text">
              <p>
                We work closely with learners, families, schools, and communities to remove
                barriers to education and help children and youth build both academic and life
                skills.
              </p>
            </div>
          </div>

          <div className="auvd-pricing-grid">
            {educationFocusAreas.map((item) => (
              <article className="auvd-pricing-card" key={item.title}>
                <div className="auvd-pricing-card-media">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="auvd-pricing-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="auvd-story-section auvd-story-section--orange">
        <div className="auvd-story-container">
          <p className="auvd-story-label">Our Approach</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">Our Approach</h2>
            <div className="auvd-story-text">
              <p>We deliver our programs through:</p>
              <ul className="auvd-pricing-list">
                {approachItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
 
      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <p className="auvd-story-label">Expected Impact</p>
          <div className="auvd-story-body">
            <div className="auvd-story-gallery auvd-story-gallery--single">
              <img
                className="auvd-story-gallery-item auvd-story-gallery-item--1"
                src="/education.jpg"
                alt="African school girls studying with books"
              />
            </div>
            <div className="auvd-story-text">
              <h2 className="auvd-story-title">Expected Impact</h2>
              <ul className="auvd-pricing-list">
                {impactItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;