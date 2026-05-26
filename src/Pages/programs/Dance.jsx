import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Dance.css";
import ToggleSection from "../../components/ToggleSection";
import speakers from "../../assets/speakers.webp";
const Dance = () => {
  const danceDescriptionText =
    "Through Art for Healing Program, We uses dance and movement as a powerful form of non-verbal expression to support emotional healing, physical well-being, and social connection among refugees in Kakuma Refugee Camp.";
  const danceHeroContentRef = useRef(null);
  const academyContentRef = useRef(null);
  const [isDanceDescriptionVisible, setIsDanceDescriptionVisible] = useState(false);
  const [danceDescriptionTypedChars, setDanceDescriptionTypedChars] = useState(0);
  const [isTikTokExpanded, setIsTikTokExpanded] = useState(false);

  useEffect(() => {
    const sectionElement = danceHeroContentRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("dance-hero-content-entered");
        setIsDanceDescriptionVisible(true);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isDanceDescriptionVisible || danceDescriptionTypedChars >= danceDescriptionText.length) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setDanceDescriptionTypedChars((previous) => previous + 1);
    }, 18);

    return () => window.clearTimeout(timeoutId);
  }, [danceDescriptionText.length, danceDescriptionTypedChars, isDanceDescriptionVisible]);

  useEffect(() => {
    const sectionElement = academyContentRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionElement.classList.add("academy-content-entered");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  return (
    <>
    
 <div className="programRoot">

  <section
    className="danceHeroSection"
    style={{
      backgroundImage: `linear-gradient(rgba(7, 23, 54, 0.74), rgba(7, 23, 54, 0.72)), url(${speakers})`,
    }}
  >
    <div className="danceHeroGrid">

      {/* TEXT SIDE */}
      <div ref={danceHeroContentRef} className="danceHeroContent dance-hero-content-animated">

        <h2 className="danceAnimatedTitle">
          {"Dance".split("").map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </h2>

        <div className="danceIconRow">
          <div className="dancePulseIcon"></div>
          <div className="dancePulseIcon"></div>
          <div className="dancePulseIcon"></div>
          <div className="dancePulseIcon"></div>
          <div className="dancePulseIcon"></div>
          <div className="dancePulseIcon"></div>
          <div className="dancePulseIcon"></div>
          <div className="dancePulseIcon"></div>
        </div>

        <p className="danceDescription">
          {danceDescriptionText.slice(0, danceDescriptionTypedChars)}
        </p>

        <div className="danceHeroActions">
          <button
            type="button"
            className="danceHeroButton danceHeroButtonPrimary"
            onClick={() => academyContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            Community Dance
          </button>
          <Link className="danceHeroButton danceHeroButtonSecondary" to="/Work">
            Learn More About the Programs
          </Link>
        </div>

        <div className="danceActivityBox">
          <h3 className="danceActivityTitle">Activities include:</h3>

          <ul className="danceActivityList">
            <li>Traditional and contemporary dance</li>
            <li>Creative movement and expression</li>
            <li>Group choreography and performances</li>
            <li>Safer and more inclusive schools</li>
            <li>Cultural dance exchange and community showcases</li>
          </ul>

          <div className="zigzag-wrapper">
            <svg className="zigzag-icon" viewBox="0 0 100 40">
              <polyline
                points="5,30 20,10 35,30 50,10 65,30 80,10 95,30"
                fill="none"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

      </div>

    </div>
  </section>

</div>


   <section className="second">
        
 
   <section className="academy">

      {/* IMAGE BANNER */}
      <div className="academy-banner">
        <img src={speakers} alt="Chezacheza team" />

        {/* overlay */}
        <div className="banner-overlay"></div>
      </div>

      {/* CONTENT */}
      <div ref={academyContentRef} className="academy-content academy-content-animated">
        <h1>Dance Training Program</h1>

        <p>
          Dance Training Program is a 3-month creative and empowerment initiative designed to support children and youth in Kakuma Refugee Camp through dance, artistic expression, and personal development.
        </p>

        <p>
          The program provides participants with a safe and inclusive environment where they can develop their talents, improve physical fitness, build confidence, and strengthen teamwork and social interaction skills. Through dance and movement, participants are encouraged to express themselves creatively while promoting emotional well-being and cultural exchange.
        </p>

        <p>
          The program runs for 3 months, giving participants consistent time to learn, practice, grow in confidence, and engage in performance activities throughout the training period.
        </p>

        <p>
          The Dance Training Program also creates opportunities for young people to showcase their talents through community performances, creative events, and cultural activities that promote unity and positive community engagement in Kakuma Refugee Camp.
        </p>

        <div className="divider"></div>

        <h2>3-Month Dance Training Program</h2>

        <div className="academy-program-details">
          <p><strong>Program Duration:</strong> 3 Months</p>
          <p><strong>Location:</strong> Kakuma Refugee Camp, Kenya</p>
        </div>

        <Link className="academy-join-pill" to="/contact#creative-arts-application">
          Join the Program
        </Link>

        <p className="academy-closing-note">
          Join AUVD's Dance Program and become part of a creative space where talent, confidence, and opportunity grow together.
        </p>

        <section className="dance-tiktok-section" aria-label="Dance TikTok video">
          <div className={`dance-tiktok-frame-shell${isTikTokExpanded ? " dance-tiktok-frame-shell-expanded" : ""}`}>
            <button
              type="button"
              className="dance-tiktok-expand"
              onClick={() => setIsTikTokExpanded((previous) => !previous)}
              aria-label={isTikTokExpanded ? "Collapse TikTok video" : "Expand TikTok video"}
            >
              {isTikTokExpanded ? "Collapse" : "Expand"}
            </button>

            <iframe
              className="dance-tiktok-frame"
              src="https://www.tiktok.com/embed/v2/7614943083079421205"
              title="AUVD TikTok dance video"
              allow="encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      </div>
     

    </section>





  <section className="section@">

    <div className="part1 dance-feature-card">

 <div className="answer">
      <div className="icon"></div>
      
          <img src="/miodern dance.jpg" alt="Modern dance" />
          <div className="dance-feature-overlay">
            <p>
              Dance is more than performance it is a pathway to confidence, creativity, unity, and opportunity for young people in Kakuma Refugee Camp
            </p>
          </div>
        </div>
  </div>

</section>






</section>








      
    
    </>
  );
};

export default Dance;