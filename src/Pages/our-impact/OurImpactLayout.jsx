import { NavLink, Outlet } from "react-router-dom";
import {
  FaBars,
  FaBookOpen,
  FaChartColumn,
  FaFileLines,
  FaNewspaper,
} from "react-icons/fa6";
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

const OurImpactLayout = () => (
  <main className="auvd-impact-page">
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
