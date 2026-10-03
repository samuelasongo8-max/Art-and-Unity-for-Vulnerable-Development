import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";
import './App.css';
 
// Pages
import Home from "./Pages/Home/Home";
import Dance from "./Pages/programs/Dance";
import About from "./Pages/about";
import Work from "./Pages/Work";
import Events from "./Pages/Events";
import Blogs from "./Pages/Blogs";
import BlogDetails from "./Pages/BlogDetails";
import Portfolio from "./Pages/portfolio";
import Pricing from "./Pages/pricing";
import Contact from "./Pages/contact";
import Donate from "./Pages/donate";
import News from "./Pages/News";
import Team from "./Pages/Team";
import OurStory from "./Pages/OurStory";
import SamuelAsongo from "./Pages/SamuelAsongo";
import Music from "./Pages/programs/Music";
import ImpactAll from "./Pages/ImpactAll";
import OurImpact from "./Pages/OurImpact";
import OurImpactLayout from "./Pages/our-impact/OurImpactLayout";
import ImpactNews from "./Pages/our-impact/News";
import ImpactReport from "./Pages/our-impact/Report";
import ImpactPost from "./Pages/our-impact/Post";
import DaddarioCommunityMusicGrant from "./Pages/DaddarioCommunityMusicGrant";
import AdminLogin from "./Pages/admin/AdminLogin";
import AdminPost from "./Pages/admin/AdminPost";
import AdminNews from "./Pages/admin/AdminNews";

import Vocational from "./Pages/programs/Vocational";
import NotFound from "./Pages/NotFound";
 
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

/* The two admin routes are internal pages and deliberately wear no public
   chrome. That is not only a styling preference: the Navbar is
   `position: fixed` at z-index 100, so rendering it over /admin/post physically
   covered the "Log out" button and made it unclickable. The check lives here,
   in one place, so the two routes can never drift apart again. */
const ADMIN_PATHS = ["/admin/login", "/admin/post", "/admin/news"];

const Chrome = () => {
  const { pathname } = useLocation();
  const isAdmin = ADMIN_PATHS.includes(pathname);

  return (
    <>
      {isAdmin ? null : <Navbar />}

      <div className={isAdmin ? undefined : "App"}>
        <div className={isAdmin ? undefined : "main-content"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* Old Our Story path kept alive for existing links/bookmarks */}
            <Route path="/about/story" element={<Navigate to="/our-impact/our-story" replace />} />
            <Route path="/about/team" element={<Team />} />
            <Route path="/about/samuel-asongo" element={<SamuelAsongo />} />
            <Route path="/Work" element={<Work />} />
            <Route path="/events" element={<Events />} />
            {/* Old blog path kept alive for existing links/bookmarks */}
            <Route path="/blogs" element={<Navigate to="/our-impact/blogs" replace />} />
              {/* Blog Details: one page per blog, id carried in the URL. */}
              <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/impact" element={<ImpactAll />} />

            {/* Our Impact + its sub pages — all four share OurImpactLayout,
                so the "Impacts" heading and the sidebar stay in place. */}
            <Route path="/our-impact" element={<OurImpactLayout />}>
              <Route index element={<OurImpact />} />
              <Route path="news" element={<ImpactNews />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="report" element={<ImpactReport />} />
              <Route path="post" element={<ImpactPost />} />
            </Route>

            {/* Our Story lives under /our-impact but renders full width with
                its own hero, so it stays outside OurImpactLayout. */}
            <Route path="/our-impact/our-story" element={<OurStory />} />

            <Route
              path="/news/daddario-community-music-grant"
              element={<DaddarioCommunityMusicGrant />}
            />

            <Route path="/dance" element={<Dance />} />
            <Route path="/Music" element={<Music />} />
            <Route path="/Vocational" element={<Vocational />} />

            {/* ===== ADMIN (internal) =====
                The single-admin backend. Reached through the small lock icon in
                the footer, which opens the same login form in a modal; these two
                routes are where that form and the dashboard live.

                Neither renders <Navbar> or <Footer> — see ADMIN_PATHS above for
                why that is a correctness requirement, not just taste.
                /admin/post is only a route guard — every write it performs is
                independently checked server-side by lib/requireAdmin.js, and the
                dashboard itself verifies the session via GET /api/admin/me
                before showing anything. */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/post" element={<AdminPost />} />
            {/* News Management: a separate admin page for news created from the
                dashboard. Same auth gate, same dashboard CSS; it never touches
                the news that already lives in src/data/news.json. */}
            <Route path="/admin/news" element={<AdminNews />} />

            {/* Catch-all so any unknown URL shows a fully translated 404 page
                instead of a blank screen. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>

      {isAdmin ? null : <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Chrome />
    </BrowserRouter>
  );
}

export default App;
