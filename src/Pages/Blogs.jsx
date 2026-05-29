import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Blogs.css";

const featuredStories = [
  {
    category: "Featured Story",
    title: "Youth Peace Week workshops used music to build peace, healing, and opportunity.",
    date: "October 2025",
    readTime: "4 min read",
    image: "/youth peace.jpg",
    alt: "Youth Peace Week participants gathered in a music and peacebuilding session",
    excerpt:
      "The workshops used music and creative arts to promote peacebuilding, mental well-being, education, and community empowerment among refugee and host community youth.",
    paragraphs: [
      "Each event focused on a distinct global day, giving young people space to learn, perform, reflect, and connect through music.",
      "By blending music, conversation, and collective participation, the workshops created an environment where young people could engage deeply with peacebuilding themes while also growing in confidence and expression.",
    ],
    action: {
      to: "/events#events-overview",
      label: "Explore more",
    },
  },
  {
    category: "Partnership Journal",
    className: "blogs-story-card-donation",
    title: "Receiving music instruments through international partnership and support.",
    date: "2025 Milestone",
    readTime: "3 min read",
    image: "/donation.jpg",
    alt: "Music instrument donation supporting young artists in Kakuma",
    excerpt:
      "AUVD received music instruments through the support of the Transylvanian Symphony Foundation, helping expand access to music education for young artists in Kakuma.",
    paragraphs: [
      "This support strengthened AUVD's music education work by placing real instruments into the hands of children and youth who were eager to learn, practice, and grow through creative expression.",
      "The initiative was also supported by Hungry for Music, whose mission of putting quality musical instruments into young hands aligns closely with AUVD's goal of building opportunity, confidence, and hope through music.",
    ],
    links: [
      {
        href: "https://www.transylvaniansymphony.org/",
        label: "Transylvanian Symphony Foundation",
      },
      {
        href: "https://hungryformusic.org/",
        label: "Hungry for Music",
      },
    ],
  },
];

const blogNotes = [
  "Community updates from AUVD programs and partnerships",
  "Stories about music, education, healing, and youth empowerment",
  "Field reflections from Kakuma Refugee Camp and partner collaborations",
];

const blogsHeroTitle = "Voices from the Community";

function Blogs() {
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    let typingInterval;

    const startDelay = setTimeout(() => {
      typingInterval = setInterval(() => {
        setTypedChars((previous) => {
          if (previous >= blogsHeroTitle.length) {
            clearInterval(typingInterval);
            return previous;
          }

          return previous + 1;
        });
      }, 65);
    }, 220);

    return () => {
      clearTimeout(startDelay);
      clearInterval(typingInterval);
    };
  }, []);

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll("[data-blogs-reveal]"));

    if (revealElements.length === 0) {
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
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const typedHeroTitle = blogsHeroTitle.slice(0, typedChars);
  const isTypingComplete = typedChars >= blogsHeroTitle.length;

  return (
    <main className="blogs-page">
      <section className="blogs-hero">
        <div className="blogs-hero-copy blogs-reveal blogs-reveal-up" data-blogs-reveal>
          <h1 aria-label={blogsHeroTitle}>
            {typedHeroTitle}
            <span className={`blogs-typing-cursor${isTypingComplete ? " is-complete" : ""}`} aria-hidden="true">|</span>
          </h1>
          <p>
            A deeper look into our work through stories of music, peacebuilding, education,
            partnerships, and creative empowerment in Kakuma.
          </p>
        </div>
      </section>

      <section className="blogs-content-shell">
        <div className="blogs-main-column">
          {featuredStories.map((story, index) => (
            <article
              key={story.title}
              className={`blogs-story-card blogs-reveal ${index % 2 === 0 ? "blogs-reveal-up" : "blogs-reveal-right"} ${index === 0 ? "blogs-story-card-featured" : ""} ${story.className ?? ""}`}
              data-blogs-reveal
            >
              <div className="blogs-story-media">
                <span className="blogs-story-media-badge">{story.category}</span>
                <img src={story.image} alt={story.alt} />
              </div>

              <div className="blogs-story-copy">
                <div className="blogs-story-header">
                  <span className="blogs-kicker">{story.category}</span>
                  <div className="blogs-story-meta">
                    <span>{story.date}</span>
                    <span>{story.readTime}</span>
                  </div>
                </div>
                <h2>{story.title}</h2>
                <p className="blogs-story-excerpt">{story.excerpt}</p>

                <div className="blogs-story-body">
                  {story.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {story.links ? (
                  <div className="blogs-story-links">
                    {story.links.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="blogs-inline-link"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}

                {story.action ? (
                  <Link to={story.action.to} className="blogs-overview-button">
                    {story.action.label}
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <aside className="blogs-sidebar">
          <section className="blogs-sidebar-card blogs-reveal blogs-reveal-right" data-blogs-reveal>
            <span className="blogs-kicker">About This Blog</span>
            <h3>Journal-style updates from AUVD</h3>
            <p>
              This page is designed as a real blog hub where readers can follow featured stories,
              partnership milestones, and reflections from our work with children and youth.
            </p>
          </section>

          <section className="blogs-sidebar-card blogs-reveal blogs-reveal-right" data-blogs-reveal>
            <span className="blogs-kicker">What You Will Read</span>
            <div className="blogs-note-list">
              {blogNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </section>

          <section className="blogs-sidebar-card blogs-sidebar-card-accent blogs-reveal blogs-reveal-right" data-blogs-reveal>
            <span className="blogs-kicker">Next Stop</span>
            <h3>Read more from the Events page</h3>
            <p>
              Continue to the Events page for the full Youth Peace Week story, workshop details,
              and photo highlights.
            </p>
            <Link to="/events" className="blogs-overview-button">
              Go to Events
            </Link>
          </section>
        </aside>
      </section>

      <section className="blogs-bottom-note blogs-reveal blogs-reveal-up" data-blogs-reveal>
        <span className="blogs-kicker">Stay Connected</span>
        <h2>Stay tuned for our upcoming blogs.</h2>
        <p>
          More stories, reflections, and community updates will be shared here as new blog
          entries are published.
        </p>
      </section>

    </main>
  );
}

export default Blogs;
