import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./ContactForm.css";

const web3FormsAccessKey = "720af78f-5c60-44e9-9ed4-2098092ebc40";

const initialValues = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Every user-facing string in this form is a translation key, so a French
   visitor sees French labels, placeholders, validation errors and status
   messages — and switching back to English restores the original wording. */
const normalizeSubmitError = (error, t) => {
  if (!(error instanceof Error)) {
    return t("contact.form.errors.sendFailed");
  }

  const message = error.message.trim();

  if (!message) {
    return t("contact.form.errors.sendFailed");
  }

  if (message.startsWith("<!DOCTYPE html") || message.startsWith("<html")) {
    return t("contact.form.errors.htmlResponse");
  }

  return message;
};

const validateValues = (values, t) => {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = t("contact.form.errors.fullName");
  }

  if (!values.email.trim()) {
    errors.email = t("contact.form.errors.emailRequired");
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = t("contact.form.errors.emailInvalid");
  }

  if (!values.subject.trim()) {
    errors.subject = t("contact.form.errors.subject");
  }

  if (!values.message.trim()) {
    errors.message = t("contact.form.errors.messageRequired");
  } else if (values.message.trim().length < 20) {
    errors.message = t("contact.form.errors.messageShort");
  }

  return errors;
};

function ContactForm({ className = "", ...restProps }) {
  const { t } = useTranslation();
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

    const validationErrors = validateValues(values, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitState({
        status: "error",
        message: t("contact.form.errors.formInvalid"),
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
        throw new Error(payload.message || t("contact.form.errors.sendFailed"));
      }

      setValues(initialValues);
      setErrors({});
      setSubmitState({
        status: "success",
        message: payload.message || t("contact.form.errors.success"),
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message: normalizeSubmitError(error, t),
      });
    }
  };

  return (
    <section className={`contact-email-card ${className}`.trim()} {...restProps}>
      <div className="contact-email-card__header">
        <p className="contact-email-card__eyebrow">{t("contact.form.eyebrow")}</p>
        <h2>{t("contact.form.title")}</h2>
      </div>

      <form className="contact-email-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-email-form__grid">
          <div className="contact-email-field">
            <label htmlFor="contact-full-name">{t("contact.form.fullName")}</label>
            <input
              id="contact-full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder={t("contact.form.fullNamePlaceholder")}
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
            <label htmlFor="contact-email-address">{t("contact.form.email")}</label>
            <input
              id="contact-email-address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t("contact.form.emailPlaceholder")}
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
          <label htmlFor="contact-subject">{t("contact.form.subject")}</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder={t("contact.form.subjectPlaceholder")}
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
          <label htmlFor="contact-message">{t("contact.form.message")}</label>
          <textarea
            id="contact-message"
            name="message"
            rows="7"
            placeholder={t("contact.form.messagePlaceholder")}
            value={values.message}
            onChange={handleChange}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : "contact-message-note"}
          />
          <div className="contact-email-field__meta">
            <span id="contact-message-note" className="contact-email-field__note">
              {t("contact.form.messageNote")}
            </span>
            <span className="contact-email-field__count">{t("common.characters", { count: values.message.trim().length })}</span>
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
          <span>{submitState.status === "submitting" ? t("contact.form.sending") : t("contact.form.send")}</span>
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
