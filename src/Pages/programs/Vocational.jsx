import { useState } from "react";
import { useTranslation } from "react-i18next";

import ImpactHero from "../../components/ImpactHero";
import "../../components/ImpactSections.css";
import "./Vocational.css";

const initialTalentForm = {
  artistName: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  confirmEmail: "",
  location: "",
  artTitle: "",
  socialHandle: "",
  artCategory: "",
  artDescription: "",
  artistStory: "",
  portfolioLink: "",
  artworkLink: "",
  experienceLevel: "",
  message: "",
  agreeToReview: false,
  confirmNotRobot: false,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const web3FormsAccessKey = "720af78f-5c60-44e9-9ed4-2098092ebc40";

const normalizeSubmitError = (error, t) => {
  if (!(error instanceof Error)) {
    return t("vocational.form.errors.sendFailed");
  }

  const message = error.message.trim();

  if (!message) {
    return t("vocational.form.errors.sendFailed");
  }

  if (message.startsWith("<!DOCTYPE html") || message.startsWith("<html")) {
    return t("vocational.form.errors.htmlResponse");
  }

  return message;
};

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const validateTalentForm = (form, t) => {
  const errors = {};

  if (!form.artistName.trim()) {
    errors.artistName = "vocational.form.errors.artistName";
  }

  if (form.age.trim() && !/^\d{1,2}$/.test(form.age.trim())) {
    errors.age = "vocational.form.errors.age";
  }

  if (!form.phone.trim()) {
    errors.phone = "vocational.form.errors.phone";
  }

  if (!form.email.trim()) {
    errors.email = "vocational.form.errors.emailRequired";
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = "vocational.form.errors.emailInvalid";
  }

  if (!form.confirmEmail.trim()) {
    errors.confirmEmail = "vocational.form.errors.confirmEmailRequired";
  } else if (form.email.trim() !== form.confirmEmail.trim()) {
    errors.confirmEmail = "vocational.form.errors.confirmEmailMatch";
  }

  if (!form.location.trim()) {
    errors.location = "vocational.form.errors.location";
  }

  if (!form.artTitle.trim()) {
    errors.artTitle = "vocational.form.errors.artTitle";
  }

  if (!form.artCategory) {
    errors.artCategory = "vocational.form.errors.artCategory";
  }

  if (!form.artDescription.trim()) {
    errors.artDescription = "vocational.form.errors.artDescription";
  }

  if (form.portfolioLink.trim() && !isValidHttpUrl(form.portfolioLink.trim())) {
    errors.portfolioLink = "vocational.form.errors.portfolioLink";
  }

  if (!form.artworkLink.trim()) {
    errors.artworkLink = "vocational.form.errors.artworkLinkRequired";
  } else if (!isValidHttpUrl(form.artworkLink.trim())) {
    errors.artworkLink = "vocational.form.errors.artworkLink";
  }

  if (!form.experienceLevel) {
    errors.experienceLevel = "vocational.form.errors.experienceLevel";
  }

  if (!form.agreeToReview) {
    errors.agreeToReview = "vocational.form.errors.agreeToReview";
  }

  if (!form.confirmNotRobot) {
    errors.confirmNotRobot = "vocational.form.errors.confirmNotRobot";
  }

  return errors;
};

/* Page Settings swatches. `tint` is the soft page-background colour the
   swatch paints onto .vocational-page; `accent` is the readable companion
   colour used for the swatch border and the active indicator. The Default
   swatch keeps the plain white canvas the page shipped with. */
const themeOptions = [
  {
    id: "blue",
    labelKey: "vocational.theme.options.blue",
    tint: "#eaf3fb",
    accent: "#14507f",
  },
  {
    id: "green",
    labelKey: "vocational.theme.options.green",
    tint: "#eaf7ef",
    accent: "#14532a",
  },
  {
    id: "orange",
    labelKey: "vocational.theme.options.orange",
    tint: "#fcf1e8",
    accent: "#9c4c1a",
  },
  {
    id: "purple",
    labelKey: "vocational.theme.options.purple",
    tint: "#f3eefb",
    accent: "#55318a",
  },
  {
    id: "pink",
    labelKey: "vocational.theme.options.pink",
    tint: "#fdeef3",
    accent: "#a83f6c",
  },
  {
    id: "default",
    labelKey: "vocational.theme.options.default",
    tint: "#ffffff",
    accent: "#12395f",
  },
];

/* The page opens on Default so the first render matches the unthemed page. */
const defaultTheme = themeOptions[themeOptions.length - 1];

function App() {
  const { t } = useTranslation();
  // Theme options are identified by an internal id; the visible swatch label is
  // a translation key, so the colour picker follows the language too.
  const [themeId, setThemeId] = useState(defaultTheme.id);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [talentForm, setTalentForm] = useState(initialTalentForm);
  const [talentErrors, setTalentErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const selectedTheme = themeOptions.find((theme) => theme.id === themeId) ?? defaultTheme;

  const handleTalentChange = (event) => {
    const { name, value, type, checked } = event.target;

    const nextValue = type === "checkbox" ? checked : value;

    let emailError;
    let confirmEmailError;
    let artworkLinkError;
    let portfolioLinkError;

    if (name === "email" || name === "confirmEmail") {
      const nextEmail = name === "email" ? value : talentForm.email;
      const nextConfirmEmail = name === "confirmEmail" ? value : talentForm.confirmEmail;

      if (nextEmail.trim() && !emailPattern.test(nextEmail.trim())) {
        emailError = "vocational.form.errors.emailInvalid";
      }

      if (!nextConfirmEmail.trim()) {
        confirmEmailError = undefined;
      } else if (nextEmail.trim() !== nextConfirmEmail.trim()) {
        confirmEmailError = "vocational.form.errors.confirmEmailMatch";
      }
    }

    if (name === "artworkLink" || name === "portfolioLink") {
      const nextArtworkLink = name === "artworkLink" ? value : talentForm.artworkLink;
      const nextPortfolioLink = name === "portfolioLink" ? value : talentForm.portfolioLink;

      if (nextArtworkLink.trim() && !isValidHttpUrl(nextArtworkLink.trim())) {
        artworkLinkError = "vocational.form.errors.artworkLink";
      }

      if (nextPortfolioLink.trim() && !isValidHttpUrl(nextPortfolioLink.trim())) {
        portfolioLinkError = "vocational.form.errors.portfolioLink";
      }
    }

    setTalentForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    setTalentErrors((previous) => {
      if (
        !previous[name] &&
        emailError === undefined &&
        confirmEmailError === undefined &&
        artworkLinkError === undefined &&
        portfolioLinkError === undefined
      ) {
        return previous;
      }

      const nextErrors = { ...previous };
      delete nextErrors[name];

      if (name === "email" || name === "confirmEmail") {
        delete nextErrors.email;
        delete nextErrors.confirmEmail;

        if (emailError) {
          nextErrors.email = emailError;
        }

        if (confirmEmailError) {
          nextErrors.confirmEmail = confirmEmailError;
        }
      }

      if (name === "artworkLink" || name === "portfolioLink") {
        delete nextErrors.artworkLink;
        delete nextErrors.portfolioLink;

        if (artworkLinkError) {
          nextErrors.artworkLink = artworkLinkError;
        }

        if (portfolioLinkError) {
          nextErrors.portfolioLink = portfolioLinkError;
        }
      }

      return nextErrors;
    });

    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setSubmitMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateTalentForm(talentForm, t);

    if (Object.keys(validationErrors).length > 0) {
      setTalentErrors(validationErrors);
      setSubmitStatus("error");
      setSubmitMessage(t("vocational.form.errors.formInvalid"));
      return;
    }

    setSubmitStatus("submitting");
    setSubmitMessage("");

    try {
      /* The e-mail body AUVD receives. Its field labels follow the language the
         artist filled the form in, so a French-speaking artist produces a
         French summary instead of an English one. */
      const artistSubmissionSummary = [
        t("vocational.form.emailBody.title"),
        t("vocational.form.fields.artistName"),
        talentForm.artistName.trim(),
        t("vocational.form.fields.age"),
        talentForm.age.trim() || t("vocational.form.emailBody.notApplicable"),
        t("vocational.form.fields.gender"),
        talentForm.gender.trim() || t("vocational.form.emailBody.notApplicable"),
        t("vocational.form.fields.phone"),
        talentForm.phone.trim(),
        t("vocational.form.fields.email"),
        talentForm.email.trim(),
        t("vocational.form.fields.confirmEmail"),
        talentForm.confirmEmail.trim(),
        t("vocational.form.fields.location"),
        talentForm.location.trim(),
        t("vocational.form.fields.artTitle"),
        talentForm.artTitle.trim(),
        t("vocational.form.fields.socialHandle"),
        talentForm.socialHandle.trim() || t("vocational.form.emailBody.notApplicable"),
        t("vocational.form.fields.artCategory"),
        t(`vocational.form.options.artCategory.${talentForm.artCategory || "placeholder"}`),
        t("vocational.form.fields.artDescription"),
        talentForm.artDescription.trim(),
        t("vocational.form.fields.artistStory"),
        talentForm.artistStory.trim() || t("vocational.form.emailBody.notApplicable"),
        t("vocational.form.fields.portfolioLink"),
        talentForm.portfolioLink.trim() || t("vocational.form.emailBody.notApplicable"),
        t("vocational.form.fields.artworkLink"),
        talentForm.artworkLink.trim(),
        t("vocational.form.fields.experienceLevel"),
        t(`vocational.form.options.experienceLevel.${talentForm.experienceLevel || "placeholder"}`),
        t("vocational.form.fields.message"),
        talentForm.message.trim() || t("vocational.form.emailBody.notApplicable"),
        t("vocational.form.emailBody.reviewConfirmation"),
        talentForm.agreeToReview
          ? t("vocational.form.emailBody.yes")
          : t("vocational.form.emailBody.no"),
        t("vocational.form.emailBody.robotConfirmation"),
        talentForm.confirmNotRobot
          ? t("vocational.form.emailBody.confirmed")
          : t("vocational.form.emailBody.notConfirmed"),
      ].join("\n");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          subject: t("vocational.form.emailSubject"),
          from_name: talentForm.artistName.trim(),
          name: talentForm.artistName.trim(),
          email: talentForm.email.trim(),
          message: artistSubmissionSummary,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Your submission could not be sent right now.");
      }

      setTalentForm(initialTalentForm);
      setTalentErrors({});
      setSubmitStatus("success");
      setSubmitMessage(payload.message || "Thank you for your submission. Our team will review it and will get back at you only if you have been selected. Thank you.");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(normalizeSubmitError(error, t));
    }
  };

  // talentErrors holds translation KEYS; resolve each one here so the error
  // text follows the active language.
  const renderFieldError = (fieldName) =>
    talentErrors[fieldName] ? (
      <span className="voc-field-error" role="alert">{t(talentErrors[fieldName])}</span>
    ) : null;

  return (
    <div
      className="vocational-page"
      style={{ "--voc-page-bg": selectedTheme.tint }}
    >
      <div className="vocational-hero-bleed">
        <ImpactHero
          label={t("vocational.hero.label")}
          heading={t("vocational.hero.heading")}
          paragraph={t("vocational.hero.paragraph")}
          image="/Showercase your Talent at AUVD.jpg"
          imageAlt={t("vocational.hero.imageAlt")}
        />
      </div>

      <section className="auvd-story-section voc-theme-band" aria-label={t("vocational.theme.label")}>
        <div className="auvd-story-container">
          <p className="auvd-story-label">{t("vocational.theme.settingsLabel")}</p>
          <div className="theme-panel">
            <h3 className="dom">{t("vocational.theme.title")}</h3>
            <div className="themeGrid">
              {themeOptions.map((theme) => {
                const isActive = theme.id === selectedTheme.id;

                return (
                  <div className="themeButtons" key={theme.id}>
                    <button
                      type="button"
                      className={isActive ? "active" : ""}
                      aria-pressed={isActive}
                      onClick={() => setThemeId(theme.id)}
                      style={{
                        "--swatch-tint": theme.tint,
                        "--swatch-accent": theme.accent,
                      }}
                    >
                      <span className="themeSwatch" aria-hidden="true" />
                      {t(theme.labelKey)}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="artSubmissionSection">
        <div className="auvd-story-container voc-intro-wrap">
            <p className="auvd-story-label">{t("vocational.guidelines.label")}</p>
            <div className="auvd-story-body">
              <h2 className="auvd-story-title auvd-story-title--lead">{t("vocational.guidelines.title")}</h2>
              <div className="auvd-story-text voc-intro-text">
                <div className="artIntroBox">
          <span className="artIntroBadge">{t("vocational.guidelines.badge")}</span>
          <h2 className="artIntroTitle">{t("vocational.guidelines.title")}</h2>
          <p className="artParagraph">
            {t("vocational.guidelines.text")}
          </p>
          <div className="artNotice" role="note">
            <strong>{t("vocational.guidelines.noticeLabel")}</strong> {t("vocational.guidelines.notice")}
          </div>
                </div>
              </div>
            </div>
          </div>

        <form className="artSubmissionForm" onSubmit={handleSubmit} noValidate>
          <h2 className="formTitle">{t("vocational.form.title")}</h2>
          <p className="formSubtitle">
            {t("vocational.form.subtitle")}
          </p>

          <div className="formHighlightCard">
            <p>
              {t("vocational.form.highlight")}
            </p>
          </div>

          <div className="formGrid">
            <label className="voc-field-block" htmlFor="voc-artist-name">
              <span>{t("vocational.form.fields.artistName")}</span>
              <input
                id="voc-artist-name"
                type="text"
                name="artistName"
                placeholder={t("vocational.form.fields.artistNamePlaceholder")}
                value={talentForm.artistName}
                onChange={handleTalentChange}
                className={talentErrors.artistName ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("artistName")}
            </label>

            <label className="voc-field-block" htmlFor="voc-age">
              <span>{t("vocational.form.fields.age")}</span>
              <input
                id="voc-age"
                type="text"
                name="age"
                placeholder={t("vocational.form.fields.agePlaceholder")}
                value={talentForm.age}
                onChange={handleTalentChange}
                className={talentErrors.age ? "voc-input-invalid" : ""}
              />
              {renderFieldError("age")}
            </label>

            <label className="voc-field-block" htmlFor="voc-gender">
              <span>{t("vocational.form.fields.gender")}</span>
              <input
                id="voc-gender"
                type="text"
                name="gender"
                placeholder={t("vocational.form.fields.genderPlaceholder")}
                value={talentForm.gender}
                onChange={handleTalentChange}
              />
            </label>

            <label className="voc-field-block" htmlFor="voc-phone">
              <span>{t("vocational.form.fields.phone")}</span>
              <input
                id="voc-phone"
                type="tel"
                name="phone"
                placeholder={t("vocational.form.fields.phonePlaceholder")}
                value={talentForm.phone}
                onChange={handleTalentChange}
                className={talentErrors.phone ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("phone")}
            </label>

            <label className="voc-field-block" htmlFor="voc-email">
              <span>{t("vocational.form.fields.email")}</span>
              <input
                id="voc-email"
                type="email"
                name="email"
                placeholder={t("vocational.form.fields.emailPlaceholder")}
                value={talentForm.email}
                onChange={handleTalentChange}
                className={talentErrors.email ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("email")}
            </label>

            <label className="voc-field-block" htmlFor="voc-confirm-email">
              <span>{t("vocational.form.fields.confirmEmail")}</span>
              <input
                id="voc-confirm-email"
                type="email"
                name="confirmEmail"
                placeholder={t("vocational.form.fields.confirmEmailPlaceholder")}
                value={talentForm.confirmEmail}
                onChange={handleTalentChange}
                className={talentErrors.confirmEmail ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("confirmEmail")}
            </label>

            <label className="voc-field-block" htmlFor="voc-location">
              <span>{t("vocational.form.fields.location")}</span>
              <input
                id="voc-location"
                type="text"
                name="location"
                placeholder={t("vocational.form.fields.locationPlaceholder")}
                value={talentForm.location}
                onChange={handleTalentChange}
                className={talentErrors.location ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("location")}
            </label>

            <label className="voc-field-block" htmlFor="voc-art-title">
              <span>{t("vocational.form.fields.artTitle")}</span>
              <input
                id="voc-art-title"
                type="text"
                name="artTitle"
                placeholder={t("vocational.form.fields.artTitlePlaceholder")}
                value={talentForm.artTitle}
                onChange={handleTalentChange}
                className={talentErrors.artTitle ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("artTitle")}
            </label>

            <label className="voc-field-block" htmlFor="voc-social-handle">
              <span>{t("vocational.form.fields.socialHandle")}</span>
              <input
                id="voc-social-handle"
                type="text"
                name="socialHandle"
                placeholder={t("vocational.form.fields.socialHandlePlaceholder")}
                value={talentForm.socialHandle}
                onChange={handleTalentChange}
              />
            </label>
          </div>

          <div className="formStack">
            <label className="voc-field-block" htmlFor="voc-art-category">
              <span>{t("vocational.form.fields.artCategory")}</span>
              <select
                id="voc-art-category"
                name="artCategory"
                value={talentForm.artCategory}
                onChange={handleTalentChange}
                className={talentErrors.artCategory ? "voc-input-invalid" : ""}
                required
              >
                <option value="">{t("vocational.form.options.artCategory.placeholder")}</option>
                <option value="music">{t("vocational.form.options.artCategory.music")}</option>
                <option value="dance">{t("vocational.form.options.artCategory.dance")}</option>
                <option value="visual_art">{t("vocational.form.options.artCategory.visualArt")}</option>
                <option value="poetry">{t("vocational.form.options.artCategory.poetry")}</option>
                <option value="drama">{t("vocational.form.options.artCategory.drama")}</option>
                <option value="crafts">{t("vocational.form.options.artCategory.crafts")}</option>
                <option value="fashion">{t("vocational.form.options.artCategory.fashion")}</option>
                <option value="storytelling">{t("vocational.form.options.artCategory.storytelling")}</option>
                <option value="other">{t("vocational.form.options.artCategory.other")}</option>
              </select>
              {renderFieldError("artCategory")}
            </label>

            <label className="voc-field-block" htmlFor="voc-art-description">
              <span>{t("vocational.form.fields.artDescription")}</span>
              <textarea
                id="voc-art-description"
                name="artDescription"
                placeholder={t("vocational.form.fields.artDescriptionPlaceholder")}
                value={talentForm.artDescription}
                onChange={handleTalentChange}
                className={talentErrors.artDescription ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("artDescription")}
            </label>

            <label className="voc-field-block" htmlFor="voc-artist-story">
              <span>{t("vocational.form.fields.artistStory")}</span>
              <textarea
                id="voc-artist-story"
                name="artistStory"
                placeholder={t("vocational.form.fields.artistStoryPlaceholder")}
                value={talentForm.artistStory}
                onChange={handleTalentChange}
              />
            </label>

            <label className="voc-field-block" htmlFor="voc-portfolio-link">
              <span>{t("vocational.form.fields.portfolioLink")}</span>
              <input
                id="voc-portfolio-link"
                type="url"
                name="portfolioLink"
                placeholder={t("vocational.form.fields.portfolioLinkPlaceholder")}
                value={talentForm.portfolioLink}
                onChange={handleTalentChange}
                className={talentErrors.portfolioLink ? "voc-input-invalid" : ""}
              />
              {renderFieldError("portfolioLink")}
            </label>

            <label className="voc-field-block" htmlFor="voc-artwork-link">
              <span>{t("vocational.form.fields.artworkLink")}</span>
              <input
                id="voc-artwork-link"
                type="url"
                name="artworkLink"
                placeholder={t("vocational.form.fields.artworkLinkPlaceholder")}
                value={talentForm.artworkLink}
                onChange={handleTalentChange}
                className={talentErrors.artworkLink ? "voc-input-invalid" : ""}
                required
              />
              <small className="voc-field-note">{t("vocational.form.fields.artworkLinkNote")}</small>
              {renderFieldError("artworkLink")}
            </label>

            <label className="voc-field-block" htmlFor="voc-experience-level">
              <span>{t("vocational.form.fields.experienceLevel")}</span>
              <select
                id="voc-experience-level"
                name="experienceLevel"
                value={talentForm.experienceLevel}
                onChange={handleTalentChange}
                className={talentErrors.experienceLevel ? "voc-input-invalid" : ""}
              >
                <option value="">{t("vocational.form.options.experienceLevel.placeholder")}</option>
                <option value="beginner">{t("vocational.form.options.experienceLevel.beginner")}</option>
                <option value="intermediate">{t("vocational.form.options.experienceLevel.intermediate")}</option>
                <option value="professional">{t("vocational.form.options.experienceLevel.professional")}</option>
              </select>
              {renderFieldError("experienceLevel")}
            </label>

            <label className="voc-field-block" htmlFor="voc-message">
              <span>{t("vocational.form.fields.message")}</span>
              <textarea
                id="voc-message"
                name="message"
                placeholder={t("vocational.form.fields.messagePlaceholder")}
                value={talentForm.message}
                onChange={handleTalentChange}
              />
            </label>
          </div>

          <label className={`voc-consent-row ${talentErrors.agreeToReview ? "voc-fieldset-invalid" : ""}`} htmlFor="voc-agree-review">
            <input
              id="voc-agree-review"
              type="checkbox"
              name="agreeToReview"
              checked={talentForm.agreeToReview}
              onChange={handleTalentChange}
            />
            <span>{t("vocational.form.consentReview")}</span>
          </label>
          {renderFieldError("agreeToReview")}

          <label className={`voc-consent-row ${talentErrors.confirmNotRobot ? "voc-fieldset-invalid" : ""}`} htmlFor="voc-confirm-robot">
            <input
              id="voc-confirm-robot"
              type="checkbox"
              name="confirmNotRobot"
              checked={talentForm.confirmNotRobot}
              onChange={handleTalentChange}
            />
            <span>{t("vocational.form.consentRobot")}</span>
          </label>
          {renderFieldError("confirmNotRobot")}

          <button type="submit" className="submitButton" disabled={submitStatus === "submitting"}>
            {submitStatus === "submitting" ? t("vocational.form.submitting") : t("vocational.form.submit")}
          </button>

          {submitStatus === "success" ? (
            <div className="formFeedback success" role="status">
              {submitMessage || t("vocational.form.errors.success")}
            </div>
          ) : null}

          {submitStatus === "error" ? (
            <div className="formFeedback error" role="alert">
              {submitMessage || t("vocational.form.errors.sendFailed")}
            </div>
          ) : null}

        </form>
      </section>
    </div>
  );
}

export default App;