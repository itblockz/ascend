/**
 * Procedural 2D-canvas renderings of the ASCEND "^" mark.
 * Stand-ins for the pre-rendered frame sequences and the loop video: each
 * draw function is a pure function of progress (or time), so scrubbing is
 * deterministic and the real media can replace it frame for frame.
 */
import { clamp01, easeOutExpo, lerp, mulberry32, smoothstep } from './canvas'

type Pt = [number, number]

/** The mark in unit space (height 1, centred on 0,0, y down). */
export const CHEVRON: Pt[] = [
  [0, -0.5],
  [0.56, 0.4],
  [0.33, 0.4],
  [0, -0.1],
  [-0.33, 0.4],
  [-0.56, 0.4],
]

const C = {
  bg: '#060B14',
  navy: '#0B1426',
  blue: '#2F6BFF',
  cyan: '#00E5FF',
  teal: '#14F1C6',
}

export function chevronPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, sx = 1, sy = 1, poly: Pt[] = CHEVRON) {
  ctx.beginPath()
  poly.forEach(([x, y], i) => {
    const px = cx + x * s * sx
    const py = cy + y * s * sy
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.closePath()
}

function insidePoly(x: number, y: number, poly: Pt[]) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/* ------------------------------------------------------------------ */
/* particles                                                           */
/* ------------------------------------------------------------------ */

interface Particle {
  sx: number
  sy: number
  tx: number
  ty: number
  delay: number
  size: number
  hue: number
  twinkle: number
}

const particleCache = new Map<number, Particle[]>()

function particles(count: number) {
  const cached = particleCache.get(count)
  if (cached) return cached
  const rnd = mulberry32(2019)
  const list: Particle[] = []
  const edges = CHEVRON.map((p, i) => [p, CHEVRON[(i + 1) % CHEVRON.length]] as const)
  const perim = edges.reduce((sum, [a, b]) => sum + Math.hypot(b[0] - a[0], b[1] - a[1]), 0)

  for (let i = 0; i < count; i++) {
    let tx: number
    let ty: number
    if (i % 5 < 2) {
      // outline
      let d = rnd() * perim
      let k = 0
      for (; k < edges.length; k++) {
        const [a, b] = edges[k]
        const len = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (d <= len) break
        d -= len
      }
      const [a, b] = edges[Math.min(k, edges.length - 1)]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
      tx = a[0] + ((b[0] - a[0]) * d) / len
      ty = a[1] + ((b[1] - a[1]) * d) / len
    } else {
      do {
        tx = rnd() * 1.12 - 0.56
        ty = rnd() * 0.9 - 0.5
      } while (!insidePoly(tx, ty, CHEVRON))
    }
    const ang = rnd() * Math.PI * 2
    const rad = 0.9 + rnd() * 1.6
    list.push({
      sx: Math.cos(ang) * rad,
      sy: Math.sin(ang) * rad * 0.8 + 0.3,
      tx,
      ty,
      delay: rnd() * 0.2,
      size: 0.6 + rnd() * 1.6,
      hue: rnd(),
      twinkle: rnd() * Math.PI * 2,
    })
  }
  particleCache.set(count, list)
  return list
}

const starCache: Pt[] = (() => {
  const rnd = mulberry32(7)
  return Array.from({ length: 180 }, () => [rnd(), rnd()] as Pt)
})()

/* ------------------------------------------------------------------ */
/* shared scenery                                                      */
/* ------------------------------------------------------------------ */

function backdrop(ctx: CanvasRenderingContext2D, w: number, h: number, glow: number, glowY = 0.48) {
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, w, h)
  const r = Math.max(w, h) * 0.7
  const g = ctx.createRadialGradient(w / 2, h * glowY, 0, w / 2, h * glowY, r)
  g.addColorStop(0, `rgba(0, 229, 255, ${0.16 * glow})`)
  g.addColorStop(0.35, `rgba(47, 107, 255, ${0.1 * glow})`)
  g.addColorStop(1, 'rgba(6, 11, 20, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

function stars(ctx: CanvasRenderingContext2D, w: number, h: number, drift: number, alpha: number) {
  ctx.fillStyle = '#cfefff'
  for (let i = 0; i < starCache.length; i++) {
    const [x, y] = starCache[i]
    const yy = (((y + drift * (0.3 + (i % 3) * 0.25)) % 1) + 1) % 1
    ctx.globalAlpha = alpha * (0.25 + (i % 5) * 0.12)
    const s = i % 7 === 0 ? 1.6 : 1
    ctx.fillRect(x * w, yy * h, s, s)
  }
  ctx.globalAlpha = 1
}

/** Perspective floor grid — the "infrastructure" the mark rises from. */
function floorGrid(ctx: CanvasRenderingContext2D, w: number, h: number, horizon: number, scroll: number, alpha: number, color = '0, 229, 255') {
  if (alpha <= 0.001) return
  const vx = w / 2
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, horizon, w, h - horizon)
  ctx.clip()
  ctx.lineWidth = 1
  const depth = h - horizon
  for (let i = -14; i <= 14; i++) {
    const x = vx + i * w * 0.09
    ctx.strokeStyle = `rgba(${color}, ${alpha * 0.22})`
    ctx.beginPath()
    ctx.moveTo(vx + i * 6, horizon)
    ctx.lineTo(vx + (x - vx) * 3.2, h + depth)
    ctx.stroke()
  }
  for (let k = 0; k < 14; k++) {
    const t = (k + (scroll % 1)) / 14
    const y = horizon + depth * t * t
    ctx.strokeStyle = `rgba(${color}, ${alpha * 0.26 * t})`
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  const fade = ctx.createLinearGradient(0, horizon, 0, horizon + depth * 0.35)
  fade.addColorStop(0, C.bg)
  fade.addColorStop(1, 'rgba(6, 11, 20, 0)')
  ctx.fillStyle = fade
  ctx.fillRect(0, horizon, w, depth * 0.35)
  ctx.restore()
}

/** Faux-extruded, gradient-filled mark with a glowing rim. */
function solidChevron(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  alpha: number,
  opts: { depth?: number; sy?: number; sx?: number; top?: string; mid?: string; bottom?: string; side?: string; rim?: number; poly?: Pt[] } = {},
) {
  if (alpha <= 0.001) return
  const { depth = s * 0.07, sy = 1, sx = 1, top = C.teal, mid = C.cyan, bottom = C.blue, side = '#0d2a5c', rim = 1, poly = CHEVRON } = opts
  ctx.save()
  ctx.globalAlpha = alpha
  const steps = Math.max(1, Math.round(depth / 1.5))
  for (let k = steps; k >= 1; k--) {
    const t = k / steps
    ctx.fillStyle = side
    ctx.globalAlpha = alpha * (0.55 + 0.45 * (1 - t))
    chevronPath(ctx, cx, cy + k * (depth / steps), s, sx, sy, poly)
    ctx.fill()
  }
  ctx.globalAlpha = alpha
  const g = ctx.createLinearGradient(cx, cy - s * 0.5 * sy, cx, cy + s * 0.4 * sy)
  g.addColorStop(0, top)
  g.addColorStop(0.5, mid)
  g.addColorStop(1, bottom)
  ctx.fillStyle = g
  chevronPath(ctx, cx, cy, s, sx, sy, poly)
  ctx.fill()

  if (rim > 0) {
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * rim})`
    ctx.lineWidth = 16
    ctx.lineJoin = 'round'
    ctx.stroke()
    ctx.strokeStyle = `rgba(220, 250, 255, ${0.75 * rim})`
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
  ctx.restore()
}

/** A bright band sweeping across the mark, clipped to its silhouette. */
function sheen(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, t: number, alpha: number) {
  if (alpha <= 0.001) return
  ctx.save()
  chevronPath(ctx, cx, cy, s)
  ctx.clip()
  const x = cx + lerp(-0.9, 0.9, t) * s
  const g = ctx.createLinearGradient(x - s * 0.25, cy - s * 0.5, x + s * 0.25, cy + s * 0.4)
  g.addColorStop(0, 'rgba(255,255,255,0)')
  g.addColorStop(0.5, `rgba(255,255,255,${0.55 * alpha})`)
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.globalCompositeOperation = 'lighter'
  ctx.fillStyle = g
  ctx.fillRect(cx - s, cy - s, s * 2, s * 2)
  ctx.restore()
}

function orbits(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, spin: number, alpha: number, front: boolean, light = false) {
  if (alpha <= 0.001) return
  const rings = [
    { rx: 1.05, ry: 0.28, tilt: -0.32, speed: 1 },
    { rx: 0.9, ry: 0.22, tilt: 0.42, speed: -1.4 },
  ]
  ctx.save()
  ctx.lineWidth = 1
  for (const r of rings) {
    ctx.save()
    ctx.translate(cx, cy + s * 0.02)
    ctx.rotate(r.tilt)
    ctx.strokeStyle = light ? `rgba(47, 107, 255, ${0.35 * alpha})` : `rgba(0, 229, 255, ${0.3 * alpha})`
    ctx.beginPath()
    // back half behind the mark, front half over it
    if (front) ctx.ellipse(0, 0, r.rx * s, r.ry * s, 0, 0, Math.PI)
    else ctx.ellipse(0, 0, r.rx * s, r.ry * s, 0, Math.PI, Math.PI * 2)
    ctx.stroke()
    for (let d = 0; d < 3; d++) {
      const a = spin * r.speed + (d * Math.PI * 2) / 3
      const na = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      if (front !== na < Math.PI) continue
      const px = Math.cos(a) * r.rx * s
      const py = Math.sin(a) * r.ry * s
      ctx.fillStyle = light ? `rgba(47, 107, 255, ${alpha})` : `rgba(160, 250, 255, ${alpha})`
      ctx.beginPath()
      ctx.arc(px, py, d === 0 ? 3 : 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
  ctx.restore()
}

/* ------------------------------------------------------------------ */
/* Hero: particles assemble the mark, it ignites, then ascends         */
/* ------------------------------------------------------------------ */

export function drawHeroChevron(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const mobile = w < 768
  const assemble = smoothstep(0.02, 0.5, p)
  const ignite = smoothstep(0.36, 0.54, p)
  const rise = smoothstep(0.55, 0.88, p)
  const settle = smoothstep(0.78, 1, p)

  backdrop(ctx, w, h, 0.35 + ignite * 0.9, 0.5 - rise * 0.06)
  stars(ctx, w, h, p * 0.9, 0.5 + 0.5 * (1 - ignite * 0.4))

  const horizon = h * (0.7 + rise * 0.14)
  floorGrid(ctx, w, h, horizon, p * 9, smoothstep(0.1, 0.4, p) * (1 - settle * 0.35))

  // portrait: the reveal copy fills the top half, so the mark settles small into the gap above the cards
  const s = (mobile ? Math.min(w * 0.62, h * 0.34) : Math.min(w * 0.36, h * 0.46)) * lerp(1, mobile ? 0.5 : 0.84, settle)
  const cx = w / 2
  const cy = h * 0.5 - rise * h * 0.07 + (1 - assemble) * h * 0.02 + (mobile ? settle * h * 0.17 : 0)

  // light trails beneath the rising mark
  const trail = rise * (1 - settle * 0.6)
  if (trail > 0.01) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    for (const fx of [-0.44, 0, 0.44]) {
      const x = cx + fx * s
      const top = cy + s * (fx === 0 ? 0 : 0.4)
      const g = ctx.createLinearGradient(x, top, x, top + h * 0.5)
      g.addColorStop(0, `rgba(0, 229, 255, ${0.35 * trail})`)
      g.addColorStop(1, 'rgba(0, 229, 255, 0)')
      ctx.fillStyle = g
      ctx.fillRect(x - s * 0.05, top, s * 0.1, h * 0.5)
    }
    ctx.restore()
  }

  // ascending echoes — the steps it climbed
  const echo = smoothstep(0.58, 0.8, p)
  for (let k = 3; k >= 1; k--) {
    const a = echo * (0.34 - k * 0.08) * (1 - settle * 0.5)
    if (a <= 0.005) continue
    ctx.save()
    ctx.globalAlpha = a
    chevronPath(ctx, cx, cy + k * s * 0.2 * echo, s * (1 - k * 0.05))
    ctx.strokeStyle = C.cyan
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()
  }

  const spin = p * 7
  orbits(ctx, cx, cy, s, spin, settle, false)

  solidChevron(ctx, cx, cy, s, ignite, { rim: ignite })
  sheen(ctx, cx, cy, s, smoothstep(0.44, 0.72, p), ignite * (1 - settle))

  // particles
  const list = particles(mobile ? 520 : 950)
  const unit = Math.max(w, h) * 0.55
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < list.length; i++) {
    const q = list[i]
    const t = easeOutExpo(clamp01((assemble - q.delay) / (1 - q.delay)))
    const swirl = (1 - t) * 1.4
    const sx = q.sx * Math.cos(swirl) - q.sy * Math.sin(swirl)
    const sy = q.sx * Math.sin(swirl) + q.sy * Math.cos(swirl)
    const x = lerp(cx + sx * unit, cx + q.tx * s, t)
    const y = lerp(cy + sy * unit, cy + q.ty * s, t)
    const tw = 0.6 + 0.4 * Math.sin(q.twinkle + p * 40)
    const a = (0.25 + 0.75 * t) * (1 - ignite * 0.7) * tw + settle * 0.12 * tw
    if (a <= 0.01) continue
    ctx.fillStyle = q.hue < 0.5 ? `rgba(0, 229, 255, ${a})` : q.hue < 0.8 ? `rgba(20, 241, 198, ${a})` : `rgba(230, 250, 255, ${a})`
    const sz = q.size * (1 + (1 - t) * 0.8)
    ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz)
  }
  ctx.restore()

  orbits(ctx, cx, cy, s, spin, settle, true)
}

/* ------------------------------------------------------------------ */
/* Inside ASCEND: the mark separates into its layers                   */
/* ------------------------------------------------------------------ */

/** Final vertical centre of each layer as a fraction of stage height — labels align to these. */
export const LAYER_Y = [0.41, 0.55, 0.69, 0.86]

const LAYER_COLORS = [
  { top: '#7ff8ff', mid: C.cyan, bottom: '#0aa6c9', side: '#08405a' },
  { top: '#8fb1ff', mid: C.blue, bottom: '#1d3fb8', side: '#101f55' },
  { top: '#8dffe6', mid: C.teal, bottom: '#0b9c86', side: '#073f3c' },
]

export function drawLayers(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const mobile = w < 768
  const sep = smoothstep(0.04, 0.86, p)
  backdrop(ctx, w, h, 0.5 + sep * 0.4, 0.5)
  stars(ctx, w, h, 0.2 + p * 0.1, 0.35)

  const s = mobile ? Math.min(w * 0.36, h * 0.2) : Math.min(w * 0.2, h * 0.24)
  const cx = w / 2
  const tilt = lerp(1, 0.46, sep)

  const ys = LAYER_Y.map((fy, i) => lerp(h * 0.58 + i * s * 0.07, h * fy, sep))

  // spine
  if (sep > 0.02) {
    ctx.save()
    ctx.setLineDash([4, 6])
    ctx.strokeStyle = `rgba(0, 229, 255, ${0.35 * sep})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx, ys[0])
    ctx.lineTo(cx, ys[3])
    ctx.stroke()
    ctx.restore()
  }

  // base platform: a grid disc — digital social infrastructure
  const by = ys[3]
  const br = s * lerp(0.7, 0.95, sep)
  ctx.save()
  ctx.translate(cx, by)
  ctx.scale(1, lerp(0.35, 0.32, sep))
  const disc = ctx.createRadialGradient(0, 0, 0, 0, 0, br)
  disc.addColorStop(0, 'rgba(20, 241, 198, 0.28)')
  disc.addColorStop(1, 'rgba(20, 241, 198, 0.02)')
  ctx.fillStyle = disc
  ctx.beginPath()
  ctx.arc(0, 0, br, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(20, 241, 198, 0.55)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(20, 241, 198, 0.18)'
  for (let r = 1; r <= 3; r++) {
    ctx.beginPath()
    ctx.arc(0, 0, (br * r) / 4, 0, Math.PI * 2)
    ctx.stroke()
  }
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2 + p * 0.8
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(a) * br, Math.sin(a) * br)
    ctx.stroke()
  }
  ctx.restore()

  // chevron layers, drawn bottom-up so upper ones overlap
  for (let i = 2; i >= 0; i--) {
    const col = LAYER_COLORS[i]
    const y = ys[i]
    // node on the spine
    if (sep > 0.3) {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = `rgba(0, 229, 255, ${sep})`
      ctx.beginPath()
      ctx.arc(cx, y + s * 0.42 * tilt, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    solidChevron(ctx, cx, y, s, 1, {
      sy: tilt,
      depth: s * lerp(0.05, 0.12, sep),
      top: col.top,
      mid: col.mid,
      bottom: col.bottom,
      side: col.side,
      rim: 0.6 + sep * 0.4,
    })
  }

  // leader lines toward the labels
  if (sep > 0.6) {
    const a = smoothstep(0.6, 0.95, p)
    ctx.save()
    ctx.strokeStyle = `rgba(0, 229, 255, ${0.4 * a})`
    ctx.lineWidth = 1
    ys.forEach((y, i) => {
      if (mobile) return
      const dir = i % 2 === 0 ? -1 : 1
      const x0 = cx + dir * s * (i === 3 ? 0.95 : 0.6)
      ctx.beginPath()
      ctx.moveTo(x0, y)
      ctx.lineTo(x0 + dir * w * 0.1 * a, y)
      ctx.stroke()
    })
    ctx.restore()
  }
}

/* ------------------------------------------------------------------ */
/* Loop: the mark turning in place (stand-in for ascend_loop.mp4)      */
/* ------------------------------------------------------------------ */

export function drawLoop(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, theme: 'light' | 'dark') {
  const light = theme === 'light'
  ctx.clearRect(0, 0, w, h)
  if (!light) backdrop(ctx, w, h, 0.9)
  const s = Math.min(w, h) * 0.46
  const cx = w / 2
  const cy = h * 0.5 + Math.sin(time * 1.2) * s * 0.03
  const ang = time * 0.9
  const sx = Math.cos(ang)
  const thick = Math.sin(ang) * s * 0.1

  // floor shadow
  const sh = ctx.createRadialGradient(cx, cy + s * 0.62, 0, cx, cy + s * 0.62, s * 0.7)
  sh.addColorStop(0, light ? 'rgba(47, 107, 255, 0.22)' : 'rgba(0, 229, 255, 0.25)')
  sh.addColorStop(1, 'rgba(47, 107, 255, 0)')
  ctx.fillStyle = sh
  ctx.save()
  ctx.translate(0, cy + s * 0.62)
  ctx.scale(1, 0.18)
  ctx.translate(0, -(cy + s * 0.62))
  ctx.fillRect(cx - s, cy + s * 0.62 - s * 0.7, s * 2, s * 1.4)
  ctx.restore()

  orbits(ctx, cx, cy, s, time * 1.1, 1, false, light)

  // side wall, stacked copies offset along x
  const steps = 14
  for (let k = steps; k >= 1; k--) {
    ctx.fillStyle = light ? '#1d3fb8' : '#0d2a5c'
    ctx.globalAlpha = 0.9
    chevronPath(ctx, cx + (thick * k) / steps, cy, s, Math.max(0.02, Math.abs(sx)) * Math.sign(sx || 1))
    ctx.fill()
  }
  ctx.globalAlpha = 1
  const front = sx >= 0
  solidChevron(ctx, cx, cy, s, 1, {
    sx: Math.max(0.02, Math.abs(sx)),
    depth: 0,
    top: front ? C.teal : '#5aa9ff',
    mid: front ? C.cyan : C.blue,
    bottom: front ? C.blue : '#1d3fb8',
    rim: light ? 0.5 : 1,
  })

  orbits(ctx, cx, cy, s, time * 1.1, 1, true, light)
}
