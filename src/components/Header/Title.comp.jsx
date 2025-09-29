/**
 * Title-Komponente
 * Zeigt die Titelleiste mit IU-Logo (links), Projekt-Titel (zentriert) und UMCATLA/GitHub-Logo (rechts).
 * Responsives Layout über Bootstrap-Grid.
 */

import "./Title.style.css";
import umcatlaLogo from "../../assets/logos/umcatla-logo2.png";
import iuLogo from "../../assets/logos/iu-logo.png";

export default function Title() {
  return (
    <header className="container-fluid titlebar">
      <div className="row align-items-center">
        {/* Linke Spalte: IU-Logo mit externem Link */}
        <div className="col-3 d-flex">
          <a
            href="https://www.iu.de/" target="_blank" rel="noopener noreferrer" className="d-inline-block"
          >
            <img src={iuLogo} alt="IU-Logo" className="logo d-block iu-logo" />
          </a>
        </div>
        {/* Mittlere Spalte: Seitentitel (semantisch h1, visuell h2) */}
        <div className="col-6 text-center">
          <h1 className="h2 fw-bold mb-0 title">UMCATLA</h1>
        </div>
        {/* Rechte Spalte: UMCATLA-Logo mit Link zum Repository */}
        <div className="col-3 d-flex justify-content-end">
          <a
            href="https://github.com/TomaszSmolak/co2-footprint"
            target="_blank"
            rel="noopener noreferrer"
            className="d-inline-block"
          >
            <img
              src={umcatlaLogo} alt="UMCATLA-Logo" className="logo d-block umcatla-logo"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
