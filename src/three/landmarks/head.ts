import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial, shade } from '../points'
import type { Landmark } from './types'

// QuantumSoul.ai: a stippled bust in three-quarter view, a network of neurons glowing inside.
// The head is a signed distance field (soft-blended ellipsoids); random points are pulled onto
// its surface, then shaded by a fixed light like a pen drawing.

type V = THREE.Vector3

// (the field is evaluated about a million times while building, so these avoid Math.hypot and
// helper calls, which are slow in V8)
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)

function ellipsoid(p: V, cx: number, cy: number, cz: number, rx: number, ry: number, rz: number) {
  const x = (p.x - cx) / rx
  const y = (p.y - cy) / ry
  const z = (p.z - cz) / rz
  const k0 = Math.sqrt(x * x + y * y + z * z)
  const k1 = Math.sqrt((x * x) / (rx * rx) + (y * y) / (ry * ry) + (z * z) / (rz * rz))
  return (k0 * (k0 - 1)) / (k1 || 1e-6)
}

function sphere(p: V, cx: number, cy: number, cz: number, r: number) {
  const x = p.x - cx
  const y = p.y - cy
  const z = p.z - cz
  return Math.sqrt(x * x + y * y + z * z) - r
}

function capsule(p: V, ax: number, ay: number, az: number, bx: number, by: number, bz: number, r: number) {
  const px = p.x - ax
  const py = p.y - ay
  const pz = p.z - az
  const dx = bx - ax
  const dy = by - ay
  const dz = bz - az
  const h = clamp01((px * dx + py * dy + pz * dz) / (dx * dx + dy * dy + dz * dz))
  const x = px - dx * h
  const y = py - dy * h
  const z = pz - dz * h
  return Math.sqrt(x * x + y * y + z * z) - r
}

function smin(a: number, b: number, k: number) {
  const h = clamp01(0.5 + (0.5 * (b - a)) / k)
  return b + (a - b) * h - k * h * (1 - h)
}

// p mirrored onto the +x side, for the paired features
const q = new THREE.Vector3()

/** Distance to the bust: face toward +z, y up, crown at about y = 1.2, shoulders at y = −2.4. */
function bust(p: V) {
  let d = ellipsoid(p, 0, 0.3, -0.12, 0.8, 0.88, 0.98) // cranium
  d = smin(d, ellipsoid(p, 0, -0.1, 0.2, 0.66, 0.8, 0.78), 0.2) // face
  d = smin(d, ellipsoid(p, 0, -0.55, 0.22, 0.52, 0.42, 0.62), 0.18) // jaw
  d = smin(d, ellipsoid(p, 0, -0.82, 0.55, 0.24, 0.2, 0.22), 0.14) // chin
  q.set(Math.abs(p.x), p.y, p.z)
  d = smin(d, ellipsoid(q, 0.42, -0.02, 0.55, 0.22, 0.16, 0.2), 0.12) // cheekbones
  d = smin(d, ellipsoid(p, 0, 0.24, 0.72, 0.52, 0.12, 0.18), 0.1) // brow
  d = smin(d, capsule(p, 0, 0.12, 0.86, 0, -0.2, 1.05, 0.085), 0.08) // nose bridge
  d = smin(d, sphere(p, 0, -0.24, 1.0, 0.11), 0.06) // nose tip
  d = smin(d, ellipsoid(p, 0, -0.3, 0.93, 0.2, 0.08, 0.1), 0.06) // nostrils
  d = smin(d, ellipsoid(p, 0, -0.47, 0.9, 0.24, 0.065, 0.1), 0.05) // upper lip
  d = smin(d, ellipsoid(p, 0, -0.58, 0.87, 0.21, 0.07, 0.1), 0.05) // lower lip
  // eye sockets carved in, eyeballs set back inside them
  d = -smin(-d, sphere(q, 0.27, 0.06, 0.86, 0.15), 0.05)
  d = smin(d, sphere(q, 0.27, 0.05, 0.77, 0.12), 0.02)
  d = smin(d, ellipsoid(q, 0.8, 0, -0.05, 0.09, 0.26, 0.16), 0.08) // ears
  d = smin(d, capsule(p, 0, -0.6, -0.12, 0, -1.75, -0.22, 0.4), 0.2) // neck
  d = smin(d, ellipsoid(p, 0, -2.05, -0.25, 1.55, 0.42, 0.62), 0.35) // shoulders
  return d
}

