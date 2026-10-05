import { createContext, useContext } from 'react'
import type { Journey, JourneyState } from './journey'

export const JourneyContext = createContext<{ state: JourneyState; journey: Journey | null }>({
  state: { stop: 0, chapter: 0, value: 0 },
  journey: null,
})

export function useJourney() {
  return useContext(JourneyContext)
}
