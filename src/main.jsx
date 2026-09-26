import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n"; // must load before App so the first paint is already translated
import "./index.css";
import { FaBullseye, FaEye } from "react-icons/fa";

// Keep <html lang> correct on first load, before React renders.
const storedLang = window.localStorage.getItem("auvd-lang");
document.documentElement.setAttribute("lang", storedLang === "fr" ? "fr" : "en");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 