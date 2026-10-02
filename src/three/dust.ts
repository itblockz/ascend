import * as THREE from 'three'

// Not rendered yet: returns once the smooth surface dissolves into dust.
export const PARTICLE_COUNT = 20000
export const PARTICLE_SIZE_PX = 1.5
// the side that breaks apart (screen right, up, slightly toward the viewer)
const DISPERSE_DIR = new THREE.Vector3(1, 0.55, 0.35).normalize()
const SURFACE_COLOR = new THREE.Color(0x18191c)
const DUST_COLOR = new THREE.Color(0x7c97c9)

// Points spread evenly on a unit sphere (golden-angle spiral); points facing
// DISPERSE_DIR drift outward and turn blue, as if the surface is breaking into dust.
export function dispersedSphere(count: number) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const random = seededRandom(7)
  const p = new THREE.Vector3()
  const color = new THREE.Color()

  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count
    const r = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i
    p.set(Math.cos(theta) * r, y, Math.sin(theta) * r)

    // 0 on the calm side, 1 where the surface faces DISPERSE_DIR
    const facing = THREE.MathUtils.smoothstep(p.dot(DISPERSE_DIR), -0.1, 0.9)
    // only some points break away; the rest stay on the surface
    const loose = facing * (random() < facing ? 1 : 0.15)
    const drift = loose * random() ** 2 * 0.9

    p.multiplyScalar(1 + drift * 0.6)
      .addScaledVector(DISPERSE_DIR, drift * 0.5)
      .add(new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).multiplyScalar(loose * 0.08))

    positions.set([p.x, p.y, p.z], i * 3)
    color.lerpColors(SURFACE_COLOR, DUST_COLOR, Math.min(1, loose * 1.2))
    colors.set([color.r, color.g, color.b], i * 3)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
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
