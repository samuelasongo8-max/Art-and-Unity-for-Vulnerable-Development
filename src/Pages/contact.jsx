import { Trans, useTranslation } from "react-i18next";
import ImpactHero from "../components/ImpactHero";
import "./contact.css";
import ContactForm from "../components/ContactForm";

/* Contact page — layout and styling only. Every word, link, and the map
   embed is unchanged. No photo hero existed, so the hero is the shared
   ImpactHero with a solid navy background carrying this page's own H1 and
   intro paragraph. */
const Contact = () => {
  const { t } = useTranslation();

  return (
    <section className="contact-page">
      <div className="contact-hero-bleed">
        <ImpactHero
          label={t("contact.hero.label")}
          heading={t("contact.hero.heading")}
          paragraph={t("contact.hero.paragraph")}
        />
      </div>
      <div className="contact-layout">
        <div className="contact-intro-panel">
          <div className="contact-intro-copy">
            {/* These two paragraphs contain inline markup, so they use <Trans>:
                the whole sentence is translated as one unit and the original
                spans stay exactly where they were. */}
            <p className="contact-primary-note">
              <Trans
                i18nKey="contact.intro.note"
                components={{
                  blueOne: <span className="contact-highlight-blue" />,
                  blueTwo: <span className="contact-highlight-blue" />,
                }}
              />
            </p>

            <div className="contact-primary-copy">
              <p className="contact-primary-story">
                <Trans
                  i18nKey="contact.intro.storyOne"
                  components={{
                    lead: <span className="contact-primary-story__lead" />,
                  }}
                />
              </p>
              <p className="contact-primary-story">{t("contact.intro.storyTwo")}</p>
              <p className="contact-primary-story">{t("contact.intro.storyThree")}</p>
              <p className="contact-primary-story">{t("contact.intro.storyFour")}</p>
              <p className="contact-primary-story">{t("contact.intro.storyFive")}</p>
            </div>
          </div>

          <div className="contact-methods" aria-label={t("contact.methods.label")}>
            <a className="contact-method-card" href="mailto:artandunityforvulnerable.org@gmail.com">
              <span className="contact-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.1-.25 6.33 4.84a1 1 0 0 0 1.14 0L18.9 6.5H5.1Zm13.4 2.02-5.32 4.06a3 3 0 0 1-3.64 0L4.5 8.52v8.73c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V8.52Z" fill="currentColor" />
                </svg>
              </span>
              <span className="contact-method-content">
                <strong>{t("contact.methods.email")}</strong>
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
                <strong>{t("contact.methods.phone")}</strong>
                <span>(+254) 784062882</span>
                <span>(+254) 102930604</span>
              </span>
            </a>

            <div className="contact-method-card" role="group" aria-label={t("contact.methods.locationLabel")}>
              <span className="contact-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 2.5a7 7 0 0 1 7 7c0 4.91-5.05 10.44-6.46 11.88a.75.75 0 0 1-1.08 0C10.05 19.94 5 14.41 5 9.5a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" fill="currentColor" />
                </svg>
              </span>
              <span className="contact-method-content">
                <strong>{t("contact.methods.location")}</strong>
                <span>{t("contact.methods.locationValue")}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="contact-form-shell">
          <ContactForm />
        </div>
      </div>

      <div className="contact-map-shell">
        <div className="contact-map-section">
          <div className="contact-map-card">
            <div className="contact-map-frame-wrapper">
              <iframe
                className="contact-map-frame"
                title={t("contact.mapTitle")}
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
