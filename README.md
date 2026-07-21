# Matson Studios — Photography Portfolio

Portfolio site for Steven Matson (Jersey, Channel Islands): macro and
wildlife photography — spiders, reptiles, botanicals — alongside a 35mm
film diary of travel, cars and street.

**Live site:** [matson-studios.vercel.app](https://matson-studios.vercel.app)

## Stack

React + Vite, Tailwind CSS. Deployed on Vercel.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

## Structure

| Path | What it is |
|------|------------|
| `src/data/photos.js` | Photo metadata — titles, species, lens/shutter/aperture/ISO, film stocks |
| `src/data/archive.js` | Field-archive data |
| `public/images/` | Digital (macro, nature) and film (35mm) photographs |
| `mockups/` | **Print & exhibition mockups** — see below |
| `BRAND.md` | Brand voice, caption templates, hashtag pools, social pipeline plan |
| `content-pipeline/` | Social content generation script + outputs |
| `CONTEXT.md` | Project context notes |

## Mockups

`mockups/` holds three self-contained HTML pages (images embedded — open
directly in a browser):

- **[print-room.html](mockups/print-room.html)** — sixteen print
  treatments built from the archive's best frames: magazine covers,
  posters, a broadsheet, an LP sleeve, a book jacket, botanical plates, a
  coffee label, a film one-sheet, a gig poster and more.
- **[the-hang.html](mockups/the-hang.html)** — five full exhibition mocks
  rendered wall-by-wall to scale (Field Work, Eight Eyes, Vivarium, Roads
  South, Paddock), plus floor plan, hang list, pricing and a practical
  gallery run-through.
- **[second-edit.html](mockups/second-edit.html)** — a census of the
  desktop film archive (reference notes).

See [mockups/README.md](mockups/README.md) for the full piece list.

---

All photographs © Steven Matson. All rights reserved.
