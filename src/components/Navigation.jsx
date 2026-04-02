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
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-3 md:py-6 flex items-center justify-between">
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

        <span
          className="text-[11px] tracking-[0.45em] uppercase"
          style={{
            fontFamily: film
              ? "'Cormorant Garamond', Georgia, serif"
              : "'Space Grotesk', system-ui, sans-serif",
            color: film ? '#c4b49a' : '#374151',
          }}
        >
          {film ? 'Film / Analog' : 'Digital / Nature & Macro'}
        </span>

        <span className="w-14" />
      </div>
    </header>
  )
}
