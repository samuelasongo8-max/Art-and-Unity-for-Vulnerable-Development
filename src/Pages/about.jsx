import { useEffect, useRef } from "react";
import { FaBullseye, FaEye, FaHandsHoldingCircle, FaPeopleGroup, FaSeedling } from "react-icons/fa6";
import ImpactHero from "../components/ImpactHero";
import "../components/ImpactSections.css";
import "./about.css";

/* About page — every word, link and image is unchanged.
   The hero is the shared ImpactHero (the same design as Our Story, Work,
   Pricing, Events and Our Impact) carrying this page's own heading, paragraph,
   photo and Founded panel; the sections below follow the Our Impact band
   pattern already used by Visual Arts / VET / Our Impact: a small bold label
   (no rule under it), a Bebas Neue title, Source Sans 3 body copy and two
   columns wherever there is an image. */

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

/* The two photos this page's Mission slideshow already used, kept on the page
   side by side under the Mission / Vision cards. */
const missionImages = [
  { src: "/Upcoming project 1 (1).jpg", alt: "Mission" },
  { src: "/AUVD.education.jpg", alt: "Vision" },
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

        sectionElement.classList.add("about-text-reveal-entered");
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-page">
      {/* HERO — the shared full-bleed hero: photo behind the fixed nav at the
          very top of the page, dark gradient overlay, Anton heading, Roboto
          copy. This page has no hero button, so none is rendered. */}
      <div className="about-hero-bleed">
        <ImpactHero
          heading="Creative empowerment for vulnerable communities in Kakuma."
          paragraph="Art and Unity for Vulnerable Development (AUVD) is a nonprofit community-based and refugee-led organization working in Kakuma Refugee Camp, Kenya. Since 2022, AUVD has supported refugees, women, youth, children, and persons with disabilities through arts, skills development, and inclusive community programs."
          image="/together1.jpg"
          imageAlt="Community gathering in Kakuma"
          factCard={{
            label: "Founded",
            value: "2022",
            caption:
              "Formally registered in 2025 to expand healing, education, and livelihoods support.",
          }}
        />
      </div>
      {/* MISSION & VISION — two short statements side by side as two clean
          cards: label above, statement below, equal widths, one per row on
          mobile. Not the two-column image layout. The two photos this section
          already used stay on the page, side by side under the cards. */}
      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <div className="about-mv-grid">
            <article className="about-mv-card">
              <div className="about-mv-icon" aria-hidden="true">
                <FaBullseye />
              </div>
              <p className="auvd-story-label">OUR MISSION</p>
              <p className="about-mv-text">
                Empower vulnerable communities through creative arts, inclusive education,
                psychosocial support and sustainable development opportunities.
              </p>
            </article>

            <article className="about-mv-card">
              <div className="about-mv-icon" aria-hidden="true">
                <FaEye />
              </div>
              <p className="auvd-story-label">OUR VISION</p>
              <p className="about-mv-text">
                A peaceful and inclusive community where vulnerable individuals thrive through art,
                education, dignity and sustainable livelihoods.
              </p>
            </article>
          </div>

          <div className="about-mv-strip">
            {missionImages.map((image) => (
              <img
                key={image.src}
                className="about-mv-strip-item"
                src={image.src}
                alt={image.alt}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE — this section has no photo, so the title takes the
          narrower left column and the two paragraphs the right one. */}
      <section className="auvd-story-section">
        <div className="auvd-story-container">
          <p className="auvd-story-label">Who We Are</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">
              Building hope through art, learning, and community action.
            </h2>
            <div ref={aboutStoryCopyRef} className="auvd-story-text about-text-reveal">
              <p>
                AUVD was established in response to the social and economic challenges faced by
                displaced and marginalized populations in Kakuma Refugee Camp and surrounding host
                communities. We believe art and creativity are powerful tools for healing,
                empowerment, education, and social transformation.
              </p>
              <p>
                Through music, dance, visual arts, and community development programs, AUVD creates
                safe spaces where people can develop confidence, strengthen their well-being, and
                build pathways toward greater social and economic inclusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR GOAL — the same two-column pattern, again with no photo, so the
          title sits in the narrower left column. */}
      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <div className="about-label-row">
            <div className="about-goal-icon" aria-hidden="true">
              <FaHandsHoldingCircle />
            </div>
            <p className="auvd-story-label">Our Goal</p>
          </div>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">
              Resilient and empowered communities
            </h2>
            <div className="auvd-story-text">
              <p>
                Our goal is to create resilient and empowered vulnerable populations in Kakuma
                Refugee Camp and host communities by improving mental well-being, strengthening
                livelihood skills, and expanding opportunities for economic and social inclusion
                through arts-based training and community development programs.
              </p>
              <p>
                AUVD remains committed to promoting dignity, creativity, equality, and peaceful
                coexistence among diverse communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TARGET BENEFICIARIES — this section has a photo (the page's existing
          six-image gallery), so it uses the two-column layout: gallery on the
          left, title, intro and beneficiary list in the text column. */}
      <section className="auvd-story-section">
        <div className="auvd-story-container">
          <p className="auvd-story-label">Target Beneficiaries</p>
          <div className="auvd-story-body">
            <div
              className="auvd-story-gallery auvd-story-gallery--single about-beneficiary-gallery"
              aria-label="AUVD beneficiary gallery"
            >
              {beneficiaryImages.map((image, index) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  className="about-beneficiary-slide"
                  style={{ animationDelay: `${index * 5}s` }}
                />
              ))}
            </div>

            <div className="auvd-story-text">
              <h2 className="auvd-story-title">Who We Serve</h2>
              <p>
                AUVD programs are designed to meet people where they are and strengthen dignity,
                healing, inclusion, and opportunity across the community.
              </p>

              <ul className="about-beneficiary-list">
                {beneficiaries.map((item, index) => (
                  <li key={item} className="about-beneficiary-item">
                    <span className="about-beneficiary-icon" aria-hidden="true">
                      {index % 2 === 0 ? <FaPeopleGroup /> : <FaSeedling />}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default EducationAccess;
