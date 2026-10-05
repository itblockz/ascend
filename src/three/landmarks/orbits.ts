import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial } from '../points'
import type { Landmark } from './types'

// Grow with Ascend: a glowing core with eight orbits around it, one for each project track of
// the Co-Working Challenge, a bright satellite riding each.

const TRACKS = 8

export function orbits(): Landmark {
  const cloud = new Cloud(113).attribute('ring', 1).attribute('speed', 1)
  const random = cloud.random
  const p = new THREE.Vector3()

  for (let i = 0; i < 700; i++) {
    const y = 1 - (2 * (i + 0.5)) / 700
    const r = Math.sqrt(1 - y * y)
    const a = i * 2.399963
    p.set(Math.cos(a) * r, y, Math.sin(a) * r).multiplyScalar(0.34)
    cloud.add(p, i % 4 ? COLORS.accent : COLORS.ember, 1.2, 0.85, { ring: -1, speed: 0 })
  }

  const tilts: THREE.Euler[] = []
  for (let k = 0; k < TRACKS; k++) {
    const radius = 0.85 + k * 0.24
    const tilt = new THREE.Euler((random() - 0.5) * 1.3, random() * Math.PI, (random() - 0.5) * 1.3)
    tilts.push(tilt)
    const n = Math.round((Math.PI * 2 * radius) / 0.035)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      cloud.add(p.set(Math.cos(a) * radius, 0, Math.sin(a) * radius).applyEuler(tilt), k % 2 ? COLORS.mist : COLORS.graphite, 1.15, 0.55, { ring: -1, speed: 0 })
    }
    // the satellite: a small cluster, moved around its ring in the shader
    const speed = (0.18 + random() * 0.25) * (k % 2 ? 1 : -1)
    for (let i = 0; i < 40; i++) {
      p.randomDirection().multiplyScalar(0.08 * Math.cbrt(random()))
      p.x += radius
      cloud.add(p, k % 3 === 0 ? COLORS.ink : COLORS.accent, 1.4, 0.95, { ring: k, speed })
    }
  }

  // ring tilts as rotation matrices for the shader
  const matrices = tilts.map((t) => new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromEuler(t)))
  const material = pointsMaterial({
    uniforms: { uTilt: { value: matrices } },
    head: /* glsl */ `
      uniform mat3 uTilt[${TRACKS}];
      attribute float ring;
      attribute float speed;
    `,
    body: /* glsl */ `
      if (ring > -0.5) {
        float ang = uTime * speed + ring * 0.8;
        float cs = cos(ang);
        float sn = sin(ang);
        p.xz = mat2(cs, sn, -sn, cs) * p.xz;
        p = uTilt[int(ring)] * p;
      } else if (length(p) < 0.4) {
        p *= 1.0 + sin(uTime * 2.0) * 0.03;
      }
    `,
  })

  const points = cloud.build(material)
  const group = new THREE.Group()
  group.add(points)
  return {
    object: group,
    extent: 2.2,
    anchors: { core: new THREE.Vector3(0, 0.45, 0) },
    update(time) {
      group.rotation.y = time * 0.06
    },
  }
}
