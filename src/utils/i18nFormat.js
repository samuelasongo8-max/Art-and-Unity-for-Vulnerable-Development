import { useTranslation } from "react-i18next";

/* ==========================================================================
   Shared date and label formatting for the language switcher.

   Every visible date goes through Intl.DateTimeFormat with the ACTIVE
   language, so "13 August 2026" becomes "13 août 2026" in French and returns
   to the exact English string when the visitor switches back.

   English uses en-GB (day month year), which is the wording the site has
   always shown; French uses fr-FR.
   ========================================================================== */
const localeForLanguage = (language) => (language === "fr" ? "fr-FR" : "en-GB");

export const formatDate = (isoDate, language, options = {}) =>
  new Intl.DateTimeFormat(localeForLanguage(language), {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(isoDate));

/* "October 5, 2025" — same long-month form, used on the Events page. */
export const formatLongDate = (isoDate, language) => formatDate(isoDate, language);

/* ==========================================================================
   Weeks-ago label. English and French plurals are handled by i18next plural
   keys, so "5 weeks ago" becomes "il y a 5 semaines" and "1 week ago"
   becomes "il y a 1 semaine".
   ========================================================================== */
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const useWeeksAgo = () => {
  const { t } = useTranslation();

  return (isoDate) => {
    if (!isoDate) {
      return "";
    }

    const timestamp = new Date(isoDate).getTime();

    if (Number.isNaN(timestamp)) {
      return "";
    }

    const weeks = Math.floor((Date.now() - timestamp) / WEEK_IN_MS);

    if (weeks < 1) {
      return t("impact.grid.weeksThisWeek");
    }

    return t("impact.grid.weeksAgo", { count: weeks });
  };
};
