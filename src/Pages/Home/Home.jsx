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
import ArtForHealing from "./sections/ArtForHealing/ArtForHealing";
import DanceSection from "./sections/DanceSection/DanceSection";
import FeaturedVideo from "./sections/FeaturedVideo/FeaturedVideo";
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

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Hero navigate={navigate} heroTitleParts={heroTitleParts} slides={slides} />
      <FeaturedVideo partnerLinks={partnerLinks} />
      <WhoWeAre />
      <NeedSection backgrounds={whySectionBackgrounds} />
      <ProgramsIntro navigate={navigate} />
      <ProgramsToggleSection />
      <ArtForHealing navigate={navigate} />
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