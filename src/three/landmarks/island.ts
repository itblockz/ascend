import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial, shade } from '../points'
import type { Landmark } from './types'

// EdenVerden.io: a floating island world with a small town, trees and a waterfall pouring
// off its edge, slowly turning.

const LIGHT = new THREE.Vector3(-0.5, 0.75, 0.45).normalize()
const DEPTH = 2.5
const FALL_ANGLE = 0.55

const { smoothstep } = THREE.MathUtils

function rimRadius(theta: number) {
  return 2.3 + 0.22 * Math.sin(3 * theta + 1) + 0.12 * Math.sin(7 * theta)
}

export function island(): Landmark {
  const cloud = new Cloud(53).attribute('kind', 1)
  const random = cloud.random
  const color = new THREE.Color()
  const p = new THREE.Vector3()
  const n = new THREE.Vector3()

  // grassy top and its rim
  for (let i = 0; i < 3600; i++) {
    const a = random() * Math.PI * 2
    const r = Math.sqrt(random()) * rimRadius(a) * 0.98
    cloud.add(p.set(Math.cos(a) * r, (random() - 0.5) * 0.04, Math.sin(a) * r), COLORS.stone, 1.05, 0.34, { kind: 0 })
  }
  for (let i = 0; i < 800; i++) {
    const a = (i / 800) * Math.PI * 2
    const r = rimRadius(a)
    cloud.add(p.set(Math.cos(a) * r, 0, Math.sin(a) * r), COLORS.graphite, 1.2, 0.7, { kind: 0 })
  }

  // rock underneath, tapering to a point
  for (let i = 0; i < 5600; i++) {
    const a = random() * Math.PI * 2
    const h = random() ** 0.85
    const wobble = 0.86 + 0.14 * Math.sin(a * 5 + h * 9)
    const r = rimRadius(a) * (1 - h) ** 1.15 * wobble
    p.set(Math.cos(a) * r, -h * DEPTH, Math.sin(a) * r)
    n.set(Math.cos(a), 0.45, Math.sin(a)).normalize()
    const lit = Math.max(n.dot(LIGHT), 0)
    cloud.add(p, shade(lit * (1 - h * 0.6), color), 1.1, (0.24 + (1 - lit) * 0.4) * smoothstep(1 - h, 0, 0.2), { kind: 0 })
  }

  // town: boxes drawn by their edges, a few lit windows
  const edge = (a: THREE.Vector3, b: THREE.Vector3) => {
    const steps = Math.ceil(a.distanceTo(b) / 0.03)
    for (let i = 0; i <= steps; i++) cloud.add(p.copy(a).lerp(b, i / steps), COLORS.graphite, 1, 0.75, { kind: 0 })
  }
  const corners = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
  for (let k = 0; k < 17; k++) {
    const a = random() * Math.PI * 2
    const r = Math.sqrt(random()) * 1.45
    // leave the waterfall side clear
    if (Math.abs(((a - FALL_ANGLE + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.5 && r > 0.8) continue
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    const w = 0.2 + random() * 0.22
    const d = 0.2 + random() * 0.22
    const h = 0.3 + random() * 1.3 * (1 - r / 1.6)
    corners[0].set(x - w, 0, z - d)
    corners[1].set(x + w, 0, z - d)
    corners[2].set(x + w, 0, z + d)
    corners[3].set(x - w, 0, z + d)
    for (let i = 0; i < 4; i++) {
      const c0 = corners[i]
      const c1 = corners[(i + 1) % 4]
      edge(c0, c1)
      edge(c0.clone().setY(h), c1.clone().setY(h))
      edge(c0, c0.clone().setY(h))
    }
    for (let i = 0; i < 6; i++) {
      const side = Math.floor(random() * 4)
      const c0 = corners[side]
      const c1 = corners[(side + 1) % 4]
      p.copy(c0).lerp(c1, 0.2 + random() * 0.6).setY(0.1 + random() * (h - 0.15))
      cloud.add(p, COLORS.accent, 1.6, 0.9, { kind: 0 })
    }
  }

  // trees
  for (let k = 0; k < 11; k++) {
    const a = random() * Math.PI * 2
    const r = 1.2 + random() * 0.9
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    for (let i = 0; i < 70; i++) {
      const t = random()
      const ang = random() * Math.PI * 2
      cloud.add(p.set(x + Math.cos(ang) * 0.13 * (1 - t), 0.08 + t * 0.38, z + Math.sin(ang) * 0.13 * (1 - t)), COLORS.graphite, 1, 0.55, { kind: 0 })
    }
  }

  // waterfall off the rim
  const fall = new THREE.Vector3(Math.cos(FALL_ANGLE), 0, Math.sin(FALL_ANGLE)).multiplyScalar(rimRadius(FALL_ANGLE))
  for (let i = 0; i < 1100; i++) {
    p.copy(fall).addScaledVector(new THREE.Vector3(-Math.sin(FALL_ANGLE), 0, Math.cos(FALL_ANGLE)), (random() - 0.5) * 0.35)
    cloud.add(p, COLORS.mist, 1 + random() * 0.6, 0.55, { kind: 1 })
  }

  // a few rocks floating around it
  for (let k = 0; k < 4; k++) {
    const center = new THREE.Vector3((random() - 0.5) * 6, -0.6 + (random() - 0.5) * 1.6, (random() - 0.5) * 3)
    if (center.length() < 3) center.setLength(3.2)
    const size = 0.12 + random() * 0.16
    for (let i = 0; i < 110; i++) {
      p.copy(center).add(n.randomDirection().multiplyScalar(size * (0.8 + random() * 0.3)))
      cloud.add(p, COLORS.graphite, 1, 0.5, { kind: 2 + k })
    }
  }

  const material = pointsMaterial({
    uniforms: { uFall: { value: new THREE.Vector2(Math.cos(FALL_ANGLE), Math.sin(FALL_ANGLE)) } },
    head: /* glsl */ `
      uniform vec2 uFall;
      attribute float kind;
    `,
    body: /* glsl */ `
      if (kind > 0.5 && kind < 1.5) {
        // water pours over the edge and falls away, thinning into spray
        float t = fract(uTime * 0.32 + seed);
        p.xz += uFall * (0.25 * sqrt(t) + t * 0.15);
        p.y -= t * t * 3.4;
        a *= smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.55, 1.0, t));
        s *= 1.0 + t;
      } else if (kind > 1.5) {
        p.y += sin(uTime * 0.6 + kind * 1.7) * 0.09;
      }
    `,
  })

  const points = cloud.build(material)
  points.position.y = 0.55
  const group = new THREE.Group()
  group.add(points)
  // tip the top toward the camera a little
  group.rotation.x = 0.22
  return {
    object: group,
    extent: 2.6,
    anchors: { town: new THREE.Vector3(0, 1.5, 0) },
    update(time) {
      points.rotation.y = time * 0.07
      points.position.y = 0.55 + Math.sin(time * 0.5) * 0.06
    },
  }
}
