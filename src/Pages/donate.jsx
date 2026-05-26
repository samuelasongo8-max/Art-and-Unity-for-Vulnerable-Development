import React, { useEffect, useState } from "react";
import "./Donate.css";

const confirmationEmail = "artandunityforvulnerable.org@gmail.com";

const donationSteps = [
  "Transfer your donation to the official AUVD Equity Bank account.",
  "Keep your transaction reference after the bank deposit or transfer.",
  "Email the donor details to AUVD so the team can record your support.",
];

const trustPoints = [
  "Official AUVD bank account",
  "Donation confirmed by email",
  "Secure bank-transfer giving",
];

const supportCards = [
  {
    title: "Transparent giving",
    text: "Every donation can be confirmed using the donor name, amount, and transaction reference so the AUVD team can verify support clearly.",
  },
  {
    title: "Direct community impact",
    text: "Your support helps sustain arts healing, education, youth development, and outreach work in Kakuma Refugee Camp.",
  },
  {
    title: "Professional follow-up",
    text: "Once the donor emails the donation details, the organization can review the details and follow up where verification is needed.",
  },
];

const donateHeroSlides = [
  {
    image: "/drawing2.jpg",
    position: "center center",
  },
  {
    image: "/education.jpg",
    position: "center 30%",
  },
  {
    image: "/together5.jpg",
    position: "center 42%",
  },
];

function Donate() {
  const [showAccount, setShowAccount] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const accountNumber = "1650287128570";
  const maskedAccount = "**** **** **** 8570";

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentHeroSlide((previous) => (previous + 1) % donateHeroSlides.length);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      window.alert("Account number copied successfully!");
    } catch {
      window.alert("Copy failed.");
    }
  };

  return (
    <div className="donate-page">
      <div className="donate-container">
        <section
          className="donate-gallery-hero"
          aria-label="AUVD donation highlights"
          style={{
            backgroundImage: `url(${donateHeroSlides[currentHeroSlide].image})`,
            backgroundPosition: donateHeroSlides[currentHeroSlide].position,
          }}
        >
          <div className="donate-gallery-overlay"></div>
          <div className="donate-gallery-copy">
            <h1 className="donate-gallery-title">Support creativity, education, and unity in Kakuma.</h1>
            <p className="donate-gallery-text">
              Your giving helps AUVD keep building safe, inspiring spaces for art, learning,
              and community support.
            </p>
            <div className="donate-gallery-indicators" aria-hidden="true">
              {donateHeroSlides.map((_, index) => (
                <span
                  key={index}
                  className={`donate-gallery-dot ${index === currentHeroSlide ? "is-active" : ""}`}
                ></span>
              ))}
            </div>
          </div>
        </section>

        <section className="donate-hero">
          <div className="donate-left">
            <span className="badge">Support AUVD Through Bank Transfer</span>

            <h1 className="donate-title">
              Give with confidence through a professional and verified donation process.
            </h1>

            <p className="donate-text">
              Your bank donation helps AUVD continue community programs in arts, education,
              psychosocial support, skills development, and humanitarian support for vulnerable
              communities in Kakuma Refugee Camp.
            </p>

            <div className="trust-row">
              {trustPoints.map((item) => (
                <span key={item} className="trust-pill">{item}</span>
              ))}
            </div>

            <div className="donate-impact-grid">
              {supportCards.map((card) => (
                <article className="donate-impact-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>

            <div className="bank-box">
              <div className="bank-box-header">
                <div>
                  <p className="section-label">Official Bank Details</p>
                  <h2>Donate by Bank Account</h2>
                </div>
                <span className="bank-status">Verified Details</span>
              </div>

              <div className="bank-detail-grid">
                <div className="bank-detail-card">
                  <span>Bank</span>
                  <strong>Equity Bank Kenya Ltd.</strong>
                </div>

                <div className="bank-detail-card wide">
                  <span>Account Name</span>
                  <strong>Arts Unity for Vulnerable Development</strong>
                </div>

                <div className="bank-detail-card wide account-card">
                  <span>Account Number</span>
                  <strong>{showAccount ? accountNumber : maskedAccount}</strong>
                </div>
              </div>

              <div className="bank-actions">
                <button className="action-btn primary-action" type="button" onClick={() => setShowAccount((previous) => !previous)}>
                  {showAccount ? "Hide Number" : "Show Full Number"}
                </button>

                <button className="action-btn secondary-action" type="button" onClick={copyAccount}>
                  Copy Account Number
                </button>
              </div>
            </div>

            <div className="process-box">
              <p className="section-label">How To Donate</p>
              <h2>Three simple steps</h2>

              <div className="steps-list">
                {donationSteps.map((step, index) => (
                  <div key={step} className="step-item">
                    <span className="step-number">0{index + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="donate-form">
            <p className="section-label">Donation Confirmation</p>
            <h2 className="form-title">Confirm Your Donation By Email</h2>

            <p className="form-subtitle">
              After sending your donation through the bank account above, the donor can email {confirmationEmail}
              so AUVD can review and record the contribution professionally.
            </p>

            <div className="donation-alert">
              <span className="donation-alert-dot"></span>
              <p>
                To confirm the donation, send the donor name, donation amount, and transaction
                reference to {confirmationEmail}.
              </p>
            </div>

            <div className="form-footer">
              <p className="form-note">
                Please make sure the donor name, amount, and transaction reference match the bank transfer.
              </p>
              <p className="form-note strong-note">
                Donation confirmation email: {confirmationEmail}.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Donate;