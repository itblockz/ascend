import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial, sampleLathe, shade } from '../points'
import type { Landmark } from './types'

// Foody AI & Spark: a steaming bowl with chopsticks, circled by an orbit of orange "picks"
// (the AI recommending dishes).

const RIM_R = 1.55
const RIM_Y = 0.38
const LIGHT = new THREE.Vector3(-0.5, 0.7, 0.5).normalize()

export function bowl(): Landmark {
  const cloud = new Cloud(41).attribute('kind', 1)
  const color = new THREE.Color()
  const p = new THREE.Vector3()

  // outer wall: a spherical cap from the foot up to the rim
  sampleLathe(
    cloud,
    6500,
    (t) => {
      const phi = 0.28 + t * (Math.PI / 2 - 0.28)
      return [RIM_R * Math.sin(phi), RIM_Y - 1.15 * Math.cos(phi)]
    },
    (point, normal) => {
      const lit = Math.max(normal.dot(LIGHT), 0)
      cloud.add(point, shade(lit, color), 1.15, 0.2 + (1 - lit) * 0.45, { kind: 0 })
    },
  )
  // foot ring and rim
  for (let i = 0; i < 380; i++) {
    const a = (i / 380) * Math.PI * 2
    cloud.add(p.set(Math.cos(a) * 0.5, -0.8, Math.sin(a) * 0.5), COLORS.graphite, 1.1, 0.55, { kind: 0 })
  }
  for (let i = 0; i < 700; i++) {
    const a = (i / 700) * Math.PI * 2
    cloud.add(p.set(Math.cos(a) * RIM_R, RIM_Y, Math.sin(a) * RIM_R), COLORS.ink, 1.3, 0.8, { kind: 0 })
  }

  // the food: a low mound, flecked with chili
  for (let i = 0; i < 2600; i++) {
    const r = Math.sqrt(cloud.random()) * 1.38
    const a = cloud.random() * Math.PI * 2
    const y = RIM_Y - 0.06 + 0.32 * (1 - (r / 1.38) ** 2) + (cloud.random() - 0.5) * 0.05
    const chili = cloud.random() < 0.07
    cloud.add(p.set(Math.cos(a) * r, y, Math.sin(a) * r), chili ? COLORS.accent : COLORS.stone, chili ? 1.5 : 1.1, chili ? 0.85 : 0.4, { kind: 0 })
  }

  // chopsticks resting across the rim
  const sticks: [THREE.Vector3, THREE.Vector3][] = [
    [new THREE.Vector3(-1.2, 0.62, 0.9), new THREE.Vector3(1.9, 1.15, -0.55)],
    [new THREE.Vector3(-1.05, 0.55, 1.08), new THREE.Vector3(2.0, 1.32, -0.25)],
  ]
  for (const [a, b] of sticks) {
    for (let i = 0; i <= 260; i++) cloud.add(p.copy(a).lerp(b, i / 260), COLORS.ink, 1.35, 0.85, { kind: 0 })
  }

  // steam rising off the food
  for (let i = 0; i < 2200; i++) {
    const r = Math.sqrt(cloud.random()) * 0.9
    const a = cloud.random() * Math.PI * 2
    cloud.add(p.set(Math.cos(a) * r, RIM_Y + 0.25, Math.sin(a) * r), COLORS.mist, 1 + cloud.random(), 0.32, { kind: 1 })
  }

  // the AI's orbit, three picks travelling around it
  for (let i = 0; i < 420; i++) {
    const a = (i / 420) * Math.PI * 2
    cloud.add(p.set(Math.cos(a) * 2.15, 0, Math.sin(a) * 2.15), COLORS.mist, 1, 0.3, { kind: 2 })
  }
  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < 46; i++) {
      p.randomDirection().multiplyScalar(0.07 * Math.cbrt(cloud.random()))
      p.x += 2.15
      cloud.add(p, COLORS.accent, 1.5, 0.95, { kind: 3 + k })
    }
  }

  const material = pointsMaterial({
    uniforms: { uTilt: { value: new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0.32, 0, 0.22))) } },
    head: /* glsl */ `
      uniform mat3 uTilt;
      attribute float kind;
    `,
    body: /* glsl */ `
      if (kind > 0.5 && kind < 1.5) {
        // steam: rise, sway, thin out
        float t = fract(uTime * 0.14 + seed);
        float h = t * 2.6;
        p.y += h;
        p.x += sin(h * 2.2 + seed * 12.0 + uTime * 0.8) * 0.2 * t;
        p.z += cos(h * 1.7 + seed * 7.0) * 0.12 * t;
        a *= sin(3.14159 * t) * (1.0 - t * 0.5);
      } else if (kind > 1.5) {
        // the orbit ring is tilted; picks ride around it
        if (kind > 2.5) {
          float ang = uTime * 0.35 + (kind - 3.0) * 2.0944;
          float cs = cos(ang);
          float sn = sin(ang);
          p.xz = mat2(cs, sn, -sn, cs) * p.xz;
        }
        p = uTilt * p;
      }
    `,
  })

  const points = cloud.build(material)
  // tip the bowl toward us so we see into it
  points.rotation.x = 0.36
  points.position.y = -0.35
  const group = new THREE.Group()
  group.add(points)
  return {
    object: group,
    extent: 2.3,
    anchors: { food: new THREE.Vector3(0.35, 0.55, 0.45) },
  }
}
