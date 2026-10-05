import * as THREE from 'three'
import { JourneyScene, type ScreenPoint } from '../three/JourneyScene'
import { STOPS, anchorOf, windowOf } from './stops'

// Ties scrolling to the flight. One loop per frame: ease toward the scroll position, switch the
// stop overlays on and off, move the camera along the route, and pin HUD labels to landmarks.
// Native scrolling stays in charge; sections are ordinary tall blocks in the page.

/** How quickly the eased position catches up with the scroll position (per second). */
const FOLLOW = 4.5
/** Values are revealed one by one across the values section. */
const VALUE_COUNT = 6

export interface JourneyState {
  /** the stop whose text is showing, or the nearest one while travelling */
  stop: number
  chapter: number
  /** values section: which value (0–5) is current */
  value: number
}

interface Range {
  top: number
  height: number
  /** scroll position where the camera is at this stop */
  anchor: number
  /** scroll positions between which the text shows */
  from: number
  to: number
}

const { clamp } = THREE.MathUtils

/** Eases in and out, but never quite stops, so the camera keeps drifting at each stop. */
function ease(f: number) {
  const smooth = f * f * (3 - 2 * f)
  return f * 0.3 + smooth * 0.7
}

export class Journey {
  private scene: JourneyScene
  private sections: HTMLElement[] = []
  private labels: { el: HTMLElement; text: HTMLElement; stop: number; anchor: string; shift: number }[] = []
  private ranges: Range[] = []
  private smooth: number | null = null
  private active = new Set<number>()
  private state: JourneyState = { stop: -1, chapter: -1, value: -1 }
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  private pointer = new THREE.Vector2()
  private pointerTarget = new THREE.Vector2()
  private timer = new THREE.Timer()
  private point: ScreenPoint = { x: 0, y: 0, visible: false }
  private idle = 0
  private onState: (state: JourneyState) => void

  constructor(canvas: HTMLCanvasElement, onState: (state: JourneyState) => void) {
    this.onState = onState
    this.scene = new JourneyScene(canvas)
    this.measure()
    window.addEventListener('resize', this.measure)
    window.addEventListener('pointermove', this.onPointer, { passive: true })
    document.addEventListener('focusin', this.onFocus)
    document.addEventListener('click', this.onClick)
    window.addEventListener('hashchange', this.onHash)
    // fonts change nothing in layout height, but re-measure once everything has settled
    window.addEventListener('load', this.measure)
    // a shared link (#values) lands where the camera arrives at that stop, not at the section top
    // (again after load, in case the browser's own jump to the section came later)
    if (location.hash) {
      this.scrollToStop(location.hash.slice(1), false)
      window.addEventListener('load', () => this.scrollToStop(location.hash.slice(1), false), { once: true })
    }
    this.scheduleBuild()
    this.scene.renderer.setAnimationLoop(this.frame)
  }

  /** Scrolls to where the camera arrives at a stop. */
  scrollToStop(id: string, smooth = true) {
    const i = STOPS.findIndex((s) => s.id === id)
    if (i < 0) return false
    const behavior = smooth && !this.reduced.matches ? 'smooth' : 'instant'
    window.scrollTo({ top: this.ranges[i].anchor, behavior })
    return true
  }

