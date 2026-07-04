# Photography Portfolio — Project Context

> Last updated: July 3 2026. This branch is the "Field Archive" redesign — a full UI rebuild.

---

## 1. What this project is

**Steven Matson — Field Archive.** A photography portfolio designed as a modern
natural-history archive: specimen-first labelling (common name + Latin binomial),
capture settings recorded on every plate, film frames logged by stock and year.
One cohesive brand across two moods — paper/ink for the digital archive, warm
darkroom charcoal for the film log.

**Vite + React 18 + Tailwind CSS 3 + Framer Motion + React Router 7** SPA.

## 2. Design system

- **Fonts (Google CDN in `index.html`):** Fraunces (display + italic binomials),
  Inter (body/UI), IBM Plex Mono (labels & data lines).
- **Palette (`tailwind.config.js`):** `paper #F4F1E9`, `parchment #ECE7DA`,
  `ink #211E17`, `ink-soft`, `line`, accent `moss #55603F` (light pages) and
  `ochre #A87B2E` (film pages); `dark*` tokens for the darkroom section.
- **Utilities (`src/index.css`):** `.label` (mono small-caps letterspaced),
  `.binomial` (italic Fraunces), `.grain` (subtle SVG noise overlay).

## 3. Structure

```
src/
├── main.jsx              BrowserRouter entry
├── App.jsx               Routes + page transitions; dark mode keyed off /film
├── data/
│   ├── photos.js         EDITABLE source of truth (film + digital metadata)
│   └── archive.js        Derived layer: real pixel ratios, parsed species
│                         (common/latin), taxon groups, film-stock parsing
├── components/
│   ├── Header.jsx        Sticky nav, adapts light/dark by route
│   ├── Footer.jsx
│   └── Lightbox.jsx      Shared overlay: keyboard arrows/Escape, captions
└── pages/
    ├── Home.jsx          Full-height split entry (Specimens / Film) + statement
    ├── Digital.jsx       /digital — dark, uniform 3:4 grid, taxa filters
    ├── FilmLog.jsx       /film — dark, uniform 3:4 grid, film-stock filters
    └── About.jsx         /about — bio, kit list, contact
Both galleries share `hooks/useScrollSnap.js`: y-mandatory snap on <html>
while mounted, each figure snap-align center / snap-stop always with a 69px
scroll margin (the sticky header height). Accent on dark pages is ochre.
```

Routes: `/`, `/digital` (`/specimens` redirects), `/film`, `/about`
(+ `vercel.json` SPA rewrite). Both gallery routes use the dark treatment;
home statement and about stay light.

House style: plain hyphens in all site copy — no en/em dashes.

## 4. Conventions & decisions

- Images render at their true aspect ratio (`archive.js` DIMENSIONS map) — no
  forced crops. If photos are added/replaced, add their `[w, h]` there.
- Plate labels lead with the species, not abstract titles — matches the
  BRAND.md voice ("informed, not pretentious"). Abstract titles from photos.js
  are still used as fallback when no subject exists.
- Taxa filters (Arachnida / Reptilia / Flora / …) are inferred from the
  `subject` field by keyword in `archive.js`.
- Film stock is parsed from the `format` field; year comes straight from data.
- The admin panel is back (restored from master): type "admin" anywhere,
  credentials admin/admin. Edits and reordering persist to localStorage and
  flow through `buildPlates`/`buildFrames` in `archive.js` into the galleries.
  "Export JS" copies a photos.js-ready array. Note: localStorage overrides
  shadow later photos.js edits on that browser - use Reset to re-sync.
- 7 images exist on disk but have no entry in `photos.js` (3 nature, 3 macro,
  1 film) — add entries there to surface them.

## 5. Dev

- `npm run dev` (port 5173+), `npm run build`.
- Deployed to Vercel; `vercel.json` handles client-side routing.
