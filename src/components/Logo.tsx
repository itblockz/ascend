// "ΛSCEND" wordmark: the A is a bar-less Λ drawn as SVG (from the v5 vector
// logo); the rest is Montserrat ExtraLight, widely tracked as in the mock.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline font-brand font-extralight tracking-[0.14em] text-ink ${className}`}>
      <svg viewBox="0 0 72 100" className="mr-[0.14em] h-[0.72em] w-auto" fill="currentColor" aria-hidden>
        <polygon points="36,0 72,100 66,100 36,17 6,100 0,100" />
      </svg>
      <span aria-hidden>SCEND</span>
      <span className="sr-only">ASCEND</span>
    </span>
  )
}
