import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";
import './App.css';
 
// Pages
import Home from "./Pages/Home";
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
            <Route path="/about/story" element={<OurStory />} />
            <Route path="/about/team" element={<Team />} />
            <Route path="/Work" element={<Work />} />
            <Route path="/events" element={<Events />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
           


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
