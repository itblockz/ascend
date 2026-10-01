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
      </main>
    </>
  )
}
