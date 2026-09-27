export type RenderMode = 'canvas' | 'three'

/** Chevron renderer for the scrubbed stages: `?hero=three` opts into Three.js. */
export function getRenderMode(): RenderMode {
  try {
    return new URLSearchParams(window.location.search).get('hero') === 'three' ? 'three' : 'canvas'
  } catch {
    return 'canvas'
  }
}

export function setRenderMode(mode: RenderMode) {
  const url = new URL(window.location.href)
  if (mode === 'three') url.searchParams.set('hero', 'three')
  else url.searchParams.delete('hero')
  window.location.assign(url.toString())
}

export const isRecordMode = () => {
  try {
    return new URLSearchParams(window.location.search).has('record')
  } catch {
    return false
  }
}
