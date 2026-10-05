import * as THREE from 'three'
import { COLORS, Cloud, pointsMaterial } from '../points'
import type { Landmark } from './types'

// AI Kru Muay Thai: a fighter made of points, bouncing in guard and throwing a knee now and
// then, with the pose-estimation skeleton (bones and joint rings) drawn over the body in orange.
// Every point is tied to a bone; the joints live in a uniform array the CPU animates.

// joints
const HEAD = 0
const NECK = 1
const CHEST = 2
const PELVIS = 3
const L_SHOULDER = 4
const L_ELBOW = 5
const L_WRIST = 6
const R_SHOULDER = 7
const R_ELBOW = 8
const R_WRIST = 9
const L_HIP = 10
const L_KNEE = 11
const L_ANKLE = 12
const R_HIP = 13
const R_KNEE = 14
const R_ANKLE = 15
const L_TOE = 16
const R_TOE = 17
const JOINTS = 18

type Pose = [number, number, number][]

// facing +x, left side toward +z; ankles on the ground (y = 0)
const GUARD: Pose = [
  [0.1, 2.93, 0], [0.05, 2.62, 0], [0.02, 2.25, 0], [0, 1.62, 0],
  [0.1, 2.52, 0.25], [0.33, 2.12, 0.31], [0.43, 2.58, 0.17],
  [-0.05, 2.52, -0.25], [0.19, 2.1, -0.31], [0.31, 2.62, -0.12],
  [0.04, 1.6, 0.14], [0.31, 0.88, 0.2], [0.43, 0.06, 0.22],
  [-0.04, 1.6, -0.14], [-0.2, 0.86, -0.18], [-0.45, 0.06, -0.2],
  [0.65, 0.02, 0.22], [-0.24, 0.02, -0.2],
]
// right knee driven up, arms pulling into the clinch, leaning back
const KNEE: Pose = [
  [-0.06, 2.95, 0], [-0.07, 2.65, 0], [-0.04, 2.27, 0], [0.05, 1.68, 0],
  [0, 2.55, 0.25], [0.36, 2.36, 0.28], [0.63, 2.55, 0.1],
  [-0.13, 2.55, -0.25], [0.23, 2.4, -0.26], [0.61, 2.58, -0.08],
  [0.07, 1.66, 0.14], [0.13, 0.9, 0.18], [0.03, 0.08, 0.2],
  [0.05, 1.66, -0.14], [0.64, 1.95, -0.1], [0.2, 1.25, -0.12],
  [0.25, 0.02, 0.2], [0.38, 1.12, -0.12],
]

// bones: [from, to, radius of the body around it]
const BONES: [number, number, number][] = [
  [NECK, CHEST, 0.19], [CHEST, PELVIS, 0.2],
  [NECK, L_SHOULDER, 0.08], [L_SHOULDER, L_ELBOW, 0.085], [L_ELBOW, L_WRIST, 0.07],
  [NECK, R_SHOULDER, 0.08], [R_SHOULDER, R_ELBOW, 0.085], [R_ELBOW, R_WRIST, 0.07],
  [PELVIS, L_HIP, 0.12], [L_HIP, L_KNEE, 0.12], [L_KNEE, L_ANKLE, 0.085], [L_ANKLE, L_TOE, 0.05],
  [PELVIS, R_HIP, 0.12], [R_HIP, R_KNEE, 0.12], [R_KNEE, R_ANKLE, 0.085], [R_ANKLE, R_TOE, 0.05],
]
const RINGED = [HEAD, NECK, L_SHOULDER, L_ELBOW, L_WRIST, R_SHOULDER, R_ELBOW, R_WRIST, PELVIS, L_KNEE, L_ANKLE, R_KNEE, R_ANKLE]

const HEIGHT = 3.2
/** The poses are in a 3.2-unit-tall figure; drawn this much bigger. */
const SCALE = 1.3
const CYCLE = 4.4
const { smoothstep } = THREE.MathUtils

export function fighter(): Landmark {
  const cloud = new Cloud(79)
    .attribute('boneA', 1)
    .attribute('boneB', 1)
    .attribute('along', 1)
    .attribute('angle', 1)
    .attribute('radius', 1)
    .attribute('kind', 1)
  const random = cloud.random
  const origin = new THREE.Vector3()

  // body surface around each bone, more points on the bigger ones
  for (const [a, b, r] of BONES) {
    const length = new THREE.Vector3(...GUARD[a]).distanceTo(new THREE.Vector3(...GUARD[b]))
    const count = Math.round(length * r * 5200) + 40
    for (let i = 0; i < count; i++) {
      cloud.add(origin, COLORS.graphite, 1.05, 0.5, { boneA: a, boneB: b, along: random(), angle: random() * Math.PI * 2, radius: r * SCALE, kind: 0 })
    }
  }
  // the head: a sphere around its joint
  for (let i = 0; i < 800; i++) {
    cloud.add(origin, COLORS.graphite, 1.05, 0.5, { boneA: HEAD, boneB: HEAD, along: random(), angle: random() * Math.PI * 2, radius: 0.2 * SCALE, kind: 0 })
  }
  // the pose-estimation overlay: bones as lines (plus the neck to head), rings at the joints
  for (const [a, b] of [...BONES, [HEAD, NECK, 0] as [number, number, number]]) {
    for (let i = 0; i <= 40; i++) cloud.add(origin, COLORS.accent, 1.05, 0.95, { boneA: a, boneB: b, along: i / 40, angle: 0, radius: 0, kind: 1 })
  }
  for (const j of RINGED) {
    for (let i = 0; i < 22; i++) cloud.add(origin, COLORS.accent, 1.1, 0.95, { boneA: j, boneB: j, along: 0, angle: (i / 22) * Math.PI * 2, radius: 0.07 * SCALE, kind: 2 })
  }
  // a faint footprint on the floor
  for (let i = 0; i < 260; i++) {
    const a = (i / 260) * Math.PI * 2
    cloud.add(new THREE.Vector3(Math.cos(a) * 0.95 * SCALE, 0, Math.sin(a) * 0.5 * SCALE), COLORS.stone, 1, 0.45, { boneA: -1, boneB: -1, kind: 3 })
  }

  const joints = Array.from({ length: JOINTS }, () => new THREE.Vector3())
  const material = pointsMaterial({
    uniforms: { uJ: { value: joints }, uLight: { value: new THREE.Vector3(-0.4, 0.6, 0.7).normalize() }, uInk: { value: COLORS.ink }, uMist: { value: COLORS.mist } },
    head: /* glsl */ `
      uniform vec3 uJ[${JOINTS}];
      uniform vec3 uLight;
      uniform vec3 uInk;
      uniform vec3 uMist;
      attribute float boneA;
      attribute float boneB;
      attribute float along;
      attribute float angle;
      attribute float radius;
      attribute float kind;
    `,
    body: /* glsl */ `
      if (kind < 2.5) {
        vec3 A = uJ[int(boneA)];
        vec3 B = uJ[int(boneB)];
        vec3 normal = vec3(0.0, 1.0, 0.0);
        if (kind > 1.5) {
          // joint ring, facing the viewer
          p = A + vec3(cos(angle), sin(angle), 0.0) * radius;
        } else if (boneA == boneB) {
          float ct = along * 2.0 - 1.0;
          float st = sqrt(1.0 - ct * ct);
          normal = vec3(cos(angle) * st, ct, sin(angle) * st);
          p = A + normal * radius;
        } else {
          vec3 dir = normalize(B - A);
          vec3 ref = abs(dir.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
          vec3 u = normalize(cross(dir, ref));
          vec3 v = cross(dir, u);
          normal = cos(angle) * u + sin(angle) * v;
          // limbs narrow a little toward the far joint
          p = mix(A, B, along) + normal * radius * (1.0 - 0.18 * along);
        }
        if (kind < 0.5) {
          float lit = max(dot(normal, uLight), 0.0);
          c = mix(uInk, uMist, lit * 0.85);
          a = 0.2 + (1.0 - lit) * 0.42;
        }
      }
    `,
  })

  const points = cloud.build(material)
  points.position.y = (-HEIGHT * SCALE) / 2
  const group = new THREE.Group()
  group.add(points)
  // three-quarter view, facing left toward the text
  group.rotation.y = Math.PI + 0.62

  const knee = new THREE.Vector3()
  const guard = GUARD.map((j) => new THREE.Vector3(...j).multiplyScalar(SCALE))
  const strike = KNEE.map((j) => new THREE.Vector3(...j).multiplyScalar(SCALE))
  const update = (time: number) => {
    const t = time % CYCLE
    const w = smoothstep(t, 2.5, 2.85) * (1 - smoothstep(t, 3.5, 3.95))
    // the guard bounces on the balls of the feet
    const bounce = Math.abs(Math.sin(time * Math.PI * 1.1)) * 0.045 * (1 - w)
    for (let i = 0; i < JOINTS; i++) {
      joints[i].copy(guard[i]).lerp(strike[i], w)
      // feet stay planted while the body bounces
      if (i !== L_ANKLE && i !== R_ANKLE && i !== L_TOE && i !== R_TOE) joints[i].y += bounce
    }
    knee.copy(joints[R_KNEE]).add(points.position)
  }
  update(0)

  return {
    object: group,
    extent: 2.3,
    anchors: { knee },
    update,
  }
}
