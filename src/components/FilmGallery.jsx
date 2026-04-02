import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from './AdminPanel'

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  )
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return mobile
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20, delay: i * 0.04 },
  }),
}

// ─── Render-item builder ──────────────────────────────────────────────────────
// Collects all landscape photos into pairs (two stacked = same height as one
// portrait) and distributes those pairs evenly back among the portraits.
// An odd-count solo landscape gets its own row-span-2 slot.
function buildRenderItems(photos) {
  const portraits  = photos.filter(p => p.aspect === 'portrait')
  const landscapes = photos.filter(p => p.aspect !== 'portrait')

  // Group landscapes into pairs; last one is a solo if count is odd
  const groups = []
  for (let i = 0; i < landscapes.length; i += 2) {
    groups.push(
      landscapes[i + 1]
        ? { kind: 'pair', photos: [landscapes[i], landscapes[i + 1]] }
        : { kind: 'solo', photo: landscapes[i] }
    )
  }

  // All portraits, no landscapes
  if (groups.length === 0) return portraits.map(photo => ({ kind: 'portrait', photo }))

  // Spread portrait groups evenly between landscape groups
  const spread = Math.ceil(portraits.length / groups.length)
  const result = []
  let pi = 0
  for (const group of groups) {
    const end = Math.min(pi + spread, portraits.length)
    while (pi < end) result.push({ kind: 'portrait', photo: portraits[pi++] })
    result.push(group)
  }
  while (pi < portraits.length) result.push({ kind: 'portrait', photo: portraits[pi++] })
  return result
}

// ─── Shared hover overlay + caption (desktop only, inside overflow container) ─
function HoverCaption({ photo }) {
  return (
    <>
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-spring bg-white/95">
        <p className="font-serif text-[13px] text-black/90 italic leading-snug">{photo.title}</p>
        <p className="font-sans text-[9px] uppercase tracking-superwide text-black/40 mt-0.5">
          {photo.format} — {photo.year}
        </p>
      </div>
    </>
  )
}

// ─── Standalone grid cell (portrait or solo landscape) ───────────────────────
function FilmCell({ photo, index, onSelect, spanTwoRows = false }) {
  const [loaded, setLoaded] = useState(false)
  const isMobile = useIsMobile()
  const twoRows = spanTwoRows || photo.aspect === 'portrait'

  // Mobile  — snap:start, scrollMarginTop = nav height (69px).
  //   Each cell is exactly (100svh − 69px) tall → every swipe travels one
  //   identical screen, giving perfectly consistent snapping.
  //   First cell sits at document-top (header is hidden on mobile) so its
  //   snap position = max(0, 0−69) = 0 → page loads without auto-jumping.
  //
  // Desktop — snap:center, scrollMarginTop = 93px (nav height).
  const snapAlign    = isMobile ? 'start' : 'center'
  const snapMarginTop = isMobile ? 69 : 93

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className={`group cursor-pointer ${twoRows ? 'md:row-span-2' : ''}`}
      style={{ scrollSnapAlign: snapAlign, scrollSnapStop: 'always', scrollMarginTop: snapMarginTop }}
      onClick={() => onSelect(photo)}
    >
      {/* Image container — full viewport height on mobile, grid row height on desktop */}
      <div
        className="relative overflow-hidden md:min-h-0 md:h-full"
        style={isMobile ? { height: 'calc(100svh - 69px)' } : undefined}
      >
        {!loaded && <div className="absolute inset-0 bg-[#F2F2F2] animate-pulse" />}
        <img
          src={photo.src}
          alt={photo.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-spring md:group-hover:scale-105"
          onLoad={() => setLoaded(true)}
          draggable={false}
        />

        {/* Desktop hover overlay */}
        <div className="hidden md:block">
          <HoverCaption photo={photo} />
        </div>

        {/* Mobile caption — gradient overlay pinned to bottom of the image */}
        <div
          className="md:hidden absolute bottom-0 left-0 right-0 px-5 pt-16 pb-6"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}
        >
          <p className="font-serif text-xl italic text-white/90 leading-snug">{photo.title}</p>
          <p className="font-sans text-[9px] uppercase tracking-superwide text-white/55 mt-1">
            {photo.format} — {photo.year}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Cell inside a landscape pair (not a grid item, fills its flex slot) ─────
function PairedCell({ photo, onSelect }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div
      className="relative flex-1 min-h-0 overflow-hidden group cursor-pointer"
      onClick={() => onSelect(photo)}
    >
      {!loaded && <div className="absolute inset-0 bg-[#F2F2F2] animate-pulse" />}
      <img
        src={photo.src}
        alt={photo.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
        onLoad={() => setLoaded(true)}
        draggable={false}
      />
      <HoverCaption photo={photo} />
    </div>
  )
}

// ─── Landscape pair wrapper — occupies same grid height as a portrait ─────────
function LandscapePair({ photos, index, onSelect }) {
  const isMobile = useIsMobile()
  const snapMarginTop = isMobile ? 69 : 93
  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="md:row-span-2 flex flex-col gap-1.5"
      style={{ scrollSnapAlign: 'center', scrollSnapStop: 'always', scrollMarginTop: snapMarginTop }}
    >
      {photos.map(photo => (
        <PairedCell key={photo.id} photo={photo} onSelect={onSelect} />
      ))}
    </motion.div>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function LightboxModal({ photo, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-3xl w-full mx-4 md:mx-6"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src.includes('?') ? photo.src.replace('w=900', 'w=1400') : photo.src}
          alt={photo.title}
          className="w-full h-auto object-contain max-h-[75vh]"
          draggable={false}
        />
        <div className="mt-4 md:mt-6 flex items-end justify-between border-t border-[#E8E8E8] pt-4">
          <div>
            <h2 className="font-serif text-xl md:text-2xl italic text-black/90">{photo.title}</h2>
            <p className="font-sans text-[10px] uppercase tracking-superwide text-black/40 mt-1">
              {photo.format} — {photo.year}
            </p>
          </div>
          <button
            onClick={onClose}
            className="font-sans text-[10px] uppercase tracking-superwide text-black/40 hover:text-black/80 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-end"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export default function FilmGallery() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('all')
  const isMobile = useIsMobile()

  // Always mandatory. On mobile the header is hidden so the first FilmCell
  // sits at document-top, its snap resolves to scroll=0, and the browser
  // rests there on load — no auto-jump. Each cell is exactly one screen tall
  // so every swipe travels an identical distance.
  useEffect(() => {
    document.documentElement.style.scrollSnapType = 'y mandatory'
    return () => { document.documentElement.style.scrollSnapType = '' }
  }, [])

  const { filmData } = useAdmin()
  const filters  = ['all', 'portrait', 'landscape']
  const filtered = filter === 'all' ? filmData : filmData.filter(p => p.aspect === filter)

  return (
    <main className="bg-film-bg min-h-screen">
      {/* ── Header — hidden on mobile (full-screen snap cells start at doc-top) ── */}
      <header className="hidden md:block max-w-6xl mx-auto px-4 md:px-6 pt-24 pb-8 md:pb-12">
        <div className="border-b border-film-rule pb-6 md:pb-8">
          <p className="font-sans text-[10px] uppercase tracking-superwide text-black/30 mb-3">
            Film Series — Analog Works
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-0">
            <h1 className="font-serif text-3xl md:text-6xl lg:text-7xl italic text-black/90 leading-none">
              Film
            </h1>
            <div className="flex items-center gap-5 md:gap-6 pb-1">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-sans text-[10px] uppercase tracking-superwide transition-colors duration-200 min-h-[44px] ${
                    filter === f ? 'text-black/90' : 'text-black/30 hover:text-black/60'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <p className="font-sans text-[9px] uppercase tracking-superwide text-black/25">
            {filtered.length} Frames
          </p>
          <p className="font-sans text-[9px] uppercase tracking-superwide text-black/25 hidden md:block">
            Kodak · Ilford · Fuji · Lomography
          </p>
        </div>
      </header>

      {/* ── Grid ─────────────────────────────────────────────────────────────
          Mobile  : single full-bleed column, natural image heights, gap-y-12
          Desktop : 4-column dense grid, 220px base row height.
                    Portraits  → row-span-2 (440px)
                    Landscape pairs → row-span-2 wrapper, two flex-1 cells (≈215px each)
                    Solo landscape  → row-span-2 (same height, object-cover crops evenly)
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-0 md:px-6 pb-24">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-1.5"
          style={isMobile ? undefined : { gridAutoRows: '220px', gridAutoFlow: 'dense' }}
        >
          {isMobile
            ? filtered.map((photo, i) => (
                <FilmCell key={photo.id} photo={photo} index={i} onSelect={setSelected} />
              ))
            : buildRenderItems(filtered).map((item, i) => {
                if (item.kind === 'portrait') {
                  return (
                    <FilmCell key={item.photo.id} photo={item.photo} index={i} onSelect={setSelected} />
                  )
                }
                if (item.kind === 'pair') {
                  return (
                    <LandscapePair key={item.photos[0].id} photos={item.photos} index={i} onSelect={setSelected} />
                  )
                }
                // solo landscape — row-span-2 to match portrait height
                return (
                  <FilmCell key={item.photo.id} photo={item.photo} index={i} onSelect={setSelected} spanTwoRows />
                )
              })
          }
        </div>
      </section>

      {/* ── Footer — hidden on mobile (mandatory snap, no natural resting point after last image) ── */}
      <footer className="hidden md:block max-w-6xl mx-auto px-4 md:px-6 py-8 border-t border-film-rule">
        <div className="flex justify-between">
          <p className="font-sans text-[9px] uppercase tracking-superwide text-black/20">All Rights Reserved</p>
          <p className="font-sans text-[9px] uppercase tracking-superwide text-black/20">Shot on Film</p>
        </div>
      </footer>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selected && <LightboxModal photo={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </main>
  )
}
