import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Team.css";

/* Leadership + support rosters — every legitimate name and photo remains
   listed. Samuel Asongo's official role is shown in full; no unsupported
   biography is invented. Order is unchanged. */
const leadershipTeam = [
  {
    name: "Samuel Asongo",
    roleKey: "team.roles.founder",
    image: "/Samuel Asongo image.png",
  },
  {
    name: "Matayo Bilibwa",
    roleKey: "team.roles.viceChairperson",
    image: "/bilbwa.png",
  },
  {
    name: "Kamikazi Rehema",
    roleKey: "team.roles.treasurer",
    image: "/kamikazi Rehema.png",
  },
  {
    name: "Ngena Jeanne",
    roleKey: "team.roles.secretary",
    image: "/Ngena jeanne.png",
  },
  {
    name: "Silva Yembo Mutenga",
    roleKey: "team.roles.viceSecretary",
    image: "/Silva yembo mutenga.png",
  },
  {
    name: "Bandulela Bwami",
    roleKey: "team.roles.logistics",
    image: "/bandulela.png",
  },
];

const supportTeam = [
  {
    name: "Nathanael Ndarabu",
    roleKey: "team.roles.member",
    image: "/ndarabu.jpg",
  },
  {
    name: "Kiza Husseine",
    roleKey: "team.roles.member",
    image: "/kiza.jpg",
  },
  {
    name: "mathiew abekyamwale",
    roleKey: "team.roles.volunteer",
    image: "/mathiew abekyamwale.png",
  },
  {
    name: "Washakema Gilbert",
    roleKey: "team.roles.volunteer",
    image: "/Khalfa.jpg",
  },
  {
    name: "Neema Wobenga",
    roleKey: "team.roles.volunteer",
    image: "/Neema Wobenga.png",
  },
];

/* Initials for the neutral placeholder if a photo fails to load. */
function initialsFor(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function TeamCard({ member }) {
  const { t } = useTranslation();
  const [imageFailed, setImageFailed] = useState(false);
  const initials = initialsFor(member.name);
  const role = t(member.roleKey);

  return (
    <article className="team-card" aria-label={`${member.name}, ${role}`}>
      {imageFailed ? (
        <div className="team-image-fallback" aria-hidden="true">
          <span>{initials}</span>
        </div>
      ) : (
        <img
          className="team-photo"
          src={member.image}
          alt={`${member.name}, ${role} of AUVD`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="team-card-body">
        <h3 className="team-name">{member.name}</h3>
        <p className="team-role">{role}</p>
        {member.name === "Samuel Asongo" && (
          <>
            <Link className="team-portfolio-link" to="/about/samuel-asongo">
              {t("team.viewProfile")}
            </Link>
            <a
              className="team-portfolio-link"
              href="https://samuel-portiforlio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("team.viewPortfolio")}
            </a>
          </>
        )}
      </div>
    </article>
  );
}

function Team() {
  const { t } = useTranslation();

  return (
    <main className="auvd-team-page">
      {/* Simple page header (this page has no photo hero): small label, then
          the page's existing title in Bebas Neue, then its existing intro
          paragraph in Source Sans 3. No new copy invented. */}
      <header className="team-page-header">
        <p className="team-page-label">{t("team.label")}</p>
        <h1 className="team-page-title">{t("team.title")}</h1>
        <p className="team-page-intro">
          {t("team.intro")}
        </p>
      </header>

      <section className="team-section" aria-label={t("team.sectionLabel")}>
        <p className="team-section-text team-section-text--lead">
          {t("team.sectionText")}
        </p>

        <div className="team-grid">
          {leadershipTeam.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      <section className="team-section support-section" aria-labelledby="support-team-heading">
        <div className="team-section-heading">
          <p className="team-section-kicker">{t("team.supportKicker")}</p>
          <h2 className="team-section-title" id="support-team-heading">
            {t("team.supportTitle")}
          </h2>
          <p className="team-section-text">
            {t("team.supportText")}
          </p>
        </div>

        <div className="team-grid">
          {supportTeam.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Team;
