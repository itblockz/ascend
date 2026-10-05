import * as THREE from 'three'
import { dustPoints } from '../dust'
import { orbHaloMaterial, orbSurfaceMaterial } from '../orbMaterials'
import type { Landmark, PlaceContext } from './types'

// The hero orb: placed in screen space so that, seen from the first stop, it sits where the
// mock puts it (1672×940 mock, orb radius 245px).
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
/** How far in front of the first stop the orb sits. */
export const ORB_DISTANCE = 10

export function orb(): Landmark {
  const geometry = new THREE.SphereGeometry(1, 96, 64)
  const surface = new THREE.Mesh(geometry, orbSurfaceMaterial())
  const halo = new THREE.Mesh(geometry, orbHaloMaterial())
  halo.scale.setScalar(HALO_SCALE)
  surface.add(halo)
  const dust = dustPoints()
  surface.add(dust)

  return {
    object: surface,
    extent: 1.7,
    place({ camera, width: w, height: h, fov, pixelRatio }: PlaceContext) {
      // world units per screen pixel on the orb's plane
      const visibleHeight = 2 * ORB_DISTANCE * Math.tan(THREE.MathUtils.degToRad(fov / 2))
      const unitsPerPx = visibleHeight / h

      const mobile = w < MOBILE_BREAKPOINT
      const cx = mobile ? 0.5 : CENTER_X
      const radiusPx = mobile ? MOBILE_RADIUS_OF_WIDTH * w : Math.min(RADIUS_OF_WIDTH * w, RADIUS_OF_HEIGHT * h)
      const cy = mobile ? (h + MOBILE_CENTER_BELOW_EDGE * radiusPx) / h : CENTER_Y

      surface.scale.setScalar(radiusPx * unitsPerPx)
      surface.position.set(camera.x + (cx - 0.5) * w * unitsPerPx, camera.y + (0.5 - cy) * h * unitsPerPx, camera.z - ORB_DISTANCE)
      // dust grains keep their size relative to the orb
      dust.material.uniforms.uPointScale.value = pixelRatio * (radiusPx / MOCK_RADIUS_PX)
    },
    update(time) {
      ;(surface.material as THREE.ShaderMaterial).uniforms.uTime.value = time
      dust.material.uniforms.uTime.value = time
      // the whole orb turns gently back and forth, so the foam's relief catches the light
      surface.rotation.y = Math.sin(time * 0.3) * 0.15
    },
  }
}
