import "./VideoSection.css";

function VideoSection() {
  return (
    <>

    <h1>Empowering young voices through music </h1>
    <p> 

Every note is a step toward confidence, creativity, and a brighter future. We believe music gives young people the opportunity to discover their talents, express themselves, and dream bigger.</p>
    
    <section className="video-section">
     
  
      <div className="video-embed-wrapper">
      
        <iframe
          src="https://www.youtube.com/embed/omWzt2QkaJE"
          title="Global Innovation Challenge video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
    </>
  );
}

export default VideoSection;