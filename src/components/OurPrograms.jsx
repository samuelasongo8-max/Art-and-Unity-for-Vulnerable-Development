import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaPalette,
  FaGraduationCap,
  FaHandHoldingDollar,
  FaHandshakeAngle,
  FaShoePrints,
} from "react-icons/fa6";
import "./OurPrograms.css";

/* ==========================================================================
   Our Programs — one shared section used by BOTH the Home page (right after
   Community Updates & Stories) and the Our Work page, so the two never drift.

   Design = the source's "Our Programs" icon strip exactly: a centered heading
   + intro, a 3-column grid of icon cells (icon → title → intro → sub-lists →
   buttons), left-border dividers, 3 → 2 → 1 responsive. Only the colours
   change (source teal/coral/yellow → the target's blue/orange palette via the
   CSS variables). Fonts inherit the site's already-applied source typography.

   Content is the target's own five pillars. Every visible string is resolved
   with t() so the section stays bilingual; the `id`s are preserved because the
   Our Work hero pills (and the #livelihoods-women deep link) anchor to them.
   ========================================================================== */

/* One icon per pillar, in the same 56px line style. Chosen to fit AUVD's work;
   no emoji, decorative (aria-hidden). */
const PILLAR_ICONS = {
  "arts-healing": FaPalette,
  "education-youth": FaGraduationCap,
  "livelihoods-women": FaHandHoldingDollar,
  peacebuilding: FaHandshakeAngle,
  "outreach-basic-needs": FaShoePrints,
};

/* Only routes and TRANSLATION KEYS live here. The pillar order and every
   key matches the requested content exactly. */
const programPillars = [
  {
    id: "arts-healing",
    titleKey: "work.programs.pillars.arts-healing.title",
    introKey: "work.programs.pillars.arts-healing.intro",
    img: "/Music%20training.jpg",
    imgAltKey: "work.programs.pillars.arts-healing.imageAlt",
    actions: [
      { to: "/Music", labelKey: "work.programs.pillars.arts-healing.actions_one" },
      { to: "/dance", labelKey: "work.programs.pillars.arts-healing.actions_two" },
    ],
    programs: [
      "work.programs.pillars.arts-healing.programs_one",
      "work.programs.pillars.arts-healing.programs_two",
    ],
    focus: [
      "work.programs.pillars.arts-healing.focus_one",
      "work.programs.pillars.arts-healing.focus_two",
      "work.programs.pillars.arts-healing.focus_three",
      "work.programs.pillars.arts-healing.focus_four",
    ],
  },
  {
    id: "education-youth",
    titleKey: "work.programs.pillars.education-youth.title",
    introKey: "work.programs.pillars.education-youth.intro",
    img: "/education.jpg",
    imgAltKey: "work.programs.pillars.education-youth.imageAlt",
    action: { to: "/pricing", labelKey: "work.programs.pillars.education-youth.action" },
    programs: [
      "work.programs.pillars.education-youth.programs_one",
      "work.programs.pillars.education-youth.programs_two",
    ],
    focus: [
      "work.programs.pillars.education-youth.focus_one",
      "work.programs.pillars.education-youth.focus_two",
      "work.programs.pillars.education-youth.focus_three",
      "work.programs.pillars.education-youth.focus_four",
    ],
  },
  {
    id: "livelihoods-women",
    titleKey: "work.programs.pillars.livelihoods-women.title",
    introKey: "work.programs.pillars.livelihoods-women.intro",
    img: "/tailoring.jpg",
    imgAltKey: "work.programs.pillars.livelihoods-women.imageAlt",
    programs: [
      "work.programs.pillars.livelihoods-women.programs_one",
      "work.programs.pillars.livelihoods-women.programs_two",
    ],
    focus: [
      "work.programs.pillars.livelihoods-women.focus_one",
      "work.programs.pillars.livelihoods-women.focus_two",
      "work.programs.pillars.livelihoods-women.focus_three",
      "work.programs.pillars.livelihoods-women.focus_four",
    ],
  },
  {
    id: "peacebuilding",
    titleKey: "work.programs.pillars.peacebuilding.title",
    introKey: "work.programs.pillars.peacebuilding.intro",
    img: "/together1.jpg",
    imgAltKey: "work.programs.pillars.peacebuilding.imageAlt",
    programs: [
      "work.programs.pillars.peacebuilding.programs_one",
      "work.programs.pillars.peacebuilding.programs_two",
    ],
    focus: [
      "work.programs.pillars.peacebuilding.focus_one",
      "work.programs.pillars.peacebuilding.focus_two",
      "work.programs.pillars.peacebuilding.focus_three",
      "work.programs.pillars.peacebuilding.focus_four",
    ],
  },
  {
    id: "outreach-basic-needs",
    titleKey: "work.programs.pillars.outreach-basic-needs.title",
    introKey: "work.programs.pillars.outreach-basic-needs.intro",
    img: "/Shoes.png",
    imgAltKey: "work.programs.pillars.outreach-basic-needs.imageAlt",
    action: { to: "/portfolio", labelKey: "work.programs.pillars.outreach-basic-needs.action" },
    programs: ["work.programs.pillars.outreach-basic-needs.programs_one"],
    focus: [
      "work.programs.pillars.outreach-basic-needs.focus_one",
      "work.programs.pillars.outreach-basic-needs.focus_two",
      "work.programs.pillars.outreach-basic-needs.focus_three",
      "work.programs.pillars.outreach-basic-needs.focus_four",
    ],
  },
];

