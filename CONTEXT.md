# Photography Portfolio — Project Context
> Last updated: April 2 2026. Use this file to resume work in a new thread without losing state.

---

## 1. What this project is

A dual-path photography portfolio with two distinct gallery sections:
- **Film** — analog / 35mm work. Stark white, editorial, Vogue-style.
- **Digital** — macro/nature photography. Dark charcoal, technical HUD aesthetic.

Built from scratch. **Vite + React + Tailwind CSS + Framer Motion** SPA with state-based routing (no React Router — just a `useState` in `App.jsx`).

---

## 2. Tech Stack

| Tool | Version | Notes |
|---|---|---|
| React | 18.3.1 | Strict Mode enabled |
| Framer Motion | 11.18.2 | Spring physics everywhere — no `linear` transitions |
| Tailwind CSS | 3.4.19 | v3, NOT v4 |
| Vite | 5.4.21 | Dev server runs on port 5173+ (auto-increments if occupied) |
| PostCSS / Autoprefixer | latest | Standard setup |
| Node | v24.13.0 | |
| npm | 11.6.2 | |

**Start dev server:** `npm run dev` from `c:\Users\StevBeast\Documents\photography portfolio`

---

## 3. File Structure

```
photography portfolio/
├── index.html                  ← Google Fonts CDN: Playfair Display, Inter, JetBrains Mono, Bebas Neue
├── package.json
├── vite.config.js
├── tailwind.config.js          ← Custom tokens (see section 5)
├── postcss.config.js
├── public/
│   └── images/
│       ├── film/35mm/          ← 20 real film photos (.jpg)
│       └── digital/
│           ├── macro/          ← 27 real macro photos
│           └── nature/         ← 4 real nature photos
└── src/
    ├── main.jsx                ← ReactDOM.createRoot entry
    ├── App.jsx                 ← State router + AdminProvider wrapper
    ├── index.css               ← Tailwind base + custom utilities
    ├── data/
    │   └── photos.js           ← ACTIVE data file (film + digital photos with real metadata)
    └── components/
        ├── LandingPage.jsx     ← 50/50 split-screen entry point
        ├── Navigation.jsx      ← Sticky top nav (Film section only)
        ├── FilmGallery.jsx     ← White editorial grid gallery
        ├── DigitalGallery.jsx  ← Dark sidebar + CSS Grid gallery
        ├── DigitalCard.jsx     ← Individual grid card with HUD overlay
        └── AdminPanel.jsx      ← Hidden admin edit mode (context + login + panel UI)
```

---

## 4. Routing Logic (`App.jsx`)

State: `section` ∈ `{ 'landing', 'film', 'digital' }`

- `landing` → renders `<LandingPage onEnter={setSection} />`
- `film` → renders `<Navigation current="film" onNavigate={setSection} />` + `<FilmGallery />`
- `digital` → renders `<DigitalGallery onNavigate={setSection} />` (Navigation NOT used — sidebar handles nav)

All transitions use `AnimatePresence mode="wait"` with spring-based enter/exit variants.

Root is wrapped in `<AdminProvider>` with `<AdminLogin />` and `<AdminPanel />` mounted at root level (overlay on top of everything).

---

## 5. Tailwind Custom Tokens (`tailwind.config.js`)

```js
fontFamily: {
  serif:  ['"Playfair Display"', 'Georgia', 'serif'],   // Film titles
  sans:   ['Inter', 'system-ui', 'sans-serif'],          // Film UI text
  mono:   ['"JetBrains Mono"', 'monospace'],             // Digital HUD
}

colors: {
  film: { bg: '#FFFFFF', ink: '#0A0A0A', mid: '#6B6B6B', rule: '#E8E8E8' }
  digital: { bg: '#050505', surface: '#0D0D0D', border: 'rgba(255,255,255,0.08)',
             accent: '#00E5FF', dim: 'rgba(255,255,255,0.4)' }
}

letterSpacing:  { superwide: '0.25em' }       // → tracking-superwide
transitionTimingFunction: { spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }  // → ease-spring
maxWidth:       { '8xl': '88rem' }
```

