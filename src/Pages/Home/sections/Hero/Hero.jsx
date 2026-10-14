import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Hero.css';

/* Home hero — the source's two-column design, filled with this page's own
   content: label, title, intro paragraph, primary CTA, four destination pills,
   social links and the rotating photo slideshow. Decorative corner + swoosh
   SVGs and the blob-masked photo with brush blobs are reproduced from the
   source and recolored to the Project 1 palette. The handwritten caption slot
   shows the current slide's caption (real target data) instead of invented
   source text. */
function Hero({ heroTitleKey, slides }) {
  const { t } = useTranslation();
  const heroTitleFull = t(heroTitleKey);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow rotation — kept from the old hero (Home's own images).
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((previous) => (previous === slides.length - 1 ? 0 : previous + 1));
    }, 10000);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  const current = slides[currentSlide];

  return (
    <section className='p1-hero'>
      <div className='p1-hero-area'>
        {/* Decorative diagonal brush — top-left corner */}
        <svg className='p1-hero-corner' viewBox='0 0 200 200' aria-hidden='true' focusable='false'>
          <path
            className='p1-hero-fill-orange'
            d='M-20 58C8 24 48-4 96-18c-14 34-34 64-54 94-20 18-44 8-62-18z'
          />
          <path
            className='p1-hero-fill-orange'
            d='M32 132c40-46 92-82 152-98-16 36-36 66-66 96-26 24-62 24-86 2z'
          />
        </svg>

        {/* Decorative curved swoosh — bottom-right corner */}
        <svg className='p1-hero-swoosh' viewBox='0 0 260 180' aria-hidden='true' focusable='false'>
          <path className='p1-hero-stroke-blue' d='M12 170C70 150 150 100 212 22' />
          <path className='p1-hero-stroke-orange' d='M42 177C102 161 176 116 236 48' />
          <path className='p1-hero-stroke-orange' d='M74 180C132 169 196 131 253 74' />
        </svg>

        <div className='p1-container p1-hero-grid'>
          <div className='p1-hero-copy'>
            <h1 className='p1-hero-title'>{heroTitleFull}</h1>
    

            <div className='p1-hero-actions'>
              <Link to='/about' className='p1-hero-btn p1-hero-btn-fill'>
                {t('home.hero.button')} <span aria-hidden='true'>→</span>
              </Link>
            </div>

            <nav className='p1-hero-links' aria-label={t('home.hero.links.explore')}>
              <Link to='/Work' className='p1-hero-pill'>{t('home.hero.links.explore')}</Link>
              <Link to='/Vocational' className='p1-hero-pill'>{t('home.hero.links.share')}</Link>
              <Link to='/Music' className='p1-hero-pill'>{t('home.hero.links.music')}</Link>
              <Link to='/dance' className='p1-hero-pill'>{t('home.hero.links.dance')}</Link>
              <Link to='/need' className='p1-hero-pill'>{t('home.hero.links.need')}</Link>
              <Link to='/visual-arts' className='p1-hero-pill'>{t('home.hero.links.visualArts')}</Link>
            </nav>

            <ul className='p1-social-links' aria-label={t('home.hero.socialLabel')}>
              <li>
                <a
                  className='p1-social-link p1-social-link--facebook'
                  href='https://www.facebook.com/profile.php?id=61569926836907'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Facebook'
                >
                  <i className='bx bxl-facebook'></i>
                </a>
              </li>
              <li>
                <a
                  className='p1-social-link p1-social-link--linkedin'
                  href='https://ke.linkedin.com--'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='LinkedIn'
                >
                  <i className='bx bxl-linkedin'></i>
                </a>
              </li>
              <li>
                <a
                  className='p1-social-link p1-social-link--instagram'
                  href='https://www.instagram.com/art.unityvulnerabledev2024/'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Instagram'
                >
                  <i className='bx bxl-instagram'></i>
                </a>
              </li>
              <li>
                <a
                  className='p1-social-link p1-social-link--youtube'
                  href='https://www.youtube.com/@Artandunity-q2q'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='YouTube'
                >
                  <i className='bx bxl-youtube'></i>
                </a>
              </li>
              <li>
                <a
                  className='p1-social-link p1-social-link--tiktok'
                  href='https://www.tiktok.com/@artunity_vulnerabledev'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='TikTok'
                >
                  <i className='bx bxl-tiktok'></i>
                </a>
              </li>
            </ul>
          </div>

          <div className='p1-hero-art'>
            <span className='p1-hero-brush p1-hero-brush-a' aria-hidden='true' />
            <span className='p1-hero-brush p1-hero-brush-b' aria-hidden='true' />
            <span className='p1-hero-brush p1-hero-brush-c' aria-hidden='true' />
            <img className='p1-hero-photo' src={current.image} alt='' />
            <p className='p1-hero-script'>{t(current.titleKey)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
