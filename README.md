# RSR — Random Swiss Rants

Ein Ventil für 15 Jahre Schweizer Absurditäten, gesehen aus deutschen Augen.

Statisches Blog auf Basis von [Astro](https://astro.build). Die Rants
werden in **Notion** geschrieben; bei jedem Build zieht ein Skript die
veröffentlichten Einträge über die Notion-API und wandelt sie in
Markdown-Content für Astro um. Kein eigener Server, keine Datenbank,
kein Login — nur Notion als CMS und ein GitHub-Actions-Workflow.

Live: **https://ciavland.github.io/rsr/**

## Wie man einen neuen Rant schreibt

1. Neuen Eintrag in der Notion-Datenbank **„RSR Rants"** anlegen.
2. Properties ausfüllen:
   - **Title** — Titel des Posts
   - **Slug** — URL-Teil, z. B. `mein-neuer-rant` → `/rants/mein-neuer-rant/`
     (nur Kleinbuchstaben, Zahlen, Bindestriche; leer lassen und der Titel
     wird automatisch in einen Slug umgewandelt)
   - **Date** — Veröffentlichungsdatum
   - **Excerpt** — 1–2 Sätze für Übersichtsseite und RSS-Feed
   - **Tags** — beliebig viele
   - **Wutlevel** — 1–5, wird als Chili-Skala 🌶️ angezeigt
   - **Status** — `Draft` (erscheint nicht auf der Seite) oder `Published`
3. Den Text als normalen Notion-Seiteninhalt schreiben (Überschriften,
   Listen, Zitate, Bold/Italic — wird 1:1 zu Markdown konvertiert).
4. Fertig. Der Workflow läuft automatisch stündlich (und bei jedem Push
   nach `main`) und übernimmt neue `Published`-Einträge auf die Live-Seite.
   Für ein sofortiges Update: im Repo unter **Actions → Deploy to GitHub
   Pages → Run workflow** manuell auslösen.

## Notion-Integration einrichten (einmalig)

1. Auf [notion.so/my-integrations](https://www.notion.so/my-integrations)
   eine neue **Internal Integration** erstellen und den API-Key kopieren.
2. Die Datenbank **„RSR Rants"** in Notion öffnen → `···` → „Connections"
   → die neue Integration hinzufügen (sonst sieht die API die Datenbank
   nicht).
3. Die Datenbank-ID aus der URL kopieren:
   `https://www.notion.so/<workspace>/<DATABASE_ID>?v=...`
4. Im GitHub-Repo unter **Settings → Secrets and variables → Actions**
   zwei Secrets anlegen:
   - `NOTION_TOKEN` — der API-Key aus Schritt 1
   - `NOTION_DATABASE_ID` — die ID aus Schritt 3

Ohne diese beiden Secrets schlägt der `fetch:notion`-Schritt im Workflow
fehl (mit einer klaren Fehlermeldung).

## Lokale Entwicklung

```bash
npm install

# .env mit NOTION_TOKEN und NOTION_DATABASE_ID anlegen (siehe oben),
# dann die aktuellen Notion-Inhalte lokal abrufen:
npm run fetch:notion

npm run dev       # lokaler Dev-Server, http://localhost:4321
npm run build     # Typecheck + statischer Build nach dist/
npm run preview   # gebauten dist/-Ordner lokal ansehen
```

Ohne `.env`/Notion-Zugang baut die Seite trotzdem (mit leerer Rant-Liste)
— praktisch, um nur am Design zu arbeiten.

## Struktur

- `scripts/fetch-notion.mjs` — zieht `Published`-Einträge aus Notion und
  schreibt sie als Markdown nach `src/content/rants/` (wird bei jedem
  Build neu generiert, nicht committet)
- `src/content.config.ts` — Schema/Validierung für Posts
- `src/layouts/` — `BaseLayout` (Grundgerüst, Header/Footer, Dark Mode)
  und `PostLayout` (Post-Kopf mit Datum, Tags, Wutlevel)
- `src/pages/` — Routen: Startseite, `rants/[slug]`, `tags/[tag]`, `about`,
  `rss.xml`, `404`
- `src/styles/global.css` — Design (Schweizer Rot/Weiss-Akzente, Dark/Light)
- `.github/workflows/deploy.yml` — holt Notion-Inhalte, baut die Seite,
  deployt nach GitHub Pages (stündlich, bei Push nach `main`, oder manuell)

## Deployment

Der Build erzeugt eine rein statische Seite in `dist/`, die per GitHub
Actions nach GitHub Pages deployt wird. Die `site`/`base`-Konfiguration
in `astro.config.mjs` ist auf `https://ciavland.github.io/rsr` gesetzt —
bei einer eigenen Domain entsprechend anpassen.
