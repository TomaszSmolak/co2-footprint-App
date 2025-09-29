/**
 * Layout-Komponente
 * - Rahmengerüst der App: Title + Navbar oben, <Outlet /> für Seiteninhalte, Footer unten.
 */

import Title from "./components/Header/Title.comp.jsx";
import Navbar from "./components/Header/Navbar.comp.jsx";
import Footer from "./components/Footer/Footer.comp.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    // Vollhöhe + Spaltenlayout: Header → Main (wächst) → Footer
    <div className="d-flex flex-column min-vh-100">
      {/* Kopfbereich */}
      <Title />
      <Navbar />

      {/* Hauptbereich: füllt den verbleibenden Platz zwischen Header und Footer */}
      <main className="container-fluid px-0 flex-grow-1">
        <Outlet />
      </main>

      {/* Footer am Seitenende (nicht fixiert) */}
      <Footer />
    </div>
  );
}
