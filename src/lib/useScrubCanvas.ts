import { useCallback, useEffect, useRef, useState } from 'react'
import { fitCanvas } from './canvas'

type FallbackDraw = (ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => void
export type ScrubStatus = 'loading' | 'frames' | 'fallback'

/**
 * Drives a <canvas> from a 0..1 progress value.
 * Preloads an image sequence; if the first frame is missing it switches
 * to a procedural fallback renderer so the section still works.
 */
export function useScrubCanvas(urls: string[], fallback: FallbackDraw) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const images = useRef<(HTMLImageElement | null)[]>([])
  const progress = useRef(0)
  const lastDrawn = useRef<string>('')
  const raf = useRef(0)
  const modeRef = useRef<ScrubStatus>('loading')
  const [status, setStatus] = useState<ScrubStatus>('loading')
  const fallbackRef = useRef(fallback)

  useEffect(() => {
    fallbackRef.current = fallback
  }, [fallback])

  const draw = useCallback(() => {
    raf.current = 0
    const canvas = canvasRef.current
    if (!canvas) return
    const mode = modeRef.current
    const p = progress.current
    const { ctx, w, h } = fitCanvas(canvas)

    if (mode === 'fallback') {
      fallbackRef.current(ctx, w, h, p)
      return
    }
    if (mode !== 'frames') return

    const list = images.current
    const target = Math.round(p * (list.length - 1))
    let img: HTMLImageElement | null = null
    for (let d = 0; d < list.length && !img; d++) {
      img = list[target - d] ?? list[target + d] ?? null
    }
    if (!img) return
    const key = `${img.src}|${canvas.width}x${canvas.height}`
    if (key === lastDrawn.current) return
    lastDrawn.current = key

    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.fillStyle = '#060B14'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
  }, [])

  const requestDraw = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(draw)
  }, [draw])

  const setProgress = useCallback(
    (p: number) => {
      progress.current = Math.min(1, Math.max(0, p))
      requestDraw()
    },
    [requestDraw],
  )

  // preload
  useEffect(() => {
    let cancelled = false
    const list: (HTMLImageElement | null)[] = new Array(urls.length).fill(null)
    images.current = list
    lastDrawn.current = ''

    const loadRest = () => {
      let next = 1
      const pump = () => {
        if (cancelled || next >= urls.length) return
        const i = next++
        const im = new Image()
        im.decoding = 'async'
        im.onload = () => {
          if (cancelled) return
          list[i] = im
          lastDrawn.current = ''
          requestDraw()
          pump()
        }
        im.onerror = pump
        im.src = urls[i]
      }
      for (let k = 0; k < 6; k++) pump()
    }

    const first = new Image()
    first.decoding = 'async'
    first.onload = () => {
      if (cancelled) return
      list[0] = first
      modeRef.current = 'frames'
      setStatus('frames')
      requestDraw()
      loadRest()
    }
    first.onerror = () => {
      if (cancelled) return
      modeRef.current = 'fallback'
      setStatus('fallback')
      requestDraw()
    }
    first.src = urls[0]

    return () => {
      cancelled = true
    }
  }, [urls, requestDraw])

  // keep the backing store in sync with layout
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => {
      lastDrawn.current = ''
      requestDraw()
    })
    ro.observe(canvas)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf.current)
      raf.current = 0
    }
  }, [requestDraw])

  return { canvasRef, setProgress, status }
}
