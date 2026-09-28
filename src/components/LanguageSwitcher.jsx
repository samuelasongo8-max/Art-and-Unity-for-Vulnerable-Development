import { FaGlobe } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

/* ==========================================================================
   Language switcher — a compact EN | FR control.

   Design notes
   - A small globe icon (react-icons/fa6 FaGlobe) sits before the two options.
     No country flags: a language is not a country.
   - The ACTIVE language is bold on a filled --impact-blue background with
     white text; the inactive one is a plain link-styled button that highlights
     on hover.
   - Both options are real <button> elements with a visible :focus-visible
     outline, so the control is fully keyboard reachable.
   - Each button carries an aria-label with the full language name
     ("English" / "Français"), aria-pressed for the state, and the correct
     lang attribute ("en" / "fr") so screen readers announce it properly.
   - Clicking calls i18n.changeLanguage: the whole app re-renders immediately
     with no page reload, and the choice is cached in localStorage by the
     detector configured in src/i18n.js.
   ========================================================================== */
const LANGUAGES = [
  { code: "en", labelKey: "nav.language.en", nameKey: "nav.language.english", lang: "en" },
  { code: "fr", labelKey: "nav.language.fr", nameKey: "nav.language.french", lang: "fr" },
];

function LanguageSwitcher({ onChange, className = "" }) {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language;

  return (
    <div
      className={`lang-switch ${className}`.trim()}
      role="group"
      aria-label={t("nav.language.label")}
    >
      <FaGlobe className="lang-switch-icon" aria-hidden="true" />

      {LANGUAGES.map((language) => {
        const isActive = current === language.code;

        return (
          <button
            key={language.code}
            type="button"
            className={`lang-switch-btn${isActive ? " is-active" : ""}`}
            onClick={() => {
              i18n.changeLanguage(language.code);
              onChange?.();
            }}
            aria-label={t(language.nameKey)}
            aria-pressed={isActive}
            lang={language.lang}
            data-lang={language.code}
          >
            {t(language.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