> **Note:** `digital.bg` in tailwind.config is `#050505` (old value) but `DigitalGallery.jsx` hardcodes `BG = '#111111'`. The config token is not used by the digital section.

---

## 6. Component Details

### `LandingPage.jsx`
- **Layout:** Full-screen flex row (50/50). On mobile (`< 768px`) switches to flex column (50/50 height).
- **Background images:** Film side uses `/images/film/35mm/0017-5f108.jpg` (grayscale filter). Digital side uses `/images/digital/macro/IMG_2851-2-Enhanced-NR.jpg`.
- **Film side:** Warm off-white `#faf8f5` bg. Playfair Display title. Decorative expanding `<hr>` lines.
- **Digital side:** Near-black `#050505` bg. Cyan grid pattern overlay. Cyan diamond decorative elements. Space Grotesk font (falls back to system-ui).
- **Mobile text animation:** Film label slides in from left (`x: -28`), Digital from right (`x: 28`). Desktop keeps `y: 30` upward animation.
- **Mobile CTA:** "Tap to Enter" (pulsing opacity). Desktop: "Enter Gallery →" (hover reveal).
- **Hover interaction:** Hovered side expands to 58%, other shrinks to 42%. Spring `stiffness: 200, damping: 30`.

> ⚠️ Cormorant Garamond and Space Grotesk are referenced in inline styles but NOT in the `<link>` in `index.html`. They fall back to Georgia / system-ui.

### `Navigation.jsx`
- Used **only** for the Film section.
- Sticky top bar, `backdrop-blur-sm`. `py-3 md:py-6`.
- **Exact height:** `py-6` (24×2) + `min-h-[44px]` button content + 1px border = **93px desktop**, **69px mobile**.
- Left: `← Index` button (`min-h-[44px] min-w-[44px]`). Centre: section label.

### `FilmGallery.jsx`
- White background. `max-w-6xl` centered.
- **Header:** `pt-24` top (clears sticky nav). Italic Playfair Display "Film" heading. Filters: `all | portrait | landscape`. No longer a scroll-snap point (page naturally starts at scroll=0).
- **Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, `gap-1.5`, `gridAutoRows: 220px`, `gridAutoFlow: dense`.
  - Portraits → `row-span-2` (440px tall).
  - Landscape pairs → `LandscapePair` component, also `row-span-2`.
  - Solo landscape → `FilmCell` with `spanTwoRows`, also `row-span-2`.
- **`buildRenderItems()`:** Groups landscape photos into pairs (two stacked = same height as portrait). Distributes pairs evenly among portraits. Ensures visual grid continuity.
- **Hover:** Caption strip slides up from bottom (`ease-spring`). Image scales `105%` (pure CSS `group-hover:scale-105`).
- **Scroll snap:** `scroll-snap-type: y mandatory` on `<html>` (set/cleared in `useEffect`). Each `FilmCell` and `LandscapePair` has `scroll-snap-align: center`, `scroll-snap-stop: always`, `scrollMarginTop: 69px` (mobile) / `93px` (desktop) — exact nav height for perfect centering in content area.
- **Mobile:** Single full-bleed column, `gap-y-12`. Each image is its own snap stop.
- **Data:** `filmData` from `useAdmin()` context (wraps `filmPhotos` from `photos.js` with localStorage overrides).

