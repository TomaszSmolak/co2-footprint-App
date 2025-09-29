/**
 * Table-Komponente (CO₂-Tabelle)
 * - Datenbasis: companies, countries aus data.json.
 * - Filter: Suche, Land, Jahr, Unternehmen.
 * - Sortierung: Name, Land, Jahr (2020–2024); Umschalten asc/desc.
 * - Anzeige: dynamische Jahresspalten je nach Jahr-Filter.
 * - Layout: Bootstrap (Container, Grid, Table, Utilities).
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import data from "../../assets/data/data.json";
import "./Table.style.css";

const YEARS = ["2020", "2021", "2022", "2023", "2024"];
const UNIT_LABEL = "Mt CO₂";

export default function Table() {
  // Fallbacks, falls JSON nicht geladen werden kann
  const companies = data?.companies ?? [];
  const countries = data?.countries ?? [];

  // Lookup-Map: countryId -> Country-Objekt
  const countryById = useMemo(
    () => Object.fromEntries(countries.map((c) => [c.countryId, c])),
    [countries]
  );

  // Referenz aufs Suchfeld (zum Re-Fokus nach Reset)
  const searchRef = useRef(null);

  // UI-States
  const [query, setQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("name"); // "name" | "country" | "2020".."2024"
  const [sortDir, setSortDir] = useState("asc");  // "asc" | "desc"

  // Reset: setzt Suche, Filter und Sortierung zurück + Fokus ins Suchfeld
  const resetFilters = () => {
    setQuery("");
    setCountryFilter("ALL");
    setYearFilter("ALL");
    setCompanyFilter("ALL");
    setSortKey("name");
    setSortDir("asc");
    setTimeout(() => searchRef.current?.focus(), 0);
  };

  // Normalisierung: Kleinbuchstaben, Diakritika entfernen, trimmen
  const normalize = (s) =>
    (s ?? "")
      .toString()
      .toLowerCase()
      .normalize("NFD")              // Zeichen in Basis + Diakritikum zerlegen
      .replace(/\p{Diacritic}/gu, "")// Diakritika entfernen (Unicode-RegEx)
      .trim();

  // Sortierlogik (Click auf Spaltenkopf)
  const handleSort = (key) => {
    // Bei Jahresklick und aktivem Jahr-Filter: Jahr übernehmen, aufsteigend sortieren
    if (YEARS.includes(key) && yearFilter !== "ALL" && key !== yearFilter) {
      setYearFilter(key);
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    // Gleiches Feld: Richtung toggeln, sonst Feld wechseln und aufsteigend
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  // Sichtbare Jahresspalten (bei gesetztem Jahr nur diese eine)
  const displayedYears = useMemo(
    () => (yearFilter === "ALL" ? YEARS : [yearFilter]),
    [yearFilter]
  );

  // Join: Company + Country → Zeilenmodell für die Tabelle
  const rows = useMemo(() => {
    return companies.map((co) => {
      const country = countryById[co.countryId];
      return {
        companyId: co.companyId,
        name: co.name,
        countryId: co.countryId,
        countryName: country?.name ?? "—",
        countryIso: country?.iso ?? "xx",
        emissions: co.co2Emissions ?? {},
      };
    });
  }, [companies, countryById]);

  // Länderoptionen (alphabetisch)
  const countryOptions = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name, "de")),
    [countries]
  );

  // Unternehmensoptionen dynamisch je nach Land
  const companyOptions = useMemo(() => {
    const list =
      countryFilter === "ALL"
        ? companies
        : companies.filter((c) => c.countryId === Number(countryFilter));
    return list
      .map((c) => ({ companyId: c.companyId, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name, "de"));
  }, [companies, countryFilter]);

  // Wenn Land wechselt und die gewählte Firma nicht mehr passt → Firma zurücksetzen
  useEffect(() => {
    if (companyFilter === "ALL") return;
    const stillValid = companyOptions.some((c) => c.companyId === Number(companyFilter));
    if (!stillValid) setCompanyFilter("ALL");
  }, [companyOptions, companyFilter]);

  // Button "Suchen" → Query als Länder-Filter interpretieren (exakt/startsWith/includes)
  const applyQueryAsCountryFilter = () => {
    const q = normalize(query);
    if (!q) return;

    let match = countries.find((c) => normalize(c.name) === q);
    if (!match) match = countries.find((c) => normalize(c.name).startsWith(q));
    if (!match) match = countries.find((c) => normalize(c.name).includes(q));

    if (match) {
      setCountryFilter(String(match.countryId));
      setCompanyFilter("ALL"); // Firmenauswahl zurücksetzen, da Land geändert wurde
      // yearFilter bleibt unverändert
    }
  };

  // Filtern nach Suche + Land + Jahr + Unternehmen
  const filtered = useMemo(() => {
    const q = normalize(query);
    return rows.filter((r) => {
      const matchesQuery =
        q.length === 0 ||
        normalize(r.name).includes(q) ||
        normalize(r.countryName).includes(q);

      const matchesCountry =
        countryFilter === "ALL" || r.countryId === Number(countryFilter);

      const matchesYear =
        yearFilter === "ALL" ||
        typeof r.emissions?.[yearFilter] === "number";

      const matchesCompany =
        companyFilter === "ALL" || r.companyId === Number(companyFilter);

      return matchesQuery && matchesCountry && matchesYear && matchesCompany;
    });
  }, [rows, query, countryFilter, yearFilter, companyFilter]);

  // Sortieren der gefilterten Zeilen
  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let av, bv;
      if (YEARS.includes(sortKey)) {
        av = a.emissions?.[sortKey] ?? -Infinity; // fehlende Werte nach hinten
        bv = b.emissions?.[sortKey] ?? -Infinity;
      } else if (sortKey === "country") {
        av = a.countryName; 
        bv = b.countryName;
      } else {
        av = a.name; 
        bv = b.name;
      }

      // Strings: localeCompare (de)
      if (typeof av === "string" && typeof bv === "string") {
        const res = av.localeCompare(bv, "de");
        return sortDir === "asc" ? res : -res;
      }

      // Zahlen: Standardvergleich (mit Fallback)
      const res = (av ?? -Infinity) - (bv ?? -Infinity);
      return sortDir === "asc" ? res : -res;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  // Pfeilindikator im Tabellenkopf
  const sortIndicator = (key) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  return (
    <div className="container-fluid py-4">
      {/* Hinweisbox (Projekt-Kontext) */}
      <div className="alert alert-warning shadow-sm mb-4" role="alert">
        <strong>Hinweis:</strong> Diese Seite ist Teil eines Hochschulprojekts.
        Die dargestellten Unternehmen wurden <u>zufällig generiert</u> und die
        CO₂-Daten dienen ausschließlich Demonstrationszwecken.
      </div>

      {/* Glasbox (siehe Table.style.css) */}
      <div className="glassbox p-3 p-md-4">
        <h2 className="m-0 mb-3">CO₂-Tabelle</h2>

        {/* Suchleiste */}
        <div className="input-group mb-2">
          <span className="input-group-text">Suche</span>
          <input
            ref={searchRef}
            className="form-control"
            placeholder="Firma oder Land…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* Reset: löscht Suche + Filter + Sortierung */}
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={resetFilters}
            title="Suche, Land-, Jahr- und Unternehmens-Filter zurücksetzen"
          >
            Reset
          </button>
          {/* Query → Länder-Filter anwenden */}
          <button
            className="btn btn-primary"
            type="button"
            onClick={applyQueryAsCountryFilter}
            title="Query auf Land anwenden (setzt den Länder-Filter)"
          >
            Suchen
          </button>
        </div>

        {/* Filterzeile */}
        <div className="d-flex flex-column flex-md-row gap-2 mb-3">
          <div className="input-group">
            <span className="input-group-text">Land</span>
            <select
              className="form-select"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              <option value="ALL">Alle</option>
              {countryOptions.map((c) => (
                <option key={c.countryId} value={c.countryId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <span className="input-group-text">Jahr</span>
            <select
              className="form-select"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="ALL">Alle</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <span className="input-group-text">Unternehmen</span>
            <select
              className="form-select"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="ALL">Alle</option>
              {companyOptions.map((c) => (
                <option key={c.companyId} value={c.companyId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabelle */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th
                  role="button"
                  onClick={() => handleSort("name")}
                  title="Nach Unternehmen sortieren"
                >
                  Unternehmen{sortIndicator("name")}
                </th>
                <th
                  role="button"
                  onClick={() => handleSort("country")}
                  title="Nach Land sortieren"
                  style={{ minWidth: 190 }}
                >
                  Land{sortIndicator("country")}
                </th>
                {displayedYears.map((y) => (
                  <th
                    key={y}
                    className="text-end"
                    role="button"
                    onClick={() => handleSort(y)}
                    title={`Nach ${y} sortieren`}
                  >
                    {y}{" "}
                    <small className="text-body-secondary">({UNIT_LABEL})</small>
                    {sortIndicator(y)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sorted.map((r) => (
                <tr key={r.companyId}>
                  <td className="fw-semibold">{r.name}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {/* Flaggenklasse erfordert global eingebundene Flag-Icons (fi fi-XX) */}
                      <span
                        className={`fi fi-${r.countryIso} me-2`}
                        style={{ fontSize: "1.25rem" }}
                        title={r.countryName}
                      />
                      <span>{r.countryName}</span>
                    </div>
                  </td>
                  {displayedYears.map((y) => (
                    <td key={y} className="text-end">
                      {typeof r.emissions?.[y] === "number"
                        ? `${r.emissions[y]} ${UNIT_LABEL}`
                        : "—"}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Leerergebnis-Hinweis */}
              {sorted.length === 0 && (
                <tr>
                  <td
                    colSpan={2 + displayedYears.length}
                    className="text-center text-body-secondary py-4"
                  >
                    Keine Treffer – passe Suche oder Filter an.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Einheitenhinweis */}
        <div className="mt-2">
          <small className="text-body-secondary">
            Einheit im Frontend: <strong>{UNIT_LABEL}/Jahr</strong>.
          </small>
        </div>
      </div>
    </div>
  );
}
