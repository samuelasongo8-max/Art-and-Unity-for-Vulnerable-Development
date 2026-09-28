import { useTranslation } from "react-i18next";
import "./TherapeuticApproach.css";
import { Link } from "react-router-dom";
import useRevealClass from "../../hooks/useRevealClass";

/* The three program cards share one shape, so their text lives in one keyed
   list that is resolved with t() on every render — switching language
   updates all three cards immediately. */
const programCards = [
  {
    key: "cardOne",
    image: "/together1.jpg",
  },
  {
    key: "cardTwo",
    image: "/kakuma6.jpg",
  },
  {
    key: "cardThree",
    image: "/refugees.jpg",
  },
];

function TherapeuticApproach() {
  const { t } = useTranslation();
  const sectionRef = useRevealClass("impact-ngo-entered", 0.24);

  return (
    <section
      ref={sectionRef}
      className="programs-section impact-ngo-animated"
    >
      <div className="impact-ngo-content programs-header">
        <h3 className="impact-ngo-title">
          {t("home.programs.title")}
        </h3>
      </div>

      <div className="programs-grid">

        {programCards.map((card) => (
          <article className="program-card" key={card.key}>

            <div className="program-image">
              <img
                src={card.image}
                alt={t(`home.programs.${card.key}.alt`)}
              />
            </div>

            <div className="program-card-body">

              <div className="card-top">

                <span className="program-badge">
                  {t(`home.programs.${card.key}.badge`)}
                </span>

                <span className="program-date">
                  {t(`home.programs.${card.key}.meta`)}
                </span>

              </div>

              <h3 className="program-title">
                {t(`home.programs.${card.key}.title`)}
              </h3>

              <p className="card-description">
                {t(`home.programs.${card.key}.text`)}
              </p>

              <Link
                to="/Music"
                className="btn-read-more"
              >
                {t("home.programs.readMore")}
              </Link>

            </div>

          </article>
        ))}

      </div>
    </section>
  );
}

export default TherapeuticApproach;
