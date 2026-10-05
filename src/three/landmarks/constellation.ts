import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial } from '../points'
import type { Landmark } from './types'

// A-S-C-E-N-D: six stars climbing from lower left to upper right, linked in order. As the
// visitor scrolls through the values, the current star lights orange and the path behind it
// fills in.

export const VALUE_NODES = [0, 1, 2, 3, 4, 5].map(
  (i) => new THREE.Vector3(-2.2 + i * 0.88, -1.5 + i * 0.6 + (i % 2 ? 0.3 : -0.3), i % 2 ? 0.45 : -0.45),
)

export interface Constellation extends Landmark {
  setActive(value: number): void
}

export function constellation(): Constellation {
  const cloud = new Cloud(101).attribute('node', 1).attribute('link', 1)
  const random = cloud.random
  const p = new THREE.Vector3()

  VALUE_NODES.forEach((c, node) => {
    for (let i = 0; i < 260; i++) {
      p.randomDirection().multiplyScalar(0.2 * Math.cbrt(random())).add(c)
      cloud.add(p, COLORS.ink, 1.5, 0.85, { node, link: -1 })
    }
    // a ring around each star
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 2
      cloud.add(p.set(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0).add(c), COLORS.mist, 1.1, 0.6, { node, link: -1 })
    }
  })
  for (let i = 0; i < VALUE_NODES.length - 1; i++) {
    const a = VALUE_NODES[i]
    const b = VALUE_NODES[i + 1]
    const steps = Math.ceil(a.distanceTo(b) / 0.025)
    for (let k = 0; k <= steps; k++) cloud.add(p.copy(a).lerp(b, k / steps), COLORS.ink, 1.2, 0.7, { node: -1, link: i + k / steps })
  }
  // a drift of dust rising along the path
  for (let i = 0; i < 900; i++) {
    const t = random() * 5
    const k = Math.min(Math.floor(t), 4)
    p.copy(VALUE_NODES[k]).lerp(VALUE_NODES[k + 1], t - k)
    p.x += (random() - 0.5) * 0.9
    p.y += (random() - 0.5) * 0.9
    p.z += (random() - 0.5) * 0.9
    cloud.add(p, COLORS.mist, 0.9, 0.3, { node: -2, link: -1 })
  }

  const active = { value: 0 }
  const material = pointsMaterial({
    uniforms: { uActive: active, uAccent: { value: COLORS.accent }, uMist: { value: COLORS.mist } },
    head: /* glsl */ `
      uniform float uActive;
      uniform vec3 uAccent;
      uniform vec3 uMist;
      attribute float node;
      attribute float link;
    `,
    body: /* glsl */ `
      if (node > -0.5) {
        float on = smoothstep(0.75, 0.0, abs(node - uActive));
        float reached = step(node, uActive + 0.5);
        c = mix(mix(uMist, c, reached), uAccent, on);
        s *= 1.0 + on * 0.8;
        a *= (0.4 + 0.6 * max(on, reached * 0.7)) * (1.0 + on * 0.3 * sin(uTime * 3.0));
      } else if (link > -0.5) {
        // the path fills in up to the current star
        float done = smoothstep(uActive + 0.05, uActive - 0.05, link);
        c = mix(uMist, uAccent, done);
        a *= mix(0.45, 1.0, done);
      } else {
        p.y += fract(uTime * 0.05 + seed) * 0.8 - 0.4;
        a *= sin(3.14159 * fract(uTime * 0.05 + seed));
      }
    `,
  })

  const points = cloud.build(material)
  const group = new THREE.Group()
  group.add(points)
  return {
    object: group,
    extent: 3.4,
    anchors: Object.fromEntries(VALUE_NODES.map((v, i) => [String(i), v.clone().add(new THREE.Vector3(0, 0.55, 0))])),
    setActive(value) {
      active.value = value
    },
    update(time) {
      group.rotation.y = Math.sin(time * 0.18) * 0.12
    },
  }
}
