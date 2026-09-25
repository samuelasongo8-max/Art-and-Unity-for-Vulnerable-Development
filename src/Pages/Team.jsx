import { useState } from "react";
import "./Team.css";

/* Leadership + support rosters — every name, role and photo kept exactly as
   previously listed, except Samuel Asongo's photo which now uses the new
   "Samuel Asongo image.png" file. No bios exist in the source data, so none
   are invented or rendered. Order is unchanged. */
const leadershipTeam = [
  {
    name: "Samuel Asongo",
    role: "Chairperson",
    image: "/Samuel Asongo image.png",
  },
  {
    name: "Matayo Bilibwa",
    role: "Vice Chairperson",
    image: "/bilbwa.png",
  },
  {
    name: "Kamikazi Rehema",
    role: "Treasurer",
    image: "/kamikazi Rehema.png",
  },
  {
    name: "Ngena Jeanne",
    role: "Secretary",
    image: "/Ngena jeanne.png",
  },
  {
    name: "Silva Yembo Mutenga",
    role: "Vice Secretary",
    image: "/Silva yembo mutenga.png",
  },
  {
    name: "Bandulela Bwami",
    role: "Logistics Coordinator",
    image: "/bandulela.png",
  },
];

const supportTeam = [
  {
    name: "Nathanael Ndarabu",
    role: "Member",
    image: "/ndarabu.jpg",
  },
  {
    name: "Kiza Husseine",
    role: "Member",
    image: "/kiza.jpg",
  },
  {
    name: "mathiew abekyamwale",
    role: "Volunteer",
    image: "/mathiew abekyamwale.png",
  },
  {
    name: "Washakema Gilbert",
    role: "Volunteer",
    image: "/Khalfa.jpg",
  },
  {
    name: "Neema Wobenga",
    role: "Volunteer",
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
  const [imageFailed, setImageFailed] = useState(false);
  const initials = initialsFor(member.name);

  return (
    <article className="team-card" aria-label={`${member.name}, ${member.role}`}>
      {imageFailed ? (
        <div className="team-image-fallback" aria-hidden="true">
          <span>{initials}</span>
        </div>
      ) : (
        <img
          className="team-photo"
          src={member.image}
          alt={member.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="team-card-body">
        <h3 className="team-name">{member.name}</h3>
        <p className="team-role">{member.role}</p>
        {member.name === "Samuel Asongo" && (
          <a
            className="team-portfolio-link"
            href="https://samuel-portiforlio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Portfolio
          </a>
        )}
      </div>
    </article>
  );
}

function Team() {
  return (
    <main className="auvd-team-page">
      {/* Simple page header (this page has no photo hero): small label, then
          the page's existing title in Bebas Neue, then its existing intro
          paragraph in Source Sans 3. No new copy invented. */}
      <header className="team-page-header">
        <p className="team-page-label">Leadership</p>
        <h1 className="team-page-title">Leadership Team</h1>
        <p className="team-page-intro">
          AUVD is led by community organizers committed to dignity, accountability, and
          practical support for vulnerable communities in Kakuma.
        </p>
      </header>

      <section className="team-section" aria-label="Leadership Team">
        <p className="team-section-text team-section-text--lead">
          This leadership team provides direction, accountability, and day-to-day coordination
          for AUVD programs.
        </p>

        <div className="team-grid">
          {leadershipTeam.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      <section className="team-section support-section" aria-labelledby="support-team-heading">
        <div className="team-section-heading">
          <p className="team-section-kicker">Members &amp; Volunteers</p>
          <h2 className="team-section-title" id="support-team-heading">
            Support Team
          </h2>
          <p className="team-section-text">
            Additional members and volunteers who support AUVD programs and community work.
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
