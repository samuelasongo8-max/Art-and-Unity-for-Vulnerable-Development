
 import { useState } from "react";
 
 import "./ToggleSection.css";

 
function ToggleSection({ title, children }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(prev => !prev);
  };

  return (
    <div className="toggle-wrapper">
      <button
        className={`toggle-button ${open ? "open" : ""}`}
        onClick={toggle}
        aria-expanded={open}
        type="button"
      >
        <span className="toggle-button-label">{title}</span>
        <span className="toggle-button-icon" aria-hidden="true">+</span>
      </button>

      <div className={`toggle-content ${open ? "open" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export default ToggleSection;