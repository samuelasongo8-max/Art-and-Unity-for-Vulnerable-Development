import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  heroTitleKey,
  impactStats,
  partnerCards,
  slides,
  vocationalImages,
} from "./data";
import FeaturedVideo from "./sections/FeaturedVideo/FeaturedVideo";
import Hero from "./sections/Hero/Hero";
import ImpactStatsSection from "./sections/ImpactStatsSection/ImpactStatsSection";
import PartnersSection from "./sections/PartnersSection/PartnersSection";
import ProgramsIntro from "./sections/ProgramsIntro/ProgramsIntro";
import ProgramsToggleSection from "./sections/ProgramsToggleSection/ProgramsToggleSection";
import TherapeuticApproach from "./sections/TherapeuticApproach/TherapeuticApproach";
import VideoSection from "./sections/VideoSection/VideoSection";
import VocationalSection from "./sections/VocationalSection/VocationalSection";
import WhoWeAre from "./sections/WhoWeAre/WhoWeAre";
import ImpactHighlights from "./sections/ImpactHighlights/ImpactHighlights";
import CommunityUpdates from "../../components/CommunityUpdates";
import WhyThisMatters from "../../sections/WhyThisMatters";
import StoriesNews from "../../sections/StoriesNews";
 
   

import OurPrograms from "../../components/OurPrograms";

function Home() {
  const navigate = useNavigate();

  return ( 
    <> 
      <Hero navigate={navigate} heroTitleKey={heroTitleKey} slides={slides} />
      <WhoWeAre />
      <CommunityUpdates />
      <OurPrograms />
      <VideoSection />
      <WhyThisMatters />
      <FeaturedVideo />
      <ProgramsIntro navigate={navigate} />
      <ProgramsToggleSection />
      <TherapeuticApproach />
      <VocationalSection navigate={navigate} vocationalImages={vocationalImages} />
      <ImpactStatsSection impactStats={impactStats} />
      <StoriesNews />
      <PartnersSection partnerCards={partnerCards} />
    </> 
  ); 
}

export default Home; 