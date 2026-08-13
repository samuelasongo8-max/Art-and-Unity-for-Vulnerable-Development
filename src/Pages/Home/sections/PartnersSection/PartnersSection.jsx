import "./PartnersSection.css";
import useRevealClass from "../../hooks/useRevealClass";

function PartnersSection({ partnerCards }) {
  const introRef = useRevealClass("partners-copy-entered", 0.3);

  return (
    <section className="partners-section">
      <div className="container">
        <div ref={introRef} className="partners-copy partners-copy-animated">
      <h1 className="partners-heading">OUR PARTNERS:</h1>
      <p className="partners-heading">Trusted by Global Partners and Funders</p>
          
        </div>

        <div className="partners-grid">
          {partnerCards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              target="_blank"
              rel="noreferrer"
              className={`partner-card ${card.className}`}
              aria-label={card.label}
            >
              {card.text ? <span>{card.text}</span> : null}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;