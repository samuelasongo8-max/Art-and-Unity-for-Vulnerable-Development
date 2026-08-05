import { useState } from "react";

import "./ToggleSection.css";

// ToggleSection supports both uncontrolled and controlled usage:
// - Uncontrolled (default): no open/setOpen props passed; component manages its own open state and renders the toggle button.
// - Controlled: pass `open` and `setOpen` props to control state from parent. Also pass `hideToggle={true}` to hide the internal button (useful when rendering the button elsewhere).
function ToggleSection({ title, children, open: controlledOpen, setOpen: setControlledOpen, hideToggle }) {
 const [internalOpen, setInternalOpen] = useState(false);

 const isControlled = typeof controlledOpen !== "undefined" && typeof setControlledOpen === "function";
 const open = isControlled ? controlledOpen : internalOpen;

 const toggle = () => {
   if (isControlled) setControlledOpen(!controlledOpen);
   else setInternalOpen((prev) => !prev);
 };

 return (
   <div className="toggle-wrapper">
     {!hideToggle && (
       <button
         className={`toggle-button ${open ? "open" : ""}`}
         onClick={toggle}
         aria-expanded={open}
         type="button"
       >
         <span className="toggle-button-label">{title}</span>
         <span className="toggle-button-icon" aria-hidden="true">+</span>
       </button>
     )}

     <div className={`toggle-content ${open ? "open" : ""}`}>
       {children}
     </div>
   </div>
 );
}

export default ToggleSection;