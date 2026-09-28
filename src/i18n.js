import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

/* ==========================================================================
   Language selection order
   1. localStorage  — the visitor's own choice, saved by the switcher
   2. navigator     — browser language, so a French browser opens in French
                      (fr, fr-FR, fr-CA … all collapse to "fr" via
                      detection.convertDetectedLanguage)
   3. fallbackLng   — English
   ========================================================================== */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "auvd-lang",
      caches: ["localStorage"],
      /* Collapse a regional code to the base language BEFORE it is cached or
         checked against supportedLngs: fr-FR / fr-CA / fr-BE all become "fr".
         Without this, a French browser that reports "fr-FR" misses the "fr"
         bundle, silently falls back to English, and then caches "fr-FR" in
         localStorage so the wrong value is persisted as well. */
      convertDetectedLanguage: (code) => {
        if (typeof code !== "string") return code;
        const base = code.split(/[-_]/)[0].toLowerCase();
        return base === "en" || base === "fr" ? base : code;
      },
    },
    supportedLngs: ["en", "fr"],
    fallbackLng: "en",
    nonExplicitSupportedLngs: true,
    // Keys are grouped by page/component, so this makes a missing or renamed key
    // obvious in development instead of rendering a silent blank.
    parseMissingKeyHandler: (key) => `⚠ ${key}`,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

/* ==========================================================================
   Everything outside React — <html lang>, document.title and the meta tags
   in index.html — has to follow the active language too, on first load and
   on every change, with no reload.
   ========================================================================== */
const applyDocumentLanguage = (lng) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute("lang", lng);

  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const entry = Object.values(i18n.getResourceBundle(lng, "translation")?.meta?.pages ?? {}).find(
    (page) => page && page.path === currentPath,
  );

  if (entry?.title) {
    document.title = entry.title;
  }

  const setMetaContent = (selector, value) => {
    if (!value) {
      return;
    }
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      const attribute = selector.includes("property=") ? "property" : "name";
      const match = selector.match(new RegExp(`${attribute}="([^"]+)"`));
      if (!match) {
        return;
      }
      element.setAttribute(attribute, match[1]);
      document.head.appendChild(element);
    }
    element.setAttribute("content", value);
  };

  if (entry?.title) {
    setMetaContent('meta[name="description"]', entry.description);
    setMetaContent('meta[property="og:title"]', entry.title);
    setMetaContent('meta[property="og:description"]', entry.description);
    setMetaContent('meta[name="twitter:title"]', entry.title);
    setMetaContent('meta[name="twitter:description"]', entry.description);
  }
};

applyDocumentLanguage(i18n.language);
i18n.on("languageChanged", applyDocumentLanguage);

if (import.meta.env?.DEV) {
  // In development, log every key that has no value in the active language so a
  // forgotten French string shows up in the console instead of silently
  // falling back to English.
  i18n.on("missingKey", (lngs, fallbackLng, key) => {
    // eslint-disable-next-line no-console
    console.warn(`[i18n] missing "${key}" for language(s): ${lngs.join(", ")}`);
  });
}


export default i18n;