const SURFACE = 16000
const NEURONS = 70
const LIGHT = new THREE.Vector3(-0.6, 0.55, 0.6).normalize()
// the bust turns to look left (toward the text) and a little toward us
const YAW = -0.85

export function head(): Landmark {
  const cloud = new Cloud(37).attribute('kind', 1).attribute('edgeT', 1)
  const random = cloud.random
  const p = new THREE.Vector3()
  const n = new THREE.Vector3()
  // distance and surface normal at once, from four samples on a small tetrahedron around the point
  const e = 0.002
  const probe = new THREE.Vector3()
  const sample = (at: V, out: V) => {
    const a = bust(probe.set(at.x + e, at.y - e, at.z - e))
    const b = bust(probe.set(at.x - e, at.y - e, at.z + e))
    const c = bust(probe.set(at.x - e, at.y + e, at.z - e))
    const d = bust(probe.set(at.x + e, at.y + e, at.z + e))
    out.set(a - b - c + d, -a - b + c + d, -a + b - c + d).normalize()
    return (a + b + c + d) / 4
  }
  // the direction we look at the bust from, in its own space
  const view = new THREE.Vector3(Math.sin(-YAW), 0, Math.cos(-YAW))
  const color = new THREE.Color()

  let placed = 0
  for (let tries = 0; placed < SURFACE && tries < SURFACE * 8; tries++) {
    p.set((random() - 0.5) * 3.2, -2.5 + random() * 3.8, -1.2 + random() * 2.5)
    // step onto the surface along the normal
    let d = 1
    for (let i = 0; i < 6 && Math.abs(d) > 0.002; i++) {
      d = sample(p, n)
      p.addScaledVector(n, -d)
    }
    if (Math.abs(sample(p, n)) > 0.006) continue
    const lit = Math.max(n.dot(LIGHT), 0)
    const rim = 1 - Math.abs(n.dot(view))
    // the bust dissolves toward its base
    const base = THREE.MathUtils.smoothstep(p.y, -2.45, -1.85)
    shade(lit * 0.95, color)
    cloud.add(p, color, 1.15, (0.16 + (1 - lit) * 0.42 + rim * rim * 0.35) * base, { kind: 0 })
    placed++
  }

  // neurons inside the skull, each wired to its nearest neighbours
  const neurons: V[] = []
  while (neurons.length < NEURONS) {
    p.set((random() - 0.5) * 1.3, 0.3 + (random() - 0.5) * 1.3, -0.1 + (random() - 0.5) * 1.5)
    if (ellipsoid(p, 0, 0.3, -0.1, 0.62, 0.66, 0.76) < 0) neurons.push(p.clone())
  }
  for (const a of neurons) {
    for (let i = 0; i < 10; i++) cloud.add(p.copy(a).addScaledVector(n.randomDirection(), 0.03), COLORS.accent, 1.6, 0.9, { kind: 2 })
    const nearest = neurons
      .filter((b) => b !== a)
      .sort((b, c) => a.distanceToSquared(b) - a.distanceToSquared(c))
      .slice(0, 2)
    for (const b of nearest) {
      const steps = Math.ceil(a.distanceTo(b) / 0.025)
      for (let i = 0; i <= steps; i++) {
        cloud.add(p.copy(a).lerp(b, i / steps), COLORS.ember, 1, 0.5, { kind: 1, edgeT: i / steps })
      }
    }
  }

  const material = pointsMaterial({
    head: /* glsl */ `
      attribute float kind;
      attribute float edgeT;
    `,
    body: /* glsl */ `
      if (kind > 1.5) {
        // neurons fire now and then
        a *= 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * 1.7 + seed * 40.0), 6.0);
      } else if (kind > 0.5) {
        // signals run along the wires
        float lag = fract(uTime * 0.5 + seed * 0.15 - edgeT);
        a *= 0.18 + smoothstep(0.25, 0.0, lag) * 0.9;
      }
    `,
  })

  const points = cloud.build(material)
  points.rotation.y = YAW
  points.position.y = 0.55
  const group = new THREE.Group()
  group.add(points)
  return {
    object: group,
    extent: 2.2,
    // the temple, where the label reads "QuantumSoul.ai"
    anchors: { temple: new THREE.Vector3(0.55, 0.95, -0.35).applyAxisAngle(new THREE.Vector3(0, 1, 0), YAW).add(points.position) },
    update(time) {
      group.rotation.y = Math.sin(time * 0.25) * 0.06
    },
  }
}
