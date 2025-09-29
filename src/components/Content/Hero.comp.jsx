/**
 * Hero-Komponente
 * - Zentrierter Einstiegsbereich mit Logo, Titel und Unterzeile.
 * - Layout/Styling in Hero.style.css; Bootstrap-Utilities für Zentrierung.
 */

import "./Hero.style.css";
import HeroLogo from "../../assets/logos/umcatla-logo2.png";

export default function Hero() {
  return (
    <>
      {/* Vollbreiter Hero-Abschnitt, vertikal/horizontal zentriert */}
      <section
        id="home"
        className="hero-section d-flex flex-column align-items-center justify-content-center text-center"
      >
        {/* Logo über dem Titel */}
        <img src={HeroLogo} alt="UmCATla Hero" className="hero-logo mb-4" />

        {/* Haupttitel und Unterzeile */}
        <h1 className="fw-bold">UmCATla</h1>
        <p className="lead">Der Weg zur Klimaneutralität</p>
      </section>
    </>
  );
}
