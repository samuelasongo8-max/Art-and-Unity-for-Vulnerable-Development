import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import for navigation
import {
  FaListCheck,
  FaMapLocationDot,
  FaPeopleGroup,
  FaUserGraduate,
} from "react-icons/fa6";
import "./Home.css";
 import ToggleSection from "../components/ToggleSection";
import kibodiii from "../assets/kibodiii-lite.webp";
// Import slides
import slide5 from "../img/slides/5.webp";
import slide6 from "../img/slides/6.webp";
import slide7 from "../img/slides/7.webp";

function Home() {
  const heroTitleParts = {
    before: "Empowering",
    highlight: " Vulnerable Communities",
    after: " Through Art and Innovation",
  };
  const heroTitleFull = `${heroTitleParts.before}${heroTitleParts.highlight}${heroTitleParts.after}`;
  const danceParagraphOne =
    "Through structured dance classes, participants develop physical fitness, coordination, and artistic expression. Dance also serves as a medium for cultural expression and emotional well-being.";
  const danceParagraphTwo = "";
  
  const navigate = useNavigate(); // ✅ hook for navigation

  const goToAbout = () => {
    navigate("/about"); // navigate to About page
  };

  /* ===== HERO SLIDER ===== */
  const slides = [
    { image: slide5, title: "Awesome Design", text: "Doloribus omnis minus temporibus perferendis ipsa architecto non, magni quam" },
    { image: slide6, title: "Fully Responsive", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit incididunt eius magni provident." },
    { image: slide7, title: "Multi-purpose Theme", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit donec mer lacinia." },
  ];
  const whySectionBackgrounds = ["/kakuma6.jpg", "/guitar2.jpg", kibodiii];
  const vocationalImages = [
    {
      src: "/tailoring.jpg",
      alt: "Tailoring and fashion design training",
    },
    {
      src: "/Cooking.webp",
      alt: "Cooking and catering training",
    },
  ];
  const slideCount = slides.length;
  const whySectionBackgroundCount = whySectionBackgrounds.length;
  const vocationalImageCount = vocationalImages.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentWhyBackground, setCurrentWhyBackground] = useState(0);
  const [currentVocationalImage, setCurrentVocationalImage] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [isDanceTypingVisible, setIsDanceTypingVisible] = useState(false);
  const [danceTypedChars, setDanceTypedChars] = useState({
    first: 0,
    second: 0,
  });
  const [isImpactVisible, setIsImpactVisible] = useState(false);
  const [impactCounts, setImpactCounts] = useState({
    reached: 0,
    programs: 0,
    trained: 0,
    camps: 0,
  });
  const impactSectionRef = useRef(null);
  const featuredVideoRef = useRef(null);
  const whyContentRef = useRef(null);
  const healingProgramRef = useRef(null);
  const therapeuticApproachRef = useRef(null);
  const featuredPerformanceRef = useRef(null);
  const visualArtsRef = useRef(null);
  const vocationalRef = useRef(null);
  const partnersIntroRef = useRef(null);
  const danceTypingRef = useRef(null);

  const impactStats = [
    {
      key: "reached",
      value: 500,
      suffix: "+",
      title: "Refugees Reached",
      icon: <FaPeopleGroup />,
      info: ["Children, youth, and adults empowered through our programs"],
    },
    {
      key: "programs",
      value: 7,
      suffix: "",
      title: "Core Programs",
      icon: <FaListCheck />,
      wide: true,
      info: [
        "Arts, Healing & Psychosocial Well-being",
        "Education, Youth Development & Empowerment",
        "Livelihoods & Women Economic Empowerment",
        "Peacebuilding & Community Inclusion",
        "Humanitarian Outreach & Basic Needs Support",
      ],
    },
    {
      key: "trained",
      value: 100,
      suffix: "+",
      title: "Youth Trained",
      icon: <FaUserGraduate />,
      info: ["Equipped with creative and life skills"],
    },
    {
      key: "camps",
      value: 1,
      suffix: "",
      title: "Refugee Camp",
      icon: <FaMapLocationDot />,
      info: ["Serving Kakuma community with safe creative spaces"],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === slideCount - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [slideCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWhyBackground((previous) =>
        previous === whySectionBackgroundCount - 1 ? 0 : previous + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [whySectionBackgroundCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVocationalImage((previous) =>
        previous === vocationalImageCount - 1 ? 0 : previous + 1
      );
    }, 4200);

    return () => clearInterval(interval);
  }, [vocationalImageCount]);

  useEffect(() => {
    let typingInterval;

    const startDelay = setTimeout(() => {
      typingInterval = setInterval(() => {
        setTypedChars((previous) => {
          if (previous >= heroTitleFull.length) {
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
  }, [heroTitleFull.length]);

  useEffect(() => {
    const sectionElement = impactSectionRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsImpactVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionElement = featuredVideoRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("video-entered");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionElement = whyContentRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("why-content-entered");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionElement = healingProgramRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("impact-text-entered");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionElement = therapeuticApproachRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("impact-ngo-entered");
        observer.disconnect();
      },
      { threshold: 0.24 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionElement = featuredPerformanceRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("video2-entered");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionElement = visualArtsRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("why-content-entered");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionElement = vocationalRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("vocational-text-entered");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionElement = partnersIntroRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("partners-copy-entered");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionElement = danceTypingRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsDanceTypingVisible(true);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isDanceTypingVisible) {
      return undefined;
    }

    if (danceTypedChars.first < danceParagraphOne.length) {
      const timeoutId = window.setTimeout(() => {
        setDanceTypedChars((previous) => ({
          ...previous,
          first: previous.first + 1,
        }));
      }, 18);

      return () => window.clearTimeout(timeoutId);
    }

    if (danceTypedChars.second < danceParagraphTwo.length) {
      const timeoutId = window.setTimeout(() => {
        setDanceTypedChars((previous) => ({
          ...previous,
          second: previous.second + 1,
        }));
      }, 18);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [
    danceParagraphOne.length,
    danceParagraphTwo.length,
    danceTypedChars.first,
    danceTypedChars.second,
    isDanceTypingVisible,
  ]);

  useEffect(() => {
    if (!isImpactVisible) {
      return undefined;
    }

    const durationMs = 3200;
    let animationFrameId;
    const animationStart = performance.now();

    const updateCounts = (now) => {
      const elapsed = now - animationStart;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setImpactCounts({
        reached: Math.round(500 * easedProgress),
        programs: Math.round(7 * easedProgress),
        trained: Math.round(100 * easedProgress),
        camps: Math.max(1, Math.round(1 * easedProgress)),
      });

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(updateCounts);
      }

      return undefined;
    };

    animationFrameId = window.requestAnimationFrame(updateCounts);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [isImpactVisible]);

  const beforeLength = heroTitleParts.before.length;
  const highlightLength = heroTitleParts.highlight.length;
  const partnerLinks = {
    f2f: "https://www.f2fmusicfoundation.org/",
    tsf: "https://www.transylvaniansymphony.org/",
  };

  const typedBefore = heroTitleParts.before.slice(0, Math.min(typedChars, beforeLength));
  const typedHighlight = heroTitleParts.highlight.slice(
    0,
    Math.max(0, Math.min(typedChars - beforeLength, highlightLength))
  );
  const typedAfter = heroTitleParts.after.slice(
    0,
    Math.max(0, typedChars - beforeLength - highlightLength)
  );
  const isTypingComplete = typedChars >= heroTitleFull.length;

  return (
    <>

      {/* ===== HERO SLIDER ===== */}
      <section
        className="hero together-hero-bg"
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      >
        <div className="hero-caption hero-card">


        <div className="hero-copy">


        <div className="lock">
            <h2 className="typing-text hero-title" aria-label={heroTitleFull}>
            {typedBefore}
            <span>{typedHighlight}</span>
            {typedAfter}
            <span className={`typing-cursor${isTypingComplete ? " is-complete" : ""}`} aria-hidden="true">|</span>
            </h2>
        </div>
          

          <p className="hero-description">Art and Unity for Vulnerable Development (AUVD) is a refugee-led organization transforming lives in Kakuma Refugee Camp through creativity, skills development, and inclusive community programs.</p>
          {/* ✅ Navigation Button */}
          


           <div className="hero-actions">


          <button className="btn-go-about" onClick={goToAbout}>
            Learn more About us 
          </button>

          <button className="btn-go-about" onClick={() => navigate("/work")}>
            Explore More
          </button>

          <button className="btn-go-about" onClick={() => navigate("/vocational")}>
            Share Your Creativity
          </button>

          <button className="btn-go-about" onClick={() => navigate("/music")}>
            music education
          </button>

          <button className="btn-go-about" onClick={() => navigate("/dance")}>
            Community dance
          </button>
           </div>

        <ul className="hero-social-links" aria-label="Social media links">
          <li>
            <a className="hero-social-link hero-social-facebook" href="https://www.facebook.com/profile.php?id=61569926836907" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">
              <i className="bx bxl-facebook"></i>
            </a>
          </li>
          <li>
            <a className="hero-social-link hero-social-linkedin" href="https://ke.linkedin.com--" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
              <i className="bx bxl-linkedin"></i>
            </a>
          </li>
          <li>
            <a className="hero-social-link hero-social-instagram" href="https://www.instagram.com/art.unityvulnerabledev2024/" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
              <i className="bx bxl-instagram"></i>
            </a>
          </li>
          <li>
            <a className="hero-social-link hero-social-youtube" href="https://www.youtube.com/@Artandunity-q2q" target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="YouTube">
              <i className="bx bxl-youtube"></i>
            </a>
          </li>
          <li>
            <a className="hero-social-link hero-social-tiktok" href="https://www.tiktok.com/@artunity_vulnerabledev" target="_blank" rel="noopener noreferrer" title="TikTok" aria-label="TikTok">
              <i className="bx bxl-tiktok"></i>
            </a>
          </li>
        </ul>

        </div>


        </div>
      </section>

    <section className="video-section">
      <div ref={featuredVideoRef} className="video video-animated">
        <div className="video-copy">
          <p className="video-kicker">Featured Video</p>
          <h2>Music Across Youth Peace Week</h2>
          <p>
            Art and Unity for Vulnerable Development (AUVD), in partnership with {" "}
            <a
              className="video-partner-link"
              href={partnerLinks.f2f}
              target="_blank"
              rel="noreferrer"
            >
              F2F Music Foundation
            </a>
            , UnityNet International, Andrew Network - AHIAGBA TV, and {" "}
            <a
              className="video-partner-link"
              href={partnerLinks.tsf}
              target="_blank"
              rel="noreferrer"
            >
              Transylvanian Symphony Foundation
            </a>
            , successfully delivered three impactful workshops during Youth Peace Week in Kakuma Refugee Camp.
          </p>
          <a
            className="video-link"
            href="https://www.youtube.com/watch?v=KC_okHjsXRw&t=2s"
            target="_blank"
            rel="noreferrer"
          >
            Open on YouTube
          </a>
        </div>

        <div className="video-frame-wrapper">
          <iframe
            className="video-frame"
            src="https://www.youtube.com/embed/KC_okHjsXRw?start=2"
            title="AUVD YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>


      





      {/* ===== WELCOME ===== */}
      <section className="mann">
        <div className="welcome">
          <div className="welcome-header-band">
             

            <h2 className="walking-text who-we-are-title">
              {"Who  We  Are".split("").map((char, i) => (
                <span key={i}>{char}</span>
              ))}
            </h2>
          </div>

          <div className="welcome-story">
            <p className="welcome-kicker">About AUVD</p>
            <p className="welcome-lead">
              Art and Unity for Vulnerable Development (AUVD) is a nonprofit Community-Based
              Organization (CBO) and Refugee-Led Organization (RLO) based in Kakuma Refugee Camp,
              Kenya. Founded in 2022 and formally registered in 2025, AUVD works to empower
              vulnerable communities including refugees, women, youth, and persons with
              disabilities.
            </p>
            <p className="welcome-body">
              Our organization was created in response to the social and economic challenges faced
              by displaced populations. We believe that art and creativity are powerful tools for
              healing, education, and transformation.
            </p>
            <p className="welcome-body">
              Today, AUVD stands as a growing organization in Kakuma, dedicated to nurturing
              talent, promoting social cohesion, and advancing sustainable development.
            </p>
          </div>
        </div>
 


</section>

    <section
      ref={whyContentRef}
      className="why-section why-content-animated"
      style={{
        backgroundImage: `linear-gradient(rgba(20, 24, 31, 0.74), rgba(20, 24, 31, 0.54)), url(${whySectionBackgrounds[currentWhyBackground]})`,
      }}
    >
      <div className="why-container why-container-no-image">

        {/* RIGHT — TEXT CONTENT */}
        
        <div className="why-content">
          <h2 className="why-title walking-text why11">
            {"The Need".split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </h2>

          <div className="why-text">
            <div className="zigzag-wrapper">
              <svg className="zigzag-icon" viewBox="0 0 100 40">
                <polyline
                  points="5,30 20,10 35,30 50,10 65,30 80,10 95,30"
                  fill="none"
                  stroke="#994208"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div id="why">
        Refugees face extraordinary challenges before, during, and after displacement 
including conflict, loss of home and loved ones, prolonged uncertainty, and stressful living conditions in camps and settlements. 
These experiences often take a significant emotional and psychological toll,
 increasing the risk of mental health and psychosocial distress. Forced displacement places refugees under prolonged stress that affects emotional well‑being, social functioning, and overall quality of life.

Despite remarkable resilience, many refugees do not have access 
to mental health and psychosocial support (MHPSS) services. In most
 refugee settings, specialized professionals like counselors and therapists 
 are scarce or unavailable, and mainstream services often don’t reach those who 
 need them most. Where support does exist, it frequently reaches only a small portion o
 f the population.

This gap leaves vulnerable individuals especially children, youth,
 women, and survivors of trauma without safe, culturally relevant spaces 
 to process emotions, rebuild confidence, and strengthen social connections. 
 Without such support, emotional suffering can undermine refugees’ ability to heal, 
 engage in education or livelihood activities, and contribute positively to their 
 communities.
            </div>
          </div>


          <br></br>
           <br></br>
            <br></br>
             <br></br>
            
        </div>
      
      </div>
            <p className="part2">
At AUVD, we believe that creative and community driven support systems are essential in addressing these challenges. By integrating arts, creative expression, and psychosocial support into community programs, we help refugees heal, connect, and thrive while promoting emotional well-being, resilience, and positive social transformation.
      </p>

    </section>


    

<div className="programs-cta">
  <button
    className="btn-go-about"
    type="button"
    onClick={() => navigate("/Work")}
  >
    Learn More About the Programs
  </button>
</div>

 <div className="programs">
  <h1>
From Hard Times to Hope: Healing Through Creativity
  </h1>
</div>

    
  {/* ToggleSection */}
  <section className="program-toggle-section">


  <ToggleSection title="🎭 Art as Therapy and Social-Social Emotional Learning at AUVD in Kakuma Refugee Camp ">
    <div className="therapy-toggle-content">
      <p>

     In response to the unique challenges faced by refugee children and youth in Kakuma Refugee 
       Camp, we have developed a holistic and {" "}
        <span style={{ color: "#994208" }}>
          culturally responsive program that integrates Social-Emotional Learning (SEL),
        </span>{" "}
        creative arts therapy principles, and mindfulness practices within a trauma-informed 
        framework. Many children and young people in Kakuma have experienced displacement, 
        loss, interrupted education, and prolonged uncertainty, all of which deeply affect their 
        emotional well-being and future prospects.
      </p>
      <p>
      Our programs promote {" "}
      <span style={{ color: "#994208", fontWeight: "bold", fontFamily: "Poppins, 'Segoe UI', sans-serif" }}>
        healing, unity, creativity, and sustainable development
      </span>{" "}
      in marginalized communities.
      </p>

      <div className="therapy-toggle-gallery" aria-label="Emotional healing program images">
        <div className="therapy-toggle-gallery__frame">
          <img
            src="/emotional1.jpg"
            alt="Children participating in emotional healing activities"
            className="therapy-toggle-gallery__image therapy-toggle-gallery__image--1"
          />
          <img
            src="/emotional2.jpg"
            alt="Refugee youth in a supportive emotional learning session"
            className="therapy-toggle-gallery__image therapy-toggle-gallery__image--2"
          />
          <img
            src="/emotional3.jpg"
            alt="Creative therapy activity with children and youth"
            className="therapy-toggle-gallery__image therapy-toggle-gallery__image--3"
          />
          <img
            src="/emotional4.jpg"
            alt="Community healing and emotional support program moment"
            className="therapy-toggle-gallery__image therapy-toggle-gallery__image--4"
          />
        </div>
      </div>
      
  </div>
   
  </ToggleSection>


  <ToggleSection title="Limited Arts Opportunities in Kakuma">
   
   <div className="camp">
    <div className="content">
    <h1>Limited Art Opportunities in Kakuma Refugee Camp</h1>
                
      
<div class="zigzag-wrapper">
  <svg class="zigzag-icon" viewBox="0 0 100 40">
    <polyline 
      points="5,30 20,10 35,30 50,10 65,30 80,10 95,30"
      fill="none"
      stroke="#f59e0b"
      stroke-width="5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>
    <p>
    Despite the rich creativity and talent found within Kakuma Refugee Camp, many children, youth, women, and vulnerable individuals continue to face serious limitations in accessing artistic and creative opportunities. Resources, training spaces, mentorship, art materials, and platforms for creative growth remain extremely limited, making it difficult for talented individuals to fully develop their potential and use their skills for personal growth and community development.

Many young people in Kakuma experience challenges related to unemployment, trauma, social exclusion, limited education opportunities, and lack of safe spaces for expression and healing. Without access to structured creative and empowerment programs, many talents remain undiscovered and unsupported.

Through our programs in Arts, Healing & Psychosocial Well-being, Education, Youth Development & Empowerment, Livelihoods & Women Economic Empowerment, Peacebuilding & Community Inclusion, and Humanitarian Outreach & Basic Needs Support, we aim to address these gaps by creating safe, inclusive, and empowering spaces for learning, creativity, healing, and community engagement.

Our music, dance, visual arts, theatre, mentorship, and livelihood initiatives help participants build confidence, strengthen emotional wellbeing, develop leadership skills, and access practical opportunities for self-reliance and social inclusion. These programs not only nurture creativity but also promote healing, peacebuilding, dignity, and long-term community resilience within Kakuma Refugee Camp.

    </p>
         <div className="divider"></div>
      </div>
      

     </div>


 

 
  </ToggleSection>
  
{/*    
  <ToggleSection title="Visual Arts Program">
          
  </ToggleSection>  */}
  



</section>


{/* ToggleSection */}
    

 <section className="impact-section">
  
  <div className="impact-wrapper">
    {/* LEFT — TEXT CONTENT */}
    <div ref={healingProgramRef} className="impact-text-area impact-text-animated">
      <h2 className="impact-heading">🎨 Art for Healing</h2>
      <div className="impact-paragraph-group">
        <p className="impact-paragraph">
          This program is designed to support refugees in Kakuma Refugee Camp by using
          creative expression as a powerful tool for emotional well-being, personal development,
          and social connection. In a context where many individuals have experienced
          displacement, trauma, and limited opportunities, the program provides safe, inclusive,
          and supportive spaces where participants can express themselves, build confidence, and
          begin to heal.
        </p>

        <p className="impact-paragraph">
          Through structured activities in music, visual arts, and storytelling, participants are
          able to share their experiences, reconnect with their identities, and develop a stronger
          sense of belonging within their community.
        </p>

        <p className="impact-paragraph">
          These creative spaces not only encourage self-expression, but also strengthen
          resilience and foster positive social interaction among diverse groups.
        </p>
      </div>

      <button
        type="button"
        className="impact-explore-button"
        onClick={() => navigate("/Music")}
      >
        Explore More
      </button>
    </div>
 
  </div>

    
</section>

<section
  ref={therapeuticApproachRef}
  className="impact-ngo-section impact-ngo-animated"
  aria-labelledby="impact-ngo-section-title"
>
  <div className="impact-ngo-content">
   
    <h3 id="impact-ngo-section-title" className="impact-ngo-title">
      Within this program, we use creative expression as a therapeutic approach to:
    </h3>
 
    <h4 className="impact-ngo-subtitle">
      Creative expression that supports healing, confidence, and belonging
    </h4>

    <p className="impact-ngo-text" style={{ color: "#201c1c" }}>
      Creative expression is used intentionally to create safe, supportive spaces where children
      and youth can process difficult experiences, rebuild confidence, and grow through guided
      artistic activities.
    </p>

    <ul className="impact-ngo-list">
      <li>
        <span className="impact-toggle-point-number">0</span>
        <span className="impact-toggle-point-text">Support emotional healing and reduce stress.</span>
      </li>
      <li>
        <span className="impact-toggle-point-number">0</span>
        <span className="impact-toggle-point-text">
          Encourage healthy expression of difficult feelings and personal experiences.
        </span>
      </li>
      <li>
        <span className="impact-toggle-point-number">0</span>
        <span className="impact-toggle-point-text">
          Strengthen self-awareness, confidence, and emotional regulation.
        </span>
      </li>
      <li>
        <span className="impact-toggle-point-number">0</span>
        <span className="impact-toggle-point-text">
          Foster social connection, empathy, and peer support.
        </span>
      </li>
      <li>
        <span className="impact-toggle-point-number">0</span>
        <span className="impact-toggle-point-text">
          Restore hope, identity, and a stronger sense of belonging.
        </span>
      </li>
    </ul>

    <p className="impact-ngo-summary">
      By integrating art with inclusive and participatory learning approaches, AUVD creates
      environments where marginalized children and youth feel valued, heard, and connected.
      Creative arts therapy practices can help participants process trauma, maintain cultural
      identity, and regain a sense of control, dignity, and resilience.
    </p>
  </div>

  <figure className="impact-ngo-media">
    <div className="impact-ngo-image-shell">
      <div className="impact-ngo-image-stack impact-ngo-image-stack-single">
        <img
          src="/together1.jpg"
          alt="Children and youth participating in a therapeutic group session"
          className="impact-ngo-image impact-ngo-image-slide impact-ngo-image-slide-primary"
        />
        <img
          src="/together2.jpg"
          alt="Creative expression activity with children and youth"
          className="impact-ngo-image impact-ngo-image-slide impact-ngo-image-slide-secondary"
        />
      </div>
    </div>
    <figcaption className="impact-ngo-caption">
      Creative healing sessions and community support moments in safe, structured spaces.
    </figcaption>
  </figure>
</section>

  {/* <ToggleSection title="Music Education Program">
    <p>
      We provide training in drums, guitar, piano,
      violin, and vocal development.
    </p>
    <p>
      Music builds confidence, emotional healing,
      and leadership skills among youth.
    </p>
  </ToggleSection> */}

  
<section className="why-section visual-arts-section">
  <div className="why-container">

    {/* LEFT — IMAGE */}
    <div className="why-image-wrapper">
      <img
        src="/drawing.jpg"
        alt="Child exploring visual arts"
        className="why-image"
      />
    </div>

    {/* RIGHT — TEXT CONTENT */}
    <div ref={visualArtsRef} className="why-content why-content-animated">
      <h2 className="why-title">Visual Arts</h2>

      <p className="why-text">
    This program uses {" "}
      <span style={{ color: "#994208", fontWeight: "bold", fontFamily: "Poppins, 'Segoe UI', sans-serif" }}>visual arts</span>{" "}
      as a powerful tool for 
      self‑expression, emotional healing, and personal development for refugees in Kakuma Refugee Camp. 
      Through participatory activities such as {" "}
      <span style={{ color: "#994208", fontWeight: "bold", fontFamily: "Poppins, 'Segoe UI', sans-serif" }}>drawing, painting, and creative crafts,</span>{" "}
      participants are
       encouraged to explore their inner experiences and communicate thoughts and feelings that may be 
       difficult to articulate through words alone. {" "}
      <span style={{ color: "#994208", fontWeight: "bold", fontFamily: "Poppins, 'Segoe UI', sans-serif" }}>
        Art‑making provides a safe, non‑judgmental space where individuals can reflect, create, and connect with themselves and others.
      </span>{" "}
      Research shows that engaging 
       in visual art can help individuals express emotions, build confidence, 
      <span style={{ color: "#994208", fontWeight: "bold", fontFamily: "Poppins, 'Segoe UI', sans-serif" }}>and improve emotional regulation and well‑being,</span>{" "}
      even in contexts of stress and trauma. 
      </p>
      

    <p className="why-text">
        
      </p>
         
 
    </div>

        
       
 
  </div>

    
</section>


<section className="our-why-section">
  <div className="our-why-container">

  

    {/* RIGHT — TEXT CONTENT */}
    <div ref={danceTypingRef} className="our-why-content"> 

      <h2 className="our-why-title"></h2>
          <h2 className="walking-text">
  {"Dance".split("").map((char, i) => (
    <span key={i}>{char}</span>
  ))}
</h2>




      <p className="our-why-text">
        {danceParagraphOne.slice(0, danceTypedChars.first)}
          In an environment where many youth face stress, trauma, unemployment, and limited recreational opportunities, dance creates hope, inspiration, and a sense of belonging. AUVD uses dance not only as entertainment, but also as a pathway for empowerment, resilience, and community connection.

The program further supports talent development by helping participants discover and showcase their abilities through performances, community events, and creative engagement activities.


          <h1>Move with purpose and  Dance with confidence.</h1> 
          <h1>Express yourself through dance and creativity.</h1>
          <h1>Where talent meets opportunity.</h1>
      </p>
      
      <p className="our-why-text">
        {danceParagraphTwo.slice(0, danceTypedChars.second)}
      </p>

      <button
        className="read-more-btn"
        onClick={() => navigate("/dance")}
      >
        Community dance
      </button>
    </div>
    
  </div>
</section>
 







<div className="vocational">
  {/* Text on the left */}
  <div ref={vocationalRef} className="vocational-text-content vocational-text-animated">
    <h2 className="vocational-title">Vocational Education Training (VET)</h2>
    <p className="vocational-text">
      Our Vocational Education and Training (VET) programs empower youth, women, and
      vulnerable community members with practical skills for self-reliance and personal
      development. Through training in tailoring and fashion design, cooking and catering,
      English language learning, after-school educational support, hairdressing and beauty,
      and handcraft and art skills such as beadwork and painting, we help participants build
      confidence, create income opportunities, and strengthen their future livelihoods.
    </p>

    <button
      className="btn-go-about vocational-explore-btn"
      onClick={() => navigate("/work#livelihoods-women")}
    >
      Explore more
    </button>



  </div>

  {/* Image on the right */}
  <img
    key={vocationalImages[currentVocationalImage].src}
    src={vocationalImages[currentVocationalImage].src}
    alt={vocationalImages[currentVocationalImage].alt}
    className="vocational-image vocational-image-fade"
  />
</div>
    


 <section
  ref={impactSectionRef}
  className={`impactSection ${isImpactVisible ? "impactSection--visible" : ""}`}
>
  <div className="impactWrapper">

     

    <h2 className="impactHeading">Our Impact</h2>

    <p className="impactText">
      Transforming lives through art, healing, and opportunity in Kakuma Refugee Camp
    </p>

    <div className="impactCards">
      {impactStats.map((stat, index) => (
        <div
          key={stat.key}
          className={`impactBox ${stat.wide ? "impactBox--wide" : ""} ${
            isImpactVisible ? "impactBox--visible" : ""
          }`}
          style={{ transitionDelay: `${index * 120}ms` }}
        >
          <div className="impactCardHeader">
            <div className="impactIconBadge" aria-hidden="true">
              {stat.icon}
            </div>
            <h3 className="impactValue">
              {impactCounts[stat.key]}
              {stat.suffix}
            </h3>
          </div>
          <h4 className="impactTitle">{stat.title}</h4>
          {stat.info.map((line) => (
            <p key={line} className="impactInfo">
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  </div>
</section>


<section class="partners-section">
  <div class="container">
    <div ref={partnersIntroRef} className="partners-copy partners-copy-animated">
      <h2 class="title">Our Partners</h2>
      <p class="subtitle">
        We are proud to collaborate with international organizations that empower music, education, and community development worldwide.
      </p>
    </div>

    <div class="partners-grid">

 
      <a href="https://www.transylvaniansymphony.org/" target="_blank" class="partner-card tsf">
      
      </a>

    
      <a href="https://www.f2fmusicfoundation.org/" target="_blank" class="partner-card f2f">
        <span>F2F Music Foundation</span>
      </a>

   
      <a href="https://www.en-rich-ment.org/" target="_blank" class="partner-card enrichment">
       
      </a>

 
      <a href="https://cammomusic.org/" target="_blank" class="partner-card cammo">
 
      </a>
       
      
      <a href="https://hungryformusic.org/" target="_blank" class="partner-card hungry">
      </a>

       <a href="https://becauseinternational.org/" target="_blank" class="partner-card because">
      </a>

      <a
        href="https://kakumasound.wordpress.com/"
        target="_blank"
        rel="noreferrer"
        className="partner-card kakuma"
        aria-label="Kakuma Sound"
      >
      </a>
         
          <a
            href="https://www.thebridgelife.com/?utm_source=chatgpt.com"
            target="_blank"
            rel="noreferrer"
            className="partner-card bright"
            aria-label="The Bridge Life"
          >
      </a>

          <a
            href="https://www.yetcafrica.org/home"
            target="_blank"
            rel="noreferrer"
            className="partner-card center"
            aria-label="YETC Africa"
          >
          </a>

    </div>
  </div>
</section>




 
 
    </>
  );
}

export default Home;