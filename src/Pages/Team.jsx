import "./Team.css";

const leadershipTeam = [
  {
    name: "Samuel Asongo",
    role: "Chairperson",
    image: "/samuel.png",
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

function Team() {
  return (
    <section className="team-page">
      <div className="team-hero">
        <div className="team-hero-copy">
          <p className="team-intro">
            AUVD is led by community organizers committed to dignity, accountability, and
            practical support for vulnerable communities in Kakuma.
          </p>
        </div>
      </div>

      <section className="team-section">
        <div className="team-layout">
          <div className="team-leadership-panel">
            <div className="team-section-heading">
              <p className="team-section-kicker">Leadership</p>
              <h2>Leadership</h2>
              <p className="team-section-text">
                This leadership team provides direction, accountability, and day-to-day coordination
                for AUVD programs.
              </p>
            </div>

            <div className="team-list" role="list">
              {leadershipTeam.map((member) => (
                <article key={member.name} className="team-member-row" role="listitem">
                  <img src={member.image} alt={member.name} className="member-image" />
                  <div className="member-copy">
                    <h3>{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="team-side-column">
            <p className="team-side-kicker">Members & Volunteers</p>
            <h3>Support Team</h3>
            <p className="team-side-text">
              Additional members and volunteers who support AUVD programs and community work.
            </p>

            <div className="team-side-list" role="list">
              {supportTeam.map((member) => (
                <article key={member.name} className="team-side-row" role="listitem">
                  <img src={member.image} alt={member.name} className="team-side-image" />
                  <div className="team-side-copy">
                    <h4>{member.name}</h4>
                    <p>{member.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </section>
  );
}

export default Team;