// The journey, in order. Each stop is a full-screen moment the camera flies to: the hero, a
// chapter's title card, a project, the partner choice, the values, careers, and contact.
// Sections are `length` viewport-heights tall; the camera arrives at the middle of each.

export type StopKind = 'hero' | 'title' | 'poi' | 'choice' | 'values' | 'careers' | 'end'

export type LandmarkId =
  | 'orb'
  | 'ocean'
  | 'globe'
  | 'head'
  | 'bowl'
  | 'island'
  | 'gathering'
  | 'fighter'
  | 'jar'
  | 'triad'
  | 'constellation'
  | 'orbits'
  | 'mark'

export interface Stop {
  /** section id, used for links (#impact) */
  id: string
  kind: StopKind
  /** chapter on the rail: 0 is the hero, 1–7 the chapters, 8 contact */
  chapter: number
  /** scroll length in viewport heights */
  length: number
  landmark?: LandmarkId
  /** on wide screens the landmark sits on this side (1 right, −1 left) and the text on the other */
  side?: 1 | -1
}

export const STOPS: Stop[] = [
  { id: 'top', kind: 'hero', chapter: 0, length: 1.6, landmark: 'orb' },
  { id: 'impact', kind: 'title', chapter: 1, length: 1.5 },
  { id: 'oceans', kind: 'poi', chapter: 1, length: 2, landmark: 'ocean', side: 1 },
  { id: 'world-stage', kind: 'poi', chapter: 1, length: 2, landmark: 'globe', side: -1 },
  { id: 'ai', kind: 'title', chapter: 2, length: 1.5 },
  { id: 'quantumsoul', kind: 'poi', chapter: 2, length: 2, landmark: 'head', side: 1 },
  { id: 'foody', kind: 'poi', chapter: 2, length: 2, landmark: 'bowl', side: -1 },
  { id: 'metaverse', kind: 'title', chapter: 3, length: 1.5 },
  { id: 'edenverden', kind: 'poi', chapter: 3, length: 2, landmark: 'island', side: 1 },
  { id: 'aomunity', kind: 'poi', chapter: 3, length: 2, landmark: 'gathering', side: -1 },
  { id: 'soft-power', kind: 'title', chapter: 4, length: 1.5 },
  { id: 'muay-thai', kind: 'poi', chapter: 4, length: 2, landmark: 'fighter', side: 1 },
  { id: 'mystery-jars', kind: 'poi', chapter: 4, length: 2, landmark: 'jar', side: -1 },
  { id: 'partners', kind: 'choice', chapter: 5, length: 2.4, landmark: 'triad', side: 1 },
  { id: 'values', kind: 'values', chapter: 6, length: 3.6, landmark: 'constellation', side: 1 },
  { id: 'careers', kind: 'careers', chapter: 7, length: 2, landmark: 'orbits', side: 1 },
  { id: 'contact', kind: 'end', chapter: 8, length: 2.2, landmark: 'mark', side: 1 },
]

/** Where in its section the camera arrives (0 top, 0.5 middle): the hero starts there. */
export function anchorOf(stop: Stop) {
  return stop.kind === 'hero' ? 0 : 0.5
}

/** The scroll window, as fractions of the section, in which a stop's text shows. */
export function windowOf(stop: Stop): [number, number] {
  if (stop.kind === 'hero') return [-Infinity, 0.5]
  if (stop.kind === 'end') return [0.18, Infinity]
  if (stop.kind === 'values') return [0.08, 0.92]
  return [0.15, 0.85]
}
