import { ArrowUpRight } from 'lucide-react'
import { JOIN_MODAL, UI } from '../content'
import { useLang } from '../i18n/LangContext'
import { extLink, LINKS } from '../lib/links'
import { Modal } from './Modal'

export function JoinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang()
  const formReady = LINKS.coWorkingForm !== '#'
  return (
    <Modal open={open} onClose={onClose} title={t(JOIN_MODAL.title)} wide>
      <p className="text-base leading-relaxed text-slate-300">{t(JOIN_MODAL.intro)}</p>

      <ol className="mt-8 grid gap-3 sm:grid-cols-2">
        {JOIN_MODAL.steps.map((s) => (
          <li key={s.title.en} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <div>
              <p className="text-sm font-semibold text-white">{t(s.title)}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{t(s.body)}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          {...extLink(LINKS.coWorkingForm)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-semibold text-brand-black transition-opacity hover:opacity-85"
        >
          {t(JOIN_MODAL.apply)}
          <ArrowUpRight size={16} />
        </a>
        <a
          {...extLink(LINKS.careers)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
        >
          {t(JOIN_MODAL.roles)}
        </a>
      </div>
      {!formReady && <p className="mt-3 text-center text-xs text-slate-500">{t(UI.comingSoon)}</p>}
    </Modal>
  )
}
