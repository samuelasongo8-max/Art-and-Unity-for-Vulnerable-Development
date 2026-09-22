import { FaArrowRight } from "react-icons/fa6";
import "./ImpactHero.css";

/* Props — label, heading, paragraph, buttonText, buttonHref, image,
   imageAlt, plus factCard (label, value, caption) and milestones
   ({year, text}). Two extra optional slots preserve existing in-hero
   content without inventing anything: tagline (Our Story's existing
   "Creativity, dignity, unity" line) and links (Work's existing anchor
   pills). When any slot is not passed, it doesn't render and the layout
   adjusts with no empty space left behind. */
function ImpactHero({
  label,
  heading,
  paragraph,
  buttonText,
  buttonHref,
  image,
  imageAlt = "",
  tagline,
  factCard,
  links = [],
  milestones = [],
}) {
  return (
    <section className="auvd-impact-hero">
      <img className="auvd-impact-hero__image" src={image} alt={imageAlt} />
      <div className="auvd-impact-hero__overlay" aria-hidden="true"></div>

      <div className="auvd-impact-hero__content">
        {label ? <p className="auvd-impact-hero__label">{label}</p> : null}
        <h1 className="auvd-impact-hero__title">{heading}</h1>
        <p className="auvd-impact-hero__text">{paragraph}</p>

        {factCard ? (
          <p className="auvd-impact-hero__meta">
            <strong>
              {factCard.label} {factCard.value}
            </strong>
            <span>{factCard.caption}</span>
          </p>
        ) : null}

        {buttonText && buttonHref ? (
          <a className="auvd-impact-hero__button" href={buttonHref}>
            {buttonText}
            <FaArrowRight aria-hidden="true" />
          </a>
        ) : null}

        {tagline ? <p className="auvd-impact-hero__tagline">{tagline}</p> : null}

        {links.length > 0 ? (
          <nav className="auvd-impact-hero__links" aria-label="On this page">
            {links.map((link) => (
              <a className="auvd-impact-hero__pill" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      {milestones.length > 0 ? (
        <ul className="auvd-impact-hero__stats" aria-label="Milestones">
          {milestones.map((milestone) => (
            <li key={milestone.year + milestone.text} className="auvd-impact-hero__stat">
              <strong>{milestone.year}</strong>
              <span>{milestone.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default ImpactHero;
