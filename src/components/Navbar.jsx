import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo1.png";
import "./Navbar.css";

const searchEntries = [
  { path: "/", title: "Home", description: "Main homepage and introduction to AUVD", keywords: ["home", "welcome", "art", "innovation", "communities", "kakuma"] },
  { path: "/about", title: "About Us", description: "Mission, vision, and overview of the organization", keywords: ["about", "mission", "vision", "organization", "auvd"] },
  { path: "/our-impact/our-story", title: "Our Story", description: "How AUVD began and the story behind the organization", keywords: ["story", "history", "began", "hope", "creativity"] },
  { path: "/about/team", title: "Leadership Team", description: "Meet the AUVD leadership team, including Samuel Asongo and Matayo Bilibwa.", keywords: ["team", "leadership", "staff", "people", "members", "Samuel Asongo", "Matayo Bilibwa"] },
  { path: "/about/samuel-asongo", title: "Samuel Asongo", description: "Samuel Asongo is the Founder, Chairperson and Chief Executive Officer of Art and Unity for Vulnerable Development (AUVD).", keywords: ["Samuel Asongo", "AUVD founder", "AUVD CEO", "AUVD Chairperson"] },
  { path: "/work", title: "Our Work", description: "Programs, community impact, and organizational work", keywords: ["work", "programs", "impact", "projects", "community"] },
  { path: "/events", title: "Events", description: "Youth Peace Week, music workshops, and recent events", keywords: ["events", "music", "workshops", "mental health", "teachers day", "food day", "youth peace week"] },
  { path: "/our-impact/blogs", title: "Blogs", description: "Stories, updates, reflections, and community highlights from AUVD", keywords: ["blogs", "blog", "stories", "updates", "articles", "community"] },
  { path: "/portfolio", title: "Outreach", description: "Gallery and portfolio of work and activities", keywords: ["portfolio", "gallery", "photos", "projects", "showcase"] },
  { path: "/pricing", title: "Education", description: "Service pricing and support options", keywords: ["pricing", "plans", "fees", "services", "cost"] },
  { path: "/our-impact", title: "Our Impact", description: "News, blogs and reports from AUVD", keywords: ["impact", "our impact", "reports", "news", "blog", "blogs"] },
  { path: "/our-impact/news", title: "Impact News", description: "Latest news and updates from AUVD", keywords: ["news", "updates", "impact", "announcements"] },
  { path: "/our-impact/report", title: "Impact Reports", description: "Annual and project reports published by AUVD", keywords: ["report", "reports", "annual", "financials", "results"] },
  { path: "/donate", title: "Donate", description: "Support the organization through donations", keywords: ["donate", "support", "fund", "give", "contribute"] },
  { path: "/contact", title: "Contact", description: "Get in touch with AUVD", keywords: ["contact", "email", "reach", "message", "phone"] },
  { path: "/dance", title: "Dance Program", description: "Dance activities and creative movement program", keywords: ["dance", "movement", "performance", "creative arts"] },
  { path: "/music", title: "Music Program", description: "Music training, learning, and performance programs", keywords: ["music", "training", "songs", "instruments", "performance"] },
  { path: "/vocational", title: "Vocational Program", description: "Vocational skills development and learning pathways", keywords: ["vocational", "skills", "training", "learning", "development"] },
];

