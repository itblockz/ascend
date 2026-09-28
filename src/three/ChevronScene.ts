/**
 * Three.js rendering of the ASCEND "^" mark, the site's only renderer.
 * hero / layers are pure functions of scroll progress (scrubbed by GSAP);
 * loop is time-driven: the mark turning on the white sections.
 */
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { CHEVRON, clamp01, easeOutExpo, lerp, LAYER_Y, mulberry32, smoothstep } from '../lib/chevron'

export type SceneKind = 'hero' | 'layers' | 'loop'

export interface ChevronSceneApi {
  setProgress: (p: number) => void
  dispose: () => void
}

const BG = 0x060b14
const DEPTH = 0.16
const FOV = 35
const CAM_Z = 5

function chevronShape() {
  const shape = new THREE.Shape()
  CHEVRON.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, -y) : shape.lineTo(x, -y)))
  shape.closePath()
  return shape
}

function gradientTexture(stops: [number, string][]) {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, 256)
  stops.forEach(([o, col]) => g.addColorStop(o, col))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 4, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  // cap UVs are shape-space xy; map y ∈ [-0.5, 0.5] onto the texture
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  tex.repeat.set(1, 1)
  tex.offset.set(0, 0.5)
  return tex
}

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(230,237,245,0.8)')
  g.addColorStop(1, 'rgba(230,237,245,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

function makeChevronMesh(geometry: THREE.ExtrudeGeometry, stops: [number, string][], side: number, glow = 0.38, edgeColor = 0xffffff) {
  const tex = gradientTexture(stops)
  const caps = new THREE.MeshPhysicalMaterial({
    map: tex,
    emissive: 0xffffff,
    emissiveMap: tex,
    emissiveIntensity: glow,
    metalness: 0.2,
    roughness: 0.18,
    clearcoat: 1,
    transparent: true,
  })
  const sides = new THREE.MeshStandardMaterial({ color: side, metalness: 0.85, roughness: 0.3, emissive: side, emissiveIntensity: 0.35, transparent: true })
  const mesh = new THREE.Mesh(geometry, [caps, sides])
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 25),
    new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: 0.8 }),
  )
  const group = new THREE.Group()
  group.add(mesh, edges)
  const setOpacity = (o: number) => {
    caps.opacity = o
    sides.opacity = o
    edges.material.opacity = 0.8 * o
    group.visible = o > 0.002
  }
  return { group, setOpacity, materials: [caps, sides, edges.material], textures: [tex] }
}

export function createChevronScene(container: HTMLElement, kind: SceneKind): ChevronSceneApi {
  // the loop sits on the light sections: transparent canvas, no bloom, no grid
  const light = kind === 'loop'
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: light, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.setClearColor(BG, light ? 0 : 1)
  renderer.toneMapping = THREE.AgXToneMapping
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  if (!light) {
    scene.background = new THREE.Color(BG)
    scene.fog = new THREE.FogExp2(BG, 0.09)
  }
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  camera.position.set(0, 0, CAM_Z)

  scene.add(new THREE.AmbientLight(0xffffff, light ? 1.1 : 0.45))
  const key = new THREE.DirectionalLight(0xffffff, 2.2)
  key.position.set(-2, 3, 4)
  scene.add(key)
  const rim = new THREE.PointLight(0xffffff, 12, 12)
  rim.position.set(0, 0.4, -1.6)
  scene.add(rim)
  const fill = new THREE.PointLight(0x94a3b8, 8, 12)
  fill.position.set(2.5, -1, 2)
  scene.add(fill)

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.25, 0.35, 0.72)
  bloom.enabled = !light
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  const disposables: { dispose: () => void }[] = [renderer, composer]
  const geometry = new THREE.ExtrudeGeometry(chevronShape(), {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.018,
    bevelSegments: 3,
    curveSegments: 1,
  })
  geometry.translate(0, 0, -DEPTH / 2)
  disposables.push(geometry)

  const root = new THREE.Group()
  scene.add(root)
  // fit-to-viewport scale from resize(); the hero multiplies its settle shrink onto it
  let baseScale = 1

  // floor grid — the infrastructure beneath
  const grid = new THREE.GridHelper(40, 80, 0xe6edf5, 0xe6edf5)
  const gridMat = grid.material as THREE.LineBasicMaterial
  gridMat.transparent = true
  gridMat.opacity = 0.16
  grid.position.y = -1.35
  grid.visible = !light
  scene.add(grid)
  disposables.push(grid.geometry, gridMat)

  let update: (p: number, time: number) => void

  if (kind === 'hero') {
    const mark = makeChevronMesh(
      geometry,
      [
        [0, '#FFFFFF'],
        [0.5, '#E6EDF5'],
        [1, '#94A3B8'],
      ],
      0x1c2536,
      0.12,
    )
    root.add(mark.group)
    disposables.push(...mark.materials, ...mark.textures)

    // particles that assemble into the mark
    const rnd = mulberry32(2019)
    const count = window.innerWidth < 768 ? 1400 : 2600
    const start = new Float32Array(count * 3)
    const target = new Float32Array(count * 3)
    const delay = new Float32Array(count)
    const inside = (x: number, y: number) => {
      let r = false
      for (let i = 0, j = CHEVRON.length - 1; i < CHEVRON.length; j = i++) {
        const [xi, yi] = CHEVRON[i]
        const [xj, yj] = CHEVRON[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) r = !r
      }
      return r
    }
    for (let i = 0; i < count; i++) {
      let x: number
      let y: number
      do {
        x = rnd() * 0.8 - 0.4
        y = rnd() - 0.5
      } while (!inside(x, y))
      target[i * 3] = x
      target[i * 3 + 1] = -y
      target[i * 3 + 2] = (rnd() - 0.5) * DEPTH * 1.4
      const th = rnd() * Math.PI * 2
      const ph = Math.acos(2 * rnd() - 1)
      const r = 2.5 + rnd() * 4
      start[i * 3] = Math.sin(ph) * Math.cos(th) * r
      start[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * r * 0.7
      start[i * 3 + 2] = Math.cos(ph) * r - 1.5
      delay[i] = rnd() * 0.2
    }
    const pos = new Float32Array(count * 3)
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const dot = dotTexture()
    const pMat = new THREE.PointsMaterial({
      size: 0.035,
      map: dot,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xe6edf5,
    })
    const points = new THREE.Points(pGeo, pMat)
    root.add(points)
    disposables.push(pGeo, pMat, dot)

    // orbit rings — the metaverse around the mark
    const orbitGroup = new THREE.Group()
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xe6edf5, transparent: true, opacity: 0 })
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    const ringGeo = new THREE.TorusGeometry(1.05, 0.004, 6, 160)
    const moonGeo = new THREE.SphereGeometry(0.028, 12, 12)
    const rings: { pivot: THREE.Group; speed: number }[] = []
    ;[
      { rx: 1.25, tilt: 0.32, speed: 1 },
      { rx: -1.1, tilt: -0.42, speed: -1.4 },
    ].forEach(({ rx, tilt, speed }) => {
      const pivot = new THREE.Group()
      pivot.rotation.set(rx, 0, tilt)
      const ring = new THREE.Mesh(ringGeo, ringMat)
      pivot.add(ring)
      for (let d = 0; d < 3; d++) {
        const m = new THREE.Mesh(moonGeo, dotMat)
        const a = (d * Math.PI * 2) / 3
        m.position.set(Math.cos(a) * 1.05, Math.sin(a) * 1.05, 0)
        pivot.add(m)
      }
      orbitGroup.add(pivot)
      rings.push({ pivot, speed })
    })
    root.add(orbitGroup)
    disposables.push(ringMat, dotMat, ringGeo, moonGeo)

    update = (p, time) => {
      const assemble = smoothstep(0.02, 0.5, p)
      const ignite = smoothstep(0.36, 0.54, p)
      const rise = smoothstep(0.55, 0.88, p)
      const settle = smoothstep(0.78, 1, p)

      for (let i = 0; i < count; i++) {
        const t = easeOutExpo(clamp01((assemble - delay[i]) / (1 - delay[i])))
        const swirl = (1 - t) * 1.6
        const sx = start[i * 3]
        const sz = start[i * 3 + 2]
        const rx = sx * Math.cos(swirl) - sz * Math.sin(swirl)
        const rz = sx * Math.sin(swirl) + sz * Math.cos(swirl)
        pos[i * 3] = lerp(rx, target[i * 3], t)
        pos[i * 3 + 1] = lerp(start[i * 3 + 1], target[i * 3 + 1], t)
        pos[i * 3 + 2] = lerp(rz, target[i * 3 + 2], t)
      }
      pGeo.attributes.position.needsUpdate = true
      pMat.opacity = (0.35 + 0.65 * assemble) * (1 - ignite * 0.75) + settle * 0.12

      mark.setOpacity(ignite)
      const sc = lerp(0.92, 1, ignite)
      mark.group.scale.setScalar(sc)
      mark.group.rotation.y = lerp(-1.1, 0, smoothstep(0.2, 0.62, p)) + Math.sin(time * 0.6) * 0.06 * settle
      mark.group.rotation.x = lerp(0.25, 0, ignite)

      // settle: the mark lifts and shrinks into the upper third, clearing the centred copy below
      root.position.y = rise * 0.34 + settle * 0.00
      root.scale.setScalar(lerp(baseScale, 0.6, settle)) // settled size is the same on every screen
      grid.position.y = -1.35 - rise * 0.9
      gridMat.opacity = 0.16 * smoothstep(0.08, 0.35, p) * (1 - settle * 0.4)
      grid.position.z = (p * 6) % 0.5

      ringMat.opacity = 0.45 * settle
      dotMat.opacity = settle
      orbitGroup.visible = settle > 0.002
      rings.forEach((r) => (r.pivot.rotation.y = time * 0.5 * r.speed + p * 4 * r.speed))

      bloom.strength = 0.12 + ignite * 0.14
      camera.position.z = CAM_Z - rise * 0.3
    }
  } else if (kind === 'layers') {
    const palettes: { stops: [number, string][]; side: number }[] = [
      { stops: [[0, '#FFFFFF'], [0.5, '#F1F5F9'], [1, '#CBD5E1']], side: 0x334155 },
      { stops: [[0, '#E2E8F0'], [0.5, '#CBD5E1'], [1, '#94A3B8']], side: 0x1e293b },
      { stops: [[0, '#94A3B8'], [0.5, '#64748B'], [1, '#475569']], side: 0x0f172a },
    ]
    const visibleH = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const finalY = LAYER_Y.map((fy) => (0.5 - fy) * visibleH)
    const layers = palettes.map((pal) => {
      const m = makeChevronMesh(geometry, pal.stops, pal.side)
      m.group.scale.setScalar(0.72)
      root.add(m.group)
      disposables.push(...m.materials, ...m.textures)
      return m
    })

    const base = new THREE.Group()
    const discMat = new THREE.MeshBasicMaterial({ color: 0xe6edf5, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.62, 64), discMat)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xe6edf5, transparent: true, opacity: 0.4 })
    base.add(disc)
    for (let r = 1; r <= 4; r++) {
      const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0, 0, (0.62 * r) / 4, 0, Math.PI * 2, false).getPoints(64)), lineMat)
      base.add(ring)
      disposables.push(ring.geometry)
    }
    const spokes: THREE.Vector3[] = []
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2
      spokes.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0))
    }
    const spokeGeo = new THREE.BufferGeometry().setFromPoints(spokes)
    base.add(new THREE.LineSegments(spokeGeo, lineMat))
    root.add(base)
    disposables.push(discMat, disc.geometry, lineMat, spokeGeo)

    const spineMat = new THREE.LineDashedMaterial({ color: 0xe6edf5, dashSize: 0.05, gapSize: 0.07, transparent: true, opacity: 0 })
    const spineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, finalY[0], -0.05), new THREE.Vector3(0, finalY[3], -0.05)])
    const spine = new THREE.Line(spineGeo, spineMat)
    spine.computeLineDistances()
    root.add(spine)
    disposables.push(spineMat, spineGeo)

    update = (p, time) => {
      const sep = smoothstep(0.04, 0.86, p)
      const tilt = lerp(0, -1.0, sep)
      layers.forEach((l, i) => {
        l.group.position.y = lerp(-0.25 - i * 0.07, finalY[i], sep)
        l.group.rotation.x = tilt
        l.group.rotation.y = lerp(-0.5, 0, sep) + Math.sin(time * 0.5 + i) * 0.03 * sep
      })
      base.position.y = lerp(-0.55, finalY[3], sep)
      base.rotation.x = -Math.PI / 2 + 0.35
      base.rotation.z = p * 0.8
      spineMat.opacity = 0.5 * sep
      grid.position.y = -1.9
      gridMat.opacity = 0.08
      bloom.strength = 0.15
    }
  } else {
    // obsidian mark turning on white, two thin orbits, a soft contact shadow
    const mark = makeChevronMesh(
      geometry,
      [
        [0, '#1C2536'],
        [0.5, '#0B1426'],
        [1, '#060B14'],
      ],
      0x334155,
      0,
      0x475569,
    )
    mark.group.scale.setScalar(1.35)
    root.add(mark.group)
    disposables.push(...mark.materials, ...mark.textures)

    const shadowTex = (() => {
      const c = document.createElement('canvas')
      c.width = c.height = 64
      const ctx = c.getContext('2d')!
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(6,11,20,0.35)')
      g.addColorStop(1, 'rgba(6,11,20,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    })()
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.35), shadowMat)
    shadow.position.set(0, -0.95, -0.2)
    root.add(shadow)
    disposables.push(shadowTex, shadowMat, shadow.geometry)

    const ringMat = new THREE.MeshBasicMaterial({ color: 0x060b14, transparent: true, opacity: 0.28 })
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x060b14 })
    const ringGeo = new THREE.TorusGeometry(1.15, 0.004, 6, 160)
    const moonGeo = new THREE.SphereGeometry(0.03, 12, 12)
    const rings: { pivot: THREE.Group; speed: number }[] = []
    ;[
      { rx: 1.3, tilt: 0.3, speed: 1 },
      { rx: -1.15, tilt: -0.4, speed: -1.3 },
    ].forEach(({ rx, tilt, speed }) => {
      const pivot = new THREE.Group()
      pivot.rotation.set(rx, 0, tilt)
      pivot.add(new THREE.Mesh(ringGeo, ringMat))
      for (let d = 0; d < 3; d++) {
        const m = new THREE.Mesh(moonGeo, dotMat)
        const a = (d * Math.PI * 2) / 3
        m.position.set(Math.cos(a) * 1.15, Math.sin(a) * 1.15, 0)
        pivot.add(m)
      }
      root.add(pivot)
      rings.push({ pivot, speed })
    })
    disposables.push(ringMat, dotMat, ringGeo, moonGeo)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    update = (_p, time) => {
      const t = reduce ? 0.6 : time
      mark.setOpacity(1)
      mark.group.rotation.y = t * 0.9
      mark.group.position.y = Math.sin(t * 1.2) * 0.04
      rings.forEach((r) => (r.pivot.rotation.y = t * 0.5 * r.speed))
    }
  }

  let progress = 0
  let raf = 0
  let visible = true
  let disposed = false
  const t0 = performance.now()

  const resize = () => {
    const w = container.clientWidth || 1
    const h = container.clientHeight || 1
    renderer.setSize(w, h, false)
    composer.setSize(w, h)
    bloom.resolution.set(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // keep the mark inside narrow portrait viewports
    baseScale = light ? 1 : Math.min(1, (w / h) * (kind === 'hero' ? 1.15 : 1.5))
    root.scale.setScalar(baseScale)
  }

  const frame = () => {
    raf = 0
    if (disposed) return
    update(progress, (performance.now() - t0) / 1000)
    composer.render()
    if (visible) raf = requestAnimationFrame(frame)
  }

  const ro = new ResizeObserver(resize)
  ro.observe(container)
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible && !raf) raf = requestAnimationFrame(frame)
  })
  io.observe(container)
  resize()
  raf = requestAnimationFrame(frame)

  return {
    setProgress(p) {
      progress = clamp01(p)
      if (!raf) raf = requestAnimationFrame(frame)
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      disposables.forEach((d) => d.dispose())
      renderer.domElement.remove()
    },
  }
}
