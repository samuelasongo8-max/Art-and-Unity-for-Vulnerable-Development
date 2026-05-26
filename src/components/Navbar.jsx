import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo l.png";
import "./Navbar.css";

const searchEntries = [
  {
    path: "/",
    title: "Home",
    description: "Main homepage and introduction to AUVD",
    keywords: ["home", "welcome", "art", "innovation", "communities", "kakuma"],
  },
  {
    path: "/about",
    title: "About Us",
    description: "Mission, vision, and overview of the organization",
    keywords: ["about", "mission", "vision", "organization", "auvd"],
  },
  {
    path: "/about/story",
    title: "Our Story",
    description: "How AUVD began and the story behind the organization",
    keywords: ["story", "history", "began", "hope", "creativity"],
  },
  {
    path: "/about/team",
    title: "Leadership",
    description: "Meet the team and leadership behind AUVD",
    keywords: ["team", "leadership", "staff", "people", "members"],
  },
  {
    path: "/work",
    title: "Our Work",
    description: "Programs, community impact, and organizational work",
    keywords: ["work", "programs", "impact", "projects", "community"],
  },
  {
    path: "/events",
    title: "Events",
    description: "Youth Peace Week, music workshops, and recent events",
    keywords: ["events", "music", "workshops", "mental health", "teachers day", "food day", "youth peace week"],
  },
  {
    path: "/blogs",
    title: "Blogs",
    description: "Stories, updates, reflections, and community highlights from AUVD",
    keywords: ["blogs", "blog", "stories", "updates", "articles", "community"],
  },
  {
    path: "/portfolio",
    title: "Outreach",
    description: "Gallery and portfolio of work and activities",
    keywords: ["portfolio", "gallery", "photos", "projects", "showcase"],
  },
  {
    path: "/pricing",
    title: "Education",
    description: "Service pricing and support options",
    keywords: ["pricing", "plans", "fees", "services", "cost"],
  },
  {
    path: "/donate",
    title: "Donate",
    description: "Support the organization through donations",
    keywords: ["donate", "support", "fund", "give", "contribute"],
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Get in touch with AUVD",
    keywords: ["contact", "email", "reach", "message", "phone"],
  },
  {
    path: "/dance",
    title: "Dance Program",
    description: "Dance activities and creative movement program",
    keywords: ["dance", "movement", "performance", "creative arts"],
  },
  {
    path: "/music",
    title: "Music Program",
    description: "Music training, learning, and performance programs",
    keywords: ["music", "training", "songs", "instruments", "performance"],
  },
  {
    path: "/vocational",
    title: "Vocational Program",
    description: "Vocational skills development and learning pathways",
    keywords: ["vocational", "skills", "training", "learning", "development"],
  },
];

const normalizeSearchText = (value) => value.trim().toLowerCase();

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutMenuPinned, setAboutMenuPinned] = useState(false);
  const [aboutMenuHovered, setAboutMenuHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const aboutDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const isAboutRoute = location.pathname === "/about" || location.pathname.startsWith("/about/");
  const aboutMenuOpen = aboutMenuPinned || aboutMenuHovered;

  const links = [
    { path: "/", name: "Home" },
    { path: "/work", name: "Work" },   // FIX: lowercase route consistency
    { path: "/events", name: "Events" },
    { path: "/portfolio", name: "Outreach" },
    { path: "/pricing", name: "Education" },
    { path: "/blogs", name: "Blogs" },
    { path: "/contact", name: "Contact" },
        { path: "/donate", name: "Donate" },
  ];

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!aboutDropdownRef.current?.contains(event.target)) {
        setAboutMenuPinned(false);
      }

      if (!searchRef.current?.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setAboutMenuPinned(false);
        setAboutMenuHovered(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
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
    <nav className="navbar">
      <div className="nav-container">

        {/* Logo */}
        <NavLink to="/" className="logo">
          <img src={logo} alt="Art and Unity for Vulnerable Development (AUVD) logo" />
        </NavLink>
        {/* Hamburger (mobile) */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className="nav-utility">
          <NavLink to="/" className="nav-brand-small" onClick={closeMenus}>
           <span>AUVD</span>
          </NavLink>
        </div>

        {/* Links */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeMenus}
          >
            Home
          </NavLink>

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
              >
                About US
              </NavLink>
              <NavLink
                to="/about/story"
                className={({ isActive }) => `dropdown-link ${isActive ? "active" : ""}`}
                onClick={closeMenus}
              >
                Our Story
              </NavLink>
              <NavLink
                to="/about/team"
                className={({ isActive }) => `dropdown-link ${isActive ? "active" : ""}`}
                onClick={closeMenus}
              >
                Leadership
              </NavLink>
            </div>
          </div>

          {links.slice(1).map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""} ${
                  link.name === "Donate" ? "donate-btn" : ""
                }`
              }
              onClick={closeMenus}
            >
              {link.name}
            </NavLink>
          ))}
          {/* Move search bar here, after all nav links */}
          <form className="nav-search" role="search" onSubmit={handleSearchSubmit} ref={searchRef}>
            <label className="nav-search-label" htmlFor="site-search">
              Search the website
            </label>
            <div className={`nav-search-shell ${searchOpen ? "open" : ""}`}>
              <span className="nav-search-icon" aria-hidden="true">⌕</span>
              <input
                id="site-search"
                type="search"
                className="nav-search-input"
                placeholder="Search pages, programs, events..."
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

            {searchOpen ? (
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
            ) : null}
          </form>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;