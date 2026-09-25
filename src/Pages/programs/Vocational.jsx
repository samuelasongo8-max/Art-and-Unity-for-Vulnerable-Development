import { useState } from "react";

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

const normalizeSubmitError = (error) => {
  if (!(error instanceof Error)) {
    return "Your submission could not be sent right now. Please try again in a moment.";
  }

  const message = error.message.trim();

  if (!message) {
    return "Your submission could not be sent right now. Please try again in a moment.";
  }

  if (message.startsWith("<!DOCTYPE html") || message.startsWith("<html")) {
    return "The submission service returned an unexpected response. Please try again in a moment.";
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

const validateTalentForm = (form) => {
  const errors = {};

  if (!form.artistName.trim()) {
    errors.artistName = "Full name or artist name is required.";
  }

  if (form.age.trim() && !/^\d{1,2}$/.test(form.age.trim())) {
    errors.age = "Age must be a number only.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.confirmEmail.trim()) {
    errors.confirmEmail = "Please confirm your email address.";
  } else if (form.email.trim() !== form.confirmEmail.trim()) {
    errors.confirmEmail = "Email addresses must match.";
  }

  if (!form.location.trim()) {
    errors.location = "Location is required.";
  }

  if (!form.artTitle.trim()) {
    errors.artTitle = "Title of your talent or work is required.";
  }

  if (!form.artCategory) {
    errors.artCategory = "Please select an art category.";
  }

  if (!form.artDescription.trim()) {
    errors.artDescription = "Describe your talent or artwork.";
  }

  if (form.portfolioLink.trim() && !isValidHttpUrl(form.portfolioLink.trim())) {
    errors.portfolioLink = "Portfolio link must be a valid http or https URL.";
  }

  if (!form.artworkLink.trim()) {
    errors.artworkLink = "A link to your artwork is required.";
  } else if (!isValidHttpUrl(form.artworkLink.trim())) {
    errors.artworkLink = "Artwork link must be a valid http or https URL.";
  }

  if (!form.experienceLevel) {
    errors.experienceLevel = "Please choose your experience level.";
  }

  if (!form.agreeToReview) {
    errors.agreeToReview = "You must confirm your information before submitting.";
  }

  if (!form.confirmNotRobot) {
    errors.confirmNotRobot = "Please confirm that you are not a robot.";
  }

  return errors;
};

/* Page Settings swatches. `tint` is the soft page-background colour the
   swatch paints onto .vocational-page; `accent` is the readable companion
   colour used for the swatch border and the active indicator. The Default
   swatch keeps the plain white canvas the page shipped with. */
const themeOptions = [
  {
    label: "Blue",
    tint: "#eaf3fb",
    accent: "#14507f",
  },
  {
    label: "Green",
    tint: "#eaf7ef",
    accent: "#14532a",
  },
  {
    label: "Orange",
    tint: "#fcf1e8",
    accent: "#9c4c1a",
  },
  {
    label: "Purple",
    tint: "#f3eefb",
    accent: "#55318a",
  },
  {
    label: "Pink",
    tint: "#fdeef3",
    accent: "#a83f6c",
  },
  {
    label: "Default",
    tint: "#ffffff",
    accent: "#12395f",
  },
];

/* The page opens on Default so the first render matches the unthemed page. */
const defaultTheme = themeOptions[themeOptions.length - 1];

function App() {
  const [themeLabel, setThemeLabel] = useState(defaultTheme.label);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [talentForm, setTalentForm] = useState(initialTalentForm);
  const [talentErrors, setTalentErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const selectedTheme = themeOptions.find((theme) => theme.label === themeLabel) ?? defaultTheme;

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
        emailError = "Enter a valid email address.";
      }

      if (!nextConfirmEmail.trim()) {
        confirmEmailError = undefined;
      } else if (nextEmail.trim() !== nextConfirmEmail.trim()) {
        confirmEmailError = "Email addresses must match.";
      }
    }

    if (name === "artworkLink" || name === "portfolioLink") {
      const nextArtworkLink = name === "artworkLink" ? value : talentForm.artworkLink;
      const nextPortfolioLink = name === "portfolioLink" ? value : talentForm.portfolioLink;

      if (nextArtworkLink.trim() && !isValidHttpUrl(nextArtworkLink.trim())) {
        artworkLinkError = "Artwork link must be a valid http or https URL.";
      }

      if (nextPortfolioLink.trim() && !isValidHttpUrl(nextPortfolioLink.trim())) {
        portfolioLinkError = "Portfolio link must be a valid http or https URL.";
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
    const validationErrors = validateTalentForm(talentForm);

    if (Object.keys(validationErrors).length > 0) {
      setTalentErrors(validationErrors);
      setSubmitStatus("error");
      setSubmitMessage("Please complete the form correctly before submitting.");
      return;
    }

    setSubmitStatus("submitting");
    setSubmitMessage("");

    try {
      const artistSubmissionSummary = [
        "Artist Submission Details",
        "Full Name / Artist Name",
        talentForm.artistName.trim(),
        "Age",
        talentForm.age.trim() || "N/A",
        "Gender",
        talentForm.gender.trim() || "N/A",
        "Phone Number",
        talentForm.phone.trim(),
        "Email Address",
        talentForm.email.trim(),
        "Confirm Email Address",
        talentForm.confirmEmail.trim(),
        "Location",
        talentForm.location.trim(),
        "Title of Your Talent or Work",
        talentForm.artTitle.trim(),
        "Social Media Handle",
        talentForm.socialHandle.trim() || "N/A",
        "Art Category",
        talentForm.artCategory,
        "Describe Your Talent or Artwork",
        talentForm.artDescription.trim(),
        "Your Story as an Artist",
        talentForm.artistStory.trim() || "N/A",
        "Portfolio / Instagram / YouTube Link",
        talentForm.portfolioLink.trim() || "N/A",
        "Link to Your Artwork",
        talentForm.artworkLink.trim(),
        "Experience Level",
        talentForm.experienceLevel,
        "Additional Message or Request",
        talentForm.message.trim() || "N/A",
        "Review Confirmation",
        talentForm.agreeToReview ? "Yes" : "No",
        "Robot Confirmation",
        talentForm.confirmNotRobot ? "Confirmed" : "Not confirmed",
      ].join("\n");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          subject: "New AUVD artist submission",
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
      setSubmitMessage(normalizeSubmitError(error));
    }
  };

  const renderFieldError = (fieldName) =>
    talentErrors[fieldName] ? (
      <span className="voc-field-error" role="alert">{talentErrors[fieldName]}</span>
    ) : null;

  return (
    <div
      className="vocational-page"
      style={{ "--voc-page-bg": selectedTheme.tint }}
    >
      <div className="vocational-hero-bleed">
        <ImpactHero
          label="Artist Submissions"
          heading="Artist submission form"
          paragraph="Share your talent professionally with AUVD. This form is designed for artists in Kakuma Refugee Camp to submit music, visual art, dance, poetry, drama, crafts, and other creative work."
          image="/Showercase your Talent at AUVD.jpg"
          imageAlt="Artists showcasing their talent at AUVD"
        />
      </div>

      <section className="auvd-story-section voc-theme-band" aria-label="Submission page settings">
        <div className="auvd-story-container">
          <p className="auvd-story-label">Page Settings</p>
          <div className="theme-panel">
            <h3 className="dom">Choose Theme Color</h3>
            <div className="themeGrid">
              {themeOptions.map((theme) => {
                const isActive = theme.label === selectedTheme.label;

                return (
                  <div className="themeButtons" key={theme.label}>
                    <button
                      type="button"
                      className={isActive ? "active" : ""}
                      aria-pressed={isActive}
                      onClick={() => setThemeLabel(theme.label)}
                      style={{
                        "--swatch-tint": theme.tint,
                        "--swatch-accent": theme.accent,
                      }}
                    >
                      <span className="themeSwatch" aria-hidden="true" />
                      {theme.label}
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
            <p className="auvd-story-label">Submission Guidelines</p>
            <div className="auvd-story-body">
              <h2 className="auvd-story-title auvd-story-title--lead">Submit your talent in a professional way</h2>
              <div className="auvd-story-text voc-intro-text">
                <div className="artIntroBox">
          <span className="artIntroBadge">Submission Guidelines</span>
          <h2 className="artIntroTitle">Submit your talent in a professional way</h2>
          <p className="artParagraph">
            Share your creativity with us. This platform is for artists in Kakuma Refugee Camp
            to showcase their talent in music, visual arts, dance, and other creative expressions.
          </p>
          <div className="artNotice" role="note">
            <strong>NB:</strong> We will only review submissions when opportunities are officially announced
            on our social media platforms. Please submit your work after following our official updates
            and announcements.
          </div>
                </div>
              </div>
            </div>
          </div>

        <form className="artSubmissionForm" onSubmit={handleSubmit} noValidate>
          <h2 className="formTitle">Submit Your Talent</h2>
          <p className="formSubtitle">
            Complete the form below carefully. Our team will review the information and contact selected applicants.
          </p>

          <div className="formHighlightCard">
            <p>
              Share your strongest work clearly and professionally. Add correct details, a good artwork title,
              and valid links so our team can review your creativity properly.
            </p>
          </div>

          <div className="formGrid">
            <label className="voc-field-block" htmlFor="voc-artist-name">
              <span>Full Name / Artist Name</span>
              <input
                id="voc-artist-name"
                type="text"
                name="artistName"
                placeholder="Enter your full name or artist name"
                value={talentForm.artistName}
                onChange={handleTalentChange}
                className={talentErrors.artistName ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("artistName")}
            </label>

            <label className="voc-field-block" htmlFor="voc-age">
              <span>Age</span>
              <input
                id="voc-age"
                type="text"
                name="age"
                placeholder="Age (Optional)"
                value={talentForm.age}
                onChange={handleTalentChange}
                className={talentErrors.age ? "voc-input-invalid" : ""}
              />
              {renderFieldError("age")}
            </label>

            <label className="voc-field-block" htmlFor="voc-gender">
              <span>Gender</span>
              <input
                id="voc-gender"
                type="text"
                name="gender"
                placeholder="Gender (Optional)"
                value={talentForm.gender}
                onChange={handleTalentChange}
              />
            </label>

            <label className="voc-field-block" htmlFor="voc-phone">
              <span>Phone Number</span>
              <input
                id="voc-phone"
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={talentForm.phone}
                onChange={handleTalentChange}
                className={talentErrors.phone ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("phone")}
            </label>

            <label className="voc-field-block" htmlFor="voc-email">
              <span>Email Address</span>
              <input
                id="voc-email"
                type="email"
                name="email"
                placeholder="Email Address"
                value={talentForm.email}
                onChange={handleTalentChange}
                className={talentErrors.email ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("email")}
            </label>

            <label className="voc-field-block" htmlFor="voc-confirm-email">
              <span>Confirm Email Address</span>
              <input
                id="voc-confirm-email"
                type="email"
                name="confirmEmail"
                placeholder="Confirm Email Address"
                value={talentForm.confirmEmail}
                onChange={handleTalentChange}
                className={talentErrors.confirmEmail ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("confirmEmail")}
            </label>

            <label className="voc-field-block" htmlFor="voc-location">
              <span>Location</span>
              <input
                id="voc-location"
                type="text"
                name="location"
                placeholder="Location (Kakuma Block / Country)"
                value={talentForm.location}
                onChange={handleTalentChange}
                className={talentErrors.location ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("location")}
            </label>

            <label className="voc-field-block" htmlFor="voc-art-title">
              <span>Title of Your Talent or Work</span>
              <input
                id="voc-art-title"
                type="text"
                name="artTitle"
                placeholder="Title of Your Talent or Work"
                value={talentForm.artTitle}
                onChange={handleTalentChange}
                className={talentErrors.artTitle ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("artTitle")}
            </label>

            <label className="voc-field-block" htmlFor="voc-social-handle">
              <span>Social Media Handle</span>
              <input
                id="voc-social-handle"
                type="text"
                name="socialHandle"
                placeholder="Social Media Handle (Optional)"
                value={talentForm.socialHandle}
                onChange={handleTalentChange}
              />
            </label>
          </div>

          <div className="formStack">
            <label className="voc-field-block" htmlFor="voc-art-category">
              <span>Select Art Category</span>
              <select
                id="voc-art-category"
                name="artCategory"
                value={talentForm.artCategory}
                onChange={handleTalentChange}
                className={talentErrors.artCategory ? "voc-input-invalid" : ""}
                required
              >
                <option value="">Select Art Category</option>
                <option value="music">Music</option>
                <option value="dance">Dance</option>
                <option value="visual_art">Visual Art</option>
                <option value="poetry">Poetry</option>
                <option value="drama">Drama / Acting</option>
                <option value="crafts">Crafts</option>
                <option value="fashion">Fashion / Design</option>
                <option value="storytelling">Storytelling</option>
                <option value="other">Other</option>
              </select>
              {renderFieldError("artCategory")}
            </label>

            <label className="voc-field-block" htmlFor="voc-art-description">
              <span>Describe Your Talent or Artwork</span>
              <textarea
                id="voc-art-description"
                name="artDescription"
                placeholder="Describe your talent or artwork..."
                value={talentForm.artDescription}
                onChange={handleTalentChange}
                className={talentErrors.artDescription ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("artDescription")}
            </label>

            <label className="voc-field-block" htmlFor="voc-artist-story">
              <span>Your Story as an Artist</span>
              <textarea
                id="voc-artist-story"
                name="artistStory"
                placeholder="Tell us your story as an artist (optional but recommended)"
                value={talentForm.artistStory}
                onChange={handleTalentChange}
              />
            </label>

            <label className="voc-field-block" htmlFor="voc-portfolio-link">
              <span>Your Portfolio / Instagram / YouTube Link</span>
              <input
                id="voc-portfolio-link"
                type="url"
                name="portfolioLink"
                placeholder="Your Portfolio / Instagram / YouTube Link"
                value={talentForm.portfolioLink}
                onChange={handleTalentChange}
                className={talentErrors.portfolioLink ? "voc-input-invalid" : ""}
              />
              {renderFieldError("portfolioLink")}
            </label>

            <label className="voc-field-block" htmlFor="voc-artwork-link">
              <span>Link to Your Artwork</span>
              <input
                id="voc-artwork-link"
                type="url"
                name="artworkLink"
                placeholder="Link to your artwork (Google Drive / Video / Audio)"
                value={talentForm.artworkLink}
                onChange={handleTalentChange}
                className={talentErrors.artworkLink ? "voc-input-invalid" : ""}
                required
              />
              <small className="voc-field-note">Only a valid link URL is accepted for artwork review.</small>
              {renderFieldError("artworkLink")}
            </label>

            <label className="voc-field-block" htmlFor="voc-experience-level">
              <span>Experience Level</span>
              <select
                id="voc-experience-level"
                name="experienceLevel"
                value={talentForm.experienceLevel}
                onChange={handleTalentChange}
                className={talentErrors.experienceLevel ? "voc-input-invalid" : ""}
              >
                <option value="">Experience Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="professional">Professional</option>
              </select>
              {renderFieldError("experienceLevel")}
            </label>

            <label className="voc-field-block" htmlFor="voc-message">
              <span>Additional Message or Request</span>
              <textarea
                id="voc-message"
                name="message"
                placeholder="Any additional message or request..."
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
            <span>I confirm that this submission is complete and ready for AUVD review.</span>
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
            <span>Confirm that you are not a robot.</span>
          </label>
          {renderFieldError("confirmNotRobot")}

          <button type="submit" className="submitButton" disabled={submitStatus === "submitting"}>
            {submitStatus === "submitting" ? "Submitting..." : "Submit Your Art"}
          </button>

          {submitStatus === "success" ? (
            <div className="formFeedback success" role="status">
              {submitMessage || "Thank you for your submission. Our team will review it and will get back at you only if you have been selected. Thank you."}
            </div>
          ) : null}

          {submitStatus === "error" ? (
            <div className="formFeedback error" role="alert">
              {submitMessage || "Your submission could not be sent right now. Please try again in a moment."}
            </div>
          ) : null}

        </form>
      </section>
    </div>
  );
}

export default App;