import { Trans, useTranslation } from "react-i18next";
/* ImpactHero is no longer used on this page: the Our Impact hero now
   follows the source's own /impact/ page-hero design (p1-impact-page-hero-*
   rules in OurImpact.css). Every other page keeps using ImpactHero. */
import { Link } from "react-router-dom";
import ImpactGrid from "./our-impact/ImpactGrid";
import "./OurImpact.css";

/* ==========================================================================
   Impact content.

   The array below holds only NON-TEXT data plus translation keys. Every
   title, excerpt, tag and alt text is resolved with t() while rendering, so
   switching language updates every card immediately with no reload.

   The four News cards below are copies of the posts in Blogs.jsx.
   ========================================================================== */
// TODO: When the report is published, add entries with category 'Report'.
// Only News entries live here right now. Blogs are rendered by Blogs.jsx on
// /our-impact/blogs and are intentionally NOT part of this array, so they never
// appear in the All or News grids. News.jsx and Report.jsx reuse this array,
// which is why it is exported from the page that owns it.
//
// Entry shape rendered by the shared ImpactGrid:
//   id           unique key
//   titleKey     translation key for the card title
//   buttonLink   optional route path — when set, an "En savoir plus" <Link>
//                button is shown in place of the title
//   category     "News" (or "Report" once reports are published)
//   date         optional ISO date — the card shows how many WEEKS ago it was
//   metaDateKey  optional key for the first entry in the meta row
//   metaRead     optional read-time in minutes ("4 min read" / "4 min de lecture")
//   excerptKey   optional key for the summary under the title
//   tagKey       optional key for the small uppercase label above the title
//   image        optional image path
//   altKey       optional image alt key (defaults to the translated title)
//   imageFit     optional "contain" (default: "cover")
// eslint-disable-next-line react-refresh/only-export-components
export const impacts = [
  {
    id: 1,
    category: "News",
    date: "2026-08-13",
    image: "/Foundation_Logo_Lockup.png",
    altKey: "impact.items.one.alt",
    imageFit: "contain",
    buttonLink: "/news/daddario-community-music-grant",
  },
  {
    id: 2,
    titleKey: "impact.items.two.title",
    category: "News",
    metaDateKey: "impact.items.two.metaDate",
    metaRead: 4,
    // TODO: Set the real publication date for this post.
    date: "2025-10-01",
    excerptKey: "impact.items.two.excerpt",
    image: "/Youth peace week.jpg",
  },
  {
    id: 3,
    titleKey: "impact.items.three.title",
    category: "News",
    metaDateKey: "impact.items.three.metaDate",
    metaRead: 3,
    // TODO: Set the real publication date for this post.
    date: "2025-01-01",
    excerptKey: "impact.items.three.excerpt",
    image: "/donation.jpg",
  },
  {
    id: 4,
    // Blogs.jsx gives this post only the category "Community" (used as the tag
    // below) and no date, so no weeks-ago text is shown.
    tagKey: "impact.items.four.tag",
    titleKey: "impact.items.four.title",
    category: "News",
    excerptKey: "impact.items.four.excerpt",
    image: "/violin.jpg",
  },
  {
    id: 5,
    // Blogs.jsx gives this post only the category "First Notes" (used as the tag
    // below) and no date, so no weeks-ago text is shown.
    tagKey: "impact.items.five.tag",
    titleKey: "impact.items.five.title",
    category: "News",
    excerptKey: "impact.items.five.excerpt",
    image: "/donation-2.jpg",
  },
];

/* ==========================================================================
   /our-impact hero — the shared ImpactHero component (the exact design Our
   Story, Work, Pricing and Events use), carrying this page's own heading and
   intro paragraph. The photo is one the project already uses (the music
   lesson in refugees.jpg, also shown on the Home page). No label and no
   button: the page's old hero had neither. Instead of the single fact card
   the shared hero normally takes, this hero ends with a row of four equal
   stat cards (the `stats` variant added to the component).
   It is mounted by OurImpactLayout above the sidebar and the card grid so the
   photo stays full-bleed; .our-impact-hero-bleed in OurImpact.css cancels the
   page's own padding for this block only.
   ========================================================================== */
/* Only the numbers live here — each label, caption and list item is a
   translation key resolved with t() at render time. */
const heroStats = [
  {
    value: "500+",
    labelKey: "impact.stats.reached.label",
    captionKey: "impact.stats.reached.caption",
  },
  {
    value: "7",
    labelKey: "impact.stats.programs.label",
    listKeys: [
      "impact.stats.programs.list_one",
      "impact.stats.programs.list_two",
      "impact.stats.programs.list_three",
      "impact.stats.programs.list_four",
      "impact.stats.programs.list_five",
    ],
  },
  {
    value: "100+",
    labelKey: "impact.stats.trained.label",
    captionKey: "impact.stats.trained.caption",
  },
  {
    value: "1",
    labelKey: "impact.stats.camps.label",
    captionKey: "impact.stats.camps.caption",
  },
];

export const OurImpactHero = () => {
  const { t } = useTranslation();

  return (
    <div className="our-impact-hero-bleed">
      <section className="p1-impact-page-hero">
        <div className="p1-impact-page-hero__top">
          <h1 className="p1-impact-page-hero__title">{t("impact.hero.heading")}</h1>
          <p className="p1-impact-page-hero__subtitle">{t("impact.hero.paragraph")}</p>
        </div>

        {/* Stats band, pinned to the bottom of the hero — the source's
            page-hero design; the target's four figures (with the Core
            Programs list) fill its four slots. */}
        <div className="p1-impact-page-hero__band">
          <div className="p1-impact-page-hero__grid">
            {heroStats.map((stat) => (
              <div key={stat.labelKey} className="p1-impact-page-hero__stat">
                <span className="p1-impact-page-hero__value">{stat.value}</span>
                <span className="p1-impact-page-hero__label">{t(stat.labelKey)}</span>
                {stat.listKeys ? (
                  <ul className="p1-impact-page-hero__list">
                    {stat.listKeys.map((key) => (
                      <li key={key}>{t(key)}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ==========================================================================
   /our-impact — "How we measure" — the closing CTA band.

   A full-bleed photo on the left with an overlapping blue card on the right
   (the source project's /impact/ "How we measure" block, re-skinned with the
   target palette). It is the last thing on the All view, mounted by
   OurImpactLayout below the sidebar + card grid so the photo can reach the
   screen edges; .our-impact-measure-bleed cancels the page's own horizontal
   padding for this band only, the same way .our-impact-hero-bleed does for
   the hero above.

   All copy is translated with t() and the link labels are their own keys, so
   the band follows the language like the rest of the page.
   ========================================================================== */
export const OurImpactMeasure = () => {
  const { t } = useTranslation();

  return (
    <div className="our-impact-measure-bleed">
      <section className="p1-measure">
        <img
          className="p1-measure__image"
          src="/muziki.webp"
          alt={t("impact.measure.imageAlt")}
        />

        <div className="p1-measure__card">
          <h2 className="p1-measure__title">{t("impact.measure.title")}</h2>
          <p className="p1-measure__text">
            {t("impact.measure.textBefore")}
            <Link className="p1-measure__link" to="/our-impact/report">
              {t("impact.measure.resources")}
            </Link>
            .
          </p>

          <h3 className="p1-measure__subtitle">{t("impact.measure.subtitle")}</h3>
          <p className="p1-measure__text">
            <Link className="p1-measure__donate" to="/donate">
              {t("impact.measure.donate")}
            </Link>
            {", "}
            <Link className="p1-measure__link" to="/contact">
              {t("impact.measure.volunteer")}
            </Link>{" "}
            {t("impact.measure.or")}{" "}
            <Link className="p1-measure__link" to="/contact">
              {t("impact.measure.partner")}
            </Link>{" "}
            {t("impact.measure.withUs")}
          </p>
        </div>
      </section>
    </div>
  );
};

/* ==========================================================================
   /our-impact — "All" view: every entry in the impacts array.
   The shared ImpactGrid does the filtering and renders the cards.
   ========================================================================== */
const OurImpact = () => <ImpactGrid category="All" items={impacts} />;

export default OurImpact;
