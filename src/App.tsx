import { Logo } from './components/Logo'

export default function App() {
  return (
    <>
      <header className="px-5 pt-6 md:px-20 md:pt-5">
        <a href="/" aria-label="ASCEND home">
          <Logo className="text-[1.75rem] md:text-[2.5rem]" />
        </a>
      </header>

      <main className="px-5 pt-24 md:px-40 md:pt-[13.8rem]">
        <h1 className="font-brand text-[2.5rem] leading-[1.05] font-light tracking-[-0.02em] text-ink md:text-[3.65rem]">
          Build Worlds.
          <br />
          Shape Experiences.
        </h1>
        <p className="mt-7 max-w-[21rem] font-brand text-[0.97rem] leading-[1.5] font-light text-muted">
          We create immersive digital experiences where AI, games, learning and technology converge.
        </p>
      </main>
    </>
  )
}
