import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

// Read the saved language once at startup. Anything other than an explicit
// "fr" falls back to English, so a stale or corrupt value can never leave the
// site with no strings.
const stored = typeof window !== "undefined" ? window.localStorage.getItem("auvd-lang") : null;
const initial = stored === "fr" ? "fr" : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: initial,
  fallbackLng: "en",
  // Keys are grouped by page/component, so this makes a missing or renamed key
  // obvious in development instead of rendering a silent blank.
  parseMissingKeyHandler: (key) => `⚠ ${key}`,
  interpolation: { escapeValue: false },
});

// Keep <html lang> in sync for accessibility, screen readers and SEO, and
// persist the choice so it survives refreshes and client-side navigation.
const applyLang = (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", lng);
  }
};

applyLang(i18n.language);
i18n.on("languageChanged", (lng) => {
  applyLang(lng);
  try {
    window.localStorage.setItem("auvd-lang", lng);
  } catch {
    // Private browsing / storage disabled — the switcher still works for the
    // current session, it just will not be remembered.
  }
});

export default i18n;
