import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import "./ContactForm.css";

const initialValues = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const emailJsConfig = useMemo(
    () => ({
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      recipientEmail: import.meta.env.VITE_CONTACT_RECIPIENT_EMAIL,
    }),
    []
  );

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

    if (!emailJsConfig.serviceId || !emailJsConfig.templateId || !emailJsConfig.publicKey) {
      setSubmitState({
        status: "error",
        message:
          "Email service is not fully configured yet. Add your EmailJS template ID in the Vite environment file.",
      });
      return;
    }

    setSubmitState({ status: "submitting", message: "" });

    try {
      const trimmedFullName = values.fullName.trim();
      const trimmedEmail = values.email.trim();
      const trimmedSubject = values.subject.trim();
      const trimmedMessage = values.message.trim();
      const formattedMessage = [
        `Full Name: ${trimmedFullName}`,
        `Email Address: ${trimmedEmail}`,
        `Subject: ${trimmedSubject}`,
        "",
        "Message:",
        trimmedMessage,
      ].join("\n");
      const recipientList = (emailJsConfig.recipientEmail || "samuelasongoinfoo@gmail.com")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      await Promise.all(
        recipientList.map((recipientEmail) =>
          emailjs.send(
            emailJsConfig.serviceId,
            emailJsConfig.templateId,
            {
              from_name: trimmedFullName,
              from_email: trimmedEmail,
              subject: trimmedSubject,
              message: trimmedMessage,
              reply_to: trimmedEmail,
              to_email: recipientEmail,
              cc_email: "",
              recipient_list: recipientEmail,
              name: trimmedFullName,
              email: trimmedEmail,
              user_name: trimmedFullName,
              user_email: trimmedEmail,
              title: trimmedSubject,
              contact_subject: trimmedSubject,
              contact_message: trimmedMessage,
              email_body: formattedMessage,
              formatted_message: formattedMessage,
            },
            emailJsConfig.publicKey
          )
        )
      );

      setValues(initialValues);
      setErrors({});
      setSubmitState({
        status: "success",
        message: "Message sent successfully. We will get back to you soon.",
      });
    } catch (error) {
      const errorText =
        typeof error?.text === "string" && error.text.trim()
          ? ` (${error.text.trim()})`
          : "";

      setSubmitState({
        status: "error",
        message: `Your message could not be sent right now. Please check your EmailJS template fields and try again.${errorText}`,
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
