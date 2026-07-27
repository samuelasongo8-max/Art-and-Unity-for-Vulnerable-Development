import { useEffect, useState } from "react";
import useRevealClass from "../../hooks/useRevealClass";

function PoolPromoBanner({ backgrounds = ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1400&auto=format&fit=crop'] }) {
  const [currentBackground, setCurrentBackground] = useState(0);
  const contentRef = useRevealClass("promo-content-entered", 0.3);

  useEffect(() => {
    if (backgrounds.length <= 1) return;
    const interval = window.setInterval(() => {
      setCurrentBackground((previous) =>
        previous === backgrounds.length - 1 ? 0 : previous + 1
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <>
      <style>{`
        /* ==========================================================
           POOL PROMO BANNER SECTION (Mobile Image Full Visibility Fix)
           ========================================================== */

        .pool-promo-section {
            width: 100%;
            max-width: 1200px;
            margin: 40px auto;
            box-sizing: border-box;
            padding: 0 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .pool-promo-section *, 
        .pool-promo-section *::before, 
        .pool-promo-section *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        /* Main Container Wrapper with Background Image and Gradient */
        .pool-promo-section .promo-container {
            position: relative;
            width: 100%;
            min-height: 400px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: flex;
            align-items: flex-end;
            padding: 0;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transition: background-image 0.8s ease-in-out;
        }

        /* Dark Navy Blue Overlay Box matching the exact layout style */
        .pool-promo-section .promo-card {
            width: 100%;
            background-color: #0b1437; /* Deep Navy Blue */
            padding: 50px 60px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            position: relative;
            z-index: 2;
        }

        /* Content Wrapper: Layout for Title and Paragraphs */
        .pool-promo-section .promo-text-wrapper {
            width: 100%;
            max-width: 900px;
        }

        .pool-promo-section .promo-title {
            font-size: clamp(2rem, 2.7vw, 2.6rem);
            font-weight: 700;
            color: #ffffff;
            line-height: 1.2;
            letter-spacing: -0.01em;
            margin-bottom: 20px;
        }

        /* Normal styling for paragraph text */
        .pool-promo-section .orang {
            color: #ffffff;
            font-size: 1rem;
            line-height: 1.7;
            margin-bottom: 16px;
        }

        .pool-promo-section .orang:last-child {
            margin-bottom: 0;
        }
 
        .pool-promo-section .join-us-btn {
            display: inline-flex;
            margin-top: 24px;
            padding: 12px 24px;
            background-color: #ff6600;
            color: #ffffff;
            text-decoration: none;
            font-weight: 700;
            border-radius: 999px;
            transition: background-color 0.2s ease, transform 0.2s ease;
        }
 
        .pool-promo-section .join-us-btn:hover,
        .pool-promo-section .join-us-btn:focus-visible {
            background-color: #ff8a33;
            transform: translateY(-1px);
        }
 
        /* Animation Classes */
        .pool-promo-section.promo-content-animated .promo-title,
        .pool-promo-section.promo-content-animated .promo-text-wrapper {
            opacity: 0;
            transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .pool-promo-section.promo-content-animated .promo-title {
            transform: translateY(24px);
        }

        .pool-promo-section.promo-content-animated .promo-text-wrapper {
            transform: translateY(20px);
        }

        .pool-promo-section.promo-content-entered .promo-title,
        .pool-promo-section.promo-content-entered .promo-text-wrapper {
            opacity: 1;
            transform: translate(0, 0);
        }

        /* Responsive Breakpoints for Tablets & Mobile */
        @media (max-width: 900px) {
            .pool-promo-section .promo-card {
                padding: 40px 30px;
            }
        }

        @media (max-width: 550px) {
            .pool-promo-section {
                padding: 0 10px;
                margin: 20px auto;
            }

            .pool-promo-section .promo-container {
                min-height: auto;
                height: 240px; 
                background-size: cover;
                background-position: center;
            }

            .pool-promo-section .promo-card {
                position: relative;
                width: 100%;
                background-color: #0b1437;
                padding: 24px 20px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            }

            .pool-promo-section .promo-title {
                font-size: 1.5rem;
                margin-bottom: 14px;
            }

            .pool-promo-section .orang {
                font-size: 0.95rem;
                line-height: 1.6;
            }
        }
      `}</style>

      <section
        ref={contentRef}
        className="pool-promo-section promo-content-animated"
      >
        <div 
          className="promo-container"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 14, 23, 0.1), rgba(10, 14, 23, 0.3)), url(${backgrounds[currentBackground]})`,
          }}
        >
          {/* Empty spacer area for mobile so the background image is fully revealed */}
        </div>
        <div className="promo-card" style={{ marginTop: '-4px' }}>
          <div className="promo-text-wrapper">
            <h2 className="promo-title">
              The Need
            </h2>
            
            <p className="orang">
              Children and young people in Kakuma Refugee Camp face many challenges caused by conflict, forced displacement, poverty, interrupted education, and prolonged uncertainty. These experiences can affect their mental health, emotional well-being, confidence, education, and future opportunities.
            </p>

            <p className="orang">
              Many have limited access to safe spaces, quality education, psychosocial support, creative activities, and skills development that help them heal, learn, and reach their full potential.
            </p>

            <p className="orang">
              AUVD responds to these challenges by providing community-led programs that combine creative arts, music education, psychosocial support, inclusive education, and life skills development. Through safe and inclusive spaces, we help children and young people build confidence, strengthen resilience, discover their talents, develop practical skills, and create positive pathways toward a brighter future.
            </p>
            <a href="/donate" className="join-us-btn">
              Join us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default PoolPromoBanner;