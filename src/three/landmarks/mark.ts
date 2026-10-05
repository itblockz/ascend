import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial, sampleCanvasShape } from '../points'
import type { Landmark } from './types'

// Arrival: the Λ from the ASCEND logo, assembling out of scattered dust as the camera comes in,
// shading from ink at its feet to orange at its apex.

// the bar-less Λ polygon from the logo (src/components/Logo.tsx), 518.4 × 720 units
const LAMBDA = [
  [259.2, 0], [518.4, 720], [475.2, 720], [259.2, 122.4], [43.2, 720], [0, 720],
]
const HEIGHT = 3.4
const COUNT = 9000

export interface Mark extends Landmark {
  setAssemble(value: number): void
}

export function mark(): Mark {
  const cloud = new Cloud(127).attribute('from', 3)
  const random = cloud.random
  const filled = sampleCanvasShape((ctx, size) => {
    const scale = (size * 0.94) / 720
    ctx.translate((size - 518.4 * scale) / 2, size * 0.03)
    ctx.scale(scale, scale)
    ctx.beginPath()
    LAMBDA.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.closePath()
    ctx.fill()
  }, 512)

  const p = new THREE.Vector3()
  const from = new THREE.Vector3()
  const color = new THREE.Color()
  const pixel = 1 / 512
  for (let i = 0; i < COUNT && filled.length; i++) {
    const [x, y] = filled[Math.floor(random() * filled.length)]
    p.set((x + (random() - 0.5) * pixel) * HEIGHT, (y + (random() - 0.5) * pixel) * HEIGHT, (random() - 0.5) * 0.22)
    // ascend: ink at the feet, orange toward the apex
    const up = THREE.MathUtils.clamp(p.y / HEIGHT + 0.5, 0, 1)
    color.copy(COLORS.ink).lerp(COLORS.accent, THREE.MathUtils.smoothstep(up, 0.35, 1))
    from.randomDirection().multiplyScalar(2.5 + random() * 4)
    from.y = Math.abs(from.y) * -0.6 - 1
    cloud.add(p, color, 1.15 + up * 0.4, 0.75, { from: [from.x, from.y, from.z] })
  }

  const assemble = { value: 0 }
  const material = pointsMaterial({
    uniforms: { uAssemble: assemble },
    head: /* glsl */ `
      uniform float uAssemble;
      attribute vec3 from;
    `,
    body: /* glsl */ `
      // each point leaves its scattered spot at its own moment, lower ones first
      float k = clamp(uAssemble * 1.6 - seed * 0.6, 0.0, 1.0);
      k = k * k * (3.0 - 2.0 * k);
      p = mix(from, p, k) + vec3(0.0, sin(uTime * 0.7 + seed * 12.0) * 0.012, 0.0);
      a *= 0.25 + 0.75 * k;
    `,
  })

  const points = cloud.build(material)
  const group = new THREE.Group()
  group.add(points)
  return {
    object: group,
    extent: 1.9,
    setAssemble(value) {
      assemble.value = value
    },
    update(time) {
      group.rotation.y = Math.sin(time * 0.3) * 0.18
    },
  }
}
