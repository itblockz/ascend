import { Logo } from './components/Logo'

export default function App() {
  return (
    <>
      <header className="flex h-16 items-center px-5 md:h-24 md:px-20">
        <a href="/">
          <Logo className="h-5 md:h-7" />
        </a>
      </header>

      <main className="px-5 pt-24 md:px-40 md:pt-40">
        <p className="eyebrow mb-4 text-accent">
          The future of digital experiences
        </p>
        <h1 className="font-brand text-[clamp(2.25rem,4vw+0.5rem,3.75rem)] leading-[1.1] font-light tracking-tight text-ink">
          Build Worlds.
          <br />
          Shape Experiences.
        </h1>
        <p className="mt-8 max-w-sm font-brand text-base leading-relaxed text-muted">
          We create immersive digital experiences where AI, games, learning and technology converge.
        </p>
        {/* destination section doesn't exist yet */}
        <a href="#explore" className="group mt-12 inline-flex items-center gap-6 text-ink">
          <span className="h-px w-10 bg-ink" aria-hidden />
          <span className="eyebrow">Explore our universe</span>
          <svg viewBox="0 0 16 16" className="ml-2 size-3 text-accent transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M1 8h13M9 3l5 5-5 5" />
          </svg>
        </a>
      </main>
    </>
  )
}
