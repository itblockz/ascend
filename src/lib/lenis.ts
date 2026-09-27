import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
  instance = lenis
}

export function getLenis() {
  return instance
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (instance) instance.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function lockScroll(locked: boolean) {
  if (!instance) {
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    return
  }
  if (locked) instance.stop()
  else instance.start()
}
