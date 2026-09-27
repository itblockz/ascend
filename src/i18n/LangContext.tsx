import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'th' | 'en'
/** A piece of copy in both languages. */
export type Bi = { th: string; en: string }

const KEY = 'ascend-lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'th' || saved === 'en') return saved
  } catch {
    /* storage unavailable */
  }
  return 'th'
}

interface LangValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (b: Bi) => string
}

const LangContext = createContext<LangValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(KEY, l)
    } catch {
      /* storage unavailable */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    // copy length changes section heights; re-measure pinned stages
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang])

  const value = useMemo<LangValue>(() => ({ lang, setLang, t: (b) => b[lang] }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}