### `DigitalGallery.jsx`
- **Background:** `#111111` (hardcoded `BG` constant).
- **Layout:** Fixed left sidebar (180px, `#0c0c0c`) on desktop. On mobile: sidebar hidden, `MobileTopNav` shown.
- **Sidebar:** "STEVEN MATSON" brand name (Bebas Neue, 18px, `letter-spacing: 0.08em`), clickable → landing. Nav links: `Home`, `Macro Lab` (active). Social handles `ig tw be vs` at bottom.
- **`MobileTopNav`:** Fixed 56px top bar. `← INDEX` button, `MACRO LAB` label, "STEVEN MATSON" name (Bebas Neue 15px).
- **Filter bar:** Sticky. `top: 0` desktop / `top: 56px` mobile. `All | Macro | Nature`. Animated cyan ● live frame count.
  - **Exact height:** `py-3` (12×2) + `min-h-[44px]` buttons = **68px desktop**. Mobile bottom = **124px** (56px nav + 68px bar).
- **Grid:** CSS Grid `repeat(3, 1fr)`, `gap: 4px` on desktop. Single column `px-4 py-4` on mobile.
- **Scroll snap:** Same as film — `scroll-snap-type: y mandatory` on `<html>`. Each `DigitalCard` has `scroll-snap-align: center`, `scroll-snap-stop: always`, `scrollMarginTop: 68px` (desktop) / `124px` (mobile).
- **Data:** `digitalData` from `useAdmin()` context.

### `DigitalCard.jsx`
- Frameless grid item — the image IS the card.
- `overflow-hidden` clips hover zoom.
- **Desktop:** Fixed `aspect-ratio: 3/4` for uniform row heights in the CSS Grid.
- **Hover zoom:** Pure CSS `group-hover:scale-[1.06]` + `transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)` + `will-change: transform`. **NOT Framer Motion** — using CSS prevents scroll-snap micro-correction glitches.
- **HUD overlay:** Framer Motion `AnimatePresence`. Gradient from bottom. `[LN] [SH] [AP] [ISO]` 2×2 grid + title + cyan stack count. Stagger children `0.05s`.
- **Mobile:** Tap once → HUD fades in. Tap again → lightbox. `✕` button dismisses HUD.
- **Skeleton:** `#1a1a1a` pulse while loading. `minHeight: 180` ensures lazy load triggers.
- **Loading fade:** `opacity: 0 → 1` via inline style + CSS transition.

### `AdminPanel.jsx`
- **Trigger:** Type `admin` anywhere on the page (keyboard listener) → login modal appears.
- **Credentials:** `admin / admin` (default, hardcoded).
- **Login UI:** Dark modal, shake animation on wrong password.
- **Panel UI:** Full-screen overlay, two tabs (Film / Digital).
  - **Reorder:** Drag-and-drop (HTML5 native drag events).
  - **Edit:** Inline inputs for all metadata fields (title, format, year for film; title, subject, category, lens, shutter, aperture, iso, stack for digital).
  - **Persistence:** Changes saved to `localStorage` as JSON. Overrides `photos.js` defaults on load.
  - **Export:** "Copy JS" button generates `photos.js`-ready array in clipboard.
- **Context:** `AdminProvider` wraps entire app. `useAdmin()` hook exposes `filmData` and `digitalData` to `FilmGallery` and `DigitalGallery`.

---

## 7. Data (`src/data/photos.js`)

### `filmPhotos` (20 entries) — **REAL PHOTOS**
```js
{ id, src, title, year, format, aspect }
// aspect: 'portrait' | 'landscape' — assigned from actual pixel dimensions
// src: '/images/film/35mm/filename.jpg'
// Metadata editable via admin panel (persisted to localStorage)
```

### `digitalPhotos` (31 entries) — **REAL PHOTOS**
```js
{ id, src, title, subject, category, lens, shutter, aperture, iso, stack }
// category: 'Macro' | 'Nature'
// src: '/images/digital/macro/filename.jpg' or '/images/digital/nature/filename.jpg'
// Metadata editable via admin panel (persisted to localStorage)
// Grid order: left-to-right (CSS Grid), not top-to-bottom (CSS columns)
```

---

## 8. Design Decisions & Constraints

