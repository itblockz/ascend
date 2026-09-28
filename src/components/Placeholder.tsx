import { ImageIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { UI } from '../content'
import { useLang } from '../i18n/LangContext'

/**
 * An image slot: shows the real file when it exists, otherwise a branded
 * gradient panel naming the file that belongs here.
 */
export function ImageSlot({
  src,
  alt,
  className = '',
  tone = 'cyan',
  children,
}: {
  src: string
  alt: string
  className?: string
  tone?: 'cyan' | 'blue' | 'teal'
  children?: ReactNode
}) {
  const { t } = useLang()
  const [failed, setFailed] = useState(false)
  const grad = {
    cyan: 'from-[#1c2536] to-[#060b14]',
    blue: 'from-[#141b28] to-[#060b14]',
    teal: 'from-[#1e293b] to-[#060b14]',
  }[tone]

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {failed ? (
        <div className={`absolute inset-0 bg-linear-to-br ${grad}`}>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 w-1/3 max-w-40 -translate-x-1/2 -translate-y-1/2 opacity-25" aria-hidden>
            <path d="M50 6 L82 94 L77 94 L49.4 18 L21.8 94 L18 94 Z" fill="none" stroke="#E6EDF5" strokeWidth="1.2" />
          </svg>
          <p className="absolute right-3 bottom-3 left-3 flex items-center gap-1.5 text-[11px] leading-tight text-slate-400/80">
            <ImageIcon size={12} className="shrink-0" />
            <span className="truncate">
              {t(UI.placeholder)} {src.replace('/assets/', '')}
            </span>
          </p>
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />
      )}
      {children}
    </div>
  )
}
