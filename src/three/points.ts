import * as THREE from 'three'

// Shared building blocks for the journey's particle landmarks: a seeded random source, a
// builder that collects points, and one points shader that every cloud uses (round soft dots,
// sized by distance, fading in out of the haze ahead and out again just before the camera).

/** Distance (world units) at which a point is drawn at its nominal size. Landmarks sit about this far from the camera at their stop. */
export const REF_DIST = 13
/** Points fade in between FAR and 0.6 × FAR from the camera… */
export const FAR = 46
/** …and fade out when closer than 3 × NEAR, so nothing smears across the lens. */
export const NEAR = 1.2

// ink on cream, a cool mist for depth, and the brand orange for points of interest
export const COLORS = {
  ink: new THREE.Color(0x18191c),
  graphite: new THREE.Color(0x4a4a50),
  stone: new THREE.Color(0x8b857d),
  mist: new THREE.Color(0x8d99b1),
  accent: new THREE.Color(0xef5224),
  ember: new THREE.Color(0xf29a72),
}

export type Rng = () => number

/** Small, fast, seeded PRNG (mulberry32), so every visit builds the same shapes. */
export function rng(seed: number): Rng {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Uniform random direction. */
export function randomDirection(random: Rng, out = new THREE.Vector3()) {
  const z = random() * 2 - 1
  const a = random() * Math.PI * 2
  const r = Math.sqrt(1 - z * z)
  return out.set(Math.cos(a) * r, z, Math.sin(a) * r)
}

/** Collects particles, then builds a THREE.Points with one shared shader. */
export class Cloud {
  readonly random: Rng
  private positions: number[] = []
  private colors: number[] = []
  private sizes: number[] = []
  private alphas: number[] = []
  private seeds: number[] = []
  private extra = new Map<string, { itemSize: number; data: number[] }>()

  constructor(seed: number) {
    this.random = rng(seed)
  }

  get count() {
    return this.sizes.length
  }

  /** Declares an extra per-point attribute; pass its values to add() under the same name. */
  attribute(name: string, itemSize: number) {
    this.extra.set(name, { itemSize, data: [] })
    return this
  }

  add(p: THREE.Vector3Like, color: THREE.Color, size = 1.6, alpha = 0.6, extra?: Record<string, number | readonly number[]>) {
    this.positions.push(p.x, p.y, p.z)
    this.colors.push(color.r, color.g, color.b)
    this.sizes.push(size)
    this.alphas.push(alpha)
    this.seeds.push(this.random())
    for (const [name, attr] of this.extra) {
      const v = extra?.[name] ?? 0
      if (typeof v === 'number') attr.data.push(v)
      else attr.data.push(...v)
    }
    return this
  }

  build(material: THREE.ShaderMaterial) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(this.sizes, 1))
    geometry.setAttribute('alpha', new THREE.Float32BufferAttribute(this.alphas, 1))
    geometry.setAttribute('seed', new THREE.Float32BufferAttribute(this.seeds, 1))
    for (const [name, attr] of this.extra) geometry.setAttribute(name, new THREE.Float32BufferAttribute(attr.data, attr.itemSize))
    const points = new THREE.Points(geometry, material)
    // the shader moves points around; bounding volumes from the rest positions would cull wrongly
    points.frustumCulled = false
    return points
  }
}

export interface PointsMaterialOptions {
  /** GLSL placed before main(): uniforms, attributes, helper functions. */
  head?: string
  /** GLSL run first in main(); it may change p (position), c (color), a (alpha) and s (size). */
  body?: string
  uniforms?: Record<string, THREE.IUniform>
}

/** The one points shader. Every material gets uTime, uPx (device pixel ratio) and uOpacity. */
export function pointsMaterial({ head = '', body = '', uniforms = {} }: PointsMaterialOptions = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPx: { value: 1 }, uOpacity: { value: 1 }, ...uniforms },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uPx;
      uniform float uOpacity;
      attribute vec3 color;
      attribute float size;
      attribute float alpha;
      attribute float seed;
      varying vec3 vColor;
      varying float vAlpha;
      ${head}
      void main() {
        vec3 p = position;
        vec3 c = color;
        float a = alpha;
        float s = size;
        ${body}
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float d = -mv.z;
        gl_Position = projectionMatrix * mv;
        float px = s * uPx * ${REF_DIST.toFixed(1)} / max(d, 0.01);
        // sub-pixel points dim instead of popping; far points melt into the haze and near ones
        // fade out before they reach the lens
        a *= clamp(px, 0.0, 1.0)
          * smoothstep(${FAR.toFixed(1)}, ${(FAR * 0.6).toFixed(1)}, d)
          * smoothstep(${NEAR.toFixed(1)}, ${(NEAR * 3).toFixed(1)}, d);
        gl_PointSize = clamp(px, 1.0, 9.0 * uPx);
        vColor = c;
        vAlpha = a * uOpacity;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float r = length(gl_PointCoord - 0.5);
        if (r > 0.5) discard;
        gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.3, r));
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
  })
}

/** Points sampled on a surface of revolution. profile(t) gives [radius, y] for t in 0–1. */
export function sampleLathe(
  cloud: Cloud,
  count: number,
  profile: (t: number) => [number, number],
  emit: (p: THREE.Vector3, normal: THREE.Vector3, t: number) => void,
) {
  // tabulate the profile so samples can be spread by surface area (radius × arc length)
  const steps = 200
  const table: { r: number; y: number; w: number }[] = []
  let total = 0
  let [pr, py] = profile(0)
  for (let i = 1; i <= steps; i++) {
    const [r, y] = profile(i / steps)
    const w = ((r + pr) / 2) * Math.hypot(r - pr, y - py)
    total += w
    table.push({ r, y, w: total })
    pr = r
    py = y
  }
  const p = new THREE.Vector3()
  const n = new THREE.Vector3()
  for (let i = 0; i < count; i++) {
    const target = cloud.random() * total
    let k = 0
    while (k < table.length - 1 && table[k].w < target) k++
    const a = table[Math.max(k - 1, 0)]
    const b = table[k]
    const f = cloud.random()
    const r = a.r + (b.r - a.r) * f
    const y = a.y + (b.y - a.y) * f
    const theta = cloud.random() * Math.PI * 2
    p.set(Math.cos(theta) * r, y, Math.sin(theta) * r)
    // outward normal of the profile, turned around the axis
    const dr = b.r - a.r
    const dy = b.y - a.y
    const len = Math.hypot(dr, dy) || 1
    n.set(Math.cos(theta) * (dy / len), -dr / len, Math.sin(theta) * (dy / len))
    emit(p, n, (k + f) / steps)
  }
}

/** Filled pixels of a 2D shape drawn on a canvas, as points in -0.5…0.5 (y up), keeping the shape's aspect. */
export function sampleCanvasShape(draw: (ctx: CanvasRenderingContext2D, size: number) => void, size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  draw(ctx, size)
  const data = ctx.getImageData(0, 0, size, size).data
  const filled: [number, number][] = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[(y * size + x) * 4 + 3] > 128) filled.push([x / size - 0.5, 0.5 - y / size])
    }
  }
  return filled
}

/** Light-to-shade ramp for stipple shading: lit points fade toward the page, shaded ones go to ink. */
export function shade(lit: number, out = new THREE.Color()) {
  const t = THREE.MathUtils.clamp(lit, 0, 1)
  return out.copy(COLORS.ink).lerp(COLORS.mist, t * 0.85)
}