/* A pillar's action buttons — supports both the legacy single `action` object
   and the newer `actions` array. */
function pillarActions(pillar) {
  if (pillar.actions && pillar.actions.length > 0) {
    return pillar.actions;
  }
  if (pillar.action) {
    return [pillar.action];
  }
  return [];
}

/* Our Programs section. Rendered identically on Home and the Our Work page.
   The heading ("Our Programs") and subtitle come from the same keys the Our
   Work page already used, so both views read the same. Anchor ids are kept on
   each cell so the hero pills (#arts-healing etc.) and #livelihoods-women keep
   working. scroll-margin-top (in the CSS) keeps the cell clear of the fixed
   navbar on an anchor jump. */
export default function OurPrograms() {
  const { t } = useTranslation();

  return (
    <section className="p1-programs">
      <div className="p1-programs-inner">
        <h2 className="p1-programs-title">{t("work.programs.kicker")}</h2>
        <p className="p1-programs-intro">{t("work.programs.title")}</p>

        <div className="p1-programs-grid">
          {programPillars.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.id];
            const actions = pillarActions(pillar);

            return (
              <div className="p1-program" id={pillar.id} key={pillar.id}>
                {Icon ? (
                  <Icon className="p1-program-icon" aria-hidden="true" />
                ) : null}

                {pillar.img ? (
                  <div className="p1-program-media">
                    <img
                      src={pillar.img}
                      alt={t(pillar.imgAltKey)}
                      loading="lazy"
                    />
                  </div>
                ) : null}

                <h3 className="p1-program-title">{t(pillar.titleKey)}</h3>
                <p className="p1-program-intro">{t(pillar.introKey)}</p>

                {pillar.programs && pillar.programs.length > 0 ? (
                  <div className="p1-program-block">
                    <h4>{t("work.programs.programsHeading")}</h4>
                    <ul>
                      {pillar.programs.map((item) => (
                        <li key={item}>{t(item)}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {pillar.focus && pillar.focus.length > 0 ? (
                  <div className="p1-program-block">
                    <h4>{t("work.programs.focusHeading")}</h4>
                    <ul>
                      {pillar.focus.map((item) => (
                        <li key={item}>{t(item)}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {actions.length > 0 ? (
                  <div className="p1-program-actions">
                    {actions.map((action) => (
                      <Link
                        className="p1-program-btn"
                        key={`${pillar.id}-${action.to}`}
                        to={action.to}
                      >
                        {t(action.labelKey)}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* Fills the empty 6th grid cell (row 2, col 3 — right of the
              Humanitarian Outreach pillar) with a topical image. */}
          <figure className="p1-program-visual">
            <img
              src="/Upcoming project  (2).jpg"
              alt={t("work.programs.outreachVisualAlt")}
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
