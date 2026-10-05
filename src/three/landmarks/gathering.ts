import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial, shade } from '../points'
import type { Landmark } from './types'

// Aomunity × GSB: avatars gathered on a hexagon-tiled plaza around a rising spiral of coins
// ("aom" means saving), each wired to the centre.

const PLAZA_R = 2.35
const AVATARS = 14
const COINS = 22
const LIGHT = new THREE.Vector3(-0.5, 0.8, 0.4).normalize()

export function gathering(): Landmark {
  const cloud = new Cloud(67).attribute('kind', 1).attribute('phase', 1).attribute('lineT', 1)
  const random = cloud.random
  const color = new THREE.Color()
  const p = new THREE.Vector3()
  const n = new THREE.Vector3()

  // hexagonal floor tiles: a dot at every tile corner
  const tile = 0.2
  for (let q = -14; q <= 14; q++) {
    for (let r = -14; r <= 14; r++) {
      const cx = tile * Math.sqrt(3) * (q + r / 2)
      const cz = tile * 1.5 * r
      for (let k = 0; k < 6; k += 2) {
        const a = (Math.PI / 3) * k + Math.PI / 6
        p.set(cx + Math.cos(a) * tile, 0, cz + Math.sin(a) * tile)
        const d = Math.hypot(p.x, p.z)
        if (d > PLAZA_R) continue
        cloud.add(p, COLORS.stone, 1, 0.42 * (1 - (d / PLAZA_R) ** 4), { kind: 0 })
      }
    }
  }
  for (let i = 0; i < 520; i++) {
    const a = (i / 520) * Math.PI * 2
    cloud.add(p.set(Math.cos(a) * PLAZA_R, 0, Math.sin(a) * PLAZA_R), COLORS.graphite, 1.1, 0.6, { kind: 0 })
  }

  // avatars: a capsule body and a round head, facing the centre
  const centre = new THREE.Vector3(0, 0.62, 0)
  for (let k = 0; k < AVATARS; k++) {
    const a = (k / AVATARS) * Math.PI * 2 + (random() - 0.5) * 0.18
    const r = 1.62 + (random() - 0.5) * 0.25
    const base = new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)
    const highlight = k % 5 === 1
    const phase = random() * Math.PI * 2
    for (let i = 0; i < 240; i++) {
      const isHead = i < 70
      if (isHead) {
        n.randomDirection()
        p.copy(n).multiplyScalar(0.085).add(base).setY(0.56 + n.y * 0.085)
      } else {
        const ang = random() * Math.PI * 2
        const y = 0.05 + random() * 0.38
        // rounded shoulders: narrow the body near its top
        const rr = 0.1 * Math.sqrt(1 - Math.max(0, (y - 0.36) / 0.1) ** 2)
        n.set(Math.cos(ang), 0, Math.sin(ang))
        p.set(base.x + n.x * rr, y, base.z + n.z * rr)
      }
      const lit = Math.max(n.dot(LIGHT), 0)
      const c = highlight ? COLORS.accent : shade(lit, color)
      cloud.add(p, c, 1.1, highlight ? 0.85 : 0.3 + (1 - lit) * 0.45, { kind: 1, phase })
    }
    // a line from each avatar to the centre, with a pulse flowing inward
    const head = base.clone().setY(0.56)
    for (let i = 0; i <= 70; i++) {
      const t = i / 70
      cloud.add(p.copy(head).lerp(centre, t), COLORS.mist, 1, 0.22, { kind: 2, lineT: t, phase })
    }
  }

  // a spiral of coins rising from the middle
  for (let k = 0; k < COINS; k++) {
    const t = k / (COINS - 1)
    const a = k * 0.62
    const c = new THREE.Vector3(Math.cos(a) * 0.32, 0.25 + t * 2.4, Math.sin(a) * 0.32)
    const tilt = new THREE.Euler(0.5 + random() * 0.6, a, random() * 0.4)
    for (let i = 0; i < 60; i++) {
      const ang = (i / 60) * Math.PI * 2
      const rr = i % 3 === 0 ? 0.08 : 0.14
      p.set(Math.cos(ang) * rr, 0, Math.sin(ang) * rr).applyEuler(tilt).add(c)
      cloud.add(p, i % 3 === 0 ? COLORS.ember : COLORS.accent, 1.15, 0.85 * (1 - t * 0.45), { kind: 3 })
    }
  }

  const material = pointsMaterial({
    head: /* glsl */ `
      attribute float kind;
      attribute float phase;
      attribute float lineT;
    `,
    body: /* glsl */ `
      if (kind > 0.5 && kind < 1.5) {
        p.y += max(sin(uTime * 1.6 + phase), 0.0) * 0.035;
      } else if (kind > 1.5 && kind < 2.5) {
        float lag = fract(uTime * 0.3 + phase * 0.16 - lineT);
        a += smoothstep(0.15, 0.0, lag) * 0.6;
      } else if (kind > 2.5) {
        float ang = uTime * 0.25;
        float cs = cos(ang);
        float sn = sin(ang);
        p.xz = mat2(cs, sn, -sn, cs) * p.xz;
      }
    `,
  })

  const points = cloud.build(material)
  points.position.y = -0.95
  const group = new THREE.Group()
  group.add(points)
  group.rotation.x = 0.3
  return {
    object: group,
    extent: 2.6,
    anchors: { coins: new THREE.Vector3(0, 1.35, 0) },
    update(time) {
      points.rotation.y = time * 0.05
    },
  }
}
