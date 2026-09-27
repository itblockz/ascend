import { ABOUT } from '../content'
import { useLang } from '../i18n/LangContext'
import { Modal } from './Modal'

export function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang()
  return (
    <Modal open={open} onClose={onClose} title={t(ABOUT.title)} wide>
      <p className="text-base leading-relaxed text-slate-300">{t(ABOUT.intro)}</p>

      <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ABOUT.facts.map((f) => (
          <div key={f.label.en} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <dt className="font-mono text-xs tracking-[0.16em] text-slate-500 uppercase">{t(f.label)}</dt>
            <dd className="mt-2 text-sm font-semibold text-white">{t(f.value)}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-10 font-mono text-xs tracking-[0.22em] text-brand-cyan uppercase">{t(ABOUT.leadersTitle)}</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {ABOUT.leaders.map((l) => (
          <li key={l.role} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <span className="font-display text-2xl font-semibold text-gradient-brand">{l.role}</span>
            <p className="mt-3 text-sm font-semibold text-white">{t(l.name)}</p>
            <p className="mt-1 text-xs text-slate-400">{t(l.title)}</p>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
