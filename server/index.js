import { config as loadEnv } from "dotenv";
import express from "express";
import cors from "cors";

loadEnv({ path: ".env", override: false });
loadEnv({ path: ".env.local", override: true });

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getEmailJsConfig = () => ({
  serviceId: process.env.VITE_EMAILJS_SERVICE_ID,
  templateId: process.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.VITE_EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
  recipientEmail: process.env.VITE_CONTACT_RECIPIENT_EMAIL,
});

const validateContactPayload = (payload) => {
  const errors = {};

  if (!payload.fullName?.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!payload.email?.trim()) {
    errors.email = "Email address is required.";
  } else if (!emailPattern.test(payload.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!payload.subject?.trim()) {
    errors.subject = "Subject is required.";
  }

  if (!payload.message?.trim()) {
    errors.message = "Message is required.";
  } else if (payload.message.trim().length < 20) {
    errors.message = "Message should be at least 20 characters.";
  }

  return errors;
};

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/contact", async (request, response) => {
  const validationErrors = validateContactPayload(request.body || {});

  if (Object.keys(validationErrors).length > 0) {
    response.status(400).json({
      message: "Please complete the form correctly before sending.",
      errors: validationErrors,
    });
    return;
  }

  const emailJsConfig = getEmailJsConfig();
  if (
    !emailJsConfig.serviceId ||
    !emailJsConfig.templateId ||
    !emailJsConfig.publicKey ||
    !emailJsConfig.privateKey
  ) {
    response.status(500).json({
      message: "Email service is not fully configured yet. Add the EmailJS server key to your backend environment.",
    });
    return;
  }

  const trimmedFullName = request.body.fullName.trim();
  const trimmedEmail = request.body.email.trim();
  const trimmedSubject = request.body.subject.trim();
  const trimmedMessage = request.body.message.trim();
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

  try {
    await Promise.all(
      recipientList.map(async (recipientEmail) => {
        const emailJsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: emailJsConfig.serviceId,
            template_id: emailJsConfig.templateId,
            user_id: emailJsConfig.publicKey,
            accessToken: emailJsConfig.privateKey,
            template_params: {
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
          }),
        });

        if (!emailJsResponse.ok) {
          const errorText = (await emailJsResponse.text()).trim();
          throw new Error(errorText || "EmailJS request failed.");
        }
      })
    );

    response.status(200).json({
      message: "Message sent successfully. We will get back to you soon.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown email delivery error.";

    response.status(502).json({
      message: `Your message could not be sent right now. Please check your EmailJS template fields and try again. (${errorMessage})`,
    });
  }
});

app.listen(port, () => {
  console.log(`AUVD contact server listening on http://localhost:${port}`);
});