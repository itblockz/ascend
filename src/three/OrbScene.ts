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

const FOV = 35
const CAMERA_Z = 10

export class OrbScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  private orb: THREE.Mesh

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.position.z = CAMERA_Z

    // placeholder: thin wireframe sphere to check position and size
    this.orb = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 16),
      new THREE.MeshBasicMaterial({ color: 0x18191c, wireframe: true, transparent: true, opacity: 0.2 }),
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
