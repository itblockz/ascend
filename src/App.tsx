import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useCallback, useEffect, useState } from 'react'
import { AboutModal } from './components/AboutModal'
import { Footer } from './components/Footer'
import { JoinModal } from './components/JoinModal'
import { Navbar } from './components/Navbar'
import { PILLARS } from './content'
import { LangProvider } from './i18n/LangContext'
import { setLenis } from './lib/lenis'
import { GlobalStageSection } from './sections/GlobalStageSection'
import { HeroSection } from './sections/HeroSection'
import { ImpactNumbersSection } from './sections/ImpactNumbersSection'
import { InsideAscendSection } from './sections/InsideAscendSection'
import { JoinCTASection } from './sections/JoinCTASection'
import { PillarSection } from './sections/PillarSection'
import { PlatformShowcaseSection } from './sections/PlatformShowcaseSection'
import { TechnologyRadarSection } from './sections/TechnologyRadarSection'
import { TrustedBySection } from './sections/TrustedBySection'
import { ValuesSection } from './sections/ValuesSection'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export default function App() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)

  const openAbout = useCallback(() => setAboutOpen(true), [])
  const closeAbout = useCallback(() => setAboutOpen(false), [])
  const openJoin = useCallback(() => setJoinOpen(true), [])
  const closeJoin = useCallback(() => setJoinOpen(false), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
    })
    setLenis(lenis)

    lenis.on('scroll', ScrollTrigger.update)

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      setLenis(null)
      lenis.destroy()
      gsap.ticker.remove(updateTicker)
    }
  }, [])

  // fonts and late images shift layout; re-measure pinned sections once settled
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <LangProvider>
      <Navbar onAbout={openAbout} />
      <main>
        <HeroSection />
        <InsideAscendSection />
        <ImpactNumbersSection />
        {PILLARS.map((p, i) => (
          <PillarSection key={p.id} pillar={p} flip={i % 2 === 1} />
        ))}
        <PlatformShowcaseSection />
        <TechnologyRadarSection />
        <TrustedBySection />
        <ValuesSection />
        <GlobalStageSection />
        <JoinCTASection onJoin={openJoin} />
      </main>
      <Footer />
      <AboutModal open={aboutOpen} onClose={closeAbout} />
      <JoinModal open={joinOpen} onClose={closeJoin} />
    </LangProvider>
  )
}
