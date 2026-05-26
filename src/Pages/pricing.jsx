import React, { useEffect, useRef, useState } from "react";
import "./pricing.css";
import speakers from "../assets/speakers.webp";

const educationHeroImages = ["/Education1.jpg", "/Education2.jpg"];

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
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const heroImpactRef = useRef(null);
  const approachContainerRef = useRef(null);
  const expectedImpactRef = useRef(null);
  const animatedEducationCardRefs = useRef([]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHeroImage((currentImage) =>
        currentImage === educationHeroImages.length - 1 ? 0 : currentImage + 1
      );
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const animatedCards = [
      heroImpactRef.current,
      approachContainerRef.current,
      expectedImpactRef.current,
      ...animatedEducationCardRefs.current.filter(Boolean),
    ].filter(Boolean);

    const observers = animatedCards.map((card) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }

          card.classList.add(
            card === heroImpactRef.current
              ? "impact-right-entered"
              : card === approachContainerRef.current
                ? "approach-container-entered"
                : card === expectedImpactRef.current
                  ? "impact-container-entered"
                : "education-card-entered"
          );
          observer.unobserve(card);
        },
        {
          threshold: 0.35,
        }
      );

      observer.observe(card);
      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll("[data-pricing-reveal]"));

    if (!revealElements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.22,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pricing-container">
      <section className="education-hero">
        <div className="education-hero-media" aria-hidden="true">
          {educationHeroImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt=""
              className={`education-hero-image${index === activeHeroImage ? " is-active" : ""}`}
            />
          ))}
        </div>

        <div ref={heroImpactRef} className="education-hero-copy impact-right-animated">
          <p className="impact-subtitle">Education Program</p>
          <h1 className="impact-title">Inclusive Learning for All</h1>
          <p className="impact-description">
            We support inclusive and quality learning for vulnerable children and youth in Kakuma
            Refugee Camp and nearby host communities. Through education, creativity, and community
            support, we help reduce dropout rates and improve learning outcomes for all.
          </p>
        </div>
      </section>

      <section className="education-focus-section">
        <div className="education-focus-header pricing-reveal pricing-reveal-up" data-pricing-reveal>
          <p className="section-label">What We Do</p>
          <h2 className="section-title">How AUVD strengthens education access</h2>
          <p className="section-intro">
            We work closely with learners, families, schools, and communities to remove barriers to
            education and help children and youth build both academic and life skills.
          </p>
        </div>

        <div className="education-grid">
          {educationFocusAreas.map((item, index) => (
            <article
              ref={(element) => {
                if (index < 6) {
                  animatedEducationCardRefs.current[index] = element;
                }
              }}
              className={`education-card${index < 6 ? " education-card-animated" : ""}`}
              key={item.title}
            >
              <div className="education-card-media">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="education-card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="approach-section">
      <div ref={approachContainerRef} className="approach-container approach-container-animated">
        <h2 className="approach-title">Our Approach</h2>
        <p className="approach-intro">
          We deliver our programs through:
        </p>

        <ul className="approach-list">
          {approachItems.map((item, index) => (
            <li
              key={item}
              className="pricing-reveal pricing-reveal-up"
              data-pricing-reveal
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
 
      <section className="impact-section">
      <div className="impact-layout">
        <div ref={expectedImpactRef} className="impact-container impact-container--split impact-container-animated">
          <div className="impact-copy-block">
            <h2 className="impact-title">Expected Impact</h2>

            <ul className="impact-list">
              {impactItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="impact-image-panel pricing-reveal pricing-reveal-right" data-pricing-reveal>
          <img
            src="/education.jpg"
            alt="African school girls studying with books"
            className="impact-study-image"
          />
        </div>
      </div>
    </section>
    </div>
  );
};

export default Pricing;