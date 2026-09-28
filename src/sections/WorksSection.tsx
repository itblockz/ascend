import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { SectionHeader } from '../components/ui'
import { WORKS, type WorkCategory } from '../content'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'

type Filter = WorkCategory | 'all'

const INITIAL = 9

const CAT_LABEL = Object.fromEntries(WORKS.filters.map((f) => [f.id, f.label])) as Record<Filter, (typeof WORKS.filters)[number]['label']>

export function WorksSection() {
  const { t } = useLang()
  const [filter, setFilter] = useState<Filter>('all')
  const [expanded, setExpanded] = useState(false)

  const matching = WORKS.items.filter((w) => filter === 'all' || (w.cats as readonly WorkCategory[]).includes(filter))
  const visible = expanded ? matching : matching.slice(0, INITIAL)

  return (
    <section id="works" className="relative overflow-hidden bg-brand-black py-36">
      <div className="section-shell">
        <SectionHeader badge={t(WORKS.badge)} title={t(WORKS.title)} lead={t(WORKS.lead)} />

        <div role="group" aria-label={t(WORKS.badge)} className="mt-14 flex flex-wrap justify-center gap-2">
          {WORKS.filters.map((f) => {
            const on = f.id === filter
            const count = f.id === 'all' ? WORKS.items.length : WORKS.items.filter((w) => (w.cats as readonly string[]).includes(f.id)).length
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setFilter(f.id)
                  setExpanded(false)
                }}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  on ? 'border-white bg-white text-brand-black' : 'border-white/15 text-slate-300 hover:border-white/40 hover:text-white'
                }`}
              >
                {t(f.label)}
                <span className={`ml-2 font-mono text-xs ${on ? 'text-slate-500' : 'text-slate-600'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        <motion.ul layout className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((w) => (
              <motion.li
                key={w.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="glass flex flex-col rounded-3xl p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-xs tracking-[0.14em] text-slate-500 uppercase">{w.cats.map((c) => t(CAT_LABEL[c])).join(' · ')}</p>
                  {'year' in w && w.year && <span className="shrink-0 font-mono text-xs text-slate-500">{w.year}</span>}
                </div>
                <h3 className="mt-4 font-display text-lg leading-snug font-semibold text-white">{w.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{t(w.client)}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">{t(w.body)}</p>
                {'ongoing' in w && w.ongoing && (
                  <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 font-mono text-[11px] tracking-[0.1em] text-slate-300 uppercase">
                    <span className="size-1.5 rounded-full bg-white/70" />
                    {t(WORKS.ongoing)}
                  </span>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {matching.length > INITIAL && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              {expanded ? t(WORKS.showLess) : `${t(WORKS.showAll)} (${matching.length})`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
