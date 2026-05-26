import "./FeaturedVideo.css";
import useRevealClass from "../../hooks/useRevealClass";

function FeaturedVideo({ partnerLinks }) {
  const sectionRef = useRevealClass("video-entered", 0.3);

  return (
    <section className="video-section">
      <div ref={sectionRef} className="video video-animated">
        <div className="video-copy">
          <p className="video-kicker">Featured Video</p>
          <h2>Music Across Youth Peace Week</h2>
          <p>
            Art and Unity for Vulnerable Development (AUVD), in partnership with{" "}
            <a className="video-partner-link" href={partnerLinks.f2f} target="_blank" rel="noreferrer">
              F2F Music Foundation
            </a>
            , UnityNet International, Andrew Network - AHIAGBA TV, and{" "}
            <a className="video-partner-link" href={partnerLinks.tsf} target="_blank" rel="noreferrer">
              Transylvanian Symphony Foundation
            </a>
            , successfully delivered three impactful workshops during Youth Peace Week in Kakuma
            Refugee Camp.
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
  );
}

export default FeaturedVideo;