import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Donate.css";

const confirmationEmail = "artandunityforvulnerable.org@gmail.com";

/* Only the bank/bank-name/account-name strings stay as data — they are
   official account details, not translatable copy. Everything the visitor
   reads is a translation key resolved with t() while rendering. */
const supportCards = [
  { key: "one", titleKey: "donate.main.cards.one.title", textKey: "donate.main.cards.one.text" },
  { key: "two", titleKey: "donate.main.cards.two.title", textKey: "donate.main.cards.two.text" },
  { key: "three", titleKey: "donate.main.cards.three.title", textKey: "donate.main.cards.three.text" },
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
  const { t } = useTranslation();
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
      window.alert(t("donate.bank.copySuccess"));
    } catch {
      window.alert(t("donate.bank.copyFailed"));
    }
  };

  return (
    <div className="donate-page">
      <div className="donate-container">
        <section
          className="donate-gallery-hero"
          aria-label={t("donate.hero.label")}
          style={{
            backgroundImage: `url(${donateHeroSlides[currentHeroSlide].image})`,
            backgroundPosition: donateHeroSlides[currentHeroSlide].position,
          }}
        >
          <div className="donate-gallery-overlay"></div>
          <div className="donate-gallery-copy">
            <h1 className="donate-gallery-title">{t("donate.hero.title")}</h1>
            <p className="donate-gallery-text">
              {t("donate.hero.text")}
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
            <h1 className="donate-title">
              {t("donate.main.title")}
            </h1>

            <p className="donate-text">
              {t("donate.main.text")}
            </p>

            <div className="trust-row">
              {[1, 2, 3].map((n) => (
                <span key={n} className="trust-pill">{t(`donate.main.trust_${n}`)}</span>
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
                  <p className="section-label">{t("donate.bank.label")}</p>
                  <h2>{t("donate.bank.title")}</h2>
                </div>
              </div>

              <div className="bank-detail-grid">
                <div className="bank-detail-card">
                  <span>{t("donate.bank.bankLabel")}</span>
                  <strong>Equity Bank Kenya Ltd.</strong>
                </div>

                <div className="bank-detail-card wide">
                  <span>{t("donate.bank.accountNameLabel")}</span>
                  <strong>Arts Unity for Vulnerable Development</strong>
                </div>

                <div className="bank-detail-card wide account-card">
                  <span>{t("donate.bank.accountNumberLabel")}</span>
                  <strong>{showAccount ? accountNumber : maskedAccount}</strong>
                </div>
              </div>

              <div className="bank-actions">
                <button className="action-btn primary-action" type="button" onClick={() => setShowAccount((previous) => !previous)}>
                  {showAccount ? t("donate.bank.hideNumber") : t("donate.bank.showNumber")}
                </button>

                <button className="action-btn secondary-action" type="button" onClick={copyAccount}>
                  {t("donate.bank.copyNumber")}
                </button>
              </div>
            </div>

            <div className="process-box">
              <p className="section-label">{t("donate.process.label")}</p>
              <h2>{t("donate.process.title")}</h2>

              <div className="steps-list">
                {[1, 2, 3].map((n, index) => (
                  <div key={n} className="step-item">
                    <span className="step-number">0{index + 1}</span>
                    <p>{t(`donate.process.steps_${n}`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="donate-form">
            <p className="section-label">{t("donate.confirmation.label")}</p>
            <h2 className="form-title">{t("donate.confirmation.title")}</h2>

            <p className="form-subtitle">
              {t("donate.confirmation.subtitle", { email: confirmationEmail })}
            </p>

            <div className="donation-alert">
              <span className="donation-alert-dot"></span>
              <p>
                {t("donate.confirmation.alert", { email: confirmationEmail })}
              </p>
            </div>

            <div className="form-footer">
              <p className="form-note">
                {t("donate.confirmation.noteOne")}
              </p>
              <p className="form-note strong-note">
                {t("donate.confirmation.noteTwo", { email: confirmationEmail })}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Donate;