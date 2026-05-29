import { useEffect, useState } from "react";
import "./about.css";

type StoryStat = {
  value: string;
  label: string;
};

const heroTitle: string = "AUVD began with a simple vision of using creativity and art to bring hope.";

const storyStats: ReadonlyArray<StoryStat> = [
  { value: "2022", label: "Grassroots initiative launched" },
  { value: "2024", label: "AUVD identity formalized" },
  { value: "2025", label: "Registered as CBO and RLO" },
];

function OurStory() {
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    let typingInterval: ReturnType<typeof setInterval> | undefined;

    const startDelay = window.setTimeout(() => {
      typingInterval = window.setInterval(() => {
        setTypedChars((previous) => {
          if (previous >= heroTitle.length) {
            if (typingInterval) {
              window.clearInterval(typingInterval);
            }
            return previous;
          }

          return previous + 1;
        });
      }, 55);
    }, 250);

    return () => {
      window.clearTimeout(startDelay);
      if (typingInterval) {
        window.clearInterval(typingInterval);
      }
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (prefersReducedMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

	const typedTitle = heroTitle.slice(0, typedChars);
	const isTypingComplete = typedChars >= heroTitle.length;

  return (
    <section className="about-page">
      <section className="about-hero story-reveal story-reveal-hero" data-reveal>
        <div className="about-hero-copy story-reveal story-reveal-left" data-reveal>
          <h1 className="about-hero-title" aria-label={heroTitle}>
			{typedTitle}
			<span className={`about-typing-cursor${isTypingComplete ? " is-complete" : ""}`} aria-hidden="true">|</span>
		  </h1>
          <p className="about-intro">
            Art and Unity for Vulnerable Development (AUVD) began from a simple vision: using
            creativity and art to bring hope, healing, and opportunity to vulnerable communities in
            Kakuma Refugee Camp.
          </p>

          <div className="story-hero-actions">
            <a href="#story-journey" className="story-pill story-pill-primary">
              Explore The Journey
            </a>
            <span className="story-pill story-pill-muted">Creativity, dignity, unity</span>
          </div>
        </div>

        <div className="about-hero-panel story-reveal story-reveal-right" data-reveal>
          <p className="about-panel-label">Started</p>
          <strong>2022</strong>
          <p>Founded by Samuel Asongo and shaped by refugee and host community youth in Kakuma.</p>
        </div>
      </section>

      <section className="story-stats story-reveal story-reveal-up" aria-label="Our Story milestones" data-reveal>
        {storyStats.map((item) => (
          <article key={item.label} className="story-stat-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="about-story story-reveal story-reveal-up" id="story-journey" data-reveal>
        <div className="about-story-copy story-reveal story-reveal-left" data-reveal>
          <p className="about-section-label">How It Started</p>
          <h2>From one refugee musician's vision to a growing community movement.</h2>
          <p>
            The organization was founded by Samuel Asongo, a refugee from the Democratic Republic
            of Congo (DRC) who fled his home country because of war and conflict. After arriving in
            Kakuma Refugee Camp, Samuel continued pursuing his passion for creative arts,
            especially music. He was a musician, guitarist, and drummer who believed that art
            could help people heal from pain, trauma, and displacement.
          </p>
          <p>
            In 2022, Samuel started a small initiative together with a group of young people from
            both refugee and host communities. At the beginning, the initiative focused on talent
            shows, storytelling, interviews, and community activities that highlighted the talents
            and experiences of artists and vulnerable youth in Kakuma. Through these activities,
            they discovered that many young people had creativity, skills, and powerful stories,
            but lacked opportunities and support.
          </p>
        </div>

        <div className="about-goals-card story-reveal story-reveal-right" data-reveal>
          <img src="/samuel.png" alt="Samuel Asongo" className="story-feature-image" />
          <div className="about-goal-header">
            <p className="about-section-label">Founder</p>
          </div>
          <h3>Samuel Asongo</h3>
          <p>
            Musician, guitarist, and drummer whose experience as a refugee shaped AUVD's mission of
            healing, dignity, and opportunity through art.
          </p>
          <blockquote className="story-quote">
            "Art can help people heal from pain, trauma, and displacement."
          </blockquote>
        </div>
      </section>

      <section className="about-story story-reveal story-reveal-up" data-reveal>
        <div className="about-story-copy story-reveal story-reveal-left" data-reveal>
          <p className="about-section-label">Growth and Registration</p>
          <h2>The initiative grew into AUVD.</h2>
          <p>
            As the initiative continued growing, it became more than just a talent platform. It
            evolved into a community movement focused on empowering vulnerable people through art,
            education, livelihood support, and community engagement. In 2024, the initiative
            officially became Art and Unity for Vulnerable Development (AUVD), and in 2025 it was
            formally registered as a Community-Based Organization (CBO) and Refugee-Led
            Organization (RLO) in Kenya.
          </p>
          <p>
            Today, AUVD continues to grow by supporting vulnerable children, youth, women, and
            persons with disabilities through creative arts, education, livelihood programs,
            mentorship, and community development initiatives.
          </p>
        </div>

        <div className="about-goals-card story-reveal story-reveal-right" data-reveal>
          <div className="about-goal-header">
            <p className="about-section-label">Where We Are Today</p>
          </div>
          <h3>Building self-reliance and opportunity</h3>
          <p>
            The organization works to promote self-reliance and economic empowerment by providing
            skills development opportunities, creative training, and community-based programs that
            help vulnerable people improve their livelihoods and build a better future.
          </p>
          <p>
            AUVD also continues to work with local and international partners to create safe spaces
            where people can express themselves, build confidence, learn new skills, strengthen
            peaceful coexistence, and contribute positively to their communities.
          </p>
        </div>
      </section>

      <section className="about-story about-story-full story-reveal story-reveal-up" data-reveal>
        <div className="about-story-copy about-story-wide story-reveal story-reveal-up" data-reveal>
          <p className="about-section-label">Partnership Milestone</p>
          <h2>Support from Transylvanian Symphony Foundation helped AUVD expand.</h2>
          <p>
            One important milestone in AUVD's journey came in 2024 when Samuel reached out to the
            Transylvanian Symphony Foundation to request musical instruments for young artists in
            Kakuma. The organization generously donated several music instruments, becoming AUVD's
            first international partner. This support helped AUVD begin expanding its programs and
            empowering vulnerable communities through music and creative arts.
          </p>
          <p>
            During this journey, Samuel also connected with Jeremy Rosado and Ron Ramsey from the
            Transylvanian Symphony Foundation in Oklahoma, USA, who showed kindness, encouragement,
            and continued support for AUVD's mission and programs.
          </p>

          <div className="story-gallery story-gallery-single" data-reveal>
            <img
              src="/donation.jpg"
              alt="Donation support for AUVD community programs"
              className="story-gallery-image story-gallery-image-single"
            />
          </div>
        </div>
      </section>

      <section className="about-story about-story-full story-reveal story-reveal-up" data-reveal>
        <div className="about-story-copy about-story-wide story-reveal story-reveal-up" data-reveal>
          <p className="about-section-label">Looking Ahead</p>
          <h2>Creativity can transform pain into hope.</h2>
          <p>
            AUVD believes that creativity can transform pain into hope, silence into powerful
            stories, and vulnerable communities into empowered communities. Through art,
            education, livelihoods, and unity, AUVD continues building opportunities and brighter
            futures for refugee and host communities in Kakuma.
          </p>

          <div className="story-closing-banner story-reveal story-reveal-up" data-reveal>
            <div>
              <p className="about-section-label">Core Belief</p>
              <h3>Building brighter futures through art, education, and livelihoods.</h3>
            </div>
            <p>
              AUVD continues creating safe spaces for expression, confidence, learning, and peaceful
              coexistence across refugee and host communities.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

export default OurStory;