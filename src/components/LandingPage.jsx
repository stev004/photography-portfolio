import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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

// ─── Landing background images ───────────────────────────────────────────────
// Portrait-oriented images give the best bg-cover fill for the tall split panels.
// Swap the src string to preview a different shot — all candidates listed below.

// Film side — tall portraits, will be rendered in grayscale over warm white
// Options (tallest → least cropping):
//   /images/film/35mm/007-83bc7.jpg    1500×2602  ← current (tallest)
//   /images/film/35mm/0035-5f56c.jpg   1500×2403
//   /images/film/35mm/0019-cf3bf.jpg   1500×2347
//   /images/film/35mm/0023-0a6ee.jpg   1500×2263
//   /images/film/35mm/0018-d567d.jpg   1500×2263
//   /images/film/35mm/0036-64db3.jpg   1500×2263
//   /images/film/35mm/0017-5f108.jpg   1500×2190
//   /images/film/35mm/0013-94ba6.jpg   1500×2221
const filmBg = '/images/film/35mm/0017-5f108.jpg'

// Digital side — tall portrait macro shots, rendered at low opacity over near-black
// Options (tallest → least cropping):
//   /images/digital/macro/IMG_2338-Enhanced-NR.jpg  1500×2490  ← current (tallest)
//   /images/digital/macro/IMG_2305.jpg               1500×2446
//   /images/digital/macro/IMG_2307-Enhanced-NR.jpg   1500×2406
//   /images/digital/macro/IMG_2378-Enhanced-NR.jpg   1500×2358
//   /images/digital/macro/IMG_2239.jpg                1500×2398
//   /images/digital/macro/IMG_2383-Enhanced-NR.jpg   1500×2250
//   /images/digital/macro/IMG_2246.jpg                1500×2250
//   /images/digital/nature/IMG_0677.jpg               1500×2005
const digitalBg = '/images/digital/macro/IMG_2851-2-Enhanced-NR.jpg'

export default function LandingPage({ onEnter }) {
  const [hovered, setHovered] = useState(null)
  const isMobile = useIsMobile()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
    exit: { opacity: 0, transition: { duration: 0.4 } },
  }

  // Film text slides in from the left on mobile, up from below on desktop
  const filmText = {
    hidden: isMobile ? { opacity: 0, x: -28 } : { opacity: 0, y: 30 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
  }

  // Digital text slides in from the right on mobile, up from below on desktop
  const digitalText = {
    hidden: isMobile ? { opacity: 0, x: 28 } : { opacity: 0, y: 30 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
  }

  return (
    <motion.div
      className={`flex ${isMobile ? 'flex-col' : 'flex-row'} h-screen w-screen overflow-hidden`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* ─── FILM SIDE ─── */}
      <motion.div
        className="relative flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        animate={
          isMobile
            ? { height: '50%', width: '100%' }
            : { width: hovered === 'film' ? '58%' : hovered === 'digital' ? '42%' : '50%' }
        }
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        onMouseEnter={() => !isMobile && setHovered('film')}
        onMouseLeave={() => !isMobile && setHovered(null)}
        onClick={() => onEnter('film')}
        style={{ backgroundColor: '#faf8f5' }}
      >
        {/* CSS transition — avoids Framer Motion writing transform values every frame,
             which caused a visible glitch when crossing between the two panels. */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${filmBg})`,
            filter: 'grayscale(100%)',
            opacity: hovered === 'film' ? 0.22 : 0.09,
            transform: hovered === 'film' ? 'scale(1.05)' : 'scale(1)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            willChange: 'transform',
          }}
        />
        <div className="film-grain" />

        <motion.div className="relative z-10 text-center px-8 select-none" variants={filmText}>
          <motion.div
            className="mx-auto mb-8 h-px"
            style={{ backgroundColor: '#8b7355' }}
            animate={{ width: hovered === 'film' ? 80 : 48 }}
            transition={{ duration: 0.5 }}
          />

          <h1
            className="text-5xl md:text-7xl font-light tracking-wide"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1a1a1a' }}
          >
            Film
          </h1>

          <p
            className="mt-3 text-sm md:text-base tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#8b7355' }}
          >
            Analog Grain &amp; Texture
          </p>

          <motion.div
            className="mx-auto mt-8 h-px"
            style={{ backgroundColor: '#8b7355' }}
            animate={{ width: hovered === 'film' ? 80 : 48 }}
            transition={{ duration: 0.5 }}
          />

          <motion.span
            className="inline-block mt-10 text-xs tracking-[0.25em] uppercase"
            style={{ color: '#8b7355' }}
            animate={
              isMobile
                ? { opacity: [0.4, 0.9, 0.4], y: 0 }
                : { opacity: hovered === 'film' ? 1 : 0, y: hovered === 'film' ? 0 : 8 }
            }
            transition={
              isMobile
                ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }
                : { duration: 0.35 }
            }
          >
            {isMobile ? 'Tap to Enter' : 'Enter Gallery\u2002\u2192'}
          </motion.span>
        </motion.div>

        {!isMobile && (
          <div
            className="absolute right-0 top-0 h-full w-px"
            style={{ backgroundColor: '#e8e0d4' }}
          />
        )}
      </motion.div>

      {/* ─── DIGITAL SIDE ─── */}
      <motion.div
        className="relative flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        animate={
          isMobile
            ? { height: '50%', width: '100%' }
            : { width: hovered === 'digital' ? '58%' : hovered === 'film' ? '42%' : '50%' }
        }
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        onMouseEnter={() => !isMobile && setHovered('digital')}
        onMouseLeave={() => !isMobile && setHovered(null)}
        onClick={() => onEnter('digital')}
        style={{ backgroundColor: '#050505' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${digitalBg})`,
            opacity: hovered === 'digital' ? 0.25 : 0.08,
            transform: hovered === 'digital' ? 'scale(1.05)' : 'scale(1)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            willChange: 'transform',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.08,
            backgroundImage:
              'linear-gradient(rgba(34,211,238,.15) 1px,transparent 1px), linear-gradient(90deg,rgba(34,211,238,.15) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div className="relative z-10 text-center px-8 select-none" variants={digitalText}>
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            animate={{ opacity: hovered === 'digital' ? 1 : 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block w-8 h-px bg-cyan-400" />
            <span className="block w-2 h-2 border border-cyan-400 rotate-45" />
            <span className="block w-8 h-px bg-cyan-400" />
          </motion.div>

          <h1
            className="text-5xl md:text-7xl font-light tracking-wider"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: '#e0e0e0' }}
          >
            Digital
          </h1>

          <p
            className="mt-3 text-sm md:text-base tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: '#22d3ee' }}
          >
            Nature &amp; Macro
          </p>

          <motion.div
            className="flex items-center justify-center gap-3 mt-8"
            animate={{ opacity: hovered === 'digital' ? 1 : 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block w-8 h-px bg-cyan-400" />
            <span className="block w-2 h-2 border border-cyan-400 rotate-45" />
            <span className="block w-8 h-px bg-cyan-400" />
          </motion.div>

          <motion.span
            className="inline-block mt-10 text-xs tracking-[0.25em] uppercase"
            style={{ color: '#22d3ee' }}
            animate={
              isMobile
                ? { opacity: [0.4, 0.9, 0.4], y: 0 }
                : { opacity: hovered === 'digital' ? 1 : 0, y: hovered === 'digital' ? 0 : 8 }
            }
            transition={
              isMobile
                ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }
                : { duration: 0.35 }
            }
          >
            {isMobile ? 'Tap to Enter' : 'Enter Gallery\u2002\u2192'}
          </motion.span>
        </motion.div>

        {/* Corner accents */}
        <motion.span
          className="absolute top-6 left-6 w-10 h-10 border-l border-t border-cyan-400/30"
          animate={{ opacity: hovered === 'digital' ? 0.8 : 0.2 }}
        />
        <motion.span
          className="absolute bottom-6 right-6 w-10 h-10 border-r border-b border-cyan-400/30"
          animate={{ opacity: hovered === 'digital' ? 0.8 : 0.2 }}
        />
      </motion.div>
    </motion.div>
  )
}
