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
  const whySectionBackgrounds = ["/Kakuma.jpg", "/guitar2.jpg", kibodiii];
  const slideCount = slides.length;
  const whySectionBackgroundCount = whySectionBackgrounds.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentWhyBackground, setCurrentWhyBackground] = useState(0);
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
      <section className="hero">
        <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="hero-image" />
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

          <button className="hero-explore-btn" onClick={() => navigate("/work")}>
            Explore More
          </button>

          <button className="hero-submit-btn" onClick={() => navigate("/vocational")}>
            Share Your Creativity
          </button>

          <button className="hero-music-btn" onClick={() => navigate("/music")}>
            music education
          </button>

          <button className="hero-dance-btn" onClick={() => navigate("/dance")}>
            Community dance
          </button>
           </div>

        </div>


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
      className="why-section"
      style={{
        backgroundImage: `linear-gradient(rgba(20, 24, 31, 0.74), rgba(20, 24, 31, 0.54)), url(${whySectionBackgrounds[currentWhyBackground]})`,
      }}
    >
      <div className="why-container">

        {/* LEFT — IMAGE */}
        <div className="why-image-wrapper">    
          <img
            src="/why-kid.webp"      
            alt="kid thinking"
            className="why-image"
          />
        </div>
        <hr className="hr"></hr>

        {/* RIGHT — TEXT CONTENT */}
        
        <div ref={whyContentRef} className="why-content why-content-animated">
          <h2 className="why-title walking-text why11">
            {"Our Why".split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </h2>

          <div className="why-text">
            <div className="zigzag-wrapper">
              <svg className="zigzag-icon" viewBox="0 0 100 40">
                <polyline
                  points="5,30 20,10 35,30 50,10 65,30 80,10 95,30"
                  fill="none"
                  stroke="#f59e0b"
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

      
 <div class="programs">
  <h1>
    <span>O</span><span>U</span><span>R</span> 
    <span>P</span><span>R</span><span>O</span><span>G</span><span>R</span><span>A</span><span>M</span><span>S</span>
  </h1>
</div>

    
  {/* ToggleSection */}
  <section className="program-toggle-section">


  <ToggleSection title="🎭 Art as Therapy and Social-Social Emotional Learning at AUVD in Kakuma Refugee Camp ">
    <div className="therapy-toggle-content">
      <p>

     In response to the unique challenges faced by refugee children and youth in Kakuma Refugee 
       Camp, we have developed a holistic and {" "}
        <span style={{ color: "#f59e0b" }}>
          culturally responsive program that integrates Social-Emotional Learning (SEL),
        </span>{" "}
        creative arts therapy principles, and mindfulness 
      practices within a trauma-informed framework. Many children and young people 
     in Kakuma have experienced displacement, loss, interrupted education, 
     and prolonged uncertainty, all of which deeply affect their emotional well-being and future 
     prospects.
      </p>
      <p>
      Our programs promote {" "}
      <span style={{ color: "#f59e0b" }}>
        healing, unity, creativity, and sustainable development
      </span>{" "}
      in marginalized communities.
      </p>

      <div className="why-image-wrapper">
        <img
          src="/mwamba.jpg"
          alt="Art therapy session"
          className="pen"
        />
      </div>
  </div>
   
  </ToggleSection>


  <ToggleSection title="Limited Arts Opportunities in Kakuma">
   
   <div className="camp">
    <div className="content">
    <h1>Limited Art Opportunities in Kakuma Refugee Camp</h1>
                
{/*       
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
</div> */}
    <p>
     At the same time, the majority of residents in Kakuma face significant limitations in 
     access to resources and opportunities to develop their talents particularly in the arts.
      Creative platforms, materials, mentorship, and pathways for artistic growth are scarce. 
      As a result, many gifted individuals, both adults and children, are unable to fully 
      realize their potential.

Through our Music Education Program, Visual Art Program, and Dance 
Program, we provide structured, safe, and inclusive creative spaces where participants 
can express themselves freely, rebuild confidence, and develop healthy coping mechanisms. 
These programs were intentionally designed to empower refugees children, youth, adults, and 
marginalized groups by equipping them with practical artistic skills, emotional resilience, 
and opportunities for personal and professional growth.

Our initiative goes beyond artistic instruction. It fosters healing, unity, 
leadership, and sustainable community development. By expanding access to creative expression, 
we are not only nurturing talent but also restoring dignity, strengthening social cohesion, and 
creating pathways toward long-term opportunity and self-reliance within marginalized communities.
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
          Art for Healing is designed to support refugees in Kakuma Refugee Camp by using
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
    </div>

   
 
  </div>

    
</section>

<section className="impact-ngo-section" aria-labelledby="impact-ngo-section-title">
  <figure className="impact-ngo-media">
    <div className="impact-ngo-image-shell">
      <img
        src="/mental.jpg"
        alt="Children and youth taking part in a healing and support session"
        className="impact-ngo-image"
      />
    </div>
    <figcaption className="impact-ngo-caption">
      Creative healing session in a safe and supportive community setting.
    </figcaption>
  </figure>

  <div className="impact-ngo-content">
    <p className="impact-ngo-label">Therapeutic Approach</p>
    <h3 id="impact-ngo-section-title" className="impact-ngo-title">
      Within this program, we use creative expression as a therapeutic approach to:
    </h3>

    <span className="impact-toggle-kicker">Therapeutic Outcomes</span>
    <h4 className="impact-ngo-subtitle">
      Creative expression that supports healing, confidence, and belonging
    </h4>

    <p className="impact-ngo-text">
      Creative expression is used intentionally to create safe, supportive spaces where children
      and youth can process difficult experiences, rebuild confidence, and grow through guided
      artistic activities.
    </p>

    <ul className="impact-ngo-list">
      <li>
        <span className="impact-toggle-point-number">01</span>
        <span className="impact-toggle-point-text">Support emotional healing and reduce stress.</span>
      </li>
      <li>
        <span className="impact-toggle-point-number">02</span>
        <span className="impact-toggle-point-text">
          Encourage healthy expression of difficult feelings and personal experiences.
        </span>
      </li>
      <li>
        <span className="impact-toggle-point-number">03</span>
        <span className="impact-toggle-point-text">
          Strengthen self-awareness, confidence, and emotional regulation.
        </span>
      </li>
      <li>
        <span className="impact-toggle-point-number">04</span>
        <span className="impact-toggle-point-text">
          Foster social connection, empathy, and peer support.
        </span>
      </li>
      <li>
        <span className="impact-toggle-point-number">05</span>
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
        src="/why-kid.webp"
        alt="Child exploring visual arts"
        className="why-image"
      />
    </div>

    {/* RIGHT — TEXT CONTENT */}
    <div ref={visualArtsRef} className="why-content why-content-animated">
      <h2 className="why-title">Visual Arts</h2>

      <p className="why-text">
    This program uses {" "}
      <span style={{ color: "#ec6104" }}>visual arts</span>{" "}
      as a powerful tool for 
      self‑expression, emotional healing, and personal development for refugees in Kakuma Refugee Camp. 
      Through participatory activities such as {" "}
      <span style={{ color: "#ec6104" }}>drawing, painting, and creative crafts,</span>{" "}
      participants are
       encouraged to explore their inner experiences and communicate thoughts and feelings that may be 
       difficult to articulate through words alone. {" "}
      <span style={{ color: "#ec6104" }}>
        Art‑making provides a safe, non‑judgmental space where individuals can reflect, create, and connect with themselves and others.
      </span>{" "}
      Research shows that engaging 
       in visual art can help individuals express emotions, build confidence, 
      <span style={{ color: "#ec6104" }}>and improve emotional regulation and well‑being,</span>{" "}
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
      className="vocational-explore-btn"
      onClick={() => navigate("/work")}
    >
      Explore more
    </button>



  </div>

  {/* Image on the right */}
  <img
    src="/why-kid.webp"
    alt="Visual Arts Program"
    className="vocational-image"
  />
</div>
    


 <section
  ref={impactSectionRef}
  className={`impactSection ${isImpactVisible ? "impactSection--visible" : ""}`}
>
  <div className="impactWrapper">

    <div className="impactEyebrow">NGO Impact Snapshot</div>

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
         
        <a href="https://www.thebridgelife.com//" target="_blank" className="partner-card bright">
      </a>

    </div>
  </div>
</section>




 
 
    </>
  );
}

export default Home;