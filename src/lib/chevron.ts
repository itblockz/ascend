/** The "^" mark in unit space (height 1, centred on 0,0, y down). */
export const CHEVRON: [number, number][] = [
  [0, -0.5],
  [0.56, 0.4],
  [0.33, 0.4],
  [0, -0.1],
  [-0.33, 0.4],
  [-0.56, 0.4],
]

/** Final vertical centre of each Inside ASCEND layer, as a fraction of stage height — labels align to these. */
export const LAYER_Y = [0.41, 0.55, 0.69, 0.86]

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

/** Deterministic PRNG so every scrub position renders the same scene. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
