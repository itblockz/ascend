import { useEffect, useRef } from 'react'
import { OrbScene } from '../three/OrbScene'

// Full-screen WebGL layer fixed behind the page content.
export function Orb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const scene = new OrbScene(canvasRef.current!)
    const onResize = () => scene.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      scene.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 size-full" aria-hidden />
}
