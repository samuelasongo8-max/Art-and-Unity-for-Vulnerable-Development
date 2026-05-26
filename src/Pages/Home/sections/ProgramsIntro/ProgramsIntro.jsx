import "./ProgramsIntro.css";

function ProgramsIntro({ navigate }) {
  return (
    <>
      <div className="programs-cta">
        <button className="btn-go-about" type="button" onClick={() => navigate("/Work")}>
          Learn More About the Programs
        </button>
      </div>

      <div className="programs">
        <h1>From Hard Times to Hope: Healing Through Creativity</h1>
      </div>
    </>
  );
}

export default ProgramsIntro;