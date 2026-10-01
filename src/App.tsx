import { Logo } from './components/Logo'

export default function App() {
  return (
    <header className="px-5 pt-6 md:px-20 md:pt-5">
      <a href="/" aria-label="ASCEND home">
        <Logo className="text-[1.75rem] md:text-[2.5rem]" />
      </a>
    </header>
  )
}
