import type { CSSProperties } from 'react'

/** Stagger index for the reveal transitions (see .line and .rise in index.css). */
export function order(i: number) {
  return { '--i': i } as CSSProperties
}
