import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial } from '../points'
import type { Landmark } from './types'

// UNESCO "Sustaining Our Oceans": a rolling sea drawn as rows of points (each row a wave
// ridge), seen from a little above, crests catching the orange, bubbles rising from below.

const WIDTH = 7.6
const DEPTH = 3.6
const NX = 260
const NZ = 30
const BUBBLES = 520

const { smoothstep } = THREE.MathUtils

export function ocean(): Landmark {
  const cloud = new Cloud(11).attribute('kind', 1)
  const color = new THREE.Color()
  const p = new THREE.Vector3()

  for (let i = 0; i < NX; i++) {
    for (let j = 0; j < NZ; j++) {
      p.set(
        (i / (NX - 1) - 0.5) * WIDTH + (cloud.random() - 0.5) * 0.02,
        0,
        (j / (NZ - 1) - 0.5) * DEPTH,
      )
      // no hard border: the sea thins out toward its edges
      const edge = smoothstep(WIDTH / 2 - Math.abs(p.x), 0, 1.8) * smoothstep(DEPTH / 2 - Math.abs(p.z), 0, 1.1)
      const near = (p.z + DEPTH / 2) / DEPTH
      color.copy(COLORS.mist).lerp(COLORS.graphite, near * 0.8)
      cloud.add(p, color, 1.2 + near * 0.6, (0.22 + near * 0.6) * edge, { kind: 0 })
    }
  }

  for (let i = 0; i < BUBBLES; i++) {
    p.set((cloud.random() - 0.5) * WIDTH * 0.6, -1.9 + cloud.random() * 0.3, (cloud.random() - 0.5) * DEPTH * 0.6)
    cloud.add(p, COLORS.mist, 1 + cloud.random() * 1.4, 0.45, { kind: 1 })
  }

  const material = pointsMaterial({
    uniforms: { uAccent: { value: COLORS.accent } },
    head: /* glsl */ `
      uniform vec3 uAccent;
      attribute float kind;
    `,
    body: /* glsl */ `
      if (kind < 0.5) {
        float h = 0.3 * sin(p.x * 1.15 + uTime * 0.9)
          + 0.18 * sin(p.z * 2.3 + p.x * 0.55 + uTime * 0.7)
          + 0.07 * sin(p.x * 3.6 - uTime * 1.6 + p.z * 1.3);
        p.y += h;
        float crest = smoothstep(0.34, 0.52, h);
        c = mix(c, uAccent, crest * 0.85);
        a *= 1.0 + crest * 0.9;
        s *= 1.0 + crest * 0.5;
      } else {
        // bubbles drift up toward the surface on a loop
        float t = fract(uTime * 0.11 + seed);
        p.y += t * 1.9;
        p.x += sin(t * 9.0 + seed * 20.0) * 0.08;
        a *= smoothstep(0.0, 0.15, t) * (1.0 - smoothstep(0.7, 1.0, t));
      }
    `,
  })

  const group = new THREE.Group()
  const sea = cloud.build(material)
  // tip the far edge up, so we look down onto the water
  sea.rotation.x = 0.5
  group.add(sea)

  return {
    object: group,
    extent: 3.8,
    anchors: { crest: new THREE.Vector3(0.3, 0.45, -0.4).applyEuler(sea.rotation) },
  }
}
