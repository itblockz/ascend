import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { ChevronStage } from '../components/ChevronStage'
import { Badge, PrimaryButton } from '../components/ui'
import { JOIN, UI } from '../content'
import { useLang } from '../i18n/LangContext'
import { extLink, LINKS } from '../lib/links'
import { EASE } from '../lib/motion'

export function JoinCTASection({ onJoin }: { onJoin: () => void }) {
  const { t } = useLang()
  return (
    <section id="join" className="relative overflow-hidden bg-white py-36 text-brand-black">
      <div className="section-shell grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative mx-auto aspect-square w-full max-w-[32rem]"
        >
          <span className="absolute inset-0 rounded-full border border-slate-200" />
          <span className="absolute inset-[8%] rounded-full border border-dashed border-slate-200" />
          <div className="absolute inset-[14%] overflow-hidden rounded-full bg-white shadow-[0_40px_100px_-40px_rgb(6_11_20/0.18)] ring-1 ring-slate-200">
            <ChevronStage scene="loop" className="" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <Badge tone="light">{t(JOIN.badge)}</Badge>
          <h2 className="mt-6 font-display text-5xl leading-[1.02] font-semibold tracking-tight md:text-7xl">
            <span className="text-gradient-blue">{t(JOIN.title)}</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-500 md:text-lg">{t(JOIN.lead)}</p>

          <dl className="mt-10 grid grid-cols-3 gap-3">
            {JOIN.facts.map((f) => (
              <div key={f.value} className="glass-light rounded-2xl p-4">
                <dt className="text-xs text-slate-500">{t(f.label)}</dt>
                <dd className="mt-1 font-display text-lg leading-tight font-semibold md:text-2xl">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <PrimaryButton tone="light" onClick={onJoin}>
              {t(JOIN.cta)} <ArrowUpRight size={16} />
            </PrimaryButton>
            <a
              {...extLink(LINKS.virtualOffice)}
              className="rounded-md border border-slate-300 px-6 py-3.5 text-sm font-medium text-brand-black transition-colors hover:bg-slate-100"
            >
              {t(UI.visitVirtualOffice)}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
