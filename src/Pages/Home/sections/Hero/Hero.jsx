import { useEffect, useState } from "react";
import ImpactHero from "../../../../components/ImpactHero";
import "./Hero.css";

/* Home hero — now the shared ImpactHero component (the exact design Our
   Story, Work, Pricing and Events use), carrying this page's own label,
   heading, intro paragraph, photo slideshow and destinations:
   - "Learn more about us" maps onto the component's button slot (/about).
   - "Explore more", "Share your creativity", "Music education" and
     "Community dance" map onto its links slot (the pill row under the
     paragraph), each keeping its exact existing route.
   The five social links keep their markup, classes and hrefs; they sit
   over the photo's right side so the copy block matches the other heroes. */
function Hero({ heroTitleParts, slides }) {
  const heroTitleFull = `${heroTitleParts.before}${heroTitleParts.highlight}${heroTitleParts.after}`;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow rotation — kept from the old hero (Home's own images).
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((previous) => (previous === slides.length - 1 ? 0 : previous + 1));
    }, 10000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-hero-bleed">
      <ImpactHero
        label="Art & Unity for Vulnerable Development"
        heading={heroTitleFull}
        paragraph="Art and Unity for Vulnerable Development (AUVD) is a refugee-led organization
          transforming lives in Kakuma Refugee Camp through creativity, skills development,
          and inclusive community programs."
        buttonText="Learn more about us"
        buttonHref="/about"
        image={slides[currentSlide].image}
        links={[
          { href: "/Work", label: "Explore more" },
          { href: "/Vocational", label: "Share your creativity" },
          { href: "/Music", label: "Music education" },
          { href: "/dance", label: "Community dance" },
        ]}
      />

      <ul className="auvd-social-links" aria-label="Social media links">
        <li>
          <a
            className="auvd-social-link auvd-social-facebook"
            href="https://www.facebook.com/profile.php?id=61569926836907"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            aria-label="Facebook"
          >
            <i className="bx bxl-facebook"></i>
          </a>
        </li>
        <li>
          <a
            className="auvd-social-link auvd-social-linkedin"
            href="https://ke.linkedin.com--"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <i className="bx bxl-linkedin"></i>
          </a>
        </li>
        <li>
          <a
            className="auvd-social-link auvd-social-instagram"
            href="https://www.instagram.com/art.unityvulnerabledev2024/"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            aria-label="Instagram"
          >
            <i className="bx bxl-instagram"></i>
          </a>
        </li>
        <li>
          <a
            className="auvd-social-link auvd-social-youtube"
            href="https://www.youtube.com/@Artandunity-q2q"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
            aria-label="YouTube"
          >
            <i className="bx bxl-youtube"></i>
          </a>
        </li>
        <li>
          <a
            className="auvd-social-link auvd-social-tiktok"
            href="https://www.tiktok.com/@artunity_vulnerabledev"
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok"
            aria-label="TikTok"
          >
            <i className="bx bxl-tiktok"></i>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Hero;
