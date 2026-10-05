import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial } from '../points'
import type { Landmark } from './types'

// Thai soft power abroad: a dotted globe with arcs from Bangkok to New Delhi, Canberra and
// Sydney, light running along them.

const R = 2.05
const DEG = Math.PI / 180

const CITIES = {
  bangkok: [13.75, 100.5],
  delhi: [28.61, 77.21],
  canberra: [-35.28, 149.13],
  sydney: [-33.87, 151.21],
} as const

// the view is centered between Bangkok and Australia
const VIEW_LAT = -6
const VIEW_LON = 118

function toVector(lat: number, lon: number, radius = R) {
  const la = lat * DEG
  const lo = lon * DEG
  return new THREE.Vector3(Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)).multiplyScalar(radius)
}

export function globe(): Landmark {
  const cloud = new Cloud(23).attribute('kind', 1).attribute('arcT', 1).attribute('arc', 1)
  const p = new THREE.Vector3()

  // latitude rings and meridians, dotted
  for (let lat = -75; lat <= 75; lat += 15) {
    const n = Math.round((2 * Math.PI * R * Math.cos(lat * DEG)) / 0.045)
    for (let i = 0; i < n; i++) cloud.add(toVector(lat, (i / n) * 360), COLORS.graphite, 1.2, 0.5, { kind: 0 })
  }
  for (let lon = 0; lon < 360; lon += 20) {
    const n = Math.round((Math.PI * R) / 0.05)
    for (let i = 1; i < n; i++) cloud.add(toVector(-90 + (i / n) * 180, lon), COLORS.mist, 1.1, 0.5, { kind: 0 })
  }
  // a fine sprinkle over the surface
  for (let i = 0; i < 2600; i++) {
    const z = cloud.random() * 2 - 1
    const a = cloud.random() * Math.PI * 2
    const r = Math.sqrt(1 - z * z)
    p.set(Math.cos(a) * r, z, Math.sin(a) * r).multiplyScalar(R)
    cloud.add(p, COLORS.graphite, 1, 0.32, { kind: 0 })
  }

  // city markers: a small ring on the surface and a dot in the middle
  const anchors: Record<string, THREE.Vector3> = {}
  const tangent = new THREE.Vector3()
  const bitangent = new THREE.Vector3()
  for (const [name, [lat, lon]] of Object.entries(CITIES)) {
    const center = toVector(lat, lon)
    const normal = center.clone().normalize()
    tangent.set(0, 1, 0).cross(normal).normalize()
    bitangent.copy(normal).cross(tangent)
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2
      p.copy(center).addScaledVector(tangent, Math.cos(a) * 0.09).addScaledVector(bitangent, Math.sin(a) * 0.09)
      cloud.add(p, COLORS.accent, 1.2, 0.95, { kind: 0 })
    }
    cloud.add(center, COLORS.accent, 3, 1, { kind: 0 })
    anchors[name] = center.clone().multiplyScalar(1.02)
  }

  // arcs from Bangkok: a faint dotted path, and a bright pulse that runs along it
  const from = toVector(...CITIES.bangkok).normalize()
  ;(['delhi', 'canberra', 'sydney'] as const).forEach((name, arc) => {
    const [lat, lon] = CITIES[name]
    const to = toVector(lat, lon).normalize()
    const angle = from.angleTo(to)
    const lift = 0.12 + angle * 0.28
    for (let i = 0; i <= 240; i++) {
      const t = i / 240
      p.copy(from).lerp(to, t).normalize().multiplyScalar(R * (1 + Math.sin(Math.PI * t) * lift))
      cloud.add(p, COLORS.ember, 1.1, 0.3, { kind: 1, arcT: t, arc })
      cloud.add(p, COLORS.accent, 2.2, 1, { kind: 2, arcT: t, arc })
    }
  })

  const material = pointsMaterial({
    head: /* glsl */ `
      attribute float kind;
      attribute float arcT;
      attribute float arc;
    `,
    body: /* glsl */ `
      if (kind > 1.5) {
        // a bright head with a tail behind it, travelling from Bangkok outward
        float lag = fract(uTime * 0.2 + arc * 0.37 - arcT);
        a *= smoothstep(0.2, 0.0, lag);
        s *= 0.6 + smoothstep(0.05, 0.0, lag) * 0.8;
      }
    `,
  })

  const points = cloud.build(material)
  const group = new THREE.Group()
  group.add(points)
  // turn the view center toward the camera (Y first, then X)
  points.rotation.set(VIEW_LAT * DEG, -VIEW_LON * DEG, 0)
  for (const v of Object.values(anchors)) v.applyEuler(points.rotation)

  return {
    object: group,
    extent: 2.6,
    anchors,
    update(time) {
      group.rotation.y = Math.sin(time * 0.12) * 0.08
    },
  }
}
