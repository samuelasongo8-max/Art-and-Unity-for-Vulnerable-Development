import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n"; // must load before App so the first paint is already translated
import "./index.css";
import { FaBullseye, FaEye } from "react-icons/fa";

/* <html lang> is kept correct on first load, before React renders, so a screen
   reader reads the first paint in the right language. i18n.js takes over from
   here and keeps it in sync on every language change. */
const storedLang = window.localStorage.getItem("auvd-lang");
document.documentElement.setAttribute("lang", storedLang === "fr" ? "fr" : "en");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
