import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaBars,
  FaBookOpen,
  FaChartColumn,
  FaFileLines,
  FaNewspaper,
} from "react-icons/fa6";
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
   ========================================================================== */

const impactNavItems = [
  { to: "/our-impact", label: "All", Icon: FaBars, end: true },
  { to: "/our-impact/our-story", label: "Our Story", Icon: FaBookOpen },
  { to: "/our-impact/news", label: "News", Icon: FaNewspaper },
  { to: "/our-impact/blogs", label: "Blogs", Icon: FaFileLines },
  { to: "/our-impact/report", label: "Report", Icon: FaChartColumn },
];

const navItemClass = ({ isActive }) =>
  `auvd-impact-nav-item${isActive ? " auvd-impact-nav-item--active" : ""}`;

/* The All view (/our-impact) opens with the shared hero — full-bleed at the
   very top of the page, above the sidebar and the card grid. The News, Blogs
   and Report sub pages keep the plain padded layout they had, so the hero is
   only mounted on the index route. */
const OurImpactHeroSlot = () => {
  const { pathname } = useLocation();

  return pathname.replace(/\/+$/, "") === "/our-impact" ? <OurImpactHero /> : null;
};

const OurImpactLayout = () => (
  <main className="auvd-impact-page">
    <OurImpactHeroSlot />

    <div className="auvd-impact-layout">
      <aside className="auvd-impact-sidebar">
        <h1 className="auvd-impact-heading">Impacts</h1>

        <nav className="auvd-impact-nav" aria-label="Impact categories">
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
                <span className="auvd-impact-nav-label">{item.label}</span>
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

export default OurImpactLayout;
