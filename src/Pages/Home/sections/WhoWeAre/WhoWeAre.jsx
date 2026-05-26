import "./WhoWeAre.css";

function WhoWeAre() {
  return (
    <section className="mann">
      <div className="welcome">
        <div className="welcome-header-band">
          <h2 className="walking-text who-we-are-title">
            {"Who  We  Are".split("").map((char, index) => (
              <span key={`${char}-${index}`}>{char}</span>
            ))}
          </h2>
        </div>

        <div className="welcome-story">
          <p className="welcome-kicker">About AUVD</p>
          <p className="welcome-lead">
            Art and Unity for Vulnerable Development (AUVD) is a nonprofit Community-Based
            Organization (CBO) and Refugee-Led Organization (RLO) based in Kakuma Refugee Camp,
            Kenya. Founded in 2022 and formally registered in 2025, AUVD works to empower
            vulnerable communities including refugees, women, youth, and persons with
            disabilities.
          </p>
          <p className="welcome-body">
            Our organization was created in response to the social and economic challenges faced by
            displaced populations. We believe that art and creativity are powerful tools for
            healing, education, and transformation.
          </p>
          <p className="welcome-body">
            Today, AUVD stands as a growing organization in Kakuma, dedicated to nurturing talent,
            promoting social cohesion, and advancing sustainable development.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhoWeAre;