import { useEffect, useRef, useState } from 'react'
import { ASSETS } from '../lib/assets'
import { fitCanvas } from '../lib/canvas'
import { drawLoop } from '../lib/chevronRenderer'

/** Continuously turning procedural mark — stand-in for the loop video. */
function LoopCanvas({ theme }: { theme: 'light' | 'dark' }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let visible = false
    const start = performance.now()

    const frame = (t: number) => {
      const { ctx, w, h } = fitCanvas(canvas)
      drawLoop(ctx, w, h, reduce ? 0.5 : (t - start) / 1000, theme)
      raf = visible && !reduce ? requestAnimationFrame(frame) : 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(frame)
    })
    io.observe(canvas)
    raf = requestAnimationFrame(frame)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [theme])

  return <canvas ref={ref} aria-hidden className="block h-full w-full" />
}

// Probe once for a real video file: a dev server or SPA host answers missing
// files with index.html, which leaves <video> stuck "loading" instead of erroring.
let probe: Promise<boolean> | null = null
function hasLoopVideo() {
  probe ??= fetch(ASSETS.loopVideoMp4, { method: 'HEAD' })
    .then((r) => r.ok && (r.headers.get('content-type') ?? '').startsWith('video/'))
    .catch(() => false)
  return probe
}

/** The mark turning 360°: ascend_loop video if present, else the procedural loop. */
export function LoopStage({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const [useVideo, setUseVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let alive = true
    hasLoopVideo().then((ok) => alive && setUseVideo(ok))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    io.observe(video)
    return () => io.disconnect()
  }, [useVideo])

  if (!useVideo) return <LoopCanvas theme={theme} />
  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-label="ASCEND mark turning 360 degrees"
      className="block h-full w-full object-cover"
      onError={() => setUseVideo(false)}
    >
      <source src={ASSETS.loopVideoWebm} type="video/webm" />
      <source src={ASSETS.loopVideoMp4} type="video/mp4" onError={() => setUseVideo(false)} />
    </video>
  )
}
