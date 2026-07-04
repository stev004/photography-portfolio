// Archive layer: enriches the raw photo data in photos.js with real pixel
// dimensions, parsed species names, taxonomic groups and film-stock info.
// photos.js stays the single editable source of truth for metadata.
import { filmPhotos, digitalPhotos } from './photos'

// Measured from the actual files in public/images (width x height).
const DIMENSIONS = {
  '/images/digital/macro/IMG_0475-Enhanced-NR.jpg': [1500, 1145],
  '/images/digital/macro/IMG_0496-Enhanced-NR.jpg': [1500, 1000],
  '/images/digital/macro/IMG_0718.jpg': [1500, 1000],
  '/images/digital/macro/IMG_1417-Enhanced-NR.jpg': [1500, 1371],
  '/images/digital/macro/IMG_1455.jpg': [1500, 1000],
  '/images/digital/macro/IMG_1711-Enhanced-NR.jpg': [1500, 1067],
  '/images/digital/macro/IMG_1810-Enhanced-NR.jpg': [1500, 1000],
  '/images/digital/macro/IMG_1903-Enhanced-NR.jpg': [1500, 1806],
  '/images/digital/macro/IMG_2031-Enhanced-NR.jpg': [1500, 1116],
  '/images/digital/macro/IMG_2233-Enhanced-NR.jpg': [1500, 2153],
  '/images/digital/macro/IMG_2239.jpg': [1500, 2398],
  '/images/digital/macro/IMG_2246.jpg': [1500, 2250],
  '/images/digital/macro/IMG_2305.jpg': [1500, 2446],
  '/images/digital/macro/IMG_2307-Enhanced-NR.jpg': [1500, 2406],
  '/images/digital/macro/IMG_2338-Enhanced-NR.jpg': [1500, 2490],
  '/images/digital/macro/IMG_2378-Enhanced-NR.jpg': [1500, 2358],
  '/images/digital/macro/IMG_2383-Enhanced-NR.jpg': [1500, 2250],
  '/images/digital/macro/IMG_2433-Enhanced-NR.jpg': [1500, 1000],
  '/images/digital/macro/IMG_2814-2-Enhanced-NR.jpg': [1333, 2000],
  '/images/digital/macro/IMG_2851-2-Enhanced-NR.jpg': [1333, 2000],
  '/images/digital/macro/IMG_2860-2-Enhanced-NR.jpg': [1333, 2000],
  '/images/digital/macro/IMG_2861-2.jpg': [1333, 2000],
  '/images/digital/macro/IMG_2862-2.jpg': [1333, 2000],
  '/images/digital/macro/IMG_2917.jpg': [1333, 2000],
  '/images/digital/macro/IMG_2941-Enhanced-NR.jpg': [1333, 2000],
  '/images/digital/macro/IMG_2961-Enhanced-NR.jpg': [2000, 1333],
  '/images/digital/macro/IMG_2986-Enhanced-NR.jpg': [2000, 1333],
  '/images/digital/nature/IMG_0677.jpg': [1500, 2005],
  '/images/digital/nature/IMG_1198.jpg': [1500, 1200],
  '/images/digital/nature/IMG_2707.jpg': [1333, 2000],
  '/images/digital/nature/IMG_2759.jpg': [1333, 2000],
  '/images/film/35mm/001-9ec80.jpg': [1500, 1709],
  '/images/film/35mm/0013-94ba6.jpg': [1500, 2221],
  '/images/film/35mm/0013-d4d23.jpg': [1500, 2263],
  '/images/film/35mm/0015-d42c8.jpg': [1500, 1013],
  '/images/film/35mm/0016-a4840.jpg': [1500, 1614],
  '/images/film/35mm/0016-e6698.jpg': [1500, 2263],
  '/images/film/35mm/0017-5f108.jpg': [1500, 2190],
  '/images/film/35mm/0018-d567d.jpg': [1500, 2263],
  '/images/film/35mm/0019-cf3bf.jpg': [1500, 2347],
  '/images/film/35mm/0023-0a6ee.jpg': [1500, 2263],
  '/images/film/35mm/0025-1e6e4.jpg': [1500, 2263],
  '/images/film/35mm/0025-45336.jpg': [1500, 2263],
  '/images/film/35mm/0025-53995.jpg': [1500, 1003],
  '/images/film/35mm/0026-c2952.jpg': [1500, 2263],
  '/images/film/35mm/0026-ec0b1.jpg': [1500, 1147],
  '/images/film/35mm/0028-20881.jpg': [1500, 1003],
  '/images/film/35mm/003-2eb22.jpg': [1500, 2263],
  '/images/film/35mm/0034-05719.jpg': [1500, 2263],
  '/images/film/35mm/0035-5f56c.jpg': [1500, 2403],
  '/images/film/35mm/0036-0e378.jpg': [1500, 1330],
  '/images/film/35mm/0036-64db3.jpg': [1500, 2263],
  '/images/film/35mm/007-83bc7.jpg': [1500, 2602],
  '/images/film/35mm/008-60c20.jpg': [1500, 2263],
}

function ratioOf(src) {
  const d = DIMENSIONS[src]
  return d ? d[0] / d[1] : 3 / 2
}

// "Jumping spider (Salticidae)" -> { common: 'Jumping spider', latin: 'Salticidae' }
function parseSubject(subject = '') {
  const m = subject.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (!m) return { common: subject.trim(), latin: null }
  return { common: m[1].trim(), latin: m[2].replace(/\.\s*$/, '').trim() }
}

function taxonOf(subject = '', category = '') {
  const s = subject.toLowerCase()
  if (/spider|salticidae|araneus|steatoda|thomisidae|trichonephila|orb-weaver|arachn/.test(s)) return 'Arachnida'
  if (/viper|chameleon|cobra|lizard|gecko|snake|reptil/.test(s)) return 'Reptilia'
  if (/buttercup|dianthus|viola|alkanet|plant|flora|flower|ranunculus/.test(s)) return 'Flora'
  if (/millipede|myriapoda/.test(s)) return 'Myriapoda'
  if (category === 'Nature') return 'Field'
  return 'Other'
}

// Short lens names so the caption data line stays on one line; the full
// name still shows in photos.js and could be surfaced in the lightbox.
const LENS_SHORT = {
  'ef-24mm stm reversed': '24mm rev.',
  'laowa 100mm ca-dreamer macro 2x': 'Laowa 100mm',
  '18-200mm dc macro os hsm': '18-200mm',
  '100mm': '100mm',
  '24mm ef-s stm': '24mm',
}

// One-line capture summary shown under every plate.
export function dataLine(p) {
  const lens = LENS_SHORT[(p.lens || '').toLowerCase()] || p.lens
  const parts = [lens, p.aperture, p.shutter, `ISO ${p.iso}`]
  const stackN = parseInt(p.stack, 10)
  if (stackN > 1) parts.push(`×${stackN} stack`)
  return parts.filter(Boolean).join(' · ')
}

// "35mm — Kodak Colorplus 200" (dashes vary) -> "Kodak ColorPlus 200"
function parseStock(format = '') {
  const raw = format.split(/[—–-]/).slice(1).join('-').trim() || format.trim()
  return raw.replace(/colorplus/i, 'ColorPlus')
}

// Builders take raw photo arrays so admin-panel overrides (order + edited
// metadata from localStorage) flow through the same derivations.
export function buildPlates(photos) {
  return photos.map((p, i) => {
    const { common, latin } = parseSubject(p.subject)
    return {
      ...p,
      number: String(i + 1).padStart(2, '0'),
      ratio: ratioOf(p.src),
      common,
      latin,
      taxon: taxonOf(p.subject, p.category),
    }
  })
}

export function buildFrames(photos) {
  return photos.map((p, i) => ({
    ...p,
    number: String(i + 1).padStart(2, '0'),
    ratio: ratioOf(p.src),
    stock: parseStock(p.format),
  }))
}

export const taxaOf = (ps) => ['All', ...new Set(ps.map((p) => p.taxon))]
export const stocksOf = (fs) => ['All', ...new Set(fs.map((f) => f.stock))]

// Defaults (no admin overrides) - used where live data isn't needed, e.g. counts.
export const plates = buildPlates(digitalPhotos)
export const frames = buildFrames(filmPhotos)
