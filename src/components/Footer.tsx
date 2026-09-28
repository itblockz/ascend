import { ArrowUpRight, MapPin, MonitorSmartphone } from 'lucide-react'
import { FOOTER, UI } from '../content'
import { useLang } from '../i18n/LangContext'
import { extLink, LINKS } from '../lib/links'
import { LogoLockup } from './Brand'

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-t border-white/8 bg-brand-black py-16">
      <div className="section-shell grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <LogoLockup className="text-white" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">{t(FOOTER.tagline)}</p>
        </div>
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-slate-500 uppercase">{t(FOOTER.addressTitle)}</p>
          <p className="mt-4 flex gap-2 text-sm leading-relaxed text-slate-300">
            <MapPin size={16} className="mt-0.5 shrink-0 text-slate-500" />
            {t(FOOTER.address)}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-slate-500 uppercase">{t(FOOTER.virtualTitle)}</p>
          <a {...extLink(LINKS.virtualOffice)} className="mt-4 inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white">
            <MonitorSmartphone size={16} className="text-slate-500" />
            {t(UI.visitVirtualOffice)} (Gather.town)
          </a>
        </div>
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-slate-500 uppercase">{t(FOOTER.socialTitle)}</p>
          <ul className="mt-4 grid gap-2">
            {LINKS.social.map((s) => (
              <li key={s.name}>
                <a {...extLink(s.href)} className="group inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white">
                  {s.name}
                  <ArrowUpRight size={14} className="opacity-40 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="section-shell mt-14 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {t(FOOTER.company)} {t(FOOTER.rights)}
        </p>
        <a {...extLink(LINKS.website)} className="font-mono tracking-[0.16em] transition-colors hover:text-white">
          WWW.ASCENDGROUP.ASIA
        </a>
      </div>
    </footer>
  )
}
