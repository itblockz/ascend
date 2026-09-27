import type { StageApi } from '../components/ChevronStage'
import type { SceneKind } from '../three/ChevronScene'

/** Mounted scrubbed stages, looked up by the frame recorder. */
export const stages = new Map<SceneKind, StageApi>()
