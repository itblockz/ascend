import { createContext, useCallback, useContext } from 'react'

export type Lang = 'en' | 'th'
/** A string in both languages. */
export type L = Record<Lang, string>
/** Lines of a heading, in both languages (headings break where the copy says, not where the box ends). */
export type Lines = Record<Lang, string[]>

export const LANG_STORAGE_KEY = 'ascend-lang'

export function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    if (saved === 'en' || saved === 'th') return saved
  } catch {
    // storage blocked: fall through to the browser language
  }
  return navigator.language.toLowerCase().startsWith('th') ? 'th' : 'en'
}

export const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({ lang: 'en', setLang: () => {} })

export function useLang() {
  return useContext(LangContext)
}

/** Picks the current language from an L (plain strings pass through). */
export function useT() {
  const { lang } = useLang()
  return useCallback((s: L | string) => (typeof s === 'string' ? s : s[lang]), [lang])
}
