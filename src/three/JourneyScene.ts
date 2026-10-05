import * as THREE from 'three'
import { STOPS, type LandmarkId, type StopKind } from '../journey/stops'
import { bowl } from './landmarks/bowl'
import { constellation, type Constellation } from './landmarks/constellation'
import { fighter } from './landmarks/fighter'
import { gate } from './landmarks/gate'
import { gathering } from './landmarks/gathering'
import { globe } from './landmarks/globe'
import { head } from './landmarks/head'
import { island } from './landmarks/island'
import { jar } from './landmarks/jar'
import { mark, type Mark } from './landmarks/mark'
import { ocean } from './landmarks/ocean'
import { orb } from './landmarks/orb'
import { orbits } from './landmarks/orbits'
import { triad, type Triad } from './landmarks/triad'
import type { Landmark } from './landmarks/types'
import { COLORS, Cloud, pointsMaterial } from './points'

const FOV = 35
// the hero camera frames the orb; every later stop is this much further down the route
const FIRST_STOP = new THREE.Vector3(0, 0, 10)
const SPACING = 36
// sideways and vertical swing of each stop, so the route winds instead of running straight
const SWING: [number, number][] = [
  [0, 0], [-3.6, 1], [2, -1], [-2, 1.5], [1, 0], [3, 1], [-1, -1], [0, 1.5], [2.5, 0],
  [-2, 1], [1, -1], [-1, 0], [2, 1], [0, 0], [-2, 1.5], [1.5, 0], [0, 0.5],
]
/** How far in front of its stop a landmark floats. */
const LANDMARK_DISTANCE = 13
/** Wide screens put landmarks beside the text; narrower ones stack them above it. */
const WIDE = 1024
/** Narrow screens: how high a landmark sits (× visible height) and how much of the width/height it may fill. */
const NARROW_FIT: Partial<Record<StopKind, [number, number, number]>> = {
  poi: [0.18, 0.44, 0.27],
  choice: [0.26, 0.38, 0.19],
  values: [0.26, 0.38, 0.19],
  careers: [0.26, 0.38, 0.19],
  end: [0.33, 0.3, 0.13],
}
const DUST = 7000
// Λ gates the camera flies through on its way into each chapter, as positions along the route
// (in stops): leaving the hero, then just after each chapter's title card
const GATES = [0.62, 1.5, 4.5, 7.5, 10.5]

const FACTORIES: Record<LandmarkId, () => Landmark> = {
  orb,
  ocean,
  globe,
  head,
  bowl,
  island,
  gathering,
  fighter,
  jar,
  triad,
  constellation,
  orbits,
  mark,
}

const { clamp } = THREE.MathUtils

export interface ScreenPoint {
  x: number
  y: number
  visible: boolean
}

