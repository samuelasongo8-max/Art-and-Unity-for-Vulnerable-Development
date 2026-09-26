import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo1.png";
import "./Navbar.css";

// Search index. Only the key is stored here; the title/description are looked
// up with t() at render time so results follow the active language. Keywords
// stay in English on purpose: they are matched against typed input, and users
// may type either language regardless of what is displayed.
const searchEntries = [
  { path: "/", key: "home", keywords: ["home", "welcome", "art", "innovation", "communities", "kakuma"] },
  { path: "/about", key: "about", keywords: ["about", "mission", "vision", "organization", "auvd"] },
  { path: "/our-impact/our-story", key: "ourStory", keywords: ["story", "history", "began", "hope", "creativity"] },
  { path: "/about/team", key: "team", keywords: ["team", "leadership", "staff", "people", "members", "Samuel Asongo", "Matayo Bilibwa"] },
  { path: "/about/samuel-asongo", key: "samuel", keywords: ["Samuel Asongo", "AUVD founder", "AUVD CEO", "AUVD Chairperson"] },
  { path: "/work", key: "work", keywords: ["work", "programs", "impact", "projects", "community"] },
  { path: "/events", key: "events", keywords: ["events", "music", "workshops", "mental health", "teachers day", "food day", "youth peace week"] },
  { path: "/our-impact/blogs", key: "blogs", keywords: ["blogs", "blog", "stories", "updates", "articles", "community"] },
  { path: "/portfolio", key: "portfolio", keywords: ["portfolio", "gallery", "photos", "projects", "showcase"] },
  { path: "/pricing", key: "pricing", keywords: ["pricing", "plans", "fees", "services", "cost"] },
  { path: "/our-impact", key: "ourImpact", keywords: ["impact", "our impact", "reports", "news", "blog", "blogs"] },
  { path: "/our-impact/news", key: "news", keywords: ["news", "updates", "impact", "announcements"] },
  { path: "/our-impact/report", key: "report", keywords: ["report", "reports", "annual", "financials", "results"] },
  { path: "/donate", key: "donate", keywords: ["donate", "support", "fund", "give", "contribute"] },
  { path: "/contact", key: "contact", keywords: ["contact", "email", "reach", "message", "phone"] },
  { path: "/dance", key: "dance", keywords: ["dance", "movement", "performance", "creative arts"] },
  { path: "/music", key: "music", keywords: ["music", "training", "songs", "instruments", "performance"] },
  { path: "/vocational", key: "vocational", keywords: ["vocational", "skills", "training", "learning", "development"] },
];

const normalizeSearchText = (value) => value.trim().toLowerCase();

function Navbar() {
  const { t, i18n } = useTranslation();
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
    { path: "/work", nameKey: "nav.ourWork" },
    { path: "/events", nameKey: "nav.events" },
    { path: "/portfolio", nameKey: "nav.searchPages.portfolio.title" },
    { path: "/pricing", nameKey: "nav.pricing" },
    {
      path: "/our-impact",
      nameKey: "nav.ourImpact",
      children: [
        { path: "/our-impact/our-story", nameKey: "nav.aboutMenu.ourStory" },
        { path: "/our-impact/news", nameKey: "nav.impactMenu.news" },
        { path: "/our-impact/blogs", nameKey: "nav.impactMenu.blogs" },
        { path: "/our-impact/report", nameKey: "nav.impactMenu.report" },
      ],
    },
    { path: "/contact", nameKey: "nav.contact" },
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
        // Search the translated title/description as well as the static
        // keywords, so a French title is findable while in French.
        const title = t(`nav.searchPages.${entry.key}.title`);
        const description = t(`nav.searchPages.${entry.key}.description`);
        const searchableText = `${title} ${description} ${entry.keywords.join(" ")}`.toLowerCase();
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
          <img src={logo} alt={t("nav.logoAlt")} />
          <span className="logo-text">A<span className="text-U">U</span>V<span className="text-D">D</span></span>
          <span className="logo-dot">.</span>
        </NavLink>

        {/* Mobile Hamburger Toggle */}
        <button
          className={`menu-toggle ${menuOpen ? "nav-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t("nav.toggleMenu")}
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
            {t("nav.home")}
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
                {t("nav.aboutShort")}
              </button>
            </div>

            <div className="dropdown-menu" role="menu">
              <NavLink
                to="/about"
                className={({ isActive }) => `dropdown-link ${isActive ? "active" : ""}`}
                onClick={closeMenus}
                end
              >
                {t("nav.about")}
              </NavLink>
              <NavLink
                to="/about/team"
                className={({ isActive }) => `dropdown-link ${isActive ? "active" : ""}`}
                onClick={closeMenus}
              >
                {t("nav.leadership")}
              </NavLink>
              <NavLink
                to="/about/samuel-asongo"
                className={({ isActive }) => `dropdown-link ${isActive ? "active" : ""}`}
                onClick={closeMenus}
              >
                {t("nav.aboutMenu.samuel")}
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
                    {t(link.nameKey)}
                  </NavLink>

                  <button
                    type="button"
                    className="auvd-nav-chevron"
                    aria-expanded={impactMenuOpen}
                    aria-controls="our-impact-submenu"
                    aria-label={t("nav.impactMenu.toggleLabel")}
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
                      {t(child.nameKey)}
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
                {t(link.nameKey)}
              </NavLink>
            )
          )}

          {/* Language switcher — placed directly after "Contact" in the shared
              .nav-links container, so it appears in the desktop bar and the
              mobile menu from a single insertion point. */}
          <div className="lang-switch" role="group" aria-label={t("nav.language.label")}>
            {["en", "fr"].map((code) => {
              const isActive = i18n.language === code;
              return (
                <button
                  key={code}
                  type="button"
                  className={`lang-switch-btn ${isActive ? "is-active" : ""}`}
                  onClick={() => {
                    i18n.changeLanguage(code);
                    closeMenus();
                  }}
                  aria-current={isActive ? "true" : undefined}
                  lang={code}
                >
                  {t(`nav.language.${code}`)}
                </button>
              );
            })}
          </div>

          {/* Actions Subsection (Search Shell & Donate Button) */}
          <div className="nav-actions">
            <form className="nav-search" role="search" onSubmit={handleSearchSubmit} ref={searchRef}>
              <label className="nav-search-label" htmlFor="site-search">
                {t("nav.search.label")}
              </label>
              <div className={`nav-search-shell ${searchOpen ? "open" : ""}`}>
                <span className="nav-search-icon" aria-hidden="true">⌕</span>
                <input
                  id="site-search"
                  type="search"
                  className="nav-search-input"
                  placeholder={t("nav.search.placeholder")}
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchOpen(Boolean(normalizeSearchText(event.target.value)));
                  }}
                  onFocus={() => setSearchOpen(Boolean(normalizedQuery))}
                  autoComplete="off"
                />
                <button type="submit" className="nav-search-button">
                  {t("nav.search.submit")}
                </button>
              </div>

              {searchOpen && (
                <div className="nav-search-results" role="listbox" aria-label={t("nav.search.resultsLabel")}>
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={result.path}
                        type="button"
                        className="nav-search-result"
                        onClick={() => handleSearchSelect(result.path)}
                      >
                        <span className="nav-search-result-title">{t(`nav.searchPages.${result.key}.title`)}</span>
                        <span className="nav-search-result-description">{t(`nav.searchPages.${result.key}.description`)}</span>
                      </button>
                    ))
                  ) : (
                    <div className="nav-search-empty">{t("nav.search.noResults")}</div>
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
              {t("nav.donate")}
            </NavLink>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;