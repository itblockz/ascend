import * as THREE from 'three'
import { dustPoints } from './dust'
import { orbHaloMaterial, orbSurfaceMaterial } from './orbMaterials'

// Where the orb sits on screen, measured on the mock (1672×940, orb radius 245px).
const MOCK_RADIUS_PX = 245
const CENTER_X = 0.64
const CENTER_Y = 0.48
const RADIUS_OF_WIDTH = MOCK_RADIUS_PX / 1672
// on short/wide screens, cap by height so the orb never crowds the header
const RADIUS_OF_HEIGHT = MOCK_RADIUS_PX / 940

// narrow screens: text spans the width, so the orb sits centered below it,
// its lower half below the bottom edge (rising into view)
const MOBILE_BREAKPOINT = 768
const MOBILE_CENTER_BELOW_EDGE = 0.1 // × radius
const MOBILE_RADIUS_OF_WIDTH = 0.4

const HALO_SCALE = 1.14

const FOV = 35
const CAMERA_Z = 10

// Scrolling flies the camera forward from where the hero frames the orb. It drifts left and a
// little up on the way, so the orb grows and slides out past the right edge instead of being hit.
const FLIGHT_START = new THREE.Vector3(0, 0, CAMERA_Z)
const FLIGHT_END = new THREE.Vector3(-2.4, 0.3, -6)
// how fast the camera catches up with the scroll position (per second)
const FOLLOW = 3

export class OrbScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  private orb: THREE.Mesh
  private halo: THREE.Mesh
  private dust: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>
  // how far along the flight the camera is (0–1), easing toward the scroll position
  private flight = 0
  private flightTarget = 0

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.position.copy(FLIGHT_START)

    const geometry = new THREE.SphereGeometry(1, 96, 64)
    this.orb = new THREE.Mesh(geometry, orbSurfaceMaterial())
    this.halo = new THREE.Mesh(geometry, orbHaloMaterial())
    this.halo.scale.setScalar(HALO_SCALE)
    this.orb.add(this.halo)
    this.dust = dustPoints()
    this.orb.add(this.dust)
    this.scene.add(this.orb)

    this.resize()

    // animate unless the visitor asked for less motion; then the orb stays as a still image
    this.reducedMotion.addEventListener('change', this.updateMotion)
    this.updateMotion()
  }

  private timer = new THREE.Timer()
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  /** Scroll position along the page, 0–1. Under reduced motion the camera stays put. */
  setProgress(progress: number) {
    this.flightTarget = progress
  }

  private updateMotion = () => {
    // setAnimationLoop runs on requestAnimationFrame, which the browser pauses in hidden tabs
    this.renderer.setAnimationLoop(this.reducedMotion.matches ? null : this.frame)
    this.render()
  }

  private frame = (time: number) => {
    this.timer.update(time)
    const t = this.timer.getElapsed()
    // capped, so the first frame after the loop restarts doesn't jump
    const dt = Math.min(this.timer.getDelta(), 0.1)

    this.flight += (this.flightTarget - this.flight) * (1 - Math.exp(-FOLLOW * dt))
    this.camera.position.lerpVectors(FLIGHT_START, FLIGHT_END, this.flight)

    ;(this.orb.material as THREE.ShaderMaterial).uniforms.uTime.value = t
    this.dust.material.uniforms.uTime.value = t
    // the whole orb turns gently back and forth, so the foam's relief catches the light
    this.orb.rotation.y = Math.sin(t * 0.3) * 0.15
    this.render()
  }

  private render() {
    this.renderer.render(this.scene, this.camera)
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
    // dust grains keep their size relative to the orb
    this.dust.material.uniforms.uPointScale.value = this.renderer.getPixelRatio() * (radiusPx / MOCK_RADIUS_PX)

    this.render()
  }

  dispose() {
    this.renderer.setAnimationLoop(null)
    this.timer.dispose()
    this.reducedMotion.removeEventListener('change', this.updateMotion)
    this.orb.geometry.dispose()
    ;(this.orb.material as THREE.Material).dispose()
    ;(this.halo.material as THREE.Material).dispose()
    this.dust.geometry.dispose()
    this.dust.material.dispose()
    this.renderer.dispose()
  }
}
