import "./GrantNews.css";
import { Link } from "react-router-dom";
const grantImage = "/AUVD, Music education grants.png";

function GrantNews() {
  return (
    <section className="grant-news" aria-labelledby="grant-news-title">
      <div className="grant-news__inner">

        {/* Date bar */}
        <div className="grant-news__meta">
          <span className="grant-news__date">11 August 2026</span>
          <div className="grant-news__rule" />
        </div>

        <div className="grant-news__grid">

          {/* Left: image */}
          <div className="grant-news__media" aria-label="AUVD music program image">
            <img
              className="grant-news__image"
              src={grantImage}
              alt="AUVD music program and community celebration"
            />
          </div>

          {/* Right: content */}
          <div className="grant-news__content">
            <span className="grant-news__location">
              KAKUMA REFUGEE CAMP &nbsp;|&nbsp; KENYA
            </span>

            <h1 id="grant-news-title" className="grant-news__title">
              WE RECEIVED A COMMUNITY MUSIC GRANT!
            </h1>

            <p className="grant-news__body">
              Art and Unity for Vulnerable Development (AUVD) is delighted to
              announce that we have been selected to receive a Community
              Music Grant from the D&apos;Addario Foundation.
            </p>

            <p className="grant-news__body">
              This support is helping young people in Kakuma Refugee Camp,
              Kenya, discover their talents, develop their skills, build
              confidence, and express themselves through music.
            </p>

            <Link
              to="/news/daddario-community-music-grant"
              className="grant-news__link"
            >
              LEARN MORE <span aria-hidden="true">›</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default GrantNews;