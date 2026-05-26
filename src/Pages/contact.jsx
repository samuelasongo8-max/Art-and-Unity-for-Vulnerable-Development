import { useEffect } from "react";

import "./Contact.css";
import ContactForm from "../components/ContactForm";

const Contact = () => {
  useEffect(() => {
    const revealedElements = Array.from(document.querySelectorAll("[data-contact-reveal]"));

    if (revealedElements.length === 0) {
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
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="contact-page">
      <div className="contact-primary-shell contact-reveal contact-reveal-up" data-contact-reveal>
        <div className="container contact-primary-section">
          <div className="contact-intro-panel contact-reveal contact-reveal-left" data-contact-reveal>
            <div className="contact-intro-copy">
              <p className="contact-primary-note">
                <span className="contact-highlight-blue">For individuals who wish to connect with AUVD,</span> please reach out via email <span className="contact-highlight-blue">at artandunityforvulnerable.org@gmail.com. We will get back to you within 48 hours.</span>
              </p>

              <h1 className="contact-primary-title">Partnership Inquiry Form</h1>

              <div className="contact-primary-copy">
                <p className="contact-primary-story">
                  <span className="contact-primary-story__lead">We</span> invite organizations, foundations, donors, and partners who share our vision of empowering vulnerable communities to collaborate with AUVD in creating meaningful and lasting impact in Kakuma Refugee Camp and surrounding host communities.
                </p>
                <p className="contact-primary-story">
                  Through partnership and support, AUVD can expand its programs in creative arts, mental health and psychosocial support, youth empowerment, education, women&apos;s empowerment, livelihood development, peacebuilding, and humanitarian outreach initiatives such as shoes distribution programs implemented in partnership with Because International.
                </p>
                <p className="contact-primary-story">
                  Your collaboration will help us create safe, inclusive, and empowering spaces where refugees, women, youth, children, and persons with disabilities can express themselves, develop skills, strengthen resilience, and access opportunities for personal and community growth.
                </p>
                <p className="contact-primary-story">
                  Together, we can promote dignity, creativity, peaceful coexistence, and sustainable development while transforming lives through community-driven solutions.
                </p>
                <p className="contact-primary-story">
                  We welcome opportunities to work together in building stronger, more resilient, and empowered communities.
                </p>
              </div>
            </div>

            <div className="contact-methods" aria-label="AUVD contact information">
              <a className="contact-method-card" href="mailto:artandunityforvulnerable.org@gmail.com">
                <span className="contact-method-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.1-.25 6.33 4.84a1 1 0 0 0 1.14 0L18.9 6.5H5.1Zm13.4 2.02-5.32 4.06a3 3 0 0 1-3.64 0L4.5 8.52v8.73c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V8.52Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="contact-method-content">
                  <strong>Email</strong>
                  <span>artandunityforvulnerable.org@gmail.com</span>
                </span>
              </a>

              <a className="contact-method-card" href="tel:+254784062882">
                <span className="contact-method-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M6.62 3.5c.4 0 .76.25.91.63l1.13 2.82c.12.3.08.64-.1.91l-1.38 2.23a14.7 14.7 0 0 0 6.73 6.73l2.23-1.38c.27-.18.61-.22.91-.1l2.82 1.13c.38.15.63.51.63.91v2.12A1.5 1.5 0 0 1 19 22C9.61 22 2 14.39 2 5a1.5 1.5 0 0 1 1.5-1.5h3.12Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="contact-method-content">
                  <strong>Phone</strong>
                  <span>(+254) 784062882</span>
                  <span>(+254) 102930604</span>
                </span>
              </a>

              <div className="contact-method-card" role="group" aria-label="AUVD location">
                <span className="contact-method-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M12 2.5a7 7 0 0 1 7 7c0 4.91-5.05 10.44-6.46 11.88a.75.75 0 0 1-1.08 0C10.05 19.94 5 14.41 5 9.5a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="contact-method-content">
                  <strong>Location</strong>
                  <span>Kakuma Refugee Camp, Kenya</span>
                </span>
              </div>
            </div>
          </div>

          <div className="contact-primary-divider" aria-hidden="true">
            <span className="contact-primary-divider__line"></span>
            <span className="contact-primary-divider__arrow"></span>
          </div>

          <div
            className="contact-form-replacement-shell contact-reveal contact-reveal-right"
            data-contact-reveal
          >
            <ContactForm />
          </div>
        </div>
      </div>

      <div className="contact-map-shell contact-reveal contact-reveal-up" data-contact-reveal>
        <div className="contact-map-section">
          <div className="contact-map-card contact-reveal contact-reveal-up" data-contact-reveal>
            <div className="contact-map-frame-wrapper">
              <iframe
                className="contact-map-frame"
                title="Map showing Art and Unity for Vulnerable Development in Kakuma Refugee Camp"
                src="https://www.google.com/maps?q=Kakuma%20Refugee%20Camp%2C%20Kenya%2C%20Kakuma%202%20Block%202%2C%20Zone%201&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;