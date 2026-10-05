import { useEffect, useRef } from 'react'
import { OrbScene } from '../three/OrbScene'

// Full-screen WebGL layer fixed behind the page content.
export function Orb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const scene = new OrbScene(canvasRef.current!)
    // how far down the page the visitor is (0–1) drives the camera's flight
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scene.setProgress(max > 0 ? window.scrollY / max : 0)
    }
    const onResize = () => {
      scene.resize()
      onScroll()
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      scene.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 size-full" aria-hidden />
}
