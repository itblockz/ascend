import { useEffect, useRef, useState } from 'react'
import { LINKS, NAV, UI } from '../content'
import { useLang, useT, type Lang } from '../i18n'
import { useJourney } from '../journey/context'
import { Logo } from './Logo'
import { Arrow, ExternalArrow } from './ui'

// which nav item a chapter belongs to (the three solution chapters share "Solutions")
const NAV_OF_CHAPTER: Record<number, string> = { 1: 'impact', 2: 'ai', 3: 'ai', 4: 'ai', 5: 'partners', 7: 'careers', 8: 'contact' }

function LangToggle() {
  const { lang, setLang } = useLang()
  const t = useT()
  return (
    <div role="group" aria-label={t(UI.language)} className="flex items-center gap-2">
      {(['en', 'th'] as Lang[]).map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="h-3 w-px bg-ink/20" aria-hidden />}
          <button
            type="button"
            lang={l}
            aria-pressed={lang === l}
            onClick={() => setLang(l)}
            className={`eyebrow transition-colors ${lang === l ? 'text-ink' : 'text-muted hover:text-ink'}`}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}

/** The header's call to action: the virtual office once its link is known, Contact until then. */
function Cta({ className = '' }: { className?: string }) {
  const t = useT()
  return LINKS.virtualOffice ? (
    <a href={LINKS.virtualOffice} target="_blank" rel="noopener" className={`btn btn-glow ${className}`}>
      <span className="eyebrow">{t(UI.virtualOffice)}</span>
      <ExternalArrow className="text-accent" />
    </a>
  ) : (
    <a href="#contact" className={`btn ${className}`}>
      <span className="eyebrow">{t(UI.contact)}</span>
      <Arrow className="text-accent" />
    </a>
  )
}

export function Header() {
  const t = useT()
  const { state } = useJourney()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const current = NAV_OF_CHAPTER[state.chapter]

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector('a')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center px-5 md:h-24 md:px-20">
      <a href="#top" aria-label={t(UI.home)} className="relative z-10">
        <Logo className="h-5 md:h-7" />
      </a>

      <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
        <ul className="flex items-center gap-10">
          {NAV.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="nav-link eyebrow" aria-current={current === item.id ? 'location' : undefined}>
                {t(item.label)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative z-10 ml-auto flex items-center gap-5 md:gap-8">
        <LangToggle />
        <Cta className="hidden sm:inline-flex" />
        <button
          type="button"
          className="flex size-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t(open ? UI.close : UI.menu)}
          onClick={() => setOpen(!open)}
        >
          <span className={`h-px w-6 bg-ink transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-ink transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" ref={menuRef} className="fixed inset-0 flex flex-col justify-between bg-bg px-5 pt-28 pb-10 lg:hidden">
          <nav aria-label="Main">
            <ul className="flex flex-col gap-5">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={() => setOpen(false)} className="text-4xl font-light tracking-tight text-ink">
                    {t(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div onClick={() => setOpen(false)}>
            <Cta />
          </div>
        </div>
      )}
    </header>
  )
}
