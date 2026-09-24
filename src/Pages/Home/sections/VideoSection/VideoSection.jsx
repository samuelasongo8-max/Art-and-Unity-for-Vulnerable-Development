import "./VideoSection.css";

/* "Empowering young voices through music" — restyled into the Our Impact
   two-column pattern: title + paragraph in one column, the existing video
   embed in the media column (video on the right here; the Grant section
   above has its image on the left, so the sides alternate). */
function VideoSection() {
  return (
    <section className="auvd-story-section auvd-story-section--tint">
      <div className="auvd-story-container">
        <div className="auvd-story-body auvd-story-body--flip">

          <div className="auvd-story-media">
            <div className="auvd-story-media-frame">
              <iframe
                src="https://www.youtube.com/embed/omWzt2QkaJE"
                title="Global Innovation Challenge video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="auvd-story-text">
            <h1 className="auvd-story-title">Empowering young voices through music</h1>
            <p>
              Every note is a step toward confidence, creativity, and a brighter future. We believe music gives young people the opportunity to discover their talents, express themselves, and dream bigger.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default VideoSection;