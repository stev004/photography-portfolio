import { motion } from 'framer-motion'

const rise = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

// Value is a string (rendered inline) or an array (stacked, one per line).
const kit = [
  ['Digital', 'Canon R7 · Canon 200D'],
  [
    'Lenses',
    'Laowa 100mm CA-Dreamer 2× macro · Laowa 25mm f/2.8 2.5-5× ultra macro · Sigma 18-200mm f/3.5-6.3 DC OS HSM · Reversed 24mm EF-S STM',
  ],
  ['Film', 'Nikon F2 · Olympus mju-II'],
  ['Stocks', 'Portra 400 · ColorPlus 200 · Gold 200 · Fujicolor 200 · CineStill 800T'],
]

export default function About() {
  return (
    <div className="mx-auto max-w-site px-5 md:px-10">
      <div className="grid gap-12 border-b border-line py-12 md:grid-cols-12 md:py-20">
        <motion.div {...rise} className="md:col-span-7">
          <p className="label text-moss">About</p>
          <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-6xl">
            Steven Matson
          </h1>
          <div className="mt-8 max-w-xl space-y-5 text-[15px] leading-relaxed text-ink-soft md:text-base">
            <p>
              I photograph small things, mostly in Jersey, Channel Islands -
              spiders and other invertebrates at macro scale, the plants and
              places around them, and whatever else the island offers.
            </p>
            <p>
              Alongside the macro work I keep a 35mm film log: streets, travel,
              and cars, shot on a Nikon F2 and an Olympus mju-II.
            </p>
          </div>

          <div className="mt-10 border-t border-line">
            {kit.map(([k, v]) => (
              <div
                key={k}
                className="flex flex-col gap-1 border-b border-line py-4 md:flex-row md:gap-8"
              >
                <span className="label w-24 shrink-0 pt-0.5 text-ink-soft">{k}</span>
                {Array.isArray(v) ? (
                  <div className="space-y-1.5">
                    {v.map((item) => (
                      <p key={item} className="font-mono text-[13px] leading-snug text-ink">
                        {item}
                      </p>
                    ))}
                  </div>
                ) : (
                  <span className="font-mono text-[13px] text-ink">{v}</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10">
            <p className="label text-ink-soft">Contact</p>
            <a
              href="mailto:s.matson007@gmail.com"
              className="mt-2 inline-block font-display text-xl font-light tracking-tight underline decoration-moss underline-offset-4 transition-colors hover:text-moss md:text-2xl"
            >
              s.matson007@gmail.com
            </a>
          </div>
        </motion.div>

        <motion.div
          {...rise}
          transition={{ ...rise.transition, delay: 0.1 }}
          className="md:col-span-5"
        >
          <div className="overflow-hidden bg-parchment">
            <img
              src="/images/digital/macro/IMG_2861-2.jpg"
              alt="King cobra"
              className="w-full object-cover"
              style={{ aspectRatio: '1333 / 2000' }}
            />
          </div>
          <div className="pt-3">
            <p className="text-sm">
              King cobra - <span className="binomial text-ink-soft">Ophiophagus hannah</span>
            </p>
            <p className="label mt-1 text-ink-soft">18-200mm · f/6.3</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
