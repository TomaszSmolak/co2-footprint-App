/**
 * Dummy-Seite: Datenschutz
 * - Platzhalter-Komponente mit Grundstruktur.
 * - Bootstrap-Container + vertikales Padding für konsistente Abstände.
 * - Semantisch <h1>, typografisch via .h2-Klasse skaliert.
 */

export default function Datenschutz() {
  return (
    <main className="container py-4 py-md-5">
      {/* Hauptüberschrift: semantisch h1, optisch als h2 dargestellt */}
      <h1 className="h2">Datenschutz</h1>

      {/* Platzhaltertext – später durch echte Inhalte ersetzen */}
      <p className="mb-0">
        Dies ist eine Platzhalter-Seite für die Datenschutzerklärung. Inhalte folgen.
      </p>
    </main>
  );
}
