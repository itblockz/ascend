import { useEffect, useRef, type RefObject } from 'react'
import { drawHeroChevron, drawLayers } from '../lib/chevronRenderer'
import { getRenderMode } from '../lib/renderMode'
import { stages } from '../lib/stageRegistry'
import { useScrubCanvas } from '../lib/useScrubCanvas'
import type { ChevronSceneApi, SceneKind } from '../three/ChevronScene'

export interface StageApi {
  setProgress: (p: number) => void
  /** Offscreen frame for the recorder (see FrameRecorder). */
  capture: (p: number, width: number, height: number) => Promise<Blob | null>
}

const MODE = getRenderMode()

const DRAW = { hero: drawHeroChevron, layers: drawLayers } as const

interface Props {
  scene: SceneKind
  frames: string[]
  apiRef: RefObject<StageApi | null>
}

/**
 * The scroll-scrubbed visual behind the Hero and Inside sections.
 * Canvas mode: real frame sequence if present, else the procedural 2D mark.
 * Three mode (`?hero=three`): the WebGL mark, loaded on demand.
 */
export function ChevronStage(props: Props) {
  return MODE === 'three' ? <ThreeStage {...props} /> : <CanvasStage {...props} />
}

function CanvasStage({ scene, frames, apiRef }: Props) {
  const { canvasRef, setProgress } = useScrubCanvas(frames, DRAW[scene])

  useEffect(() => {
    const api: StageApi = {
      setProgress,
      capture: (p, width, height) => {
        const c = document.createElement('canvas')
        c.width = width
        c.height = height
        DRAW[scene](c.getContext('2d')!, width, height, p)
        return new Promise((res) => c.toBlob(res, 'image/webp', 0.9))
      },
    }
    apiRef.current = api
    stages.set(scene, api)
    return () => {
      apiRef.current = null
      stages.delete(scene)
    }
  }, [apiRef, scene, setProgress])

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block h-full w-full" />
}

function ThreeStage({ scene, apiRef }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let api: ChevronSceneApi | null = null
    let pending = 0
    let cancelled = false

    const stage: StageApi = {
      setProgress: (p) => {
        pending = p
        api?.setProgress(p)
      },
      capture: (p, w, h) => api?.capture(p, w, h) ?? Promise.resolve(null),
    }
    apiRef.current = stage
    stages.set(scene, stage)

    import('../three/ChevronScene').then(({ createChevronScene }) => {
      if (cancelled) return
      api = createChevronScene(host, scene)
      api.setProgress(pending)
    })

    return () => {
      cancelled = true
      api?.dispose()
      apiRef.current = null
      stages.delete(scene)
    }
  }, [apiRef, scene])

  return <div ref={hostRef} aria-hidden className="absolute inset-0 bg-brand-black" />
}
