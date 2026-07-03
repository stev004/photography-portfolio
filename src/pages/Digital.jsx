import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { plates, plateTaxa } from '../data/archive'
import Lightbox from '../components/Lightbox'
import useScrollSnap, { snapTarget, snapStart } from '../hooks/useScrollSnap'

function dataLine(p) {
  const parts = [p.lens, p.aperture, p.shutter, `ISO ${p.iso}`]
  if (p.stack && p.stack !== '1 frame') parts.push(p.stack.replace(' frames', '-frame stack'))
  return parts.filter(Boolean).join(' · ')
}

function Plate({ plate, onOpen }) {
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
          src={plate.src}
          alt={plate.common || plate.title}
          loading="lazy"
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={{
            objectFit: plate.objectFit || 'cover',
            objectPosition: plate.objectPosition || '50% 50%',
          }}
        />
      </button>
      <figcaption className="border-b border-dark-line pb-4 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[15px] font-medium text-dark-text">{plate.common || plate.title}</p>
          <p className="label text-dark-soft">Pl. {plate.number}</p>
        </div>
        {plate.latin && <p className="binomial mt-0.5 text-sm text-dark-soft">{plate.latin}</p>}
        <p className="label mt-2 !tracking-[0.08em] text-dark-soft">{dataLine(plate)}</p>
      </figcaption>
    </motion.figure>
  )
}

export default function Digital() {
  const [taxon, setTaxon] = useState('All')
  const [open, setOpen] = useState(null)
  useScrollSnap()

  const visible = useMemo(
    () => (taxon === 'All' ? plates : plates.filter((p) => p.taxon === taxon)),
    [taxon]
  )

  return (
    <div className="mx-auto max-w-site px-5 text-dark-text md:px-10">
      <section style={snapStart} className="border-b border-dark-line pb-8 pt-12 md:pb-10 md:pt-20">
        <p className="label text-ochre">No. 01 - Digital</p>
        <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-6xl">
          Digital Archive
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-dark-soft md:text-base">
          Close studies of arachnids, reptiles and flora. Species identified
          where possible; capture settings recorded on every plate.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {plateTaxa.map((t) => {
            const n = t === 'All' ? plates.length : plates.filter((p) => p.taxon === t).length
            return (
              <button
                key={t}
                onClick={() => setTaxon(t)}
                className={`label min-h-[44px] transition-colors ${
                  taxon === t
                    ? 'text-dark-text underline decoration-ochre underline-offset-8'
                    : 'text-dark-soft hover:text-dark-text'
                }`}
              >
                {t} <span className="text-ochre">{n}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-x-6 gap-y-10 py-10 sm:grid-cols-2 md:py-14 lg:grid-cols-3">
        {visible.map((p) => (
          <Plate key={p.id} plate={p} onOpen={() => setOpen(visible.indexOf(p))} />
        ))}
      </section>

      <Lightbox
        items={visible}
        index={open}
        onClose={() => setOpen(null)}
        onIndex={setOpen}
        renderCaption={(p) => (
          <>
            <p className="text-sm text-paper">
              {p.common || p.title}
              {p.latin && <span className="binomial text-paper/60"> - {p.latin}</span>}
            </p>
            <p className="label mt-2 !tracking-[0.08em] text-paper/50">{dataLine(p)}</p>
          </>
        )}
      />
    </div>
  )
}
