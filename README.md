# RSR — Random Swiss Rants

Ein Ventil für 15 Jahre Schweizer Absurditäten, gesehen aus deutschen Augen.

Statisches Blog auf Basis von [Astro](https://astro.build). Posts sind
Markdown-Dateien im Repo — kein Server, keine Datenbank, kein Login.

## Entwicklung

```bash
npm install
npm run dev       # lokaler Dev-Server, http://localhost:4321
npm run build     # Typecheck + statischer Build nach dist/
npm run preview   # gebauten dist/-Ordner lokal ansehen
```

## Einen neuen Rant schreiben

1. Neue Datei in `src/content/rants/` anlegen, z. B. `mein-neuer-rant.md`.
   Der Dateiname wird zur URL: `/rants/mein-neuer-rant/`.
2. Frontmatter ausfüllen:

   ```md
   ---
   title: "Titel des Rants"
   date: 2026-07-07
   excerpt: "Ein bis zwei Sätze für die Übersichtsseite und den RSS-Feed."
   tags: ["kategorie1", "kategorie2"]
   wutlevel: 3   # 1–5, wird als Chili-Skala angezeigt
   draft: false  # true = Post wird nicht gebaut/veröffentlicht
   ---
   ```

3. Darunter den Text in Markdown schreiben (Überschriften, Listen, Zitate,
   Links funktionieren wie gewohnt).
4. Committen und pushen — beim nächsten Deploy erscheint der Post
   automatisch auf der Startseite, unter seinen Tags und im RSS-Feed.

## Struktur

- `src/content/rants/` — die Blogposts (Markdown)
- `src/content.config.ts` — Schema/Validierung für Posts
- `src/layouts/` — `BaseLayout` (Grundgerüst, Header/Footer, Dark Mode)
  und `PostLayout` (Post-Kopf mit Datum, Tags, Wutlevel)
- `src/pages/` — Routen: Startseite, `rants/[slug]`, `tags/[tag]`, `about`,
  `rss.xml`, `404`
- `src/styles/global.css` — Design (Schweizer Rot/Weiss-Akzente, Dark/Light)

## Deployment

Der Build erzeugt eine rein statische Seite in `dist/` — hostbar auf
GitHub Pages, Netlify, Vercel, Cloudflare Pages o. ä. Vor dem ersten Deploy
in `astro.config.mjs` die `site`-URL auf die echte Domain anpassen (wird
für RSS-Feed und Sitemap gebraucht).
