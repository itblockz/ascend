import * as THREE from 'three'

// Dust breaking off the orb, modeled on the mock. Up close the mock's dust is a lace of tiny
// bubbles: thin rings and broken arcs a few px across, blue-grey where they turn from the
// light and white where they catch it, warming toward the bottom. It covers the upper right
// of the orb, thins into spray streaming off to the right, and leaves fine sparkle on the
// lower rim. Points are generated once on the unit sphere; the orb's transform places and
// sizes them. The orb isn't rotated, so object space matches the screen: +x right, +y up,
// +z toward the viewer.

/** Direction the orb breaks apart toward; the surface dissolve in orbMaterials.ts uses it too. */
export const DISSOLVE_DIR = new THREE.Vector3(0.84, 0.54, 0.05).normalize()

// backlight from behind the orb, a little high and to the left (the same light that makes its
// rim glow): foam facing us is in shade, foam seen edge-on at the silhouette and on top catches it
const LIGHT_DIR = new THREE.Vector3(-0.3, 0.45, -0.85).normalize()
const WIND_DIR = new THREE.Vector3(1, 0.12, 0).normalize()

/** One CSS px on an orb of the mock's size (radius 245px), in unit-sphere units. */
const PX = 1 / 245
/** Point size in CSS px for an orb of the mock's size; OrbScene scales it with the orb. */
const SIZE_PX = 1.6

const BUBBLE_COUNT = 12000
const GRAINS_PER_BUBBLE = 3
const SPRAY_COUNT = 7000
const SPRAY_STREAMS = 160
const STREAK_COUNT = 2500
const SPARKLE_COUNT = 9000

// colors sampled from the mock's dust, from shadow to light: blue where the foam is seen
// edge-on (near the silhouette), grey where it faces us, warm toward the bottom
const COOL = [0x98a2b8, 0xb9c1d2, 0xdcdde0, 0xf8f7f3].map((c) => new THREE.Color(c))
const GREY = [0x9ea0aa, 0xb6b8be, 0xd3d2d3, 0xf6f4f0].map((c) => new THREE.Color(c))
const WARM = [0xae9fa3, 0xcdbfbd, 0xe3d8d2, 0xf6eee7].map((c) => new THREE.Color(c))
const SPRAY_COOL = [0x9aa3b8, 0xb3b9c8].map((c) => new THREE.Color(c))
const SPRAY_WARM = [0xc9b5b2, 0xe2bfb2].map((c) => new THREE.Color(c))
const SPARKLE = [0xcbbbb6, 0xfff8f0].map((c) => new THREE.Color(c))

const { clamp, lerp, smoothstep } = THREE.MathUtils

type Random = () => number
type Emit = (p: THREE.Vector3, color: THREE.Color, size: number, alpha: number) => void

