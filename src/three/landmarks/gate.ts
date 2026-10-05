import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial } from '../points'

// A gate in the shape of the logo's Λ that the camera flies through on its way into a chapter.
// It only shows while the camera travels toward it (see JourneyScene), never behind a title.

// the logo's bar-less Λ (src/components/Logo.tsx): outer apex, feet, inner apex, y down
const LAMBDA: [number, number][] = [
  [259.2, 0], [518.4, 720], [475.2, 720], [259.2, 122.4], [43.2, 720], [0, 720],
]
const HEIGHT = 8
/** The route passes this far above the gate's feet (× height), inside the opening. */
const PASS_HEIGHT = 0.3

export function gate(seed: number) {
  const cloud = new Cloud(seed)
  const random = cloud.random
  const scale = HEIGHT / 720
  const toWorld = ([x, y]: [number, number]) => new THREE.Vector3((x - 259.2) * scale, (720 - y) * scale - HEIGHT * PASS_HEIGHT, 0)
  const corners = LAMBDA.map(toWorld)
  const p = new THREE.Vector3()
  const color = new THREE.Color()

  for (let i = 0; i < corners.length; i++) {
    const a = corners[i]
    const b = corners[(i + 1) % corners.length]
    const length = a.distanceTo(b)
    const outer = i === 0 || i === corners.length - 1
    // a crisp dotted outline, plus a looser scatter along each stroke
    const dots = Math.ceil(length / 0.035)
    for (let k = 0; k <= dots; k++) {
      p.copy(a).lerp(b, k / dots)
      const up = (p.y / HEIGHT + PASS_HEIGHT) ** 2
      color.copy(COLORS.graphite).lerp(COLORS.accent, outer ? up : 0)
      cloud.add(p, color, 1.2, 0.75)
    }
    for (let k = 0; k < length * 60; k++) {
      p.copy(a).lerp(b, random())
      p.x += (random() - 0.5) * 0.18
      p.y += (random() - 0.5) * 0.18
      p.z += (random() - 0.5) * 0.5
      cloud.add(p, COLORS.mist, 0.9 + random(), 0.35)
    }
  }

  const material = pointsMaterial({
    body: /* glsl */ `
      p.z += sin(uTime * 0.6 + seed * 9.0) * 0.06;
    `,
  })
  return cloud.build(material)
}
