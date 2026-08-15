import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  danceParagraphs,
  heroTitleParts,
  impactStats,
  partnerCards,
  partnerLinks,
  slides,
  vocationalImages,
  whySectionBackgrounds, 
} from "./data";
import DanceSection from "./sections/DanceSection/DanceSection";
import FeaturedVideo from "./sections/FeaturedVideo/FeaturedVideo";
import GrantNews from "./sections/GrantNews/GrantNews";
import Hero from "./sections/Hero/Hero";
import ImpactStatsSection from "./sections/ImpactStatsSection/ImpactStatsSection";
import NeedSection from "./sections/NeedSection/NeedSection";
import PartnersSection from "./sections/PartnersSection/PartnersSection";
import ProgramsIntro from "./sections/ProgramsIntro/ProgramsIntro";
import ProgramsToggleSection from "./sections/ProgramsToggleSection/ProgramsToggleSection";
import TherapeuticApproach from "./sections/TherapeuticApproach/TherapeuticApproach";
import VisualArts from "./sections/VisualArts/VisualArts";
import VocationalSection from "./sections/VocationalSection/VocationalSection";
import WhoWeAre from "./sections/WhoWeAre/WhoWeAre";
import ImpactHighlights from "./sections/ImpactHighlights/ImpactHighlights";
 
   

function Home() {
  const navigate = useNavigate();

  return ( 
    <> 
      <Hero navigate={navigate} heroTitleParts={heroTitleParts} slides={slides} />
      <GrantNews />
      <FeaturedVideo partnerLinks={partnerLinks} />
      <ImpactHighlights />
      <WhoWeAre />
      <NeedSection backgrounds={whySectionBackgrounds} />
      <ProgramsIntro navigate={navigate} />
      <ProgramsToggleSection />
      <TherapeuticApproach />
      <VisualArts />
      <DanceSection navigate={navigate} danceParagraphs={danceParagraphs} />
      <VocationalSection navigate={navigate} vocationalImages={vocationalImages} />
      <ImpactStatsSection impactStats={impactStats} />
      <PartnersSection partnerCards={partnerCards} />
    </> 
  ); 
}

export default Home; 