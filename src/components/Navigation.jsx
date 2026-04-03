import { motion } from 'framer-motion'

const isFilm = (current) => current === 'film'

export default function Navigation({ current, onNavigate }) {
  const film = isFilm(current)

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        backgroundColor: film ? 'rgba(250,248,245,0.92)' : 'rgba(4,4,4,0.88)',
        borderBottom: film ? '1px solid #ede5d8' : '1px solid rgba(34,211,238,0.07)',
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-3 md:py-6 flex items-center justify-between">
        <motion.button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase cursor-pointer border-none bg-transparent min-h-[44px] min-w-[44px] px-1"
          style={{
            fontFamily: film
              ? "'Cormorant Garamond', Georgia, serif"
              : "'Space Grotesk', system-ui, sans-serif",
            color: film ? '#9a8a72' : '#22d3ee',
          }}
          whileHover={{ x: -4 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        >
          <span>&larr;</span> Index
        </motion.button>

        {/* Desktop: section label centred */}
        <span
          className="hidden md:block text-[11px] tracking-[0.45em] uppercase"
          style={{
            fontFamily: film
              ? "'Cormorant Garamond', Georgia, serif"
              : "'Space Grotesk', system-ui, sans-serif",
            color: film ? '#c4b49a' : '#374151',
          }}
        >
          {film ? 'Film / Analog' : 'Digital / Nature & Macro'}
        </span>

        {/* Mobile: brand name — absolute so it sits at exactly the container's horizontal centre
             regardless of the unequal widths of the ← Index button and the page-title label */}
        <span
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: '0.08em', color: film ? '#9a8a72' : '#22d3ee' }}
        >
          STEVEN MATSON
        </span>

        {/* Desktop: balance spacer */}
        <span className="hidden md:block w-14" />

        {/* Mobile: page title on the right */}
        <span
          className="md:hidden text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: film ? '#c4b49a' : '#374151',
          }}
        >
          {film ? 'Film' : 'Digital'}
        </span>
      </div>
    </header>
  )
}
