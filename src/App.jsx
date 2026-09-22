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
import Portfolio from "./Pages/portfolio";
import Pricing from "./Pages/pricing";
import Contact from "./Pages/contact";
import Donate from "./Pages/donate";
import Team from "./Pages/Team";
import OurStory from "./Pages/OurStory";
import Music from "./Pages/programs/Music";
import ImpactAll from "./Pages/ImpactAll";
import OurImpact from "./Pages/OurImpact";
import OurImpactLayout from "./Pages/our-impact/OurImpactLayout";
import ImpactNews from "./Pages/our-impact/News";
import ImpactReport from "./Pages/our-impact/Report";
import DaddarioCommunityMusicGrant from "./Pages/DaddarioCommunityMusicGrant";

import Vocational from "./Pages/programs/Vocational";
 
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">   {/* ✅ ADD THIS */}

        <Navbar />

        <div className="main-content">   {/* ✅ ADD THIS */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* Old Our Story path kept alive for existing links/bookmarks */}
            <Route path="/about/story" element={<Navigate to="/our-impact/our-story" replace />} />
            <Route path="/about/team" element={<Team />} />
            <Route path="/Work" element={<Work />} />
            <Route path="/events" element={<Events />} />
            {/* Old blog path kept alive for existing links/bookmarks */}
            <Route path="/blogs" element={<Navigate to="/our-impact/blogs" replace />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/impact" element={<ImpactAll />} />

            {/* Our Impact + its sub pages — all four share OurImpactLayout,
                so the "Impacts" heading and the sidebar stay in place. */}
            <Route path="/our-impact" element={<OurImpactLayout />}>
              <Route index element={<OurImpact />} />
              <Route path="news" element={<ImpactNews />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="report" element={<ImpactReport />} />
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
          </Routes>
        </div>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;
