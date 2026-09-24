import { useEffect } from "react";
import ImpactHero from "../components/ImpactHero";
import "./Events.css";

const heroTitle = "Partnership for Impact: Music Across Youth Peace Week";

const heroLead =
  "Art and Unity for Vulnerable Development (AUVD), in partnership with F2F Music Foundation, UnityNet International, Andrew Network - AHIAGBA TV, and Transylvanian Symphony Foundation, successfully delivered three impactful workshops during Youth Peace Week in Kakuma Refugee Camp.";

const workshopEvents = [
  {
    date: "October 5, 2025",
    title: "World Teachers' Day",
    theme: "The Joy Within Music",
    image: "/muziki.jpg",
    alt: "Muziki image for World Teachers' Day",
    variant: "poster",
    posterHeadline: "Celebrate teachers through music, gratitude, and community voices.",
    posterDetails: "Live performances, appreciation, and creative expression in Kakuma Refugee Camp.",
    description:
      "Students honored teachers and mentors through music performances celebrating guidance, appreciation, and education.",
  },
  {
    date: "October 10, 2025",
    title: "World Mental Health Day",
    theme: "The Power Within Music",
    description:
      "This workshop focused on how music supports emotional healing, resilience, and mental well-being.",
    galleryImages: [
      {
        src: "/ani1.jpg",
        alt: "Participants during the World Mental Health Day workshop in a large featured moment",
        featured: true,
      },
      {
        src: "/mental.jpg",
        alt: "Participants during the World Mental Health Day music workshop",
      },
      {
        src: "/mental2.jpg",
        alt: "Young people taking part in a music and wellness session",
      },
      {
        src: "/menatal3.jpg",
        alt: "Workshop moment focused on healing, resilience, and well-being",
      },
      {
        src: "/Sharmante1.jpg",
        alt: "Sharmante during the World Mental Health Day music workshop",
      },
    ],
  },
  {
    date: "October 16, 2025",
    title: "World Food Day",
    theme: "The Peace of God Within Music",
    image: "/furaha.jpg",
    alt: "Participants exploring music and art conversations around hope and livelihoods",
    description:
      "Participants explored how art and music can inspire hope, dignity, and conversations around food security and livelihoods.",
  },
];

const impactPoints = [
  "188 students from refugee and host communities participated in the workshops.",
  "Young refugee artists gained international online visibility.",
  "The workshops connected music with education, mental health, peacebuilding, and livelihoods.",
  "The partnership strengthened collaboration between local and international organizations.",
];
function Events() {
  useEffect(() => {
    const revealedElements = Array.from(document.querySelectorAll("[data-reveal]"));

    if (revealedElements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="events-page">
      {/* Full-bleed hero — the shared ImpactHero component (the exact design
          Pricing uses), carrying this page's own heading, intro paragraph and
          photo. The old hero had no button, fact card or milestones, so none
          are added. */}
      <div className="auvd-events-hero-bleed">
        <ImpactHero
          heading={heroTitle}
          paragraph={heroLead}
          image="/mental.jpg"
          imageAlt="Participants during the World Mental Health Day workshop in a large featured moment"
        />
      </div>

      <div className="auvd-events-container">

        {/* Overview — the Our Impact section pattern: label (no rule), then a
            two-column body with the image collage on the left. */}
        <section id="events-overview" className="auvd-events-section auvd-events-section--white" data-reveal>
          <p className="events-section-label">Overview</p>
          <div className="auvd-events-body">
            <div className="auvd-events-collage auvd-events-collage--single">
              <img src="/youth peace.jpg" alt="Youth Peace Week participants gathered in a music and peacebuilding session" />
            </div>
            <div className="auvd-events-text">
              <h2 className="auvd-events-title">Youth Peace Week workshops used music to build peace, healing, and opportunity.</h2>
              <p>
                The workshops used music and creative arts to promote peacebuilding, mental
                well-being, education, and community empowerment among refugee and host
                community youth.
              </p>
              <p>
                Each event focused on a distinct global day, giving young people space to learn,
                perform, reflect, and connect through music.
              </p>
            </div>
          </div>
        </section>

        {workshopEvents.map((event, index) => (
          <section
            key={event.title}
            className={`auvd-events-section${index % 2 === 0 ? " auvd-events-section--flip" : ""}${
              event.title === "World Mental Health Day" ? " auvd-events-section--white" : ""
            }`}
            data-reveal
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <p className="event-story-date">{event.date}</p>
            <div className="auvd-events-body">
              <div className={`auvd-events-collage auvd-events-collage--${event.galleryImages ? "five" : "single"}`}>
                {event.galleryImages
                  ? event.galleryImages.map((image) => (
                      <img key={image.src} src={image.src} alt={image.alt} />
                    ))
                  : event.variant === "poster"
                    ? (
                      <div className="event-story-image event-story-image-poster">
                        <img src={event.image} alt={event.alt} />
                        {event.posterHeadline ? (
                          <div className="event-story-poster-copy">
                            <h4>{event.posterHeadline}</h4>
                            <p>{event.posterDetails}</p>
                          </div>
                        ) : null}
                      </div>
                    )
                    : <img src={event.image} alt={event.alt} />}
              </div>

              <div className="auvd-events-text">
                <h2 className="auvd-events-title">{event.title}</h2>
                <h3 className="event-story-theme">{event.theme}</h3>
                <p>{event.description}</p>
              </div>
            </div>
          </section>
        ))}

                {/* Impact — the page's own dark blue band kept as the section
            background; section label and title on the left, closing
            paragraphs and quote on the right. */}
                <section
                  className="auvd-events-section auvd-events-impact events-reveal"
                  data-reveal
                >
                  <div className="auvd-events-body">
                    <div className="auvd-events-impact-head">
                      <p className="events-section-label">Impact Created</p>
                      <h2 className="auvd-events-title">What the partnership made possible</h2>
                    </div>
                    <div className="auvd-events-text">
                      <ul className="impact-list">
                        {impactPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>

                      <div className="events-closing">
                <p>
                  Through this initiative, AUVD demonstrated that music is more than
                  entertainment. It is a powerful tool for healing, unity, and positive social
                  change within vulnerable communities.
                </p>
                <p>
                  We sincerely thank all our partners for believing in the talent, creativity,
                  and potential of young people in Kakuma Refugee Camp.
                </p>
                <blockquote>"This is what unity sounds like."</blockquote>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Events;
