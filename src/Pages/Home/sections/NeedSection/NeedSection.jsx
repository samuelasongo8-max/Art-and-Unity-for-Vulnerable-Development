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
            POOL PROMO BANNER SECTION (Clean Split Layout)
            ========================================================== */

        .pool-promo-section {
            width: 100%;
            max-width: 1200px;
            margin: 80px auto;
            box-sizing: border-box;
            padding: 0 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .pool-promo-section *, 
        .pool-promo-section *::before, 
        .pool-promo-section *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        /* Main Grid Container matching split layout */
        .pool-promo-section .promo-container {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        /* Left Image Column */
        .pool-promo-section .promo-image-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 450px;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            transition: background-image 0.8s ease-in-out;
        }

        /* Right Content Column */
        .pool-promo-section .promo-card {
            width: 100%;
            background-color: transparent;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            position: relative;
            z-index: 2;
        }

        .pool-promo-section .promo-text-wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
        }

        .pool-promo-section .promo-title {
            font-family: "Poppins", sans-serif, -apple-system;
            font-size: clamp(2rem, 3vw, 2.5rem);
            font-weight: 800;
            color: #ff6600; /* Warm orange accent */
            text-transform: uppercase;
            line-height: 1.2;
            margin-bottom: 1rem;
            letter-spacing: 0.02em;
        }

        .pool-promo-section .title-underline {
            width: 60px;
            height: 3px;
            background-color: #ff6600;
            margin-bottom: 1.5rem;
        }

        .pool-promo-section .orang {
            font-size: 1rem;
            line-height: 1.7;
            color: #475569;
            margin-bottom: 1.2rem;
        }

        .pool-promo-section .orang:last-of-type {
            margin-bottom: 1.5rem;
        }

        .pool-promo-section .split-action-block {
            width: 100%;
            border-top: 1px solid #e2e8f0;
            padding-top: 1.5rem;
        }

        .pool-promo-section .join-us-btn {
            display: inline-block;
            font-family: "Poppins", sans-serif, -apple-system;
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #ff6600;
            text-decoration: none;
            border: 2px solid #ff6600;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            transition: all 0.3s ease;
            background-color: transparent;
            cursor: pointer;
        }

        .pool-promo-section .join-us-btn:hover,
        .pool-promo-section .join-us-btn:focus-visible {
            background-color: #ff6600;
            color: #ffffff;
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
            .pool-promo-section {
                padding: 0 20px;
                margin: 40px auto;
            }

            .pool-promo-section .promo-container {
                grid-template-columns: 1fr;
                gap: 2.5rem;
            }

            .pool-promo-section .promo-image-wrapper {
                min-height: 350px;
            }

            .pool-promo-section .promo-card {
                text-align: left;
            }
        }
      `}</style>

      <section
        ref={contentRef}
        className="pool-promo-section promo-content-animated"
      >
        <div className="promo-container">
          <div 
            className="promo-image-wrapper"
            style={{
              backgroundImage: `url(${backgrounds[currentBackground]})`,
            }}
          ></div>
          <div className="promo-card">
            <div className="promo-text-wrapper">
              <h2 className="promo-title">
                The Need
              </h2>
              <div className="title-underline"></div>
              
              <p className="orang">
                Children and young people in Kakuma Refugee Camp face many challenges caused by conflict, forced displacement, poverty, interrupted education, and prolonged uncertainty. These experiences can affect their mental health, emotional well-being, confidence, education, and future opportunities.
              </p>

              <p className="orang">
                Many have limited access to safe spaces, quality education, psychosocial support, creative activities, and skills development that help them heal, learn, and reach their full potential.
              </p>

              <p className="orang">
                AUVD responds to these challenges by providing community-led programs that combine creative arts, music education, psychosocial support, inclusive education, and life skills development. Through safe and inclusive spaces, we help children and young people build confidence, strengthen resilience, discover their talents, develop practical skills, and create positive pathways toward a brighter future.
              </p>

              <div className="split-action-block">
                <a href="/donate" className="join-us-btn">
                  Join us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PoolPromoBanner;