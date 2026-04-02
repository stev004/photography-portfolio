import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DigitalCard from './DigitalCard'
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

const FILTERS = ['All', 'Macro', 'Nature']

const BG = '#111111'
const SIDEBAR_BG = '#0c0c0c'
const SIDEBAR_W = 180
const MOBILE_NAV_H = 56

// ── Lightbox ─────────────────────────────────────────────────────────────────
function DigitalLightbox({ photo, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(8,8,8,0.93)', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <motion.div
        className="relative mx-4 md:mx-6 w-full max-w-3xl"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* touch-action: pinch-zoom lets the user pinch to zoom inside the lightbox */}
        <img
          src={photo.src.includes('?') ? photo.src.replace('w=900', 'w=1400') : photo.src}
          alt={photo.title}
          className="w-full h-auto max-h-[65vh] object-contain"
          style={{ touchAction: 'pinch-zoom' }}
          draggable={false}
        />
        <div className="p-4 md:p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Mobile: title above specs. Desktop: side-by-side. */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
            <div>
              <h2 className="font-mono text-sm text-white/75 tracking-wide">{photo.title}</h2>
              <p className="font-mono text-[10px] text-white/30 mt-1 uppercase tracking-widest">{photo.subject}</p>
            </div>
            {/* 2-col grid on mobile keeps specs compact; single-col right-aligned on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-1 md:text-right">
              <p className="font-mono text-[10px] text-white/30">[LN: {photo.lens}]</p>
              <p className="font-mono text-[10px] text-white/30">[AP: f/{photo.aperture.replace('f/','')}]</p>
              <p className="font-mono text-[10px] text-white/30">[SH: {photo.shutter}]</p>
              <p className="font-mono text-[10px] text-white/30">[ISO: {photo.iso}]</p>
              <p className="font-mono text-[10px] col-span-2 md:col-span-1" style={{ color: 'rgba(0,229,255,0.45)' }}>[STACK: {photo.stack}]</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-4 font-mono text-[9px] uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors duration-200 min-h-[44px] flex items-center"
          >
            [ CLOSE ]
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Desktop Sidebar ───────────────────────────────────────────────────────────
function Sidebar({ onNavigate }) {
  return (
    <aside
      className="fixed top-0 left-0 h-full flex-col z-30 hidden md:flex"
      style={{ width: SIDEBAR_W, background: SIDEBAR_BG, borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Brand name */}
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => onNavigate('landing')}
          className="text-left transition-opacity duration-200"
          style={{ opacity: 0.75 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
        >
          <span
            className="block leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.08em' }}
          >
            STEVEN MATSON
          </span>
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col gap-0.5 px-6 pt-6 flex-1">
        <SidebarLink label="Home" onClick={() => onNavigate('landing')} />
        <SidebarLink label="Macro Lab" active />
      </nav>

      {/* Social icons row */}
      <div className="px-6 py-8 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {['ig', 'tw', 'be', 'vs'].map((s) => (
          <span
            key={s}
            className="font-mono text-[9px] uppercase tracking-widest cursor-pointer transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
          >
            {s}
          </span>
        ))}
      </div>
    </aside>
  )
}

function SidebarLink({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className="text-left font-sans text-[13px] py-1.5 transition-colors duration-200"
      style={{ color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
               fontWeight: active ? 500 : 400 }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
    >
      {label}
    </button>
  )
}

// ── Mobile Top Nav ────────────────────────────────────────────────────────────
function MobileTopNav({ onNavigate }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:hidden"
      style={{
        height: MOBILE_NAV_H,
        background: SIDEBAR_BG,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Back to Index */}
      <button
        onClick={() => onNavigate('landing')}
        className="font-mono text-[11px] tracking-widest flex items-center gap-2 min-h-[44px] min-w-[44px]"
        style={{ color: 'rgba(255,255,255,0.45)' }}
      >
        <span style={{ fontSize: 14 }}>←</span>
        <span>INDEX</span>
      </button>

      {/* Brand name — centred */}
      <button
        onClick={() => onNavigate('landing')}
        style={{ color: 'rgba(255,255,255,0.75)' }}
      >
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: '0.08em' }}>
          STEVEN MATSON
        </span>
      </button>

      {/* Section label — right */}
      <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Digital
      </span>
    </div>
  )
}

// ── Main Gallery ──────────────────────────────────────────────────────────────
export default function DigitalGallery({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const isMobile = useIsMobile()

  // Always mandatory. On mobile the grid wrapper has paddingTop:56px, which
  // places the first card at document-position 124px (filterBar 68px + pad 56px).
  // Its snap = max(0, 124−124) = 0 → page loads at scroll=0 without jumping.
  useEffect(() => {
    document.documentElement.style.scrollSnapType = 'y mandatory'
    return () => { document.documentElement.style.scrollSnapType = '' }
  }, [])

  const { digitalData } = useAdmin()
  const filtered = activeFilter === 'All'
    ? digitalData
    : digitalData.filter(p => p.category === activeFilter)

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      {/* Desktop sidebar (hidden on mobile) */}
      <Sidebar onNavigate={onNavigate} />

      {/* Mobile top nav (hidden on desktop) */}
      <MobileTopNav onNavigate={onNavigate} />

      {/* Main content — offset by sidebar on desktop, padded top by mobile nav */}
      <main style={{ marginLeft: isMobile ? 0 : SIDEBAR_W }}>

        {/* ── Top filter bar ── */}
        <div
          className="sticky z-20 flex items-center gap-1 px-4 md:px-6 py-3"
          style={{
            top: isMobile ? MOBILE_NAV_H : 0,
            background: BG,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="font-sans text-[12px] px-3 py-2 rounded-sm transition-all duration-200 min-h-[44px]"
              style={{
                color: activeFilter === f ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
                background: activeFilter === f ? 'rgba(255,255,255,0.08)' : 'transparent',
                fontWeight: activeFilter === f ? 500 : 400,
              }}
              onMouseEnter={e => { if (activeFilter !== f) e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
              onMouseLeave={e => { if (activeFilter !== f) e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
            >
              {f}
            </button>
          ))}

          <div className="flex-1" />

          {/* Live badge */}
          <motion.div
            className="flex items-center gap-1.5"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(0,229,255,0.7)' }} />
            <span className="font-mono text-[9px] tracking-widest" style={{ color: 'rgba(0,229,255,0.5)' }}>
              {filtered.length} frames
            </span>
          </motion.div>
        </div>

        {/* ── Photo grid ──
            Mobile: single column floating cards with horizontal padding
            Desktop: 3-column CSS grid — flows LEFT→RIGHT (row by row)     */}
        {/* Mobile: paddingTop 56px pushes first card to doc-pos 124px
                   (filterBar 68px + this 56px), so its snap resolves to 0. */}
        <div
          className={isMobile ? '' : 'p-4'}
          style={isMobile ? { paddingTop: 56 } : undefined}
        >
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            style={isMobile ? undefined : {
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px',
            }}
          >
            {filtered.map((photo) => (
              <DigitalCard
                key={photo.id}
                photo={photo}
                onSelect={setSelected}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        </div>

      </main>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selected && (
          <DigitalLightbox photo={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
