import { Link } from "react-router-dom";
import PageSeo from "../components/PageSeo";
import "./SamuelAsongo.css";

const SITE_URL = "https://art-and-unity-for-vulnerable-develo.vercel.app";
const SAMUEL_IMAGE = `${SITE_URL}/Samuel%20Asongo%20image.png`;

const samuelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/about/samuel-asongo#person`,
  name: "Samuel Asongo",
  url: `${SITE_URL}/about/samuel-asongo`,
  image: SAMUEL_IMAGE,
  jobTitle: "Founder, Chairperson & Chief Executive Officer (CEO)",
  description:
    "Samuel Asongo is the Founder, Chairperson and Chief Executive Officer (CEO) of Art and Unity for Vulnerable Development (AUVD), a refugee-led organization based in Kakuma Refugee Camp, Kenya.",
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
};

function SamuelAsongo() {
  return (
    <>
      <PageSeo
        title="Samuel Asongo – Founder, Chairperson & CEO | AUVD"
        description="Samuel Asongo is the Founder, Chairperson and Chief Executive Officer (CEO) of Art and Unity for Vulnerable Development (AUVD), a refugee-led organization based in Kakuma Refugee Camp, Kenya."
        canonicalPath="about/samuel-asongo"
        image="Samuel%20Asongo%20image.png"
        jsonLd={samuelJsonLd}
      />
      <main className="samuel-page">
        <header className="samuel-page-header">
          <p className="samuel-page-label">AUVD Leadership</p>
          <h1>Samuel Asongo – Founder, Chairperson &amp; Chief Executive Officer (CEO) of AUVD</h1>
          <p className="samuel-page-intro">
            Samuel Asongo is the Founder, Chairperson and Chief Executive Officer (CEO) of Art and
            Unity for Vulnerable Development (AUVD), a refugee-led organization working with refugees,
            youth, women, children and vulnerable communities in Kakuma Refugee Camp, Kenya.
          </p>
        </header>

        <div className="samuel-profile">
          <img
            className="samuel-profile-photo"
            src="/Samuel%20Asongo%20image.png"
            alt="Samuel Asongo, Founder, Chairperson and Chief Executive Officer of AUVD"
          />
          <div className="samuel-profile-content">
            <h2>AUVD founder and organizational leader</h2>
            <p>
              Samuel founded the initiative that became Art and Unity for Vulnerable Development
              (AUVD) in Kakuma Refugee Camp. His experience as a refugee and musician shaped the
              organization&apos;s mission of using creativity and art to support healing, dignity, and
              opportunity.
            </p>
            <p>
              AUVD began in 2022 and formally registered as a Community-Based Organization and
              Refugee-Led Organization in Kenya in 2025. The organization works through arts,
              education, youth development, livelihoods, and inclusive community programs.
            </p>
            <p className="samuel-profile-role">
              <strong>Official role:</strong> Founder | Chairperson &amp; Chief Executive Officer (CEO)
            </p>
            <div className="samuel-profile-links">
              <Link to="/about/team">Meet the AUVD leadership team</Link>
              <Link to="/our-impact/our-story">Read AUVD&apos;s story</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default SamuelAsongo;
