import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaBars,
  FaBookOpen,
  FaChartColumn,
  FaFileLines,
  FaHouse,
  FaImages,
  FaNewspaper,
} from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { OurImpactHero } from "../OurImpact";
import "../OurImpact.css";

/* ==========================================================================
   Our Impact layout — the "Impacts" heading and the sidebar stay in place
   while the sub page on the right changes through <Outlet />.

   Routes using this layout:
     /our-impact         -> All     (News + Report)
     /our-impact/news    -> News
     /our-impact/blogs   -> Blogs   (the existing Blogs.jsx page)
     /our-impact/report  -> Report
     /our-impact/post    -> Post    (the Instagram-style social feed)
   ========================================================================== */

/* Only the routes and icons live here; the labels are translation keys
   resolved with t() on every render, so the sidebar follows the language. */
const impactNavItems = [
  { to: "/our-impact", labelKey: "impact.layout.nav.all", Icon: FaBars, end: true },
  { to: "/our-impact/our-story", labelKey: "impact.layout.nav.ourStory", Icon: FaBookOpen },
  { to: "/our-impact/news", labelKey: "impact.layout.nav.news", Icon: FaNewspaper },
  { to: "/our-impact/blogs", labelKey: "impact.layout.nav.blogs", Icon: FaFileLines },
  { to: "/our-impact/report", labelKey: "impact.layout.nav.report", Icon: FaChartColumn },
  { to: "/our-impact/post", labelKey: "impact.layout.nav.post", Icon: FaImages },
  /* Home is the only one of the requested extra items whose route already
     exists (App.jsx renders Home at "/"). It is placed after the existing six
     so their order is untouched, and `end` stops it staying highlighted on
     every route, since a bare "/" NavLink matches all paths. */
  { to: "/", labelKey: "impact.layout.nav.home", Icon: FaHouse, end: true },
];

const navItemClass = ({ isActive }) =>
  `auvd-impact-nav-item${isActive ? " auvd-impact-nav-item--active" : ""}`;

/* The All view (/our-impact) opens with the shared hero — full-bleed at the
   very top of the page, above the sidebar and the card grid. The News, Blogs,
   Report and Post sub pages keep the plain padded layout they had, so the hero
   is only mounted on the index route. */
const OurImpactHeroSlot = () => {
  const { pathname } = useLocation();

  return pathname.replace(/\/+$/, "") === "/our-impact" ? <OurImpactHero /> : null;
};

const OurImpactLayout = () => {
  const { t } = useTranslation();

  return (
    <main className="auvd-impact-page">
      <OurImpactHeroSlot />

      <div className="auvd-impact-layout">
        <aside className="auvd-impact-sidebar">
          <h1 className="auvd-impact-heading">{t("impact.layout.heading")}</h1>

          <nav className="auvd-impact-nav" aria-label={t("impact.layout.navLabel")}>
            {impactNavItems.map((item) => {
              const Icon = item.Icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={navItemClass}
                >
                  <Icon className="auvd-impact-nav-icon" aria-hidden="true" />
                  <span className="auvd-impact-nav-label">{t(item.labelKey)}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <section className="auvd-impact-content">
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default OurImpactLayout;