export class JourneyScene {
  readonly renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200)
  private stopCameras = STOPS.map((_, i) =>
    i === 0 ? FIRST_STOP.clone() : new THREE.Vector3(SWING[i][0], SWING[i][1], FIRST_STOP.z - SPACING * i),
  )
  private route = new THREE.CatmullRomCurve3(this.stopCameras, false, 'centripetal')
  private landmarks: (Landmark | null)[] = STOPS.map(() => null)
  private pointMaterials: THREE.ShaderMaterial[] = []
  private gates: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>[] = []
  private size = { width: 1, height: 1 }

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.scene.add(this.buildDust())
    const last = STOPS.length - 1
    GATES.forEach((at, i) => {
      const g = gate(200 + i)
      // centred on the route, facing back along it
      this.route.getPoint(at / last, g.position)
      this.route.getTangent(at / last, tangent)
      g.lookAt(look.copy(g.position).sub(tangent))
      this.gates.push(g)
      this.pointMaterials.push(g.material)
      this.scene.add(g)
    })
    // the hero's orb right away; the rest is built bit by bit (see buildNext)
    this.build(0)
  }

  /** Builds the next landmark not built yet; returns false when all are done. */
  buildNext() {
    const i = this.landmarks.findIndex((l, k) => !l && STOPS[k].landmark)
    if (i < 0) return false
    this.build(i)
    return true
  }

  private build(i: number) {
    const id = STOPS[i].landmark
    if (!id || this.landmarks[i]) return
    const landmark = FACTORIES[id]()
    this.landmarks[i] = landmark
    landmark.object.traverse((o) => {
      const m = (o as THREE.Points).material
      if (m instanceof THREE.ShaderMaterial && m.uniforms.uPx) this.pointMaterials.push(m)
    })
    this.scene.add(landmark.object)
    this.place(i)
  }

  resize(width: number, height: number) {
    this.size = { width, height }
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    for (const m of this.pointMaterials) m.uniforms.uPx.value = this.renderer.getPixelRatio()
    this.landmarks.forEach((_, i) => this.place(i))
  }

  private place(i: number) {
    const landmark = this.landmarks[i]
    if (!landmark) return
    const { width, height } = this.size
    const camera = this.stopCameras[i]
    for (const m of this.pointMaterials) m.uniforms.uPx.value = this.renderer.getPixelRatio()
    if (landmark.place) {
      landmark.place({ camera, width, height, fov: FOV, pixelRatio: this.renderer.getPixelRatio() })
      return
    }
    const visibleHeight = 2 * LANDMARK_DISTANCE * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const visibleWidth = visibleHeight * (width / height)
    const wide = width >= WIDE
    // beside the text on wide screens, above it on narrow ones (higher and smaller for the
    // stops whose text runs long)
    const [lift, fitWidth, fitHeight] = NARROW_FIT[STOPS[i].kind] ?? NARROW_FIT.poi!
    const x = wide ? (STOPS[i].side ?? 0) * visibleWidth * 0.24 : 0
    const y = wide ? 0 : visibleHeight * lift
    const room = wide ? Math.min(visibleWidth * 0.23, visibleHeight * 0.42) : Math.min(visibleWidth * fitWidth, visibleHeight * fitHeight)
    landmark.object.scale.setScalar(Math.min(1, room / landmark.extent))
    landmark.object.position.set(camera.x + x, camera.y + y, camera.z - LANDMARK_DISTANCE)
  }

  /** Dust scattered along the whole route, so flying feels like moving through space. */
  private buildDust() {
    const cloud = new Cloud(5)
    const random = cloud.random
    const p = new THREE.Vector3()
    for (let i = 0; i < DUST; i++) {
      this.route.getPoint(random(), p)
      // keep the hero's own frame almost clear, as in the mock; the dust thickens once the flight begins
      if (p.z > -6 && random() > 0.15) continue
      const a = random() * Math.PI * 2
      const r = 2.5 + 22 * random() ** 1.4
      p.x += Math.cos(a) * r
      p.y += Math.sin(a) * r * 0.75
      p.z += (random() - 0.5) * 6
      const pick = random()
      const color = pick < 0.05 ? COLORS.accent : pick < 0.45 ? COLORS.mist : COLORS.graphite
      cloud.add(p, color, 0.8 + random() ** 2 * 1.8, 0.16 + random() * 0.38)
    }
    const material = pointsMaterial({
      body: /* glsl */ `
        p += vec3(sin(uTime * 0.15 + seed * 6.28), cos(uTime * 0.12 + seed * 4.1), 0.0) * 0.22;
      `,
    })
    this.pointMaterials.push(material)
    return cloud.build(material)
  }

  /**
   * s: position along the route in stops (2.5 = halfway between stops 2 and 3).
   * pointer: −1…1 on both axes, for a slight parallax.
   */
  update(s: number, time: number, pointer: THREE.Vector2) {
    const last = STOPS.length - 1
    s = clamp(s, 0, last)
    const t = s / last
    this.route.getPoint(t, position)
    this.route.getTangent(t, tangent)
    // 0 at a stop, 1 halfway between two: the camera looks straight ahead at stops (so the
    // layout of landmark and text holds) and leans into the route's turns while travelling
    const travel = Math.sin(Math.PI * (s - Math.floor(s)))
    direction.set(0, 0, -1).lerp(tangent, travel * 0.6).normalize()
    this.camera.position.copy(position)
    this.camera.position.x += pointer.x * 0.25
    this.camera.position.y += pointer.y * 0.15
    this.camera.lookAt(look.copy(this.camera.position).add(direction))
    this.camera.rotateZ(-tangent.x * travel * 0.3)

    for (const m of this.pointMaterials) m.uniforms.uTime.value = time
    // a gate shows only while the camera travels toward and through it
    this.gates.forEach((g, i) => {
      const opacity = 1 - THREE.MathUtils.smoothstep(Math.abs(s - GATES[i]), 0.22, 0.48)
      g.visible = opacity > 0
      g.material.uniforms.uOpacity.value = opacity
    })
    this.landmarks.forEach((landmark, i) => {
      if (!landmark) return
      const near = Math.abs(s - i)
      // only the landmarks around the camera are drawn
      landmark.object.visible = near < 1.7
      if (landmark.object.visible) landmark.update?.(time, clamp(1 - near, 0, 1))
    })
    const end = this.landmarks[last] as Mark | null
    end?.setAssemble(clamp(1.4 - Math.abs(s - last) * 1.4, 0, 1))

    this.renderer.render(this.scene, this.camera)
  }

  /** Is the landmark of stop i built? */
  has(i: number) {
    return !!this.landmarks[i]
  }

  /** Builds landmarks the camera is about to reach, if the idle builder hasn't got to them yet. */
  ensureAround(s: number) {
    for (let i = Math.max(0, Math.floor(s) - 1); i <= Math.min(STOPS.length - 1, Math.ceil(s) + 1); i++) this.build(i)
  }

  /** Screen position of a landmark's HUD anchor (CSS px). */
  project(stop: number, anchor: string, out: ScreenPoint) {
    const landmark = this.landmarks[stop]
    const local = landmark?.anchors?.[anchor]
    out.visible = false
    if (!landmark || !local || !landmark.object.visible) return out
    world.copy(local)
    landmark.object.localToWorld(world)
    world.project(this.camera)
    out.x = (world.x * 0.5 + 0.5) * this.size.width
    out.y = (-world.y * 0.5 + 0.5) * this.size.height
    out.visible = world.z < 1 && Math.abs(world.x) < 1.05 && Math.abs(world.y) < 1.05
    return out
  }

  select(index: number) {
    const i = STOPS.findIndex((s) => s.landmark === 'triad')
    this.build(i)
    ;(this.landmarks[i] as Triad).select(index)
  }

  setValue(value: number) {
    const i = STOPS.findIndex((s) => s.landmark === 'constellation')
    ;(this.landmarks[i] as Constellation | null)?.setActive(value)
  }

  dispose() {
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      mesh.geometry?.dispose()
      const m = mesh.material
      if (Array.isArray(m)) m.forEach((x) => x.dispose())
      else m?.dispose()
    })
    this.renderer.dispose()
  }
}

const position = new THREE.Vector3()
const tangent = new THREE.Vector3()
const direction = new THREE.Vector3()
const look = new THREE.Vector3()
const world = new THREE.Vector3()
