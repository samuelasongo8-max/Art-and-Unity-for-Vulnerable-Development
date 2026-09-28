#!/usr/bin/env node
/**
 * i18n:check — development guard for the English/French translation.
 *
 * Fails (non-zero exit) when:
 *   1. a key exists in one locale file but not the other, in either direction;
 *   2. a French value is byte-for-byte identical to its English value and the
 *      key is not covered by the ALLOW_IDENTICAL list below.
 *
 * Run with:  npm run i18n:check
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(here, "..", "src", "locales");

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
const fr = JSON.parse(fs.readFileSync(path.join(localesDir, "fr.json"), "utf8"));

/**
 * Keys whose French value is intentionally the same as the English one:
 * people's names, e-mail addresses, URLs / paths, numbers and dates, the AUVD
 * acronym, the official names of partner organizations, and the words that are
 * already correct French ("Contact", "Impact", "Protection", "Message",
 * "Orange", "Blogs", "Storytelling", "Transylvanian Symphony Foundation").
 *
 * Values starting with any of these prefixes are also allowed.
 */
const ALLOW_IDENTICAL_EXACT = new Set([
  // Brand / acronym / placeholder glyphs
  "nav.language.en",
  "nav.language.fr",
  "nav.language.english",
  "nav.language.french",
  "common.arrow",
  "portfolio.hero.eyebrowBefore",
  "home.hero.slides.auvd",
  // Words that are already correct French
  "common.contact",
  "nav.contact",
  "nav.searchPages.contact.title",
  "footer.links.contact",
  "contact.form.message",
  "about.missionVision.images.mission",
  "about.missionVision.images.vision",
  "impact.layout.heading",
  "home.programs.cardThree.alt",
  "home.programs.cardThree.badge",
  "music.impactTitle",
  "portfolio.coreImpact.items.one.title",
  "vocational.theme.options.orange",
  "vocational.form.options.artCategory.storytelling",
  // "Blogs" is used as a section name in both languages on this site.
  "nav.impactMenu.blogs",
  "nav.searchPages.blogs.title",
  "impact.layout.nav.blogs",
  // Proper nouns
  "nav.aboutMenu.samuel",
  "nav.searchPages.samuel.title",
  "ourStory.origin.founder",
  "home.programs.cardOne.meta",
  "home.programs.cardTwo.meta",
  "home.programs.cardThree.meta",
  "home.programs.cardTwo.badge",
  "home.programs.cardTwo.alt",
  "home.programs.cardOne.alt",
  "home.programs.cardOne.badge",
  "impact.all.sectionOne.p1Strong",
  // Numbers and ISO dates
  "about.hero.factValue",
  "ourStory.hero.factValue",
  "impact.items.two.metaRead",
  "impact.items.three.metaRead",
  "home.grantNews.date",
  "impact.items.one.date",
  // Place names
  // Meta page paths are routing data, never displayed.
]);

const ALLOW_IDENTICAL_PATTERNS = [
  /^meta\.pages\..*\.path$/, // route paths
  /^.*\.factValue$/, // years
  /^.*\.date$/, // ISO dates
  /^.*\.metaRead$/, // read-time numbers
  /^.*\.(en|fr)$/, // language codes
  /^.*\.(english|french)$/, // endonyms
  /^common\.arrow$/, // glyph
];

/* The acronym "AUVD" is the organization's name. It is never translated and
   never re-spelled, so a value that is exactly "AUVD" is correct in both
   languages. This is value-based (not key-based) so a new key that displays
   the acronym is allow-listed automatically instead of failing the check. */
const ALLOW_IDENTICAL_VALUES = new Set(["AUVD"]);

const isAllowedIdentical = (key, value) =>
  ALLOW_IDENTICAL_EXACT.has(key) ||
  ALLOW_IDENTICAL_VALUES.has(value) ||
  ALLOW_IDENTICAL_PATTERNS.some((re) => re.test(key));

const flatten = (obj, prefix = "", out = {}) => {
  for (const [key, value] of Object.entries(obj)) {
    const keyPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flatten(value, keyPath, out);
    } else {
      out[keyPath] = value;
    }
  }
  return out;
};

const enFlat = flatten(en);
const frFlat = flatten(fr);

const missingInFr = Object.keys(enFlat).filter((k) => !(k in frFlat));
const missingInEn = Object.keys(frFlat).filter((k) => !(k in enFlat));
const untranslated = Object.keys(enFlat).filter(
  (k) => k in frFlat && enFlat[k] === frFlat[k] && !isAllowedIdentical(k, enFlat[k])
);

let failed = false;

if (missingInFr.length || missingInEn.length) {
  failed = true;
  console.error("✖ i18n:check — key sets are out of sync\n");
  for (const key of missingInFr) {
    console.error(`  missing in fr.json : ${key} = ${JSON.stringify(enFlat[key])}`);
  }
  for (const key of missingInEn) {
    console.error(`  missing in en.json : ${key} = ${JSON.stringify(frFlat[key])}`);
  }
  console.error("");
}

if (untranslated.length) {
  failed = true;
  console.error("✖ i18n:check — French value identical to the English one\n");
  for (const key of untranslated) {
    console.error(`  untranslated : ${key} = ${JSON.stringify(enFlat[key])}`);
  }
  console.error(
    "\n  If a value is intentionally identical, add its key to ALLOW_IDENTICAL_EXACT\n" +
      "  in scripts/check-i18n.js so the check documents the decision explicitly.\n"
  );
}

if (failed) {
  console.error(`\n${missingInFr.length + missingInEn.length} key mismatch(es), ${untranslated.length} untranslated value(s).`);
  process.exit(1);
}

console.log(
  `✔ i18n:check passed — ${Object.keys(enFlat).length} keys present in en.json and fr.json, no untranslated values outside the allow-list.`
);
