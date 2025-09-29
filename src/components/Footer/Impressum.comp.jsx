/**
 * Dummy-Seite: Impressum
 * - Platzhalter-Komponente mit Grundstruktur.
 * - Bootstrap-Container + vertikales Padding für konsistente Abstände.
 * - Semantisch <h1>, typografisch via .h2-Klasse skaliert.
 */

export default function Impressum() {
  return (
    <main className="container py-4 py-md-5">
      {/* Hauptüberschrift: semantisch h1, optisch als h2 dargestellt */}
      <h1 className="h2">Impressum</h1>

      {/* Platzhaltertext – später durch rechtskonforme Inhalte ersetzen */}
      <p className="mb-0">
        Dies ist eine Platzhalter-Seite für das Impressum. Inhalte werden später ergänzt.
        Alle Angaben ohne Gewähr.
      </p>
    </main>
  );
}
