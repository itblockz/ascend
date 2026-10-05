import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { UI, type Video } from '../content'
import { useT } from '../i18n'
import { VideoContext } from '../video'

// A layer over the journey that plays a project's video (YouTube, privacy-enhanced mode).
export function VideoProvider({ children }: { children: ReactNode }) {
  const t = useT()
  const [video, setVideo] = useState<Video | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const play = useCallback((v: Video) => {
    returnFocus.current = document.activeElement as HTMLElement
    setVideo(v)
  }, [])
  const close = useCallback(() => {
    setVideo(null)
    returnFocus.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (!video) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [video, close])

  return (
    <VideoContext.Provider value={play}>
      {children}
      {video &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t(video.title)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 p-5 backdrop-blur-md md:p-20"
            onClick={close}
          >
            <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <div className="aspect-video w-full bg-ink">
                <iframe
                  className="size-full"
                  src={`https://www.youtube-nocookie.com/embed/${video.youtube}?autoplay=1&rel=0`}
                  title={t(video.title)}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-6">
                <p className="eyebrow text-ink">{t(video.title)}</p>
                <button ref={closeRef} type="button" onClick={close} className="eyebrow flex items-center gap-3 text-ink">
                  {t(UI.close)}
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M1 1l10 10M11 1 1 11" />
                  </svg>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </VideoContext.Provider>
  )
}
