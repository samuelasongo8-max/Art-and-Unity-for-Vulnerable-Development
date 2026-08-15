import { Link } from "react-router-dom";
import "./ImpactAll.css";

const ImpactAll = () => {
  return (
    <>
    <section className="impact-hero">
        <br />
            <br />
                <br />
                    <br />
                        <br />
                            <br />
                                <br />
                                    
    <br />
      <img
        src="/donation-2.jpg"
        alt="Refugee supported by RefugePoint"
        className="impact-bg-image"
      />
      <div className="impact-overlay"></div>
      <div className="impact-content">
        <div className="impact-text">
         
          <h1>
            Investing <em> in Music.</em> Empowering Young People.
          </h1>
           <br></br>
                <br></br>
          <p>
            See how generous partners have helped bring hundreds of musical instruments to young people in Kakuma Refugee Camp.
          </p>
            More than 200 musical instruments. More opportunities to learn, create, and grow.
          <br></br>
             <br></br>
            
            Today, these donations continue to support young musicians as they learn, practice, perform, and discover their talents through music. But the need continues. With your support, we can put more instruments into the hands of young people and expand access to quality music education in our community.
               <br></br>
             <br></br>
          <div className="impact-buttons">
            <Link to="/donate" className="btn btn-primary">
              Support Our Work <span className="arrow">→</span>
            </Link>
            
          </div>
        </div>
      </div>
          <br></br>
              <br></br>
                  <br></br>
                     
    </section>

    <br></br>
    

     <section className="auvd-music-donation-section">
      <div className="auvd-music-donation-container">

        {/* LEFT — IMAGE */}
        <div className="auvd-music-donation-image">
          <img
            src="/donation-5.jpg"
            alt="Young people learning and playing music in Kakuma"
          />
        </div>

        {/* RIGHT — CONTENT */}
        <div className="auvd-music-donation-content">

          <span className="auvd-music-donation-label">
            OUR MUSIC JOURNEY || ||
          </span>
         
          <h2>
            Music That <span>Reached Kakuma</span>
          </h2>

          <div className="auvd-music-donation-line"></div>

          <p className="auvd-music-donation-intro">
            Every instrument can open a door to learning, creativity,
            confidence, and opportunity for a young person.
          </p>

          <p>
            In 2025, AUVD received its first major donation of musical
            instruments from the <strong>Transylvanian Symphony Foundation</strong>.
            More than <strong>180 musical instruments</strong> reached Kakuma,
            including guitars, clarinets, saxophones, violins, a piano,
            and other instruments.
          </p>
    
          <p>
            This donation helped establish and strengthen AUVD's
            <strong>  Music Education Program,  
          giving young people in Kakuma greater access</strong>, to instruments and music training.
            {/* <strong> 25 additional instruments</strong>, including pianos
            and guitars. The instruments were shipped to Kakuma to help
            expand access to music education. */}
          </p>
             
          <a
            href="/donate"
            className="auvd-music-donation-button"
          >
            DONATE TODAY
            <span>→</span>
          </a>

        </div>
      </div>
    </section>














    <section className="auvd-music-donation-right-section">
  <div className="auvd-music-donation-right-container">

    {/* LEFT — CONTENT */}
    <div className="auvd-music-donation-right-content">

      <span className="auvd-music-donation-right-label">
        Continued Support || ||
      </span>

      <h2>
        2025 — More Instruments <span>  Reached Kakuma</span>
      </h2>

      <div className="auvd-music-donation-right-line"></div>

      <p className="auvd-music-donation-right-intro">
        Later in 2025, through the support of the Transylvanian Symphony Foundation in partnership with Hungry for Music, AUVD received more than 25 additional musical instruments.
      </p>
 
      <p>
        These included pianos, guitars, and other instruments,<strong>which were shipped to Kakuma to help expand</strong>
        access to music education and  <strong>support more </strong>young musicians.
         
      </p>

      {/* <p>
        Later in 2025, through the support of the
        <strong> Transylvanian Symphony Foundation in partnership with
        Hungry for Music</strong>, AUVD received more than
        <strong> 25 additional instruments</strong>, including pianos
        and guitars. The instruments were shipped to Kakuma to help
        expand access to music education.
      </p> */}

      <a
        href="/donate"
        className="auvd-music-donation-right-button"
      >
        DONATE TODAY
        <span>→</span>
      </a>

    </div>

    {/* RIGHT — IMAGE */}
    <div className="auvd-music-donation-right-image">
      <img
        src="/donation-4.jpg"
        alt="Young people learning and playing music in Kakuma"
      />
    </div>

  </div>
</section>
<br></br>
    </>
  );
};

export default ImpactAll;