const normalizeSearchText = (value) => value.trim().toLowerCase();

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutMenuPinned, setAboutMenuPinned] = useState(false);
  const [aboutMenuHovered, setAboutMenuHovered] = useState(false);
  const [impactMenuOpen, setImpactMenuOpen] = useState(false);
  const [impactMenuDismissed, setImpactMenuDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const aboutDropdownRef = useRef(null);
  const impactDropdownRef = useRef(null);
  const impactCloseTimer = useRef(null);
  const searchRef = useRef(null);
  
  const isAboutRoute = location.pathname === "/about" || location.pathname.startsWith("/about/");
  const aboutMenuOpen = aboutMenuPinned || aboutMenuHovered;

  /* `--dismissed` lets Escape / a click really close the menu even while the
     cursor is still resting on it (where the CSS :hover rule would otherwise
     keep it open). It clears as soon as the pointer or focus re-enters. */
  const impactDropdownClass = [
    "nav-dropdown",
    "auvd-nav-dropdown",
    impactMenuOpen ? "open" : "",
    impactMenuDismissed ? "auvd-nav-dropdown--dismissed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  /* ------------------------------------------------------------------------
     Our Impact dropdown
     Desktop: opens on hover or keyboard focus, closes after a short delay when
     the cursor leaves (so moving from the label into the menu doesn't flicker)
     and closes immediately on Escape.
     Mobile: the same flag drives the chevron button that expands the children.
     ---------------------------------------------------------------------- */
  const clearImpactCloseTimer = () => {
    if (impactCloseTimer.current) {
      clearTimeout(impactCloseTimer.current);
      impactCloseTimer.current = null;
    }
  };

  const openImpactMenu = () => {
    clearImpactCloseTimer();
    setImpactMenuDismissed(false);
    setImpactMenuOpen(true);
  };

  const closeImpactMenu = () => {
    clearImpactCloseTimer();
    setImpactMenuDismissed(true);
    setImpactMenuOpen(false);
  };

  const scheduleImpactClose = () => {
    clearImpactCloseTimer();
    impactCloseTimer.current = setTimeout(() => {
      impactCloseTimer.current = null;
      setImpactMenuOpen(false);
    }, 160);
  };

  const handleImpactBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      closeImpactMenu();
    }
  };

  const toggleImpactMenu = () => {
    if (impactMenuOpen) {
      closeImpactMenu();
    } else {
      openImpactMenu();
    }
  };

  // Primary routing array (excluding Home, About, and standalone action items)
  // Items with `children` render as a dropdown parent (Our Impact).
  const links = [
    { path: "/work", name: "Work" },
    { path: "/events", name: "Events" },
    { path: "/portfolio", name: "Outreach" },
    { path: "/pricing", name: "Education" },
    {
      path: "/our-impact",
      name: "Our Impact",
      children: [
        { path: "/our-impact/our-story", name: "Our Story" },
        { path: "/our-impact/news", name: "News" },
        { path: "/our-impact/blogs", name: "Blogs" },
        { path: "/our-impact/report", name: "Report" },
      ],
    },
    { path: "/contact", name: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handlePointerDown = (event) => {
      if (!aboutDropdownRef.current?.contains(event.target)) {
        setAboutMenuPinned(false);
      }
      if (!impactDropdownRef.current?.contains(event.target)) {
        setImpactMenuDismissed(true);
        setImpactMenuOpen(false);
      }
      if (!searchRef.current?.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setAboutMenuPinned(false);
        setAboutMenuHovered(false);
        setImpactMenuDismissed(true);
        setImpactMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    handleScroll(); // Initialize on load

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      if (impactCloseTimer.current) {
        clearTimeout(impactCloseTimer.current);
        impactCloseTimer.current = null;
      }
    };
  }, []);

  const normalizedQuery = normalizeSearchText(searchQuery);
  const searchResults = normalizedQuery
    ? searchEntries.filter((entry) => {
        const searchableText = `${entry.title} ${entry.description} ${entry.keywords.join(" ")}`.toLowerCase();
        return searchableText.includes(normalizedQuery);
      }).slice(0, 6)
    : [];

  const closeMenus = () => {
    setMenuOpen(false);
    setAboutMenuPinned(false);
    setAboutMenuHovered(false);
    closeImpactMenu();
    setSearchOpen(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!normalizedQuery || searchResults.length === 0) {
      setSearchOpen(Boolean(normalizedQuery));
      return;
    }
    navigate(searchResults[0].path);
    setSearchQuery("");
    closeMenus();
  };

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchQuery("");
    closeMenus();
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        
        {/* Logo Link Wrapper */}
        <NavLink to="/" className="logo" onClick={closeMenus}>
          <img src={logo} alt="AUVD logo" />
          <span className="logo-text">A<span className="text-U">U</span>V<span className="text-D">D</span></span>
          <span className="logo-dot">.</span>
        </NavLink>

        {/* Mobile Hamburger Toggle */}
        <button
          className={`menu-toggle ${menuOpen ? "nav-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-links"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Brand Utility Label for Mobile Viewports */}
        <div className="nav-utility">
          <NavLink to="/" className="nav-brand-small" onClick={closeMenus}>
            AUVD
          </NavLink>
        </div>

        {/* Core Links & Controls Container */}
        <div id="mobile-nav-links" className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeMenus}
          >
            Home
          </NavLink>

          {/* Premium Dropdown Interface */}
          <div
            ref={aboutDropdownRef}
            className={`nav-dropdown ${aboutMenuOpen ? "open" : ""}`}
            onMouseEnter={() => setAboutMenuHovered(true)}
            onMouseLeave={() => setAboutMenuHovered(false)}
          >
            <div className="nav-parent">
              <button
                type="button"
                className={`nav-link nav-trigger ${isAboutRoute ? "active" : ""}`}
                onClick={() => setAboutMenuPinned((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={aboutMenuOpen}
              >
                About
              </button>
            </div>

            <div className="dropdown-menu" role="menu">
              <NavLink
                to="/about"
                className={({ isActive }) => `dropdown-link ${isActive ? "active" : ""}`}
                onClick={closeMenus}
                end
              >
                About Us
              </NavLink>
              <NavLink
                to="/about/team"
                className={({ isActive }) => `dropdown-link ${isActive ? "active" : ""}`}
                onClick={closeMenus}
              >
                Leadership
              </NavLink>
              <NavLink
                to="/about/samuel-asongo"
                className={({ isActive }) => `dropdown-link ${isActive ? "active" : ""}`}
                onClick={closeMenus}
              >
                Samuel Asongo
              </NavLink>
            </div>
          </div>

          {/* Looped Dynamic Middle Link Parameters */}
          {links.map((link, index) =>
            link.children ? (
              /* Dropdown parent (Our Impact) — hover + keyboard focus on desktop,
                 indented expandable list with a chevron button on mobile. */
              <div
                key={index}
                ref={impactDropdownRef}
                className={impactDropdownClass}
                onMouseEnter={openImpactMenu}
                onMouseLeave={scheduleImpactClose}
                onBlur={handleImpactBlur}
              >
                <div className="nav-parent auvd-nav-parent">
                  {/* Keyboard focus on the label opens the menu. The chevron
                      button on mobile is left out, so one tap = one toggle. */}
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `nav-link nav-trigger auvd-nav-trigger ${isActive ? "active" : ""}`
                    }
                    onFocus={openImpactMenu}
                    onClick={closeMenus}
                  >
                    {link.name}
                  </NavLink>

                  <button
                    type="button"
                    className="auvd-nav-chevron"
                    aria-expanded={impactMenuOpen}
                    aria-controls="our-impact-submenu"
                    aria-label="Toggle Our Impact menu"
                    onClick={toggleImpactMenu}
                  >
                    <span aria-hidden="true">{impactMenuOpen ? "▴" : "▾"}</span>
                  </button>
                </div>

                <div id="our-impact-submenu" className="dropdown-menu auvd-dropdown-menu">
                  {link.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `dropdown-link auvd-dropdown-link ${isActive ? "active" : ""}`
                      }
                      onClick={closeMenus}
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={index}
                to={link.path}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={closeMenus}
              >
                {link.name}
              </NavLink>
            )
          )}

          {/* Actions Subsection (Search Shell & Donate Button) */}
          <div className="nav-actions">
            <form className="nav-search" role="search" onSubmit={handleSearchSubmit} ref={searchRef}>
              <label className="nav-search-label" htmlFor="site-search">
                Search website
              </label>
              <div className={`nav-search-shell ${searchOpen ? "open" : ""}`}>
                <span className="nav-search-icon" aria-hidden="true">⌕</span>
                <input
                  id="site-search"
                  type="search"
                  className="nav-search-input"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchOpen(Boolean(normalizeSearchText(event.target.value)));
                  }}
                  onFocus={() => setSearchOpen(Boolean(normalizedQuery))}
                  autoComplete="off"
                />
                <button type="submit" className="nav-search-button">
                  Search
                </button>
              </div>

              {searchOpen && (
                <div className="nav-search-results" role="listbox" aria-label="Search results">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={result.path}
                        type="button"
                        className="nav-search-result"
                        onClick={() => handleSearchSelect(result.path)}
                      >
                        <span className="nav-search-result-title">{result.title}</span>
                        <span className="nav-search-result-description">{result.description}</span>
                      </button>
                    ))
                  ) : (
                    <div className="nav-search-empty">No matching page found.</div>
                  )}
                </div>
              )}
            </form>

            {/* Standalone Action Highlighting Button */}
            <NavLink 
              to="/donate" 
              className={({ isActive }) => `btn btn-primary donate-btn ${isActive ? "active" : ""}`}
              onClick={closeMenus}
            >
              Donate
            </NavLink>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;