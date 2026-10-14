import { Link } from "react-router-dom";
import "./GetInvolved.css";

/* ==========================================================================
   Get Involved (/impact/get-involved) — the source project's Get Involved
   page design, re-skinned with the target palette. Every class is prefixed
   `p1-getinvolved-` so nothing collides with the rest of the target.

   Layout (copied from the source): a white header (breadcrumb, uppercase
   Oswald heading, short blue rule, intro) above a list of split rows. The
   first involvement (Donate) is a full image-left / text-right row; the rest
   are text-only cards in a responsive grid (3 → 2 → 1).

   Content uses ONLY facts already in this project (Kakuma Refugee Camp,
   vulnerable girls / teenage mothers / young women, education and skills
   training programmes). No invented numbers, partners or dates.
   ========================================================================== */

/* The involvement cards. `to` points at the target's real pages:
   Donate has its own page; Volunteer / Membership / Mentor / Partner have no
   dedicated page here, so they fall back to /contact rather than a dead route. */
const involvement = [
  {
    title: "Donate",
    summary:
      "Your gift funds education, skills training and dignity programmes for vulnerable girls, teenage mothers and young women in Kakuma Refugee Camp.",
    to: "/donate",
  },
  {
    title: "Volunteer",
    summary:
      "Give your time and skills to support women and girls in Kakuma Refugee Camp.",
    to: "/contact",
  },
  {
    title: "Membership",
    summary: "Join as a member and help shape our priorities and programmes.",
    to: "/contact",
  },
  {
    title: "Mentor",
    summary: "Share your experience as a mentor for young women and girls.",
    to: "/contact",
  },
  {
    title: "Partner",
    summary:
      "Partner with us as a funder, institution or community organisation.",
    to: "/contact",
  },
];

const [featured, ...cards] = involvement;

export default function GetInvolved() {
  return (
    <div className="p1-getinvolved-page">
      {/* ---------- Header: white, below the fixed navbar ---------- */}
      <header className="p1-getinvolved-header">
        <div className="p1-getinvolved-container">
          <nav className="p1-getinvolved-crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Get Involved</span>
          </nav>

          <h1 className="p1-getinvolved-title">Get Involved</h1>
          <span className="p1-getinvolved-rule" aria-hidden="true" />
          <p className="p1-getinvolved-sub">There is a place for everyone.</p>
          <p className="p1-getinvolved-intro">
            Donors, development organizations, NGOs, community partners, schools,
            training institutions, health partners, volunteers, mentors and
            members — stand with Art and Unity for Vulnerable Development and
            create lasting impact for women and girls in Kakuma Refugee Camp.
          </p>
        </div>
      </header>

      {/* ---------- Split rows ---------- */}
      <div className="p1-getinvolved-list">
        {/* Featured row: image left, text right. */}
        <article className="p1-getinvolved-row">
          <div className="p1-getinvolved-media">
            <img
              className="p1-getinvolved-img"
              src="/Music%20training.jpg"
              alt="Children and youth learning music with AUVD in Kakuma Refugee Camp"
              loading="lazy"
            />
            <span className="p1-getinvolved-fade" aria-hidden="true" />
          </div>

          <div className="p1-getinvolved-panel">
            <div className="p1-getinvolved-content">
              <h2 className="p1-getinvolved-heading">{featured.title}</h2>
              <span className="p1-getinvolved-divider" aria-hidden="true" />
              <p className="p1-getinvolved-body">{featured.summary}</p>
              <Link to={featured.to} className="p1-getinvolved-btn">
                Learn More
              </Link>
            </div>
          </div>
        </article>

        {/* Text-only cards: 3 per row on desktop, 2 on tablet, 1 on mobile. */}
        <div className="p1-getinvolved-grid">
          {cards.map((item) => (
            <article
              key={item.title}
              className="p1-getinvolved-row p1-getinvolved-row--card"
            >
              <div className="p1-getinvolved-panel">
                <div className="p1-getinvolved-content">
                  <h2 className="p1-getinvolved-heading">{item.title}</h2>
                  <span
                    className="p1-getinvolved-divider"
                    aria-hidden="true"
                  />
                  <p className="p1-getinvolved-body">{item.summary}</p>
                  <Link to={item.to} className="p1-getinvolved-btn">
                    Learn More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
