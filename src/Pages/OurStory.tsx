import { useEffect } from "react";
import ImpactHero from "../components/ImpactHero";
import "./about.css";
import "./our-impact/OurStory.css";

type StoryStat = {
  value: string;
  label: string;
};

const storyStats: ReadonlyArray<StoryStat> = [
  { value: "2022", label: "Grassroots initiative launched" },
  { value: "2024", label: "AUVD identity formalized" },
  { value: "2025", label: "Registered as CBO and RLO" },
];

function OurStory() {
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

  return (
    <section className="auvd-story-page about-page">
      {/* Full-bleed hero — markup and styles live in the shared ImpactHero
          component so Work and Pricing reuse the exact same design. */}
      <ImpactHero
        label="Started"
        heading="vision of using creativity and art to bring hope."
        paragraph="Art and Unity for Vulnerable Development (AUVD) began from a simple vision: using creativity and art to bring hope, healing, and opportunity to vulnerable communities in Kakuma Refugee Camp."
        buttonText="Explore The Journey"
        buttonHref="#story-journey"
        image="/together1.jpg"
        imageAlt="AUVD community members gathered together"
        tagline="Creativity, dignity, unity"
        factCard={{
          label: "Started",
          value: "2022",
          caption:
            "Founded by Samuel Asongo and shaped by refugee and host community youth in Kakuma.",
        }}
        milestones={storyStats.map((stat) => ({ year: stat.value, text: stat.label }))}
      />

      <section className="auvd-story-origin" id="story-journey" aria-labelledby="story-origin-heading">
        <div className="auvd-story-origin-container">
          <div className="auvd-story-origin-collage auvd-story-origin-collage--single">
            <img
              className="auvd-story-origin-image-large"
              src="/Samuel%20Asongo%20image.png"
              alt="Samuel Asongo"
            />
          </div>
          <div className="auvd-story-origin-text">
            <p className="auvd-story-origin-eyebrow">How It Started</p>
            <h2 id="story-origin-heading">From one refugee musician&apos;s vision to a growing community movement.</h2>
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
            <h3 className="auvd-story-origin-founder">Samuel Asongo</h3>
            <p>
              Musician, guitarist, and drummer whose experience as a refugee shaped AUVD&apos;s mission of
              healing, dignity, and opportunity through art.
            </p>
            <blockquote className="auvd-story-origin-quote">
              &quot;Art can help people heal from pain, trauma, and displacement.&quot;
            </blockquote>
          </div>
        </div>
      </section>

      {/* Growth and Registration — no images: Bebas title left, copy right. */}
      <section className="auvd-story-section">
        <div className="auvd-story-container">
          <p className="auvd-story-label">Growth and Registration</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">The initiative grew into AUVD.</h2>
            <div className="auvd-story-text">
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
          </div>
        </div>
      </section>

      {/* Where We Are Today — second band (light tint). */}
      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <p className="auvd-story-label">Where We Are Today</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">Building self-reliance and opportunity</h2>
            <div className="auvd-story-text">
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
          </div>
        </div>
      </section>

      {/* Partnership Milestone — the section's one existing image sits in the
          left collage column; title and paragraphs on the right. */}
      <section className="auvd-story-section">
        <div className="auvd-story-container">
          <p className="auvd-story-label">Partnership Milestone</p>
          <div className="auvd-story-body">
            <div className="auvd-story-gallery auvd-story-gallery--single">
              <img
                className="auvd-story-gallery-item auvd-story-gallery-item--1"
                src="/donation.jpg"
                alt="Donation support for AUVD community programs"
              />
            </div>
            <div className="auvd-story-text">
              <h2 className="auvd-story-title">Support from Transylvanian Symphony Foundation helped AUVD expand.</h2>
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
            </div>
          </div>
        </div>
      </section>

      {/* Looking Ahead — fourth band (light tint). */}
      <section className="auvd-story-section auvd-story-section--tint">
        <div className="auvd-story-container">
          <p className="auvd-story-label">Looking Ahead</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">Creativity can transform pain into hope.</h2>
            <div className="auvd-story-text">
              <p>
                AUVD believes that creativity can transform pain into hope, silence into powerful
                stories, and vulnerable communities into empowered communities. Through art,
                education, livelihoods, and unity, AUVD continues building opportunities and brighter
                futures for refugee and host communities in Kakuma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Belief — was the closing banner inside "Looking Ahead"; now its
          own section with the "Upcoming project (2).jpg" background image. */}
      <section className="auvd-story-belief">
        <img
          className="auvd-story-belief-image"
          src="/Upcoming%20project%20(2).jpg"
          alt=""
          aria-hidden="true"
        />
        <div className="auvd-story-belief-overlay" aria-hidden="true"></div>
        <div className="auvd-story-container">
          <p className="auvd-story-label">Core Belief</p>
          <div className="auvd-story-body">
            <h2 className="auvd-story-title auvd-story-title--lead">Building brighter futures through art, education, and livelihoods.</h2>
            <div className="auvd-story-text">
              <p>
                AUVD continues creating safe spaces for expression, confidence, learning, and peaceful
                coexistence across refugee and host communities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default OurStory;