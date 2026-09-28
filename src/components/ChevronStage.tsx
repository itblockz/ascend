import { useEffect, useRef, type RefObject } from 'react'
import type { ChevronSceneApi, SceneKind } from '../three/ChevronScene'

export interface StageApi {
  setProgress: (p: number) => void
}

interface Props {
  scene: SceneKind
  /** scroll-driven scenes (hero, layers) receive progress through this */
  apiRef?: RefObject<StageApi | null>
  className?: string
}

/**
 * Three.js stage for the "^" mark. The WebGL scene is loaded on demand so
 * the page's text paints before the three.js chunk arrives.
 */
export function ChevronStage({ scene, apiRef, className = 'bg-brand-black' }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let api: ChevronSceneApi | null = null
    let pending = 0
    let cancelled = false

    if (apiRef) {
      apiRef.current = {
        setProgress: (p) => {
          pending = p
          api?.setProgress(p)
        },
      }
    }

    import('../three/ChevronScene').then(({ createChevronScene }) => {
      if (cancelled) return
      api = createChevronScene(host, scene)
      api.setProgress(pending)
    })

    return () => {
      cancelled = true
      api?.dispose()
      if (apiRef) apiRef.current = null
    }
  }, [apiRef, scene])

  return <div ref={hostRef} aria-hidden className={`absolute inset-0 ${className}`} />
}
