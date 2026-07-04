import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { plates, frames } from '../data/archive'

const rise = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

function ChoicePanel({ to, index, title, note, count, image, position, hovered, onHover, id }) {
  const dim = hovered !== null && hovered !== id
  return (
    <motion.div
      animate={{ flexGrow: hovered === id ? 1.25 : 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 26 }}
      className="relative min-h-[42vh] flex-1 basis-0 md:min-h-0"
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link to={to} className="group absolute inset-0 block overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] ${
            dim ? 'opacity-60' : 'opacity-100'
          }`}
          style={{ objectPosition: position }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/25" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-paper md:p-10">
          <p className="label text-paper/70">{index}</p>
          <h2 className="mt-3 font-display text-4xl font-light tracking-tight md:text-6xl">
            {title}
          </h2>
          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-paper/25 pt-4">
            <p className="max-w-sm text-sm leading-relaxed text-paper/75">{note}</p>
            <p className="label whitespace-nowrap text-paper/90">
              {count} <span className="transition-transform duration-300 group-hover:translate-x-1 inline-block">→</span>
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Home() {
  const [hovered, setHovered] = useState(null)

  return (
    <div>
      {/* Split entry: the archive's two collections */}
      <section className="flex flex-col md:h-[calc(100vh-69px)] md:min-h-[560px] md:flex-row">
        <ChoicePanel
          id="digital"
          to="/digital"
          index="No. 01 - Digital"
          title="Digital"
          note="Macro & natural history - arachnids, reptiles and flora, identified where possible."
          count={`${plates.length} frames`}
          image="/images/digital/macro/IMG_2851-2-Enhanced-NR.jpg"
          position="70% 62%"
          hovered={hovered}
          onHover={setHovered}
        />
        <ChoicePanel
          id="film"
          to="/film"
          index="No. 02 - Analogue"
          title="Film"
          note="35mm on Portra, ColorPlus, Gold and CineStill - streets, travel and the occasional racing car."
          count={`${frames.length} frames`}
          image="/images/film/35mm/0017-5f108.jpg"
          position="50% 55%"
          hovered={hovered}
          onHover={setHovered}
        />
      </section>

      {/* Statement */}
      <motion.section
        {...rise}
        className="mx-auto flex max-w-site flex-col gap-6 px-5 py-14 md:flex-row md:items-baseline md:justify-between md:px-10 md:py-20"
      >
        <div>
          <p className="label text-moss">Matson Studios - Jersey, Channel Islands</p>
          <p className="mt-5 max-w-2xl font-display text-2xl font-light leading-snug tracking-tight md:text-3xl">
            Photographs made in the field, mostly in Jersey - informed by a
            background in biology and a habit of looking under things.
          </p>
        </div>
        <Link
          to="/about"
          className="label whitespace-nowrap text-moss transition-colors hover:text-ink"
        >
          About the photographer →
        </Link>
      </motion.section>
    </div>
  )
}
