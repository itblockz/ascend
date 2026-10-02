import * as THREE from 'three'

// Where the orb sits on screen, as fractions of the viewport (from the mock at 1672px wide).
const CENTER_X = 0.64
const CENTER_Y = 0.48
const RADIUS_OF_WIDTH = 245 / 1672
// on short/wide screens, cap by height so the orb never crowds the header
const RADIUS_OF_HEIGHT = 245 / 940

// narrow screens: text spans the width, so the orb sits centered below it,
// its lower half below the bottom edge (rising into view)
const MOBILE_BREAKPOINT = 768
const MOBILE_CENTER_BELOW_EDGE = 0.1 // × radius
const MOBILE_RADIUS_OF_WIDTH = 0.4

const PARTICLE_COUNT = 20000
// the side that breaks apart (screen right, up, slightly toward the viewer)
const DISPERSE_DIR = new THREE.Vector3(1, 0.55, 0.35).normalize()
const SURFACE_COLOR = new THREE.Color(0x18191c)
const DUST_COLOR = new THREE.Color(0x7c97c9)
const PARTICLE_SIZE_PX = 1.5

const FOV = 35
const CAMERA_Z = 10

export class OrbScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  private orb: THREE.Points

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.position.z = CAMERA_Z

    this.orb = new THREE.Points(
      dispersedSphere(PARTICLE_COUNT),
      new THREE.PointsMaterial({
        vertexColors: true,
        size: PARTICLE_SIZE_PX * this.renderer.getPixelRatio(),
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.5,
      }),
    )
    this.scene.add(this.orb)

    this.resize()
  }

  resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()

    // world units per screen pixel on the z = 0 plane
    const visibleHeight = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const unitsPerPx = visibleHeight / h

    const mobile = w < MOBILE_BREAKPOINT
    const cx = mobile ? 0.5 : CENTER_X
    const radiusPx = mobile ? MOBILE_RADIUS_OF_WIDTH * w : Math.min(RADIUS_OF_WIDTH * w, RADIUS_OF_HEIGHT * h)
    const cy = mobile ? (h + MOBILE_CENTER_BELOW_EDGE * radiusPx) / h : CENTER_Y

    this.orb.scale.setScalar(radiusPx * unitsPerPx)
    this.orb.position.set((cx - 0.5) * w * unitsPerPx, (0.5 - cy) * h * unitsPerPx, 0)

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.orb.geometry.dispose()
    ;(this.orb.material as THREE.Material).dispose()
    this.renderer.dispose()
  }
}

// Points spread evenly on a unit sphere (golden-angle spiral); points facing
// DISPERSE_DIR drift outward and turn blue, as if the surface is breaking into dust.
function dispersedSphere(count: number) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const random = seededRandom(7)
  const p = new THREE.Vector3()
  const color = new THREE.Color()

  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count
    const r = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i
    p.set(Math.cos(theta) * r, y, Math.sin(theta) * r)

    // 0 on the calm side, 1 where the surface faces DISPERSE_DIR
    const facing = THREE.MathUtils.smoothstep(p.dot(DISPERSE_DIR), -0.1, 0.9)
    // only some points break away; the rest stay on the surface
    const loose = facing * (random() < facing ? 1 : 0.15)
    const drift = loose * random() ** 2 * 0.9

    p.multiplyScalar(1 + drift * 0.6)
      .addScaledVector(DISPERSE_DIR, drift * 0.5)
      .add(new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).multiplyScalar(loose * 0.08))

    positions.set([p.x, p.y, p.z], i * 3)
    color.lerpColors(SURFACE_COLOR, DUST_COLOR, Math.min(1, loose * 1.2))
    colors.set([color.r, color.g, color.b], i * 3)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

// Deterministic PRNG (mulberry32) so the shape is the same on every load.
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
