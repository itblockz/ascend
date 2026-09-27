import { motion } from 'framer-motion'
import { useState } from 'react'
import { SectionHeader } from '../components/ui'
import { VALUES } from '../content'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'

export function ValuesSection() {
  const { t, lang } = useLang()
  const [active, setActive] = useState(0)

  return (
    <section id="values" className="relative overflow-hidden bg-brand-black py-36">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_bottom,rgb(0_229_255/0.1),transparent_70%)]" />
      <div className="section-shell relative">
        <SectionHeader badge={t(VALUES.badge)} title={<span className="text-gradient-brand">{t(VALUES.title)}</span>} />

        {/* desktop: letters expand on hover */}
        <div className="mt-20 hidden h-[26rem] gap-3 lg:flex">
          {VALUES.items.map((v, i) => {
            const on = i === active
            return (
              <motion.button
                key={v.letter}
                type="button"
                layout
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={on}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ flex: on ? 4 : 1 }}
                className={`glass relative flex flex-col overflow-hidden rounded-3xl p-6 text-left transition-colors ${on ? 'border-brand-cyan/40' : ''}`}
              >
                {/* ascending step: each letter sits a little higher than the last */}
                <span
                  className={`font-display leading-none font-bold transition-all duration-500 ${on ? 'text-8xl text-gradient-brand' : 'text-6xl text-slate-600'}`}
                  style={{ marginTop: on ? 0 : `${(5 - i) * 2.2}rem` }}
                >
                  {v.letter}
                </span>
                <motion.div
                  initial={false}
                  animate={{ opacity: on ? 1 : 0, y: on ? 0 : 16 }}
                  transition={{ duration: 0.45, ease: EASE, delay: on ? 0.15 : 0 }}
                  className="mt-auto min-w-[16rem]"
                >
                  <p className="font-display text-2xl font-semibold text-white">{v.name}</p>
                  {lang === 'th' && <p className="text-sm text-brand-cyan">{v.th}</p>}
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">{t(v.body)}</p>
                </motion.div>
                {!on && <span className="mt-auto font-mono text-xs tracking-[0.2em] text-slate-600 [writing-mode:vertical-rl]">{v.name.toUpperCase()}</span>}
              </motion.button>
            )
          })}
        </div>

        {/* mobile / tablet: stacked cards */}
        <ul className="mt-16 grid gap-3 sm:grid-cols-2 lg:hidden">
          {VALUES.items.map((v, i) => (
            <motion.li
              key={v.letter}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 2) * 0.08 }}
              className="glass flex gap-5 rounded-3xl p-6"
            >
              <span className="font-display text-5xl leading-none font-bold text-gradient-brand">{v.letter}</span>
              <div>
                <p className="font-display text-lg font-semibold text-white">{v.name}</p>
                {lang === 'th' && <p className="text-sm text-brand-cyan">{v.th}</p>}
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{t(v.body)}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
