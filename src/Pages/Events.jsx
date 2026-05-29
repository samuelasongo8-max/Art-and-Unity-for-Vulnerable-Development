import { useEffect, useState } from "react";
import "./Events.css";

const heroTitle = "Partnership for Impact: Music Across Youth Peace Week";

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
  const [typedChars, setTypedChars] = useState(0);

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

  useEffect(() => {
    let typingInterval;

    const startDelay = setTimeout(() => {
      typingInterval = setInterval(() => {
        setTypedChars((previous) => {
          if (previous >= heroTitle.length) {
            clearInterval(typingInterval);
            return previous;
          }

          return previous + 1;
        });
      }, 55);
    }, 250);

    return () => {
      clearTimeout(startDelay);
      clearInterval(typingInterval);
    };
  }, []);

  const typedTitle = heroTitle.slice(0, typedChars);
  const isTypingComplete = typedChars >= heroTitle.length;

  return (
    <section className="events-page">
      <div className="events-hero events-reveal events-reveal-up" data-reveal>
        <h1 className="events-hero-title" aria-label={heroTitle}>
          {typedTitle}
          <span className={`events-typing-cursor${isTypingComplete ? " is-complete" : ""}`} aria-hidden="true">|</span>
        </h1>
        <p className="events-intro">
          Art and Unity for Vulnerable Development (AUVD), in partnership with F2F Music
          Foundation, UnityNet International, Andrew Network - AHIAGBA TV, and
          Transylvanian Symphony Foundation, successfully delivered three impactful
          workshops during Youth Peace Week in Kakuma Refugee Camp.
        </p>
      </div>

      <article id="events-overview" className="events-feature events-reveal events-reveal-up" data-reveal>
        <div className="events-feature-copy">
          <p className="events-section-label">Overview</p>
          <h2>Youth Peace Week workshops used music to build peace, healing, and opportunity.</h2>
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

        <div className="events-feature-media">
          <img src="/youth peace.jpg" alt="Youth Peace Week participants gathered in a music and peacebuilding session" />
        </div>
      </article>

      <div className="events-list">
        {workshopEvents.map((event) => (
          <article
            key={event.title}
            className={`event-story-card events-reveal ${event.title === "World Mental Health Day" ? "events-reveal-right" : "events-reveal-up"}${event.variant === "poster" ? " event-story-card-poster" : ""}${event.galleryImages ? " event-story-card-gallery" : ""}${event.title === "World Mental Health Day" ? " event-story-card-mental" : ""}`}
            data-reveal
            style={{ transitionDelay: `${workshopEvents.indexOf(event) * 120}ms` }}
          >
            {event.image ? (
              <div className={`event-story-image${event.variant === "poster" ? " event-story-image-poster" : ""}`}>
                <img src={event.image} alt={event.alt} />
                {event.posterTag ? (
                  <div className="event-story-poster-top">
                    <span className="event-story-poster-tag">{event.posterTag}</span>
                    <span className="event-story-poster-date">{event.date}</span>
                  </div>
                ) : null}
                {event.posterHeadline ? (
                  <div className="event-story-poster-copy">
                    <h4>{event.posterHeadline}</h4>
                    <p>{event.posterDetails}</p>
                  </div>
                ) : null}
                {event.posterLabel ? (
                  <div className="event-story-poster-caption">{event.posterLabel}</div>
                ) : null}
              </div>
            ) : null}

            <div className="event-story-copy">
              <p className="event-story-date">{event.date}</p>
              <h2>{event.title}</h2>
              <h3>{event.theme}</h3>
              <p>{event.description}</p>

              {event.galleryImages ? (
                <div className="event-story-gallery">
                  {event.galleryImages.map((image) => (
                    <figure
                      key={image.src}
                      className={`event-story-gallery-item${image.featured ? " event-story-gallery-item-featured" : ""}`}
                    >
                      <img src={image.src} alt={image.alt} />
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <section className="events-impact">
        <div className="events-impact-header events-reveal events-reveal-up" data-reveal>
          <p className="events-section-label">Impact Created</p>
          <h2>What the partnership made possible</h2>
        </div>

        <div className="events-impact-grid">
          {impactPoints.map((point, index) => (
            <article
              key={point}
              className="impact-card events-reveal events-reveal-up"
              data-reveal
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <p>{point}</p>
            </article>
          ))}
        </div>

        <div className="events-closing events-reveal events-reveal-up" data-reveal>
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
      </section>
    </section>
  );
}

export default Events;