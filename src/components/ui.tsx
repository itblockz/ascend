import { Fragment, type ReactNode } from 'react'
import { order } from './order'

/** Heading lines that rise out of a mask, one after another. */
export function Lines({ lines, start = 0 }: { lines: string[]; start?: number }) {
  // the space between lines keeps the words apart for screen readers and copy-paste
  return lines.map((line, i) => (
    <Fragment key={i}>
      <span className="line" style={order(start + i)}>
        <span>{line}</span>
      </span>{' '}
    </Fragment>
  ))
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`size-3 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M1 8h13M9 3l5 5-5 5" />
    </svg>
  )
}

export function ExternalArrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`size-2.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  )
}

export function Play({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`size-2.5 ${className}`} fill="currentColor" aria-hidden>
      <path d="M4 2.5v11L13.5 8z" />
    </svg>
  )
}

/** The bar-less Λ of the logo, as a small marker. */
export function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 10" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M1 9.5 6 .8l5 8.7" />
    </svg>
  )
}

/** A label pinned to a point of a landmark; the journey loop moves it every frame. */
export function HudLabel({ stop, anchor, kind = 'reticle', children }: { stop: number; anchor: string; kind?: 'reticle' | 'tag'; children: ReactNode }) {
  return (
    <span className={`hud hud-${kind}`} data-hud={`${stop}:${anchor}`} aria-hidden>
      {kind === 'reticle' ? (
        <>
          <svg className="hud-reticle" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M1 10V1h9M30 1h9v9M39 30v9h-9M10 39H1v-9" />
          </svg>
          <span className="hud-leader" />
        </>
      ) : (
        <span className="hud-dot" />
      )}
      <span className="hud-text eyebrow">{children}</span>
    </span>
  )
}

/** Big figure over a small label. */
export function Facts({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-4">
      {items.map((f) => (
        <div key={f.label} className="flex flex-col-reverse gap-2">
          <dt className="text-xs leading-snug text-muted">{f.label}</dt>
          <dd className="text-3xl leading-none font-light tracking-tight text-ink tabular-nums">{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}
