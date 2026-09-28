// ASCEND identity, redrawn as vectors from the supplied logo (unnamed.png):
// a tall thin-stroke Λ with a slightly heavier right stroke, and a light
// geometric wordmark whose A is a bar-less Λ.

/** The Λ symbol. Right stroke is a touch heavier than the left, as in the original. */
export function Mark({ className = 'h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} fill="currentColor" aria-hidden>
      <polygon points="40,0 80,100 74,100 39.2,14 4.8,100 0,100" />
    </svg>
  )
}

/** Wordmark "ΛSCEND": the A is drawn as a Λ; the rest is set in Montserrat Light. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline font-brand font-light tracking-[0.05em] ${className}`}>
      <svg viewBox="0 0 72 100" className="mr-[0.1em] h-[0.72em] w-auto" fill="currentColor" aria-hidden>
        <polygon points="36,0 72,100 63.5,100 36,24 8.5,100 0,100" />
      </svg>
      <span aria-hidden>SCEND</span>
      <span className="sr-only">ASCEND</span>
    </span>
  )
}

/** Horizontal lockup for the navbar: wordmark over the company line. */
export function Logo() {
  return (
    <span className="flex flex-col items-start leading-none text-white">
      <Wordmark className="text-[1.35rem]" />
      <span className="mt-1.5 hidden font-brand text-[10px] font-normal tracking-[0.42em] whitespace-nowrap text-slate-400 sm:block">ASCEND Co., Ltd.</span>
    </span>
  )
}

/** Stacked lockup (as in the original artwork): Λ above the wordmark and company line. */
export function LogoLockup({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <Mark className="h-14" />
      <Wordmark className="mt-4 text-[1.75rem]" />
      <span className="mt-2 font-brand text-[10px] tracking-[0.42em] text-slate-400">ASCEND Co., Ltd.</span>
    </span>
  )
}
