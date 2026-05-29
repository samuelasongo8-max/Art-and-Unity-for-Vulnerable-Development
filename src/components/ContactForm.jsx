import { useState } from "react";
import "./ContactForm.css";

const web3FormsAccessKey = "720af78f-5c60-44e9-9ed4-2098092ebc40";

const initialValues = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeSubmitError = (error) => {
  if (!(error instanceof Error)) {
    return "Your message could not be sent right now. Please try again.";
  }

  const message = error.message.trim();

  if (!message) {
    return "Your message could not be sent right now. Please try again.";
  }

  if (message.startsWith("<!DOCTYPE html") || message.startsWith("<html")) {
    return "The contact form returned an unexpected HTML response. Please check the form service configuration and try again.";
  }

  return message;
};

const validateValues = (values) => {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.subject.trim()) {
    errors.subject = "Subject is required.";
  }

  if (!values.message.trim()) {
    errors.message = "Message is required.";
  } else if (values.message.trim().length < 20) {
    errors.message = "Message should be at least 20 characters.";
  }

  return errors;
};

function ContactForm({ className = "", ...restProps }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => {
      if (!previous[name]) {
        return previous;
      }

      const nextErrors = { ...previous };
      delete nextErrors[name];
      return nextErrors;
    });

    if (submitState.status !== "idle") {
      setSubmitState({ status: "idle", message: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateValues(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitState({
        status: "error",
        message: "Please complete the form correctly before sending.",
      });
      return;
    }

    setSubmitState({ status: "submitting", message: "" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          name: values.fullName.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Message delivery failed.");
      }

      setValues(initialValues);
      setErrors({});
      setSubmitState({
        status: "success",
        message: payload.message || "Message sent successfully. We will get back to you soon.",
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message: normalizeSubmitError(error),
      });
    }
  };

  return (
    <section className={`contact-email-card ${className}`.trim()} {...restProps}>
      <div className="contact-email-card__header">
        <p className="contact-email-card__eyebrow">Contact Us</p>
        <h2>Partner With AUVD</h2>
      </div>

      <form className="contact-email-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-email-form__grid">
          <div className="contact-email-field">
            <label htmlFor="contact-full-name">Full Name</label>
            <input
              id="contact-full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={values.fullName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "contact-full-name-error" : undefined}
            />
            {errors.fullName ? (
              <span id="contact-full-name-error" className="contact-email-field__error" role="alert">
                {errors.fullName}
              </span>
            ) : null}
          </div>

          <div className="contact-email-field">
            <label htmlFor="contact-email-address">Email Address</label>
            <input
              id="contact-email-address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="yourname@example.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-address-error" : undefined}
            />
            {errors.email ? (
              <span id="contact-email-address-error" className="contact-email-field__error" role="alert">
                {errors.email}
              </span>
            ) : null}
          </div>
        </div>

        <div className="contact-email-field">
          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="Tell us what you would like to discuss"
            value={values.subject}
            onChange={handleChange}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          />
          {errors.subject ? (
            <span id="contact-subject-error" className="contact-email-field__error" role="alert">
              {errors.subject}
            </span>
          ) : null}
        </div>

        <div className="contact-email-field">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows="7"
            placeholder="Type your message here..."
            value={values.message}
            onChange={handleChange}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : "contact-message-note"}
          />
          <div className="contact-email-field__meta">
            <span id="contact-message-note" className="contact-email-field__note">
              Share your partnership idea, support request, or collaboration message.
            </span>
            <span className="contact-email-field__count">{values.message.trim().length} characters</span>
          </div>
          {errors.message ? (
            <span id="contact-message-error" className="contact-email-field__error" role="alert">
              {errors.message}
            </span>
          ) : null}
        </div>

        <button
          className="contact-email-form__submit"
          type="submit"
          disabled={submitState.status === "submitting"}
        >
          <span>{submitState.status === "submitting" ? "Sending Message..." : "Send Message"}</span>
        </button>

        <div className="contact-email-form__status" aria-live="polite" aria-atomic="true">
          {submitState.message ? (
            <p
              className={`contact-email-form__feedback contact-email-form__feedback--${submitState.status}`}
              role={submitState.status === "error" ? "alert" : "status"}
            >
              {submitState.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default ContactForm;
