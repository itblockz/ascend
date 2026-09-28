import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { ImageSlot } from '../components/Placeholder'
import { SectionHeader } from '../components/ui'
import { GLOBAL_STAGE } from '../content'
import { useLang } from '../i18n/LangContext'
import { ASSETS } from '../lib/assets'
import { EASE } from '../lib/motion'

const TONES = ['cyan', 'blue', 'teal'] as const

export function GlobalStageSection() {
  const { t } = useLang()
  const [tall, ...stacked] = GLOBAL_STAGE.cards

  const card = (c: (typeof GLOBAL_STAGE.cards)[number], i: number, className: string) => (
    <motion.div
      key={c.key}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1, ease: EASE, delay: i * 0.12 }}
      className={className}
    >
      <ImageSlot src={ASSETS[c.key]} alt={t(c.title)} tone={TONES[i]} className="group size-full rounded-[2rem]">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-black/90 via-brand-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
          <p className="flex items-center gap-1.5 font-mono text-xs tracking-[0.22em] text-slate-300">
            <MapPin size={13} />
            {c.kicker}
          </p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-white md:text-3xl">{t(c.title)}</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-300">{t(c.body)}</p>
        </div>
      </ImageSlot>
    </motion.div>
  )

  return (
    <section id="global" className="relative overflow-hidden bg-brand-black py-36">
      <div className="section-shell">
        <SectionHeader badge={t(GLOBAL_STAGE.badge)} title={<span className="text-gradient-brand">{t(GLOBAL_STAGE.title)}</span>} />
        <div className="mt-20 grid gap-4 md:grid-cols-2">
          {card(tall, 0, 'h-[28rem] md:h-[42rem]')}
          <div className="grid gap-4">
            {stacked.map((c, i) => card(c, i + 1, 'h-[20rem] md:h-auto'))}
          </div>
        </div>
      </div>
    </section>
  )
}
