import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './WhoWeAre.css';

/* "Who We Are" — first content section, directly below the hero.
   Design copied from the source's Who We Are: image column on the left inside
   an irregular brush-stroke frame with four painted strokes, copy column on
   the right with an underlined heading, paragraphs and a button. Recolored to
   the Project 1 palette (p1-who-*). The three existing images keep their
   4-second one-after-another rotation inside the frame. */
function WhoWeAre() {
  const { t } = useTranslation();
  const images = ['/donation.jpg', '/drawing.jpg', '/emotional1.jpg'];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className='p1-who'>
      <div className='p1-who-container p1-who-grid'>
        {/* Left column: rotating photo inside the brush-stroke frame */}
        <div className='p1-who-art'>
          <div className='p1-who-photo-wrap'>
            <span className='p1-who-stroke p1-who-stroke--1' />
            <span className='p1-who-stroke p1-who-stroke--2' />
            <span className='p1-who-stroke p1-who-stroke--3' />
            <span className='p1-who-stroke p1-who-stroke--4' />
            <img
              className='p1-who-photo'
              src={images[activeImageIndex]}
              alt={t('home.whoWeAre.imageAlt')}
              loading='lazy'
            />
          </div>
        </div>

        {/* Right column: heading + paragraphs + Read more */}
        <div className='p1-who-copy'>
          <h2>{t('home.whoWeAre.title')}</h2>
          <p>{t('home.whoWeAre.p1')}</p>
          <p>{t('home.whoWeAre.p2')}</p>
          <p>{t('home.whoWeAre.p3')}</p>
          <Link to='/about' className='p1-who-btn'>
            {t('home.whoWeAre.readMore')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhoWeAre;
