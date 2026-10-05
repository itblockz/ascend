import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial } from '../points'
import type { Landmark } from './types'

// "Choose your path": three linked nodes (government, business, talent). The chosen one turns
// orange and grows; signals keep running between all three.

const RADIUS = 1.9
const NODE_R = 0.42

export interface Triad extends Landmark {
  select(index: number): void
}

export function triad(): Triad {
  const cloud = new Cloud(97).attribute('node', 1).attribute('lineT', 1)
  const random = cloud.random
  const p = new THREE.Vector3()
  const centers = [0, 1, 2].map((i) => {
    const a = Math.PI / 2 + (i * Math.PI * 2) / 3
    return new THREE.Vector3(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS, 0)
  })

  centers.forEach((c, node) => {
    // a shell of evenly spread points around a denser core
    const shell = 520
    for (let i = 0; i < shell; i++) {
      const y = 1 - (2 * (i + 0.5)) / shell
      const r = Math.sqrt(1 - y * y)
      const a = i * 2.399963
      p.set(Math.cos(a) * r, y, Math.sin(a) * r).multiplyScalar(NODE_R).add(c)
      cloud.add(p, COLORS.graphite, 1.1, 0.55, { node })
    }
    for (let i = 0; i < 140; i++) {
      p.randomDirection().multiplyScalar(NODE_R * 0.45 * Math.cbrt(random())).add(c)
      cloud.add(p, COLORS.ink, 1.3, 0.75, { node })
    }
  })
  // links between every pair, carrying pulses
  for (let i = 0; i < 3; i++) {
    const a = centers[i]
    const b = centers[(i + 1) % 3]
    for (let k = 0; k <= 160; k++) {
      const t = k / 160
      cloud.add(p.copy(a).lerp(b, t), COLORS.mist, 1, 0.35, { node: -1, lineT: t + i })
    }
  }

  const selection = { value: -1 }
  const highlight = { value: 0 }
  const material = pointsMaterial({
    uniforms: { uSel: selection, uMix: highlight, uAccent: { value: COLORS.accent } },
    head: /* glsl */ `
      uniform float uSel;
      uniform float uMix;
      uniform vec3 uAccent;
      attribute float node;
      attribute float lineT;
    `,
    body: /* glsl */ `
      if (node > -0.5) {
        float on = (1.0 - min(abs(node - uSel), 1.0)) * uMix;
        c = mix(c, uAccent, on);
        s *= 1.0 + on * 0.5;
        a *= mix(0.75, 1.15, on);
        p *= 1.0 + sin(uTime * 1.2 + node * 2.0) * 0.01;
      } else {
        float lag = fract(uTime * 0.25 - fract(lineT));
        a += smoothstep(0.12, 0.0, lag) * 0.6;
      }
    `,
  })

  const points = cloud.build(material)
  const group = new THREE.Group()
  group.add(points)
  let target = 0
  return {
    object: group,
    extent: 2.4,
    select(index) {
      selection.value = index
      target = index >= 0 ? 1 : 0
    },
    update(time) {
      highlight.value += (target - highlight.value) * 0.08
      group.rotation.y = Math.sin(time * 0.2) * 0.25
      group.rotation.x = Math.sin(time * 0.15) * 0.1
    },
  }
}
