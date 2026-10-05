import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial, sampleCanvasShape, sampleLathe, shade } from '../points'
import type { Landmark } from './types'

// Mistertel's Mystery Jars: a patterned jar with its lid lifting, sparks spiralling out of it
// and gathering into a question mark above.

const LIGHT = new THREE.Vector3(-0.55, 0.6, 0.55).normalize()
const PROFILE = new THREE.SplineCurve(
  [
    [0.42, -1.25], [0.8, -1.02], [1.02, -0.55], [0.98, -0.08], [0.76, 0.33], [0.44, 0.62], [0.38, 0.8], [0.5, 0.9],
  ].map(([r, y]) => new THREE.Vector2(r, y)),
)

export function jar(): Landmark {
  const cloud = new Cloud(83).attribute('kind', 1)
  const random = cloud.random
  const color = new THREE.Color()
  const p = new THREE.Vector3()

  sampleLathe(
    cloud,
    7200,
    (t) => {
      const v = PROFILE.getPoint(t)
      return [v.x, v.y]
    },
    (point, normal) => {
      const lit = Math.max(normal.dot(LIGHT), 0)
      cloud.add(point, shade(lit, color), 1.1, 0.2 + (1 - lit) * 0.45, { kind: 0 })
    },
  )
  // two painted bands of zigzag around the belly (the profile rises steadily, so search it by height)
  const radiusAt = (y: number) => {
    let lo = 0
    let hi = 1
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2
      if (PROFILE.getPoint(mid).y < y) lo = mid
      else hi = mid
    }
    return PROFILE.getPoint(lo).x
  }
  for (const band of [-0.62, -0.12]) {
    const radius = radiusAt(band)
    for (let i = 0; i < 520; i++) {
      const a = (i / 520) * Math.PI * 2
      const zig = Math.abs(((a * 24) / Math.PI) % 2 - 1) - 0.5
      const r = radius * 1.01
      cloud.add(p.set(Math.cos(a) * r, band + zig * 0.12, Math.sin(a) * r), COLORS.accent, 1.15, 0.75, { kind: 0 })
    }
  }

  // the lid, floating just above the mouth
  for (let i = 0; i < 520; i++) {
    const a = random() * Math.PI * 2
    const r = Math.sqrt(random()) * 0.52
    cloud.add(p.set(Math.cos(a) * r, 1.02 + (0.52 - r) * 0.18, Math.sin(a) * r), COLORS.graphite, 1.05, 0.55, { kind: 1 })
  }
  for (let i = 0; i < 90; i++) cloud.add(p.randomDirection().multiplyScalar(0.09).add(new THREE.Vector3(0, 1.2, 0)), COLORS.ink, 1.1, 0.7, { kind: 1 })

  // sparks spiralling up out of the jar
  for (let i = 0; i < 1500; i++) cloud.add(p.set(0, 0, 0), random() < 0.5 ? COLORS.accent : COLORS.ember, 1 + random() * 1.1, 0.85, { kind: 2 })

  // the question mark they gather into
  const glyph = sampleCanvasShape((ctx, size) => {
    ctx.font = `600 ${size * 0.9}px Montserrat, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('?', size / 2, size * 0.54)
  }, 160)
  for (let i = 0; i < 900 && glyph.length; i++) {
    const [gx, gy] = glyph[Math.floor(random() * glyph.length)]
    cloud.add(p.set(gx * 1.3 + (random() - 0.5) * 0.01, 2.55 + gy * 1.3, (random() - 0.5) * 0.08), COLORS.accent, 1.2, 0.8, { kind: 3 })
  }

  const material = pointsMaterial({
    head: /* glsl */ `attribute float kind;`,
    body: /* glsl */ `
      if (kind < 1.5) {
        // the jar and lid turn slowly; the question mark keeps facing us
        float ang = uTime * 0.18;
        float cs = cos(ang);
        float sn = sin(ang);
        p.xz = mat2(cs, sn, -sn, cs) * p.xz;
      }
      if (kind > 0.5 && kind < 1.5) {
        p.y += 0.14 + sin(uTime * 1.3) * 0.06;
      } else if (kind > 1.5 && kind < 2.5) {
        // up through the neck, then fanning out
        float u = fract(uTime * 0.1 + seed);
        float r = u < 0.55 ? mix(0.62, 0.16, u / 0.55) : mix(0.16, 1.15, (u - 0.55) / 0.45);
        float ang = seed * 6.2832 + u * 9.0 + uTime * 0.5;
        p = vec3(cos(ang) * r, mix(-0.85, 2.3, u), sin(ang) * r);
        a *= smoothstep(0.0, 0.12, u) * (1.0 - smoothstep(0.7, 1.0, u));
      } else if (kind > 2.5) {
        p.y += sin(uTime * 0.8) * 0.06;
        a *= 0.55 + 0.45 * sin(uTime * 2.0 + seed * 30.0);
      }
    `,
  })

  const points = cloud.build(material)
  points.position.y = -0.75
  const group = new THREE.Group()
  group.add(points)
  group.rotation.x = 0.12
  return {
    object: group,
    extent: 2.1,
    anchors: { mouth: new THREE.Vector3(0.45, 0.25, 0) },
  }
}
