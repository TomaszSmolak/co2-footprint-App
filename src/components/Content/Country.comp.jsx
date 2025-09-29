/**
 * CountryList-Komponente
 * - Lädt Länder aus data.json.
 * - Sortiert alphabetisch (deutsches Locale).
 * - Zeigt Länder im responsiven Kartenraster inkl. Flagge.
 */

import React, { useMemo } from "react";
import data from "../../assets/data/data.json";
import "./Country.style.css";

export default function CountryList() {
  // Fallback, falls Daten nicht vorliegen
  const countries = data?.countries ?? [];

  // Alphabetische Sortierung (stabile Kopie, deutsches Locale)
  const sorted = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name, "de")),
    [countries]
  );

  return (
    <div className="container-fluid py-4">
      {/* Hinweis/Warnbox (Projektkontext) */}
      <div className="alert alert-warning shadow-sm mb-4" role="alert">
        <strong>Hinweis:</strong> Diese Seite ist Teil eines Hochschulprojekts.{"  "}
        Die dargestellten Länder wurden <u>zufällig ausgewählt</u> und dienen nur Demonstrationszwecken.
      </div>

      {/* Glasbox (Styling in Country.style.css / shared glassbox) */}
      <div className="glassbox p-3 p-md-4">
        <h2 className="mb-4">Ländertabelle</h2>

        {/* Kartenraster: 1 Spalte (XS), 2 (MD), 3 (LG) */}
        <div className="row g-3">
          {sorted.map((c) => (
            <div key={c.countryId} className="col-12 col-md-6 col-lg-4">
              {/* Einzelkarte: Flagge + Ländername
                  Hinweis: Klassen "fi fi-XX" benötigen die Flag-Icons-CSS global */}
              <div className="d-flex align-items-center p-2 border rounded bg-light bg-opacity-10">
                <span
                  className={`fi fi-${c.iso} me-2`}
                  title={c.name}
                  style={{ fontSize: "1.5rem" }}
                />
                <span className="fw-medium">{c.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
