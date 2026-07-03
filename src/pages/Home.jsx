import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { plates, frames } from '../data/archive'

const rise = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

function CollectionCard({ to, index, title, note, count, cover, ratio }) {
  return (
    <Link to={to} className="group block">
      <div className="overflow-hidden bg-parchment" style={{ aspectRatio: '4 / 3' }}>
        <img
          src={cover}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={{ objectPosition: ratio }}
        />
      </div>
      <div className="flex items-baseline justify-between border-b border-line pb-4 pt-5">
        <div>
          <p className="label text-ink-soft">{index}</p>
          <h3 className="mt-2 font-display text-2xl font-medium tracking-tight md:text-3xl">
            {title}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{note}</p>
        </div>
        <p className="label whitespace-nowrap text-ink-soft">
          {count} <span className="text-moss">→</span>
        </p>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <div className="mx-auto max-w-site px-5 md:px-10">
      {/* Hero */}
      <section className="border-b border-line pb-14 pt-16 md:pb-20 md:pt-28">
        <motion.p {...rise} className="label text-moss">
          Field Archive — Jersey, Channel Islands
        </motion.p>
        <motion.h1
          {...rise}
          transition={{ ...rise.transition, delay: 0.08 }}
          className="mt-6 max-w-4xl font-display text-5xl font-light leading-[1.02] tracking-tight md:text-7xl lg:text-8xl"
        >
          Small lives,
          <br />
          quiet places.
        </motion.h1>
        <motion.p
          {...rise}
          transition={{ ...rise.transition, delay: 0.16 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg"
        >
          Macro photography, natural history and 35mm film. Species identified
          where possible; settings recorded per plate.
        </motion.p>
      </section>

      {/* Feature plate */}
      <motion.section {...rise} className="border-b border-line py-10 md:py-14">
        <div className="overflow-hidden bg-parchment">
          <img
            src="/images/digital/macro/IMG_2961-Enhanced-NR.jpg"
            alt="Jumping spider, Salticidae"
            className="w-full object-cover"
            style={{ aspectRatio: '2000 / 1333' }}
          />
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 pt-4">
          <p className="text-sm">
            Jumping spider — <span className="binomial text-ink-soft">Salticidae</span>
          </p>
          <p className="label text-ink-soft">Laowa 100mm · f/16 · 1/125 · ISO 400</p>
        </div>
      </motion.section>

      {/* Collections */}
      <section className="py-14 md:py-20">
        <motion.p {...rise} className="label text-ink-soft">
          Collections
        </motion.p>
        <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-10">
          <motion.div {...rise}>
            <CollectionCard
              to="/specimens"
              index="No. 01"
              title="Specimen Archive"
              note="Macro and natural history in digital — arachnids, reptiles and flora, photographed close and identified where possible."
              count={`${plates.length} plates`}
              cover="/images/digital/macro/IMG_2378-Enhanced-NR.jpg"
              ratio="50% 30%"
            />
          </motion.div>
          <motion.div {...rise} transition={{ ...rise.transition, delay: 0.1 }}>
            <CollectionCard
              to="/film"
              index="No. 02"
              title="Film Log"
              note="35mm on Portra, ColorPlus, Gold and CineStill — streets, travel and the occasional racing car."
              count={`${frames.length} frames`}
              cover="/images/film/35mm/0023-0a6ee.jpg"
              ratio="50% 60%"
            />
          </motion.div>
        </div>
      </section>

      {/* Note */}
      <motion.section
        {...rise}
        className="flex flex-col gap-6 border-t border-line py-14 md:flex-row md:items-baseline md:justify-between md:py-20"
      >
        <p className="max-w-2xl font-display text-2xl font-light leading-snug tracking-tight md:text-3xl">
          Photographs made in the field, mostly in Jersey — informed by a
          background in biology and a habit of looking under things.
        </p>
        <Link to="/about" className="label whitespace-nowrap text-moss transition-colors hover:text-ink">
          About the photographer →
        </Link>
      </motion.section>
    </div>
  )
}
