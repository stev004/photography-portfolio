import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { frames, filmStocks } from '../data/archive'
import Lightbox from '../components/Lightbox'
import useScrollSnap, { snapTarget } from '../hooks/useScrollSnap'

function Frame({ frame, onOpen }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group"
      style={snapTarget}
    >
      <button
        onClick={onOpen}
        className="block aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-dark-2 text-left"
      >
        <img
          src={frame.src}
          alt={frame.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </button>
      <figcaption className="border-b border-dark-line pb-4 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[15px] font-medium text-dark-text">{frame.title}</p>
          <p className="label text-dark-soft">Fr. {frame.number}</p>
        </div>
        <p className="label mt-2 !tracking-[0.08em] text-dark-soft">
          {frame.stock} · {frame.year}
        </p>
      </figcaption>
    </motion.figure>
  )
}

export default function FilmLog() {
  const [stock, setStock] = useState('All')
  const [open, setOpen] = useState(null)
  useScrollSnap()

  const visible = useMemo(
    () => (stock === 'All' ? frames : frames.filter((f) => f.stock === stock)),
    [stock]
  )

  return (
    <div className="mx-auto max-w-site px-5 text-dark-text md:px-10">
      <section className="border-b border-dark-line pb-8 pt-12 md:pb-10 md:pt-20">
        <p className="label text-ochre">No. 02 - Analogue</p>
        <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-6xl">
          Film Log
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-dark-soft md:text-base">
          35mm frames from Jersey and elsewhere - streets, travel and the
          occasional racing car. Logged by stock and year.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {filmStocks.map((s) => {
            const n = s === 'All' ? frames.length : frames.filter((f) => f.stock === s).length
            return (
              <button
                key={s}
                onClick={() => setStock(s)}
                className={`label min-h-[44px] transition-colors ${
                  stock === s
                    ? 'text-dark-text underline decoration-ochre underline-offset-8'
                    : 'text-dark-soft hover:text-dark-text'
                }`}
              >
                {s} <span className="text-ochre">{n}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-x-6 gap-y-10 py-10 sm:grid-cols-2 md:py-14 lg:grid-cols-3">
        {visible.map((f) => (
          <Frame key={f.id} frame={f} onOpen={() => setOpen(visible.indexOf(f))} />
        ))}
      </section>

      <Lightbox
        items={visible}
        index={open}
        onClose={() => setOpen(null)}
        onIndex={setOpen}
        renderCaption={(f) => (
          <>
            <p className="text-sm text-paper">{f.title}</p>
            <p className="label mt-2 !tracking-[0.08em] text-paper/50">
              35mm · {f.stock} · {f.year}
            </p>
          </>
        )}
      />
    </div>
  )
}
