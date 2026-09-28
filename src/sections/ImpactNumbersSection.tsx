import { animate, motion, useInView } from 'framer-motion'
import { Clock, Landmark, ScanLine, Users, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SectionHeader } from '../components/ui'
import { IMPACT } from '../content'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'

const ICONS: LucideIcon[] = [Users, Landmark, ScanLine, Clock]

function CountUp({ value, prefix = '', suffix }: { value: number; prefix?: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [v, setV] = useState(0)

  useEffect(() => {
    if (!inView) return
    const c = animate(0, value, { duration: 2, ease: EASE, onUpdate: setV })
    return () => c.stop()
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {Math.round(v).toLocaleString('en-US')}
      <span className="text-slate-500">{suffix}</span>
    </span>
  )
}

export function ImpactNumbersSection() {
  const { t } = useLang()
  return (
    <section id="impact" className="relative overflow-hidden bg-brand-black py-36">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-white/10" />
      <div className="section-shell">
        <SectionHeader badge={t(IMPACT.badge)} title={<span className="text-gradient-brand">{t(IMPACT.title)}</span>} />

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT.stats.map((m, i) => {
            const Icon = ICONS[i]
            return (
              <motion.article
                key={m.label.en}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
                className="glass relative overflow-hidden rounded-3xl p-7"
              >
                <Icon size={22} className="relative text-slate-500" />
                <p className="relative mt-10 font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">
                  <CountUp value={m.value} prefix={m.prefix} suffix={m.suffix} />
                </p>
                <p className="relative mt-4 text-sm leading-relaxed text-slate-400">{t(m.label)}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
