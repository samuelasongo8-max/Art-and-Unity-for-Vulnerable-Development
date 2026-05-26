import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

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

const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const locationPattern = /^[A-Za-z0-9\s/,'-]+$/;

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
  } else if (!namePattern.test(form.artistName.trim())) {
    errors.artistName = "Name must contain text only, not numbers.";
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
  } else if (!locationPattern.test(form.location.trim())) {
    errors.location = "Location must use words, numbers, or / only.";
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

const themeOptions = [
  {
    label: "Blue",
    color: "#117acf",
    styles: {
      "--voc-page-bg": "#f4f8ff",
      "--voc-accent": "#117acf",
      "--voc-accent-strong": "#0b5fa8",
      "--voc-accent-soft": "rgba(17, 122, 207, 0.12)",
      "--voc-accent-glow": "rgba(17, 122, 207, 0.18)",
      "--voc-panel-border": "rgba(17, 122, 207, 0.14)",
      "--voc-panel-shadow": "rgba(13, 50, 83, 0.1)",
      "--voc-highlight-bg": "linear-gradient(135deg, #0c4fd6 0%, #117acf 100%)",
      "--voc-input-bg": "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
      "--voc-focus-ring": "rgba(17, 122, 207, 0.14)",
      "--voc-heading": "#13253a",
      "--voc-copy": "#475b72",
      "--voc-body": "#17324a",
    },
  },
  {
    label: "Green",
    color: "#0b4613",
    styles: {
      "--voc-page-bg": "#f4fbf5",
      "--voc-accent": "#0b7a24",
      "--voc-accent-strong": "#0b4613",
      "--voc-accent-soft": "rgba(11, 122, 36, 0.12)",
      "--voc-accent-glow": "rgba(11, 122, 36, 0.18)",
      "--voc-panel-border": "rgba(11, 122, 36, 0.14)",
      "--voc-panel-shadow": "rgba(12, 58, 27, 0.1)",
      "--voc-highlight-bg": "linear-gradient(135deg, #0b4613 0%, #18b33a 100%)",
      "--voc-input-bg": "linear-gradient(180deg, #ffffff 0%, #f6fdf7 100%)",
      "--voc-focus-ring": "rgba(11, 122, 36, 0.14)",
      "--voc-heading": "#133020",
      "--voc-copy": "#456251",
      "--voc-body": "#173922",
    },
  },
  {
    label: "Orange",
    color: "#ff9800",
    styles: {
      "--voc-page-bg": "#fff8ef",
      "--voc-accent": "#ff9800",
      "--voc-accent-strong": "#d96a00",
      "--voc-accent-soft": "rgba(255, 152, 0, 0.12)",
      "--voc-accent-glow": "rgba(255, 152, 0, 0.2)",
      "--voc-panel-border": "rgba(255, 152, 0, 0.16)",
      "--voc-panel-shadow": "rgba(107, 63, 11, 0.12)",
      "--voc-highlight-bg": "linear-gradient(135deg, #d96a00 0%, #ff9800 100%)",
      "--voc-input-bg": "linear-gradient(180deg, #ffffff 0%, #fffaf2 100%)",
      "--voc-focus-ring": "rgba(255, 152, 0, 0.16)",
      "--voc-heading": "#3b2411",
      "--voc-copy": "#755438",
      "--voc-body": "#4a3016",
    },
  },
  {
    label: "Purple",
    color: "#9c27b0",
    styles: {
      "--voc-page-bg": "#fbf4ff",
      "--voc-accent": "#9c27b0",
      "--voc-accent-strong": "#6f00b5",
      "--voc-accent-soft": "rgba(156, 39, 176, 0.12)",
      "--voc-accent-glow": "rgba(156, 39, 176, 0.18)",
      "--voc-panel-border": "rgba(156, 39, 176, 0.14)",
      "--voc-panel-shadow": "rgba(72, 28, 97, 0.12)",
      "--voc-highlight-bg": "linear-gradient(135deg, #6f00b5 0%, #a92cff 100%)",
      "--voc-input-bg": "linear-gradient(180deg, #ffffff 0%, #fdf7ff 100%)",
      "--voc-focus-ring": "rgba(156, 39, 176, 0.16)",
      "--voc-heading": "#331844",
      "--voc-copy": "#654479",
      "--voc-body": "#46215a",
    },
  },
  {
    label: "Pink",
    color: "#e91e63",
    styles: {
      "--voc-page-bg": "#fff4f8",
      "--voc-accent": "#e91e63",
      "--voc-accent-strong": "#c4004f",
      "--voc-accent-soft": "rgba(233, 30, 99, 0.12)",
      "--voc-accent-glow": "rgba(233, 30, 99, 0.18)",
      "--voc-panel-border": "rgba(233, 30, 99, 0.14)",
      "--voc-panel-shadow": "rgba(120, 25, 60, 0.12)",
      "--voc-highlight-bg": "linear-gradient(135deg, #c4004f 0%, #ff2f7d 100%)",
      "--voc-input-bg": "linear-gradient(180deg, #ffffff 0%, #fff8fb 100%)",
      "--voc-focus-ring": "rgba(233, 30, 99, 0.16)",
      "--voc-heading": "#43192a",
      "--voc-copy": "#7a4658",
      "--voc-body": "#5c2339",
    },
  },
];

function App() {
  const [themeColor, setThemeColor] = useState(themeOptions[0].color);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [talentForm, setTalentForm] = useState(initialTalentForm);
  const [talentErrors, setTalentErrors] = useState({});
  const selectedTheme = themeOptions.find((theme) => theme.color === themeColor) ?? themeOptions[0];
  const emailJsConfig = useMemo(
    () => ({
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      recipientEmail: import.meta.env.VITE_CONTACT_RECIPIENT_EMAIL,
    }),
    []
  );

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
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateTalentForm(talentForm);

    if (Object.keys(validationErrors).length > 0) {
      setTalentErrors(validationErrors);
      setSubmitStatus("invalid");
      window.alert("You must complete the form correctly before submitting.");
      return;
    }

    if (!emailJsConfig.serviceId || !emailJsConfig.templateId || !emailJsConfig.publicKey) {
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("submitting");

    try {
      const recipientList = (emailJsConfig.recipientEmail || "samuelasongoinfoo@gmail.com")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
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

      await Promise.all(
        recipientList.map((recipientEmail) =>
          emailjs.send(
            emailJsConfig.serviceId,
            emailJsConfig.templateId,
            {
              to_email: recipientEmail,
              cc_email: "",
              recipient_list: recipientEmail,
              from_name: talentForm.artistName.trim(),
              from_email: talentForm.email.trim(),
              reply_to: talentForm.email.trim(),
              subject: "New AUVD artist submission",
              submission_type: "Artist Submission Form",
              name: talentForm.artistName.trim(),
              email: talentForm.email.trim(),
              user_name: talentForm.artistName.trim(),
              user_email: talentForm.email.trim(),
              artist_name: talentForm.artistName.trim(),
              age: talentForm.age.trim() || "N/A",
              gender: talentForm.gender.trim() || "N/A",
              phone: talentForm.phone.trim(),
              confirm_email: talentForm.confirmEmail.trim(),
              location: talentForm.location.trim(),
              art_title: talentForm.artTitle.trim(),
              social_handle: talentForm.socialHandle.trim(),
              art_category: talentForm.artCategory,
              art_description: talentForm.artDescription.trim(),
              artist_story: talentForm.artistStory.trim(),
              portfolio_link: talentForm.portfolioLink.trim(),
              artwork_link: talentForm.artworkLink.trim(),
              experience_level: talentForm.experienceLevel,
              message: artistSubmissionSummary,
              additional_message: talentForm.message.trim(),
              review_confirmation: talentForm.agreeToReview ? "Yes" : "No",
              robot_confirmation: talentForm.confirmNotRobot ? "Confirmed" : "Not confirmed",
              application_summary: artistSubmissionSummary,
              email_body: artistSubmissionSummary,
              formatted_message: artistSubmissionSummary,
              submitted_application_details: artistSubmissionSummary,
              artist_submission_summary: artistSubmissionSummary,
            },
            emailJsConfig.publicKey
          )
        )
      );

      setTalentForm(initialTalentForm);
      setTalentErrors({});
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  };

  const renderFieldError = (fieldName) =>
    talentErrors[fieldName] ? (
      <span className="voc-field-error" role="alert">{talentErrors[fieldName]}</span>
    ) : null;

  return (
    <div
      className="vocational-page"
      style={selectedTheme.styles}
    >
      <section className="vocational-hero">
        <p className="vocational-kicker">Creative Opportunities</p>
        <h1 className="vocational-title">Artist submission form</h1>
        <p className="vocational-summary">
          Share your talent professionally with AUVD. This form is designed for artists in Kakuma
          Refugee Camp to submit music, visual art, dance, poetry, drama, crafts, and other creative work.
        </p>
      </section>

      <div className="theme-panel">
        <h3 className="dom">Choose Theme Color</h3>
        <div className="themeGrid">
          {themeOptions.map((theme) => (
            <div className="themeButtons" key={theme.color}>
              <button
                type="button"
                className={themeColor === theme.color ? "active" : ""}
                onClick={() => setThemeColor(theme.color)}
              >
                {theme.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      <section className="artSubmissionSection">
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

        <form className="artSubmissionForm" onSubmit={handleSubmit}>
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
            <label className="voc-field-block">
              <span>Full Name / Artist Name</span>
              <input
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

            <label className="voc-field-block">
              <span>Age</span>
              <input
                type="text"
                name="age"
                placeholder="Age (Optional)"
                value={talentForm.age}
                onChange={handleTalentChange}
                className={talentErrors.age ? "voc-input-invalid" : ""}
              />
              {renderFieldError("age")}
            </label>

            <label className="voc-field-block">
              <span>Gender</span>
              <input
                type="text"
                name="gender"
                placeholder="Gender (Optional)"
                value={talentForm.gender}
                onChange={handleTalentChange}
              />
            </label>

            <label className="voc-field-block">
              <span>Phone Number</span>
              <input
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

            <label className="voc-field-block">
              <span>Email Address</span>
              <input
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

            <label className="voc-field-block">
              <span>Confirm Email Address</span>
              <input
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

            <label className="voc-field-block">
              <span>Location</span>
              <input
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

            <label className="voc-field-block">
              <span>Title of Your Talent or Work</span>
              <input
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

            <label className="voc-field-block">
              <span>Social Media Handle</span>
              <input
                type="text"
                name="socialHandle"
                placeholder="Social Media Handle (Optional)"
                value={talentForm.socialHandle}
                onChange={handleTalentChange}
              />
            </label>
          </div>

          <div className="formStack">
            <label className="voc-field-block">
              <span>Select Art Category</span>
              <select
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

            <label className="voc-field-block">
              <span>Describe Your Talent or Artwork</span>
              <textarea
                name="artDescription"
                placeholder="Describe your talent or artwork..."
                value={talentForm.artDescription}
                onChange={handleTalentChange}
                className={talentErrors.artDescription ? "voc-input-invalid" : ""}
                required
              />
              {renderFieldError("artDescription")}
            </label>

            <label className="voc-field-block">
              <span>Your Story as an Artist</span>
              <textarea
                name="artistStory"
                placeholder="Tell us your story as an artist (optional but recommended)"
                value={talentForm.artistStory}
                onChange={handleTalentChange}
              />
            </label>

            <label className="voc-field-block">
              <span>Your Portfolio / Instagram / YouTube Link</span>
              <input
                type="url"
                name="portfolioLink"
                placeholder="Your Portfolio / Instagram / YouTube Link"
                value={talentForm.portfolioLink}
                onChange={handleTalentChange}
                className={talentErrors.portfolioLink ? "voc-input-invalid" : ""}
              />
              {renderFieldError("portfolioLink")}
            </label>

            <label className="voc-field-block">
              <span>Link to Your Artwork</span>
              <input
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

            <label className="voc-field-block">
              <span>Experience Level</span>
              <select
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

            <label className="voc-field-block">
              <span>Additional Message or Request</span>
              <textarea
                name="message"
                placeholder="Any additional message or request..."
                value={talentForm.message}
                onChange={handleTalentChange}
              />
            </label>
          </div>

          <label className={`voc-consent-row ${talentErrors.agreeToReview ? "voc-fieldset-invalid" : ""}`}>
            <input
              type="checkbox"
              name="agreeToReview"
              checked={talentForm.agreeToReview}
              onChange={handleTalentChange}
            />
            <span>I confirm that this submission is complete and ready for AUVD review.</span>
          </label>
          {renderFieldError("agreeToReview")}

          <label className={`voc-consent-row ${talentErrors.confirmNotRobot ? "voc-fieldset-invalid" : ""}`}>
            <input
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

          {submitStatus === "invalid" ? (
            <div className="formFeedback error" role="alert">
              You must complete the form correctly before submitting.
            </div>
          ) : null}

          {submitStatus === "success" ? (
            <div className="formFeedback success" role="status">
              Thank you for your submission. Our team will review it and will get back at you only if you have been selected. Thank you.
            </div>
          ) : null}

          {submitStatus === "error" ? (
            <div className="formFeedback error" role="alert">
              Your submission could not be sent right now. Please try again in a moment.
            </div>
          ) : null}

        </form>
      </section>
    </div>
  );
}

export default App;