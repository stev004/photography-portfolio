import { useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Lightbox({ items, index, onClose, onIndex, renderCaption }) {
  const item = index != null ? items[index] : null

  const step = useCallback(
    (dir) => {
      if (index == null) return
      onIndex((index + dir + items.length) % items.length)
    },
    [index, items.length, onIndex]
  )

  useEffect(() => {
    if (item == null) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose, step])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-8">
            <span className="label text-paper/60">
              {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <button
              onClick={onClose}
              className="label min-h-[44px] min-w-[44px] text-paper/60 transition-colors hover:text-paper"
              aria-label="Close"
            >
              Close ✕
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-5 md:px-20">
            <motion.img
              key={item.src}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              src={item.src}
              alt={item.title}
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); step(-1) }}
              className="absolute left-0 top-1/2 hidden h-24 w-16 -translate-y-1/2 items-center justify-center font-mono text-xl text-paper/40 transition-colors hover:text-paper md:flex"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(1) }}
              className="absolute right-0 top-1/2 hidden h-24 w-16 -translate-y-1/2 items-center justify-center font-mono text-xl text-paper/40 transition-colors hover:text-paper md:flex"
              aria-label="Next"
            >
              →
            </button>
          </div>

          <div
            className="mx-auto w-full max-w-3xl px-5 pb-6 pt-4 text-center md:pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {renderCaption(item)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