export function dustPoints() {
  const positions: number[] = []
  const colors: number[] = []
  const sizes: number[] = []
  const alphas: number[] = []
  const emit: Emit = (p, color, size, alpha) => {
    positions.push(p.x, p.y, p.z)
    colors.push(color.r, color.g, color.b)
    sizes.push(size)
    alphas.push(alpha)
  }

  const random = seededRandom(7)
  addFoam(emit, random)
  addSpray(emit, random)
  addStreak(emit, random)
  addSparkle(emit, random)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
  geometry.setAttribute('alpha', new THREE.Float32BufferAttribute(alphas, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: { uPointScale: { value: 1 } },
    vertexShader: /* glsl */ `
      uniform float uPointScale;
      attribute vec3 color;
      attribute float size;
      attribute float alpha;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = max(size * uPointScale, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.2, d));
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
  })

  return new THREE.Points(geometry, material)
}

/** Rejection-samples the foam at point p of the unit sphere: returns how dense the foam is
 * there (0–1) if a bubble lands at p, or 0 if it doesn't. The cheap tests come first, so most
 * points are turned away before the finer noise is sampled. */
function sampleFoam(p: THREE.Vector3, random: Random) {
  const front = p.dot(DISSOLVE_DIR)
  if (front < -0.3 || p.z < -0.3) return 0
  // evenly spread points crowd together near the silhouette on screen; thin them there
  // so the foam covers the face as densely as the edge
  const facing = Math.max(p.z, 0.33)
  if (random() > facing) return 0
  // a coarse, swirled noise frays the edge where the foam meets the smooth surface into
  // curling wisps (the noise is sampled at a point pushed around by another noise)
  warped.set(p.x + fbm(p, 1.5, 1) - 0.5, p.y + fbm(warped.copy(p).addScalar(7.3), 1.5, 1) - 0.5, p.z)
  const edge = smoothstep(front + (fbm(warped, 2.2, 3) - 0.5) * 0.8, -0.1, 0.35)
  if (random() > edge) return 0
  // clumps a few dozen px across, laced together along thin ridges
  const texture = (0.25 + 0.75 * smoothstep(fbm(p, 5, 3), 0.3, 0.7)) * (0.5 + 0.5 * ridge(p, 12))
  if (random() > texture) return 0
  return edge * facing * texture
}
const warped = new THREE.Vector3()

/** The foam: bubbles (thin rings, often broken into arcs) in the surface's tangent plane,
 * with loose grains around them. Shaded by the sphere's light, plus a highlight on the
 * side of each ring facing the light. */
function addFoam(emit: Emit, random: Random) {
  const c = new THREE.Vector3()
  const t1 = new THREE.Vector3()
  const t2 = new THREE.Vector3()
  const p = new THREE.Vector3()
  const color = new THREE.Color()

  for (let n = 0; n < BUBBLE_COUNT; ) {
    randomOnSphere(c, random)
    const density = sampleFoam(c, random)
    if (density === 0) continue
    const light = sphereLight(c)
    const warmth = warmthAt(c)
    const facing = c.z
    tangentBasis(c, t1, t2)
    lift(c, density, random)

    // a lumpy, squashed ring, usually broken into an arc
    const radius = (1.5 + random() ** 2 * 5) * PX // mostly small, a few large
    const squash = 0.6 + random() * 0.4
    const lumps = random() * Math.PI * 2
    const arc = random() < 0.2 ? Math.PI * 2 : Math.PI * (0.5 + random() * 1.2)
    const start = random() * Math.PI * 2
    const steps = Math.max(3, Math.round((arc * radius) / (1.3 * PX)))
    const lightSide = Math.atan2(t2.dot(LIGHT_DIR), t1.dot(LIGHT_DIR))
    // near the silhouette, grains fade so the edge-on foam doesn't pile up into a dark rim
    const alpha = 0.55 + 0.35 * Math.min(1, facing * 1.5)
    for (let i = 0; i < steps; i++) {
      const a = start + (arc * i) / steps
      const r = radius * (1 + 0.25 * Math.sin(a * 3 + lumps))
      p.copy(c)
        .addScaledVector(t1, Math.cos(a) * r)
        .addScaledVector(t2, Math.sin(a) * r * squash)
      // outlines sit in the darker half of the ramp; the lit side of the ring catches a highlight
      const tone = light * 0.75 + Math.cos(a - lightSide) * 0.3
      shade(color, tone, warmth, facing)
      emit(p, color, SIZE_PX * (0.8 + random() * 0.4), alpha * (0.85 + random() * 0.15))
    }

    for (let i = 0; i < GRAINS_PER_BUBBLE; i++) {
      const a = random() * Math.PI * 2
      const r = (2 + random() * 6) * PX
      p.copy(c).addScaledVector(t1, Math.cos(a) * r).addScaledVector(t2, Math.sin(a) * r)
      // some loose grains are glints, whiter than the page, so the foam glows; mostly where it's
      // seen edge-on, since the foam facing us sits in the backlight's shade
      const glint = random() < 0.6 * (1 - facing * 0.6)
      const tone = glint ? 0.9 + random() * 0.1 : light + (random() - 0.5) * 0.25
      shade(color, tone, warmth, facing)
      emit(p, color, SIZE_PX * (0.8 + random() * 1.2), glint ? 0.7 + random() * 0.3 : 0.4 + random() * 0.3)
    }
    n++
  }
}

/** The sphere under the backlight, with broad folds of light and shade across the foam, a
 * bright crest along the top and a deep band running just inside the right edge. */
function sphereLight(p: THREE.Vector3) {
  const crest = smoothstep(p.y, 0.6, 0.95)
  const band = smoothstep(p.x, 0.2, 0.6) * smoothstep(p.z, 0.08, 0.22) * (1 - smoothstep(p.z, 0.35, 0.6))
  return (
    p.dot(LIGHT_DIR) * 0.5 + 0.62 + (fbm(p, 3, 2) - 0.5) * 0.6 + (fbm(p, 8, 1) - 0.5) * 0.2 + crest * 0.12 - band * 0.12
  )
}

/** 0 on the upper part, rising to 1 toward the bottom, where the dust turns warm. */
function warmthAt(p: THREE.Vector3) {
  return 1 - smoothstep(p.y, -0.45, 0.05)
}

/** Blue at the silhouette, grey facing us, warm below; the warm part is also lifted by the
 * orb's warm rim glow. `facing` is the surface normal's z (1 = facing the viewer). */
function shade(target: THREE.Color, tone: number, warmth: number, facing: number) {
  const cool = ramp(target, COOL, tone).lerp(ramp(scratchColor, GREY, tone), smoothstep(facing, 0.4, 1) * 0.45)
  const warm = ramp(scratchColor, WARM, lerp(tone, 0.5 + tone * 0.5, warmth))
  return cool.lerp(warm, warmth)
}
const scratchColor = new THREE.Color()

/** Lift a foam point off the surface (more where the foam is dense) and push a few grains
 * just past the silhouette toward the break-up direction. */
function lift(p: THREE.Vector3, density: number, random: Random) {
  p.multiplyScalar(1.01 + 0.04 * density + random() * 0.02)
  return p.addScaledVector(DISSOLVE_DIR, density * random() ** 3 * 0.12)
}

/** Grains blown off the dissolving rim and streaming right: most follow a few hundred thin
 * streams, the rest drift loose and fan out with distance; some are tiny broken bubbles.
 * Warm below, cool above. */
function addSpray(emit: Emit, random: Random) {
  const sources = Array.from({ length: SPRAY_STREAMS }, () => sprayOrigin(new THREE.Vector3(), random))
  const p = new THREE.Vector3()
  const q = new THREE.Vector3()
  const color = new THREE.Color()
  for (let n = 0; n < SPRAY_COUNT; n++) {
    const streamed = random() < 0.4
    if (streamed) p.copy(sources[Math.floor(random() * SPRAY_STREAMS)])
    else sprayOrigin(p, random)
    const warm = p.y < -0.25
    const wave = p.x * 40 // per-stream phase, so streams wave out of step

    const t = 0.06 + -Math.log(1 - random()) * 0.4 // distance traveled: most stay close
    p.addScaledVector(WIND_DIR, t)
    // the upper spray fans out as it goes; streams stay thin and waver
    p.y += (random() - 0.5) * t * (streamed ? 0.04 : 0.5) + Math.max(p.y, 0) * t * 0.1
    if (streamed) p.y += Math.sin(t * 9 + wave) * 0.02
    p.z += (random() - 0.5) * t * 0.3

    const palette = warm ? SPRAY_WARM : SPRAY_COOL
    color.lerpColors(palette[0], palette[1], random())
    const alpha = 0.35 + 0.5 * Math.exp(-t * 1.5)
    if (random() < 0.3) {
      // a small broken bubble, in the screen plane: the foam fragmenting as it leaves
      const radius = (1 + random() * 2) * PX
      const arc = Math.PI * (0.5 + random())
      const start = random() * Math.PI * 2
      for (let a = 0; a < arc; a += (1.3 * PX) / radius) {
        q.set(p.x + Math.cos(start + a) * radius, p.y + Math.sin(start + a) * radius, p.z)
        emit(q, color, SIZE_PX * 0.9, alpha)
      }
    } else {
      emit(p, color, SIZE_PX * (0.8 + random() * 0.9), alpha)
    }
  }
}

/** A warm ribbon peeling off the lower right of the orb and rising to the right as it thins out,
 * lit by the orb's warm rim glow. */
function addStreak(emit: Emit, random: Random) {
  const p = new THREE.Vector3()
  const color = new THREE.Color()
  for (let n = 0; n < STREAK_COUNT; n++) {
    const s = random() ** 1.5 // along the ribbon: denser where it leaves the orb
    const width = 0.05 * (1 - s * 0.5)
    p.set(0.82 + 0.85 * s, -0.6 + 0.4 * s + 0.08 * Math.sin(Math.PI * s), 0.3)
    p.x += (random() - 0.5) * width
    p.y += (random() - 0.5) * width
    color.lerpColors(SPRAY_WARM[0], SPRAY_WARM[1], 0.4 + random() * 0.6)
    emit(p, color, SIZE_PX * (0.6 + random() * 0.7), (0.3 + random() * 0.4) * (1 - s * 0.7))
  }
}

/** A point on the right of the dissolving side near the silhouette (as seen on screen), just off
 * the surface, so the spray streams outward instead of across the orb's face. */
function sprayOrigin(out: THREE.Vector3, random: Random) {
  do {
    // sample only the orb's right side, x ≥ 0.45 (still uniform over the sphere's surface)
    const x = 0.45 + random() * 0.55
    const a = random() * Math.PI * 2
    const r = Math.sqrt(1 - x * x)
    out.set(x, Math.cos(a) * r, Math.sin(a) * r)
  } while (out.dot(DISSOLVE_DIR) < 0.3 || Math.abs(out.z) > 0.45)
  return out.multiplyScalar(1.04)
}

/** Fine warm sparkle across the lower face, in a band just inside the rim glow. */
function addSparkle(emit: Emit, random: Random) {
  const p = new THREE.Vector3()
  const color = new THREE.Color()
  for (let n = 0; n < SPARKLE_COUNT; ) {
    // sample only the lower front of the orb, y ≤ -0.2 and z ≥ 0 (still uniform over the surface)
    const y = -0.2 - random() * 0.8
    const a = random() * Math.PI
    const r = Math.sqrt(1 - y * y)
    p.set(Math.cos(a) * r, y, Math.sin(a) * r)
    const low = 1 - smoothstep(p.y, -0.85, -0.2)
    // on screen, a band starting a little inside the silhouette rather than piled on it
    const band = smoothstep(p.z, 0.08, 0.25) * (1 - smoothstep(p.z, 0.4, 0.75))
    if (random() > low * band) continue
    p.multiplyScalar(1 + random() ** 2 * 0.03)
    // mostly light specks that glitter against the glow, with a few darker grains
    const dark = random() < 0.25
    color.copy(SPARKLE[dark ? 0 : 1])
    emit(p, color, SIZE_PX * (0.6 + random() * 0.7), dark ? 0.35 + random() * 0.35 : 0.6 + random() * 0.4)
    n++
  }
}

/** Color along evenly spaced stops for t in [0, 1]. */
function ramp(target: THREE.Color, stops: THREE.Color[], t: number) {
  const x = clamp(t, 0, 1) * (stops.length - 1)
  const i = Math.min(Math.floor(x), stops.length - 2)
  return target.lerpColors(stops[i], stops[i + 1], x - i)
}

/** Two unit vectors spanning the plane tangent to the unit sphere at p. */
function tangentBasis(p: THREE.Vector3, t1: THREE.Vector3, t2: THREE.Vector3) {
  t1.set(0, 1, 0)
  if (Math.abs(p.y) > 0.9) t1.set(1, 0, 0)
  t1.cross(p).normalize()
  t2.crossVectors(p, t1)
}

function randomOnSphere(out: THREE.Vector3, random: Random) {
  const z = random() * 2 - 1
  const a = random() * Math.PI * 2
  const r = Math.sqrt(1 - z * z)
  return out.set(Math.cos(a) * r, Math.sin(a) * r, z)
}

/** Octaves of smooth value noise, roughly in [0, 1]. */
function fbm(p: THREE.Vector3, scale: number, octaves: number) {
  let sum = 0
  let amp = 0.5
  let f = scale
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(p.x * f, p.y * f, p.z * f)
    amp *= 0.5
    f *= 2.03
  }
  return sum / (1 - 0.5 ** octaves) // the amplitudes sum to this
}

/** 1 on the thin lines where the noise crosses its midpoint, falling to 0 between them. */
function ridge(p: THREE.Vector3, scale: number) {
  return Math.max(0, 1 - Math.abs(fbm(p, scale, 2) * 2 - 1) * 3) ** 2
}

// Lattice for the value noise: a shuffled permutation (doubled to skip wrapping) picks a random
// value for each lattice corner, as in Perlin's reference noise.
const PERM = new Uint8Array(512)
const LATTICE_VALUES = new Float32Array(256)
{
  const random = seededRandom(11)
  for (let i = 0; i < 256; i++) {
    PERM[i] = i
    LATTICE_VALUES[i] = random()
  }
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[PERM[i], PERM[j]] = [PERM[j], PERM[i]]
  }
  PERM.copyWithin(256, 0, 256)
}

function valueNoise(x: number, y: number, z: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const u = fade(x - xi)
  const v = fade(y - yi)
  const w = fade(z - zi)
  const X = xi & 255
  const Y = yi & 255
  const Z = zi & 255
  const A = PERM[X] + Y
  const B = PERM[X + 1] + Y
  const AA = PERM[A] + Z
  const AB = PERM[A + 1] + Z
  const BA = PERM[B] + Z
  const BB = PERM[B + 1] + Z
  const V = LATTICE_VALUES
  const near = lerp(lerp(V[PERM[AA]], V[PERM[BA]], u), lerp(V[PERM[AB]], V[PERM[BB]], u), v)
  const far = lerp(lerp(V[PERM[AA + 1]], V[PERM[BA + 1]], u), lerp(V[PERM[AB + 1]], V[PERM[BB + 1]], u), v)
  return lerp(near, far, w)
}

function fade(t: number) {
  return t * t * (3 - 2 * t)
}

// Deterministic PRNG (mulberry32) so the shape is the same on every load.
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
