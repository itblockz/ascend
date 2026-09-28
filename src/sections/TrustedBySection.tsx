import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SectionHeader } from '../components/ui'
import { TRUSTED } from '../content'
import { useLang } from '../i18n/LangContext'
import { logoPath } from '../lib/assets'
import { EASE } from '../lib/motion'

function PartnerLogo({ id, name }: { id: string; name: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className="flex h-16 shrink-0 items-center px-8 md:px-12">
      {failed ? (
        <span className="font-display text-lg font-semibold tracking-wide whitespace-nowrap text-slate-500 transition-colors hover:text-white md:text-xl">{name}</span>
      ) : (
        <img src={logoPath(id)} alt={name} onError={() => setFailed(true)} className="h-9 w-auto opacity-60 brightness-0 invert transition-opacity hover:opacity-100" />
      )}
    </span>
  )
}

export function TrustedBySection() {
  const { t } = useLang()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = TRUSTED.cases.length
  const current = TRUSTED.cases[index]

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % n), 6500)
    return () => window.clearInterval(id)
  }, [paused, n])

  return (
    <section id="trusted" className="relative overflow-hidden bg-brand-black py-36">
      <div className="section-shell">
        <SectionHeader badge={t(TRUSTED.badge)} title={t(TRUSTED.title)} />
      </div>

      {/* partner marquee */}
      <div className="relative mt-16 overflow-hidden border-y border-white/8 py-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee flex w-max">
          {[...TRUSTED.partners, ...TRUSTED.partners].map((p, i) => (
            <PartnerLogo key={`${p.id}-${i}`} id={p.id} name={p.name} />
          ))}
        </div>
      </div>

      {/* case highlights */}
      <div className="section-shell mt-16">
        <div
          className="glass relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] p-8 md:p-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative min-h-64 md:min-h-56" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.article
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <p className="text-xs tracking-[0.12em] text-slate-500 uppercase">{t(current.tag)}</p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-white text-balance md:text-3xl">{t(current.title)}</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-300">{t(current.body)}</p>
                <p className="mt-6 text-sm font-medium text-slate-500">{t(current.meta)}</p>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="relative mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {TRUSTED.cases.map((c, i) => (
                <button
                  key={c.title.en}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={t(c.title)}
                  aria-current={i === index}
                  className={`h-0.5 transition-all duration-500 ${i === index ? 'w-10 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIndex((i) => (i - 1 + n) % n)}
                aria-label="Previous"
                className="grid size-11 place-items-center rounded-md border border-white/15 text-white transition-colors hover:bg-white/10"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % n)}
                aria-label="Next"
                className="grid size-11 place-items-center rounded-md border border-white/15 text-white transition-colors hover:bg-white/10"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
