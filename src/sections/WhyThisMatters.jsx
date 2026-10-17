import { Link } from 'react-router-dom';
import '../components/P1Bubble.css';
import './WhyThisMatters.css';

/* ==========================================================================
   "Why This Matters" — three facts, written only from text already present in
   the target (Who We Are, Our Programs pillars, Shoe That Grows, music
   programs). No invented numbers, dates, quotes or partners.

   Design (matches the reference): solid orange band, white rounded cards with
   a circular blue icon, a bold dark title, a short accent bar, and dark body
   text. Icons are inline SVGs so no extra icon library is required.
   ========================================================================== */

const reasons = [
  {
    title: 'Education Opens Doors',
    text: 'Refugee and vulnerable children and young people face barriers to quality education and learning opportunities. AUVD promotes inclusive education, digital literacy, STEM learning, mentorship, and life skills to help learners build confidence and pursue a brighter future.',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
        <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: 'Empowering Women and Young People',
    text: 'Women and young people need opportunities to develop skills, earn income, and participate in community development. AUVD supports vocational training, entrepreneurship, financial literacy, youth leadership, and women\u2019s economic empowerment to strengthen independence and resilience.',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Art, Well-being and Unity',
    text: 'Creative expression can bring people together and strengthen community connections. Through music, dance, visual arts, psychosocial support, peacebuilding, and inclusive community activities, AUVD promotes well-being, peaceful coexistence, and stronger refugee\u2013host community relationships.',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    ),
  },
];

export default function WhyThisMatters() {
  return (
    <section className="p1-why">
      <div className="p1-why__inner">
        <div className="p1-why__split">
          {/* Left: empty image slot — add your <img> here. Right: text bubble. */}
          <div className="p1-why__media">
            <img src="/Why%20this%20matter%20at%20AUVD.jpg" alt="Why this matter at AUVD" loading="lazy" />
          </div>
          <div className="p1-bubble-section">
            <div className="p1-bubble">
              <div className="p1-bubble-body">
                <h2 className="p1-why__title p1-bubble-title">Why This Matters</h2>
                <p className="p1-why__intro p1-bubble-text">
                  AUVD is a refugee-led, community-based nonprofit organization in Kakuma
                  Refugee Camp, Turkana County, Kenya. We empower refugees and vulnerable
                  host communities through creative arts, inclusive education,
                  psychosocial support, skills development, and community-led initiatives
                  that build resilience, dignity, and opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p1-why__grid">
          {reasons.map((r) => (
            <article key={r.title} className="p1-why__card">
              <span className="p1-why__icon">{r.icon}</span>
              <h3 className="p1-why__card-title">{r.title}</h3>
              <span className="p1-why__bar" aria-hidden="true"></span>
              <p className="p1-why__text">{r.text}</p>
            </article>
          ))}
        </div>

        {/* CTA — links only to a route that already exists in the target. */}
        <p className="p1-why__cta">
          <Link to="/our-impact" className="p1-why__button">
            Learn more about our work{' '}
            <span className="p1-why__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M3 12h16" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </p>
      </div>
    </section>
  );
}
