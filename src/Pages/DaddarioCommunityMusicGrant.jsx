import "./DaddarioCommunityMusicGrant.css";

const grantImage = "/Foundation_Logo_Lockup.png";

function DaddarioCommunityMusicGrant() {
  return (
    <>
    
    <article className="daddario-grant-article">
<div className="daddario-grant-article__container">
        <header className="daddario-grant-article__header">
<p className="daddario-grant-article__date">August 15, 2026</p>
<p className="daddario-grant-article__location">Kakuma Refugee Camp, Kenya</p>
<h1 className="daddario-grant-article__title">
            AUVD RECEIVES A COMMUNITY MUSIC GRANT FROM THE D’ADDARIO FOUNDATION
    </h1>
        </header>

        <div className="daddario-grant-article__image-wrap">
    <img
            className="daddario-grant-article__image"
            src={grantImage}
            alt="AUVD music education program in Kakuma Refugee Camp"
    />
        </div>

        <div className="daddario-grant-article__content">
    <p>
            Art and Unity for Vulnerable Development (AUVD) is delighted to announce that we have been
            selected to receive a Community Music Grant from the D’Addario Foundation. This support is an
            important milestone for our organization and our Music Education Program in Kakuma Refugee Camp,
            Kenya.
        </p>

        <p>
            The grant will help support our efforts to create more opportunities for young people to learn,
            develop their talents, and express themselves through music. We are deeply grateful to the
            D’Addario Foundation for believing in our work and supporting our commitment to expanding access
            to music education in our community.
    </p>
        </div>
    </div>
    </article>

    <section className="auvd-music-donation-right-section">
<div className="auvd-music-donation-right-container">

    {/* LEFT — CONTENT */}
    <div className="auvd-music-donation-right-content">

    <span className="auvd-music-donation-right-label">
    "THANK YOU, D’ADDARIO FOUNDATION"|| || ||
    </span>

    <h2>
        GRANT IMPACT <span>HIGHLIGHT</span>
    </h2>

    <div className="auvd-music-donation-right-line"></div>
          <p>
        $1,500
Cash Grant

and

$500
In-Kind Music Products
 

<strong>" $2,000 Total "</strong>
        <strong>Grant Support</strong> 
         
      </p>

    <p className="auvd-music-donation-right-intro">
       "At AUVD, we believe that every young person deserves an opportunity to be seen, heard, and supported."

"We extend our heartfelt appreciation to the D’Addario Foundation for believing in AUVD and supporting our commitment to expanding access to music education."
 

"Your support is not simply funding a program. You are investing in young people, their creativity, their confidence, and their dreams."



      </p>
 


      {/* <p>
        Later in 2025, through the support of the
        <strong> Transylvanian Symphony Foundation in partnership with
        Hungry for Music</strong>, AUVD received more than
        <strong> 25 additional instruments</strong>, including pianos
        and guitars. The instruments were shipped to Kakuma to help
        expand access to music education.
      </p> */}

   

    </div>

    {/* RIGHT — IMAGE */}
    <div className="auvd-music-donation-right-image">
      <img
        src="public/Back20.jpg"
        alt=" AUVD Grant from D'Addario Foundation"
      />
    </div>

  </div>
</section>
    </>
  );
}

export default DaddarioCommunityMusicGrant;
