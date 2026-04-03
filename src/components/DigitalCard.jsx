import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const hudVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, staggerChildren: 0.05 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const hudLineVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
}

export default function DigitalCard({ photo, onSelect, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const [tapped, setTapped] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const hudVisible = (hovered || tapped) && loaded

  const handleClick = () => {
    if (isMobile) {
      if (!tapped) {
        // First tap: reveal the HUD
        setTapped(true)
      } else {
        // Second tap: open the lightbox (tap-to-expand / macro zoom)
        onSelect(photo)
      }
    } else {
      onSelect(photo)
    }
  }

  const handleDismiss = (e) => {
    e.stopPropagation()
    setTapped(false)
  }

  return (
    <div
      className="relative overflow-hidden cursor-pointer group"
      style={{
        // Desktop: fixed aspect-ratio so all cards sit at the same height in the grid
        aspectRatio: isMobile ? undefined : '3 / 4',
        // Mobile: exactly one screen tall (below nav + filter bar).
        //   height = 100svh − (mobileNav 56px + filterBar 68px) = 100svh − 124px
        //   Edge-to-edge (no radius, no margin) — snap handles the spacing.
        ...(isMobile ? { height: 'calc(100svh - 124px)' } : {}),
        marginBottom: 0,
        borderRadius: 0,
        minHeight: 180,
        // Desktop: snap:center, scrollMarginTop = filter bar height (68px)
        // Mobile:  snap:start, scrollMarginTop = nav + filter bar (124px)
        scrollSnapAlign: isMobile ? 'start' : 'center',
        scrollSnapStop: 'always',
        scrollMarginTop: isMobile ? 124 : 68,
      }}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onClick={handleClick}
    >
      {/* Skeleton — sits on top while image is loading */}
      {!loaded && (
        <div className="absolute inset-0 z-10 bg-[#1a1a1a] animate-pulse" />
      )}

      {/* Image — CSS-only transitions so the compositor thread handles scale/opacity
           without Framer Motion writing transform values mid-animation, which was
           causing scroll-snap to micro-correct on every frame (the "glitch"). */}
      <img
        src={photo.src}
        alt={photo.title}
        loading="lazy"
        className="w-full h-full block group-hover:scale-[1.06]"
        style={{
          objectFit:      photo.objectFit      || 'cover',
          objectPosition: photo.objectPosition || 'center',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          willChange: 'transform',
        }}
        onLoad={() => setLoaded(true)}
        draggable={false}
      />

      {/* Mobile "TAP" hint — shown when card is loaded but HUD is not yet revealed */}
      {isMobile && loaded && !tapped && (
        <div
          className="absolute bottom-2 right-2 font-mono text-[8px] tracking-widest pointer-events-none"
          style={{ color: 'rgba(0,229,255,0.45)' }}
        >
          TAP
        </div>
      )}

      {/* HUD overlay */}
      <AnimatePresence>
        {hudVisible && (
          <motion.div
            className="absolute inset-0 flex flex-col justify-end"
            style={{
              background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.2) 45%, transparent 70%)',
            }}
            variants={hudVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-4">
              {/* Subject */}
              <motion.p
                variants={hudLineVariants}
                className="font-mono text-[9px] uppercase tracking-widest mb-3"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {photo.subject}
              </motion.p>

              {/* Spec grid — full labels on mobile, abbreviated on desktop */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                {[
                  [isMobile ? 'Lens'         : 'LN',  photo.lens],
                  [isMobile ? 'Shutter'      : 'SH',  photo.shutter],
                  [isMobile ? 'Aperture'     : 'AP',  `f/${photo.aperture.replace('f/', '')}`],
                  [isMobile ? 'ISO'          : 'ISO', photo.iso],
                ].map(([label, val]) => (
                  <motion.div key={label} variants={hudLineVariants} className="flex flex-col gap-0.5">
                    <span
                      className="font-mono uppercase tracking-widest"
                      style={{ fontSize: isMobile ? 9 : 8, color: 'rgba(255,255,255,0.28)' }}
                    >
                      {label}
                    </span>
                    <span className="font-mono text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {val}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Footer row */}
              <motion.div
                variants={hudLineVariants}
                className="flex items-center justify-between pt-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="font-mono text-[9px] tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {photo.title}
                </span>
                <span className="font-mono text-[9px] tracking-widest" style={{ color: 'rgba(0,229,255,0.55)' }}>
                  {photo.stack}
                </span>
              </motion.div>

              {/* Mobile: expand hint + CLOSE button pinned to bottom-center */}
              {isMobile && (
                <>
                  <motion.p
                    variants={hudLineVariants}
                    className="font-mono text-[8px] uppercase tracking-widest mt-3 text-center"
                    style={{ color: 'rgba(0,229,255,0.35)' }}
                  >
                    Tap again to expand
                  </motion.p>
                  <motion.button
                    variants={hudLineVariants}
                    onClick={handleDismiss}
                    className="w-full mt-3 font-mono text-[10px] uppercase tracking-widest py-2.5 flex items-center justify-center"
                    style={{
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 2,
                      color: 'rgba(255,255,255,0.45)',
                      background: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    Close
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner ticks (always subtle) */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l pointer-events-none transition-opacity duration-300"
        style={{ borderColor: hudVisible ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }} />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r pointer-events-none transition-opacity duration-300"
        style={{ borderColor: hudVisible ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }} />
    </div>
  )
}
