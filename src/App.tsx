import { Logo } from './components/Logo'

export default function App() {
  return (
    <>
      <header className="px-5 pt-6 md:px-20 md:pt-5">
        <a href="/" aria-label="ASCEND home">
          <Logo className="text-[1.75rem] md:text-[2.5rem]" />
        </a>
      </header>

      <main className="px-5 pt-24 md:px-40 md:pt-48">
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
      </main>
    </>
  )
}
