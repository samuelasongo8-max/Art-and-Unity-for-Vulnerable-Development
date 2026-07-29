import ToggleSection from "../../../../components/ToggleSection";
import "./ProgramsToggleSection.css";

function ProgramsToggleSection() {
  return (
    
    <section className="program-toggle-section">
      <ToggleSection title="2026 UPCOMING EVENTS">
  <div className="event-card">
     

    <h3>No Events Scheduled Yet</h3>

    <p>
      We are currently planning our upcoming community activities,
      workshops, performances, and outreach programs.
      Please check back soon or follow our updates to stay informed
      about future events.
    </p>
  
  </div>
</ToggleSection>
    </section>
  );
}

export default ProgramsToggleSection;