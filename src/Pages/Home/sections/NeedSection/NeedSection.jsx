import { useEffect, useState } from "react";
import "./NeedSection.css";

/* "The Need" — restyled into the Our Impact two-column pattern:
   existing cycling background image in the media column (right, via the
   --flip modifier, alternating from the "Who We Are" section above),
   title + 3 paragraphs + "Join us" link on the left. The old inline
   <style> block (and its underline / rule decorations) is gone; shared
   layout and typography come from the .auvd-story-* classes imported
   once via Home.css. */
function PoolPromoBanner({ backgrounds = ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1400&auto=format&fit=crop'] }) {
  const [currentBackground, setCurrentBackground] = useState(0);

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
    <section className="auvd-story-section">
      <div className="auvd-story-container">
        <div className="auvd-story-body auvd-story-body--flip">

          <div className="auvd-story-media">
            <div
              className="promo-image-wrapper"
              role="img"
              aria-label="AUVD community programs"
              style={{
                backgroundImage: `url(${backgrounds[currentBackground]})`,
              }}
            ></div>
          </div>

          <div className="auvd-story-text">
            <h2 className="auvd-story-title">The Need</h2>

            <p>
              Children and young people in Kakuma Refugee Camp face many challenges caused by conflict, forced displacement, poverty, interrupted education, and prolonged uncertainty. These experiences can affect their mental health, emotional well-being, confidence, education, and future opportunities.
            </p>

            <p>
              Many have limited access to safe spaces, quality education, psychosocial support, creative activities, and skills development that help them heal, learn, and reach their full potential.
            </p>

            <p>
              AUVD responds to these challenges by providing community-led programs that combine creative arts, music education, psychosocial support, inclusive education, and life skills development. Through safe and inclusive spaces, we help children and young people build confidence, strengthen resilience, discover their talents, develop practical skills, and create positive pathways toward a brighter future.
            </p>

            <a href="/donate" className="auvd-cta-link">
              Join us
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default PoolPromoBanner;