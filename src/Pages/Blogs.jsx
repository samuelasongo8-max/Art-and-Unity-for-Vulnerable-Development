import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Blogs.css";
const musicStories = [
  {
    category: "October 2025 · 4 min read",
    title:
      "Youth Peace Week workshops used music to build peace, healing, and opportunity.",
    description:
      "The workshops used music and creative arts to promote peacebuilding, mental well-being, education, and community empowerment among refugee and host community youth. Each event focused on a distinct global day, giving young people space to learn, perform, reflect, and connect through music. By blending music, conversation, and collective participation, the workshops created an environment where young people could engage deeply with peacebuilding themes while also growing in confidence and expression.",
    image: "/Youth peace week.jpg",
    alt: "Young people participating in Youth Peace Week workshops",
    link: "/events#events-overview",
    linkText: "Explore more",
  },

  {
    category: "2025 Milestone · 3 min read",
    title:
      "Receiving music instruments through international partnership and support.",
    description:
      "AUVD received music instruments through the support of the Transylvanian Symphony Foundation, helping expand access to music education for young artists in Kakuma. This support strengthened AUVD's music education work by placing real instruments into the hands of children and youth who were eager to learn, practice, and grow through creative expression. The initiative was also supported by Hungry for Music, whose mission of putting quality musical instruments into young hands aligns closely with AUVD's goal of building opportunity, confidence, and hope through music.",
    image: "/donation.jpg",
    alt: "Musical instruments donated to AUVD",
    link: "/donation",
    linkText: "Read story",
    partners: [
      {
        name: "Transylvanian Symphony Foundation",
        url: "https://www.transylvaniansymphony.org/",
      },
      {
        name: "Hungry for Music",
        url: "https://hungryformusic.org/",
      },
    ],
  },

  {
    category: "Community",
    title: "Music Reaches Every Corner",
    description:
      "Dozens of children and youth gathered with their new instruments, from violins to keyboards, ready to start learning together.",
    image: "/violin.jpg",
    alt: "Young musician learning to play violin",
    link: "/music",
    linkText: "Read story",
  },

  {
    category: "First Notes",
    title: "A New Ukulele, A New Start",
    description:
      "For many children, this was the first instrument they had ever held. Small moments like this build confidence and joy.",
    image: "/donation-2.jpg",
    alt: "Child exploring a newly donated instrument",
    link: "/music",
    linkText: "Read story",
  },
];

function getVisibleStoryCount() {
  if (typeof window === "undefined") {
    return 3;
  }

  if (window.innerWidth <= 640) {
    return 1;
  }

  if (window.innerWidth <= 900) {
    return 2;
  }

  return 3;
}

function Blogs() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleStoryCount, setVisibleStoryCount] = useState(getVisibleStoryCount);
  const lastIndex = musicStories.length - visibleStoryCount;

  useEffect(() => {
    const handleResize = () => {
      setVisibleStoryCount(getVisibleStoryCount());
      setCurrentIndex((index) => Math.min(index, musicStories.length - getVisibleStoryCount()));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showPrevious = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const showNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, lastIndex));
  };

  return (
    <main className="blogs-page">
      <section className="blogs-hero" aria-labelledby="blogs-heading">
        <div className="blogs-hero-inner">
          <div className="blogs-editorial-header">
           <div className="blogs-editorial-copy">
  <p className="blogs-eyebrow">Music Instrument Donations:</p>
  <h1 id="blogs-heading" className="blogs-heading">Music That Reached Kakuma</h1>
  <p className="blogs-intro">
    Our music education journey grew through the generosity of partners who believed
    that every young person deserves an opportunity to learn, create, and express
    themselves through music.
  </p>
   <Link className="blogs-view-all" to="/news/daddario-community-music-grant">
              View All <span aria-hidden="true">→</span>
            </Link>
</div>

  
  
  </div>
    </div>
  </section>
    

      <section className="blogs-editorial" aria-labelledby="blogs-heading">
        <div className="blogs-carousel-heading">
          <div className="blogs-progress" aria-hidden="true">
            <span style={{ width: `${((currentIndex + 1) / (lastIndex + 1)) * 100}%` }} />
          </div>
          <div className="blogs-carousel-controls" aria-label="Carousel controls">
            <button
              type="button"  
              className="blogs-carousel-button"
              onClick={showPrevious}
              disabled={currentIndex === 0}   
              aria-label="Previous stories"
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <button
              type="button"
              className="blogs-carousel-button"
              onClick={showNext}
              disabled={currentIndex === lastIndex}
              aria-label="Next stories"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <div className="blogs-carousel" aria-live="polite">
          <div className="blogs-carousel-track" style={{ "--blogs-index": currentIndex }}>
            {musicStories.map((story) => (
              <article className="blogs-story-card" key={story.title}>
                <img className="blogs-story-image" src={story.image} alt={story.alt} />
                <div className="blogs-story-copy">
                  <span className="blogs-story-category">{story.category}</span>
                  <h2>{story.title}</h2>
                  <p>{story.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}

export default Blogs;