  // in-page links go to the stop's arrival point; the address keeps the hash for sharing
  private onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    if (!link) return
    const id = link.hash.slice(1)
    if (!this.scrollToStop(id)) return
    e.preventDefault()
    history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`)
  }

  private onHash = () => {
    this.scrollToStop(location.hash.slice(1))
  }

  /** Builds the remaining landmarks while the browser is idle, one at a time. */
  private scheduleBuild = () => {
    const run = () => {
      if (this.scene.buildNext()) this.scheduleBuild()
    }
    // Safari has no requestIdleCallback
    const whenIdle = window.requestIdleCallback as typeof window.requestIdleCallback | undefined
    this.idle = whenIdle ? whenIdle(run, { timeout: 800 }) : window.setTimeout(run, 60)
  }

  measure = () => {
    this.sections = [...document.querySelectorAll<HTMLElement>('[data-stop]')]
    this.labels = [...document.querySelectorAll<HTMLElement>('[data-hud]')].map((el) => {
      const [stop, anchor] = el.dataset.hud!.split(':')
      return { el, text: el.querySelector<HTMLElement>('.hud-text')!, stop: Number(stop), anchor, shift: 0 }
    })
    const vh = window.innerHeight
    this.ranges = this.sections.map((section, i) => {
      const top = section.offsetTop
      const height = section.offsetHeight
      const [from, to] = windowOf(STOPS[i])
      return { top, height, anchor: top + height * anchorOf(STOPS[i]), from: top + height * from, to: top + height * to }
    })
    // the last anchor must be reachable
    const max = document.documentElement.scrollHeight - vh
    const last = this.ranges[this.ranges.length - 1]
    if (last) last.anchor = Math.min(last.anchor, max)
    this.scene.resize(window.innerWidth, vh)
  }

  /** Scroll position (px) where the camera arrives at a stop. */
  anchorOf(id: string) {
    const i = STOPS.findIndex((s) => s.id === id)
    return this.ranges[i]?.anchor ?? 0
  }

  select(index: number) {
    this.scene.select(index)
  }

  /** Jump within the values section to a given value. */
  valueAnchor(index: number) {
    const i = STOPS.findIndex((s) => s.kind === 'values')
    const r = this.ranges[i]
    return r.from + ((r.to - r.from) * (index + 0.5)) / VALUE_COUNT
  }

  private onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    this.pointerTarget.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
  }

  // keyboard users tabbing into a stop's links: fly there so they can see what has focus
  private onFocus = (e: FocusEvent) => {
    const section = (e.target as HTMLElement).closest<HTMLElement>('[data-stop]')
    if (!section) return
    const i = Number(section.dataset.stop)
    if (!this.active.has(i)) window.scrollTo({ top: this.ranges[i].anchor })
  }

  private frame = (time: number) => {
    this.timer.update(time)
    const dt = Math.min(this.timer.getDelta(), 0.1)
    const reduced = this.reduced.matches
    const y = window.scrollY
    // ease toward the scroll position (jump straight there on load, and when motion is reduced)
    if (this.smooth === null || reduced) this.smooth = y
    else this.smooth += (y - this.smooth) * (1 - Math.exp(-FOLLOW * dt))
    const at = this.smooth

    // which stops' text is showing
    this.ranges.forEach((r, i) => {
      const on = at >= r.from && at <= r.to
      if (on !== this.active.has(i)) {
        if (on) this.active.add(i)
        else this.active.delete(i)
        this.sections[i]?.toggleAttribute('data-active', on)
      }
    })

    // position along the route, in stops
    let s = 0
    const anchors = this.ranges.map((r) => r.anchor)
    if (at >= anchors[anchors.length - 1]) s = anchors.length - 1
    else {
      for (let i = 0; i < anchors.length - 1; i++) {
        if (at < anchors[i + 1]) {
          const f = clamp((at - anchors[i]) / (anchors[i + 1] - anchors[i]), 0, 1)
          // reduced motion: cut between stops instead of flying
          s = i + (reduced ? Math.round(f) : ease(f))
          break
        }
      }
    }

    // the nearest stop along the route sets the chapter on the rail
    const current = Math.round(s)

    // values: which one is current
    let value = this.state.value
    const valuesIndex = STOPS.findIndex((stop) => stop.kind === 'values')
    const vr = this.ranges[valuesIndex]
    if (vr) {
      const f = clamp((at - vr.from) / (vr.to - vr.from), 0, 0.999)
      value = Math.floor(f * VALUE_COUNT)
      this.scene.setValue(reduced ? value : clamp(f * VALUE_COUNT - 0.5, 0, VALUE_COUNT - 1))
    }

    if (current !== this.state.stop || value !== this.state.value) {
      this.state = { stop: current, chapter: STOPS[current].chapter, value }
      this.onState(this.state)
    }

    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
    document.documentElement.style.setProperty('--journey', String(clamp(at / max, 0, 1)))

    this.pointer.lerp(reduced ? this.pointerTarget.set(0, 0) : this.pointerTarget, 1 - Math.exp(-3 * dt))
    this.scene.ensureAround(s)
    this.scene.update(s, reduced ? 0 : this.timer.getElapsed(), this.pointer)

    // keep label text on screen and clear of the chapter rail: slide it left when it would
    // run past the right edge
    const right = window.innerWidth - (window.innerWidth >= 1024 ? 110 : 12)
    for (const label of this.labels) {
      const p = this.scene.project(label.stop, label.anchor, this.point)
      const show = p.visible && this.active.has(label.stop)
      label.el.style.opacity = show ? '1' : '0'
      if (!p.visible) continue
      label.el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`
      const left = p.x + label.text.offsetLeft
      const shift = Math.round(Math.max(Math.min(0, right - (left + label.text.offsetWidth)), 12 - left))
      if (shift !== label.shift) {
        label.shift = shift
        label.text.style.translate = `${shift}px 0`
      }
    }
  }

  dispose() {
    this.scene.renderer.setAnimationLoop(null)
    ;(window.cancelIdleCallback as typeof window.cancelIdleCallback | undefined)?.(this.idle)
    window.clearTimeout(this.idle)
    window.removeEventListener('resize', this.measure)
    window.removeEventListener('load', this.measure)
    window.removeEventListener('pointermove', this.onPointer)
    document.removeEventListener('focusin', this.onFocus)
    document.removeEventListener('click', this.onClick)
    window.removeEventListener('hashchange', this.onHash)
    this.timer.dispose()
    this.scene.dispose()
  }
}
