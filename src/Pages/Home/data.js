import kibodiii from "../../assets/kibodiii-lite.webp";
import slide5 from "../../img/slides/5.webp";
import slide7 from "../../img/slides/7.webp";

/* ==========================================================================
   Home page data.

   Every string here is a TRANSLATION KEY, never display text. The components
   call t() while rendering, so switching language updates this content
   immediately with no reload. Keeping it as keys (rather than moving the data
   into the components) preserves the existing data/page separation.
   ========================================================================== */
export const heroTitleKey = "home.hero.title";

export const slides = [
  { image: slide5, titleKey: "home.hero.slides.one" },
  { image: "/Background%20image%20AUVD1.jpg", titleKey: "home.hero.slides.auvd" },
  { image: slide7, titleKey: "home.hero.slides.two" },
  { image: "/Background%20image%20AUVD2.jpg", titleKey: "home.hero.slides.auvd" },
];

export const partnerLinks = {
  f2f: "https://www.f2fmusicfoundation.org/",
  tsf: "https://www.transylvaniansymphony.org/",
};

export const whySectionBackgrounds = ["/kakuma6.jpg", "/guitar2.jpg", kibodiii];

export const danceParagraphKey = "home.dance.description";

export const vocationalImages = [
  {
    src: "/tailoring.jpg",
    altKey: "home.vocational.altOne",
  },
  {
    src: "/Cooking.webp",
    altKey: "home.vocational.altTwo",
  },
];

/* Each stat keeps its numeric value and icon here; the title and the info
   lines are keys resolved with t() at render time. */
export const impactStats = [
  {
    key: "reached",
    value: 500,
    suffix: "+",
    titleKey: "home.impactStats.stats.reached.title",
    icon: "people",
    infoKeys: ["home.impactStats.stats.reached.info_one"],
  },
  {
    key: "programs",
    value: 7,
    suffix: "",
    titleKey: "home.impactStats.stats.programs.title",
    icon: "list",
    wide: true,
    infoKeys: [
      "home.impactStats.stats.programs.info_one",
      "home.impactStats.stats.programs.info_two",
      "home.impactStats.stats.programs.info_three",
      "home.impactStats.stats.programs.info_four",
      "home.impactStats.stats.programs.info_five",
    ],
  },
  {
    key: "trained",
    value: 100,
    suffix: "+",
    titleKey: "home.impactStats.stats.trained.title",
    icon: "graduate",
    infoKeys: ["home.impactStats.stats.trained.info_one"],
  },
  {
    key: "camps",
    value: 1,
    suffix: "",
    titleKey: "home.impactStats.stats.camps.title",
    icon: "map",
    infoKeys: ["home.impactStats.stats.camps.info_one"],
  },
];

/* Partner organizations keep their own official names in both languages, so
   the labels stay as written — only the section copy around them is keyed. */
export const partnerCards = [
  { href: "https://www.transylvaniansymphony.org/", className: "tsf", label: "Transylvanian Symphony Foundation" },
  { href: "https://www.f2fmusicfoundation.org/", className: "f2f", label: "F2F Music Foundation", text: "F2F Music Foundation" },
  { href: "https://www.en-rich-ment.org/", className: "enrichment", label: "En-Rich-Ment" },
  { href: "https://cammomusic.org/", className: "cammo", label: "Cammo Music" },
  { href: "https://hungryformusic.org/", className: "hungry", label: "Hungry for Music" },
  { href: "https://becauseinternational.org/", className: "because", label: "Because International" },
  { href: "https://kakumasound.wordpress.com/", className: "kakuma", label: "Kakuma Sound" },
  { href: "https://www.thebridgelife.com/?utm_source=chatgpt.com", className: "bright", label: "The Bridge Life" },
  { href: "https://www.yetcafrica.org/home", className: "center", label: "YETC Africa" },
];