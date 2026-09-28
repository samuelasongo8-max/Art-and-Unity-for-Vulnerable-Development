import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./ImpactAll.css";

const ImpactAll = () => {
  const { t } = useTranslation();

  return (
    <>
    <section className="impact-hero">
        <br />
            <br />
                <br />
                    <br />
                        <br />
                            <br />
                                <br />
                                    
    <br />
      <img
        src="/donation-2.jpg"
        alt={t("impact.all.heroAlt")}
        className="impact-bg-image"
      />
      <div className="impact-overlay"></div>
      <div className="impact-content">
        <div className="impact-text">
         
          <h1>
            {/* The italic run inside this heading is inline markup, so <Trans>
                keeps the emphasis while the sentence itself is translated. */}
            <Trans i18nKey="impact.all.heroTitle" components={{ em: <em /> }} />
          </h1>
           <br></br>
                <br></br>
          <p>
            {t("impact.all.heroP1")}
          </p>
            {t("impact.all.heroP2")}
          <br></br>
             <br></br>
            
            {t("impact.all.heroP3")}
               <br></br>
             <br></br>
          <div className="impact-buttons">
            <Link to="/donate" className="btn btn-primary">
              {t("impact.all.supportButton")} <span className="arrow">→</span>
            </Link>
            
          </div>
        </div>
      </div>
          <br></br>
              <br></br>
                  <br></br>
                     
    </section>

    <br></br>
    

     <section className="auvd-music-donation-section">
      <div className="auvd-music-donation-container">

        {/* LEFT — IMAGE */}
        <div className="auvd-music-donation-image">
          <img
            src="/donation-5.jpg"
            alt={t("impact.all.sectionOne.alt")}
          />
        </div>

        {/* RIGHT — CONTENT */}
        <div className="auvd-music-donation-content">

          <span className="auvd-music-donation-label">
            {t("impact.all.sectionOne.label")}
          </span>
          
          <h2>
            {t("impact.all.sectionOne.titleBefore")} <span>{t("impact.all.sectionOne.titleAfter")}</span>
          </h2>

          <div className="auvd-music-donation-line"></div>

          <p className="auvd-music-donation-intro">
            {t("impact.all.sectionOne.intro")}
          </p>

          {/* These paragraphs carry bold partner / figure names, so <Trans>
              translates the whole sentence and keeps the <strong> runs. */}
          <p>
            <Trans
              i18nKey="impact.all.sectionOne.p1"
              components={{
                partner: <strong />,
                figure: <strong />,
              }}
            />
          </p>
    
          <p>
            <Trans
              i18nKey="impact.all.sectionOne.p2"
              components={{ program: <strong /> }}
            />
          </p>
             
          <a
            href="/donate"
            className="auvd-music-donation-button"
          >
            {t("common.donateToday")}
            <span>→</span>
          </a>

        </div>
      </div>
    </section>
    <section className="auvd-music-donation-right-section">
  <div className="auvd-music-donation-right-container">

    {/* LEFT — CONTENT */}
    <div className="auvd-music-donation-right-content">

      <span className="auvd-music-donation-right-label">
        {t("impact.all.sectionTwo.label")}
      </span>

      <h2>
        {t("impact.all.sectionTwo.titleBefore")} <span>{t("impact.all.sectionTwo.titleAfter")}</span>
      </h2>

      <div className="auvd-music-donation-right-line"></div>

      <p className="auvd-music-donation-right-intro">
        {t("impact.all.sectionTwo.intro")}
      </p>
 
      <p>
        <Trans
          i18nKey="impact.all.sectionTwo.p"
          components={{
            shipped: <strong />,
            more: <strong />,
          }}
        />
      </p>

      <a
        href="/donate"
        className="auvd-music-donation-right-button"
      >
        {t("common.donateToday")}
        <span>→</span>
      </a>

    </div>

    {/* RIGHT — IMAGE */}
    <div className="auvd-music-donation-right-image">
      <img
        src="/donation-4.jpg"
        alt={t("impact.all.sectionTwo.alt")}
      />
    </div>

  </div>
</section>
<br></br>
    </>
  );
};

export default ImpactAll;
