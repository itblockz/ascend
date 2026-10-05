import type * as THREE from 'three'

export interface PlaceContext {
  /** where the camera sits at this landmark's stop */
  camera: THREE.Vector3
  width: number
  height: number
  fov: number
  pixelRatio: number
}

/** One object the camera passes on its flight, standing for a chapter or project. */
export interface Landmark {
  object: THREE.Object3D
  /** rough radius in world units; narrow screens shrink landmarks so they fit */
  extent: number
  /** points (in the object's local space) that HUD labels follow on screen */
  anchors?: Record<string, THREE.Vector3>
  /** custom placement; without it the scene sets the landmark beside its stop */
  place?(ctx: PlaceContext): void
  /** time in seconds; focus 0–1 is how close the camera is to this landmark's stop */
  update?(time: number, focus: number): void
}