| Decision | Reason |
|---|---|
| State-based routing (no React Router) | Single-page portfolio, no URL navigation needed |
| Film uses top `Navigation`, Digital uses sidebar | Different layout paradigms per section |
| CSS Grid for digital (not columns) | Left-to-right ordering as requested; uniform `aspect-ratio: 3/4` rows |
| `buildRenderItems()` for film grid | Groups landscapes into pairs for visual continuity with portraits |
| Spring physics on ALL animations | Deliberately premium feel |
| `scroll-snap-align: center` (not `start`) | Rows land centred in viewport, not flush to top |
| CSS `group-hover:scale` on DigitalCard (not Framer Motion) | Framer Motion JS transforms caused scroll-snap micro-correction glitch |
| `scroll-snap-stop: always` | Prevents fast trackpad swipes from skipping rows |
| `scrollMarginTop` = exact sticky header height | Shifts snap-area center to cancel nav's visual offset; rows appear centred in content area |
| Bebas Neue for "STEVEN MATSON" brand | Matches user's reference — bold condensed uppercase geometric sans |
| `#111111` for Digital bg (not tailwind token) | User requested lighter dark |

---

## 9. Known Issues / Open Items

1. **Fonts missing from CDN:** `Cormorant Garamond` and `Space Grotesk` used in `LandingPage.jsx` inline styles but not in `index.html`. Falls back to Georgia / system-ui. Add to Google Fonts `<link>` if these fonts matter.

2. **Digital color token stale:** `tailwind.config.js` `digital.bg` is `#050505` but `DigitalGallery.jsx` uses `#111111`.

3. **Social links placeholder:** `ig tw be vs` handles in sidebar have no `href`. Wire up to real profile URLs.

4. **`hero.png` unused** — harmless, can delete.

---

## 10. Mobile Implementation (April 2 2026)

Full mobile pass. Key changes:
- `index.css`: `-webkit-overflow-scrolling: touch`, `touch-action: manipulation`
- `LandingPage.jsx`: Mobile split is top/bottom 50vh. Slide-in text animations. "Tap to Enter" CTA.
- `FilmGallery.jsx`: Single column full-bleed, `gap-y-12`, responsive typography `text-3xl md:text-6xl lg:text-7xl`. Mobile captions always visible below images.
- `Navigation.jsx`: 44px touch targets, `py-3 md:py-6`, responsive px.
- `DigitalGallery.jsx`: Sidebar hidden on mobile. `MobileTopNav` (56px fixed bar). Single-column floating cards with `px-4 borderRadius: 4`.
- `DigitalCard.jsx`: Tap-to-reveal HUD, `✕` dismiss, "TAP" hint, `loading="lazy"`.

---

## 11. Scroll Snap (April 2 2026)

Both galleries use `scroll-snap-type: y mandatory` on `<html>`, enabled on mount / cleaned up on unmount.

### Film Gallery
- **Snap targets:** Each `FilmCell` and `LandscapePair` (`motion.div`)
- `scroll-snap-align: center` — row lands in middle of viewport
- `scroll-snap-stop: always` — one gesture = one row, never skips
- `scrollMarginTop: 69px` mobile / `93px` desktop — exact nav height for centring maths
- Header is NOT a snap point (page naturally starts at scroll=0)

### Digital Gallery
- **Snap targets:** Each `DigitalCard` outer `div`
- Same `center` / `always` approach
- `scrollMarginTop: 124px` mobile / `68px` desktop — filter-bar height for centring maths

---

## 12. Immediate Next Steps

- [ ] Add Cormorant Garamond + Space Grotesk to `index.html` Google Fonts link
- [ ] Wire up real social links in Digital sidebar
- [ ] Add real EXIF data to `digitalPhotos` metadata (lens, shutter, aperture, iso, stack)
- [ ] Update page `<title>` in `index.html` to "Steven Matson — Photography"
- [x] Deploy to Vercel (repo pushed to GitHub)
