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
    <div className="auvd-team-page">
      <div className="team-hero">
        <div className="team-hero-copy">
        <br></br>
        <br></br>
        <br></br>
          <p className="team-intro">
            AUVD is led by community organizers committed to dignity, accountability, and
            practical support for vulnerable communities in Kakuma.
          </p>
        </div>
      </div>

      <section className="team-section">
        <div className="team-section-heading">
          <p className="team-section-kicker">Leadership</p>
          <h2>Leadership Team</h2>
          <p className="team-section-text">
            This leadership team provides direction, accountability, and day-to-day coordination
            for AUVD programs.
          </p>
        </div>

        <div className="team-grid" role="list">
          {leadershipTeam.map((member) => (
            <div className="team-card" key={member.name} role="listitem">
              <a href="#profile" className="team-image-wrapper">
                <img src={member.image} alt={member.name} />
                <div className="team-arrow-btn">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              </a>
              <h3 className="team-name">{member.name}</h3>
              <span className="team-role">{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section support-section">
        <div className="team-section-heading">
          <p className="team-section-kicker">Members & Volunteers</p>
          <h2>Support Team</h2>
          <p className="team-section-text">
            Additional members and volunteers who support AUVD programs and community work.
          </p>
        </div>

        <div className="team-grid" role="list">
          {supportTeam.map((member) => (
            <div className="team-card" key={member.name} role="listitem">
              <a href="#profile" className="team-image-wrapper">
                <img src={member.image} alt={member.name} />
                <div className="team-arrow-btn">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              </a>
              <h3 className="team-name">{member.name}</h3>
              <span className="team-role">{member.role}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Team;