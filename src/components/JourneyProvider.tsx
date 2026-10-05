import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { JourneyContext } from '../journey/context'
import { Journey, type JourneyState } from '../journey/journey'

// Full-screen WebGL layer fixed behind the page, and the journey that flies its camera.
export function JourneyProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<JourneyState>({ stop: 0, chapter: 0, value: 0 })
  const [journey, setJourney] = useState<Journey | null>(null)

  useEffect(() => {
    const j = new Journey(canvasRef.current!, setState)
    setJourney(j)
    return () => j.dispose()
  }, [])

  const value = useMemo(() => ({ state, journey }), [state, journey])
  return (
    <JourneyContext.Provider value={value}>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 size-full" aria-hidden />
      {children}
    </JourneyContext.Provider>
  )
}
