import { CHAPTERS, UI } from '../content'
import { useT } from '../i18n'
import { useJourney } from '../journey/context'
import { Chevron } from './ui'

// Chapter rail on the right edge: a Λ per chapter, the current one in orange with its name.
export function Rail() {
  const t = useT()
  const { state } = useJourney()
  return (
    <nav aria-label={t(UI.chapters)} className="fixed top-1/2 right-10 z-20 hidden -translate-y-1/2 lg:block">
      <ol className="flex flex-col items-end gap-1">
        {CHAPTERS.map((c, i) => {
          const n = i + 1
          const status = n === state.chapter ? 'current' : n < state.chapter ? 'past' : 'next'
          return (
            <li key={c.id}>
              <a href={`#${c.id}`} className="rail-item" data-status={status} aria-current={status === 'current' ? 'step' : undefined}>
                <span className="rail-label eyebrow">{t(c.name)}</span>
                <span className="rail-number eyebrow tabular-nums">{String(n).padStart(2, '0')}</span>
                <Chevron className="rail-mark" />
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
