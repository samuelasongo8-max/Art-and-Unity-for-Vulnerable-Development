import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DonateBanner from "./components/DonateBanner";
import BackToTop from "./components/BackToTop";
import './App.css';
 
// Pages
const Home = lazy(() => import("./Pages/Home/Home"));
const Dance = lazy(() => import("./Pages/programs/Dance"));
const About = lazy(() => import("./Pages/about"));
const Work = lazy(() => import("./Pages/Work"));
const Events = lazy(() => import("./Pages/Events"));
const Blogs = lazy(() => import("./Pages/Blogs"));
const BlogDetails = lazy(() => import("./Pages/BlogDetails"));
const Portfolio = lazy(() => import("./Pages/portfolio"));
const Pricing = lazy(() => import("./Pages/pricing"));
const Contact = lazy(() => import("./Pages/contact"));
const Donate = lazy(() => import("./Pages/donate"));
const News = lazy(() => import("./Pages/News"));
const Team = lazy(() => import("./Pages/Team"));
const OurStory = lazy(() => import("./Pages/OurStory"));
const SamuelAsongo = lazy(() => import("./Pages/SamuelAsongo"));
const Music = lazy(() => import("./Pages/programs/Music"));
const ImpactAll = lazy(() => import("./Pages/ImpactAll"));
const GetInvolved = lazy(() => import("./Pages/GetInvolved"));
const OurImpact = lazy(() => import("./Pages/OurImpact"));
const OurImpactLayout = lazy(() => import("./Pages/our-impact/OurImpactLayout"));
const ImpactNews = lazy(() => import("./Pages/our-impact/News"));
const ImpactReport = lazy(() => import("./Pages/our-impact/Report"));
const ImpactPost = lazy(() => import("./Pages/our-impact/Post"));
const DaddarioCommunityMusicGrant = lazy(() => import("./Pages/DaddarioCommunityMusicGrant"));
const AdminLogin = lazy(() => import("./Pages/admin/AdminLogin"));
const AdminPost = lazy(() => import("./Pages/admin/AdminPost"));
const AdminNews = lazy(() => import("./Pages/admin/AdminNews"));
const Vocational = lazy(() => import("./Pages/programs/Vocational"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Updates = lazy(() => import("./Pages/Updates"));
const UpdateDetail = lazy(() => import("./Pages/UpdateDetail"));
const Need = lazy(() => import("./Pages/Need"));
const VisualArts = lazy(() => import("./Pages/VisualArts"));
 
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

/* The admin routes are internal pages and deliberately wear no public
   chrome. That is not only a styling preference: the Navbar is
   `position: fixed` at z-index 100, so rendering it over /admin/post physically
   covered the "Log out" button and made it unclickable. The check lives here,
   in one place, so the routes can never drift apart again. */
const ADMIN_PATHS = ["/admin/login", "/admin/post", "/admin/news"];

const Chrome = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isAdmin = ADMIN_PATHS.includes(pathname);

  return (
    <>
      {isAdmin ? null : <Navbar />}

      <div className={isAdmin ? undefined : "App"}>
        <div className={isAdmin ? undefined : "main-content"}>
          <Suspense
            fallback={
              <div className="route-loading" role="status" aria-live="polite">
                {t("common.loading")}
              </div>
            }
          >
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
            {/* Get Involved is a separate full page (not a child of
                OurImpactLayout), reached from the Impact sidebar. */}
            <Route path="/impact/get-involved" element={<GetInvolved />} />

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

            {/* "The Need" and "Visual Arts" — standalone pages reached from the
                Home hero pills (moved off the home page to avoid crowding it). */}
            <Route path="/need" element={<Need />} />
            <Route path="/visual-arts" element={<VisualArts />} />

            {/* Community Updates & Stories — copied from the source design.
                /updates is the grid page; /updates/:slug is one detail page.
                A wrong slug shows the in-page "Update not found" message. */}
            <Route path="/updates" element={<Updates />} />
            <Route path="/updates/:slug" element={<UpdateDetail />} />

            {/* ===== ADMIN (internal) =====
                The single-admin backend. Reached through the small lock icon in
                the footer, which opens the same login form in a modal; these two
                routes are where that form and the dashboard live.

                Neither renders <Navbar> or <Footer> — see ADMIN_PATHS above for
                why that is a correctness requirement, not just taste.
                Every admin page verifies the session via GET /api/admin/me
                before showing anything, and each server-backed write is
                independently checked by lib/requireAdmin.js. */}
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
          </Suspense>
        </div>
      </div>

      {isAdmin ? (
        null
      ) : (
        <>
          <DonateBanner />
          <Footer />
          <BackToTop />
        </>
      )}
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
