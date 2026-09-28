import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageSeo from "../components/PageSeo";
import "./SamuelAsongo.css";

const SITE_URL = "https://art-and-unity-for-vulnerable-develo.vercel.app";
const SAMUEL_IMAGE = `${SITE_URL}/Samuel%20Asongo%20image.png`;

/* The job title and description are descriptive phrases, so they follow the
   active language. The schema.org "name" fields below are the organization's
   official registered names and stay as written, because that is what search
   engines and other software match against. */
const buildJsonLd = (t) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/about/samuel-asongo#person`,
  name: "Samuel Asongo",
  url: `${SITE_URL}/about/samuel-asongo`,
  image: SAMUEL_IMAGE,
  jobTitle: t("samuel.roleValue"),
  description: t("samuel.description"),
  worksFor: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Art and Unity for Vulnerable Development",
    alternateName: "AUVD",
    url: `${SITE_URL}/`,
  },
  founderOf: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
  },
});

function SamuelAsongo() {
  const { t } = useTranslation();
  const samuelJsonLd = buildJsonLd(t);

  return (
    <>
      <PageSeo
        title={t("samuel.title")}
        description={t("samuel.description")}
        canonicalPath="about/samuel-asongo"
        image="Samuel%20Asongo%20image.png"
        jsonLd={samuelJsonLd}
      />
      <main className="samuel-page">
        <header className="samuel-page-header">
          <p className="samuel-page-label">{t("samuel.label")}</p>
          <h1>{t("samuel.heading")}</h1>
          <p className="samuel-page-intro">
            {t("samuel.intro")}
          </p>
        </header>

        <div className="samuel-profile">
          <img
            className="samuel-profile-photo"
            src="/Samuel%20Asongo%20image.png"
            alt={t("samuel.alt")}
          />
          <div className="samuel-profile-content">
            <h2>{t("samuel.profileTitle")}</h2>
            <p>{t("samuel.p1")}</p>
            <p>{t("samuel.p2")}</p>
            <p className="samuel-profile-role">
              <strong>{t("samuel.roleLabel")}</strong> {t("samuel.roleValue")}
            </p>
            <div className="samuel-profile-links">
              <Link to="/about/team">{t("samuel.meetTeam")}</Link>
              <Link to="/our-impact/our-story">{t("samuel.readStory")}</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default SamuelAsongo;
