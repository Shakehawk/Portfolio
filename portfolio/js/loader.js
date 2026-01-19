const root = document.getElementById("sections-root");

const files = [
  "sections/start.html",
  "sections/projekte.html",
  "sections/ueber.html",
  "sections/skills.html",
  "sections/kontakt.html",
];

async function loadAll() {
  const parts = await Promise.all(
    files.map(async (file) => {
      const res = await fetch(file, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Konnte ${file} nicht laden (${res.status})`);
      return res.text();
    })
  );

  root.innerHTML = parts.join("\n");
}

loadAll().catch((err) => {
  console.error(err);
  root.innerHTML = `
    <div class="container" style="padding:24px;">
      <p style="color:#f1d487;font-weight:900;">Fehler beim Laden der Sections.</p>
      <p style="color:#b8c9c0;">Starte über VS Code Live Server (sonst blockt der Browser fetch()).</p>
    </div>`;
});
