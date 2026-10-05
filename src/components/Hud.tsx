import { CHAPTERS, UI } from '../content'
import { useT } from '../i18n'
import { useJourney } from '../journey/context'

// Bottom corners: where you are (chapter and a bar for the whole journey) and, at the start,
// a hint to scroll.
export function Hud() {
  const t = useT()
  const { state } = useJourney()
  const chapter = state.chapter
  const inChapter = chapter >= 1 && chapter <= CHAPTERS.length
  return (
    <>
      <div
        className={`pointer-events-none fixed bottom-10 left-20 z-20 hidden items-center gap-4 transition-opacity duration-500 md:flex ${inChapter ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden
      >
        <span className="eyebrow text-ink tabular-nums">
          {String(Math.max(chapter, 1)).padStart(2, '0')}
          <span className="text-muted"> / {String(CHAPTERS.length).padStart(2, '0')}</span>
        </span>
        <span className="relative h-px w-16 overflow-hidden bg-ink/15">
          <span className="journey-bar absolute inset-0 bg-accent" />
        </span>
        <span className="eyebrow text-muted">{inChapter ? t(CHAPTERS[chapter - 1].name) : ''}</span>
      </div>

      <div
        className={`pointer-events-none fixed bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 transition-opacity duration-700 md:right-20 md:left-auto md:translate-x-0 md:flex-row md:gap-4 ${chapter === 0 ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden
      >
        <span className="eyebrow text-muted">{t(UI.scroll)}</span>
        <span className="scroll-cue" />
      </div>
    </>
  )
}
