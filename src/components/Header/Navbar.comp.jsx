/**
 * Navbar-Komponente
 * - Responsives Navigationsmenü (Bootstrap Navbar + Collapse/Toggler).
 * - Automatische Ausrichtung der Nav-Liste (links/rechts) je nach Textausrichtung (LTR/RTL).
 */

import { NavLink } from "react-router-dom";
import "./Navbar.style.css";
import umcatlaLogo from "../../assets/logos/umcatla-logo2.png";

export default function Navbar() {
  return (
    <>
      {/* Sticky Navbar: bleibt oben kleben; leichte Unterkante via border-bottom */}
      <nav className="navbar navbar-expand-md navbar-light border-bottom sticky-top" dir="ltr">
        <div className="container-fluid">
          {/* Brand-Bereich: Icon + Projekttitel, Link zur Startseite */}
          <NavLink
            className="navbar-brand d-flex align-items-center"
            to="/"
            aria-label="Zur Startseite"
          >
            <img src={umcatlaLogo} alt="Brand Icon" className="brand-icon me-2" />
            <span className="fw-bold fs-4">CO₂-Footprint</span>
          </NavLink>

          {/* Toggler für Mobilgeräte (Bootstrap Collapse).
             data-bs-target muss mit dem id-Attribut des Collapse-Containers übereinstimmen. */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Navigation umschalten"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Kollabierbarer Bereich mit den Navigationslinks */}
          <div className="collapse navbar-collapse" id="mainNav">
            {/* Ausrichtung dynamisch (LTR/RTL) + mobile Abstände (mb-2) */}
            <ul className="navbar-nav nav-local mb-2 mb-md-0">
              <li className="nav-item">
                {/* "end" sorgt dafür, dass "/" nur auf der Startseite aktiv ist */}
                <NavLink className="nav-link" end to="/">
                  Start
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/data">
                  CO₂-Tabelle
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/companies">
                  Unternehmen
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/countries">
                  Länder
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About us
                </NavLink>
              </li>
              <li className="nav-item">
                {/* Externer Link zum Repository (neuer Tab, sicherer rel-Attributsatz) */}
                <a
                  className="nav-link"
                  href="https://github.com/TomaszSmolak/co2-footprint-App"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
