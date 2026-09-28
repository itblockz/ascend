import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NAV, UI } from '../content'
import { useLang } from '../i18n/LangContext'
import { scrollToId } from '../lib/lenis'
import { extLink, LINKS } from '../lib/links'
import { EASE } from '../lib/motion'
import { Logo } from './Brand'

export function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLang()
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
      aria-label={t(UI.langSwitch)}
      className={`relative grid h-10 grid-cols-2 items-center rounded-md border border-white/15 p-1 text-xs font-medium ${className}`}
    >
      <motion.span
        layout
        transition={{ duration: 0.35, ease: EASE }}
        className={`absolute inset-y-1 w-[calc(50%-4px)] rounded bg-white/12 ${lang === 'th' ? 'left-1' : 'left-1/2'}`}
      />
      <span className={`relative px-2.5 transition-colors ${lang === 'th' ? 'text-white' : 'text-slate-500'}`}>TH</span>
      <span className={`relative px-2.5 transition-colors ${lang === 'en' ? 'text-white' : 'text-slate-500'}`}>EN</span>
    </button>
  )
}

export function Navbar({ onAbout }: { onAbout: () => void }) {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || open ? 'bg-brand-black/90 shadow-2xl backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="section-shell flex h-20 items-center justify-between gap-4">
        <button type="button" onClick={() => go('top')} aria-label="ASCEND home" className="text-left">
          <Logo />
        </button>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {NAV.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => go(l.id)}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {t(l.label)}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LangToggle className="hidden sm:grid" />
          <button
            type="button"
            onClick={onAbout}
            className="hidden rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5 md:inline-flex"
          >
            {t(UI.about)}
          </button>
          <a
            {...extLink(LINKS.virtualOffice)}
            className="rounded-md bg-brand-cyan px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap text-brand-black transition-opacity hover:opacity-85 sm:px-5 sm:text-sm"
          >
            {t(UI.virtualOffice)}
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t(UI.menuClose) : t(UI.menuOpen)}
            aria-expanded={open}
            className="ml-1 grid size-11 place-items-center rounded-md border border-white/15 text-white xl:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden border-t border-white/5 xl:hidden"
          >
            <ul className="section-shell flex flex-col py-4">
              {NAV.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE }}
                >
                  <button
                    type="button"
                    onClick={() => go(l.id)}
                    className="flex w-full items-center justify-between border-b border-white/5 py-4 font-display text-2xl font-medium text-white"
                  >
                    {t(l.label)}
                  </button>
                </motion.li>
              ))}
              <li className="flex items-center gap-3 pt-5">
                <LangToggle className="sm:hidden" />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onAbout()
                  }}
                  className="flex-1 rounded-md border border-white/15 py-3 text-sm font-medium text-white md:hidden"
                >
                  {t(UI.about)}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
