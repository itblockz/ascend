import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ArrowUpRight, Award, ChevronDown, ScanLine, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Wordmark } from '../components/Brand'
import { ChevronStage, type StageApi } from '../components/ChevronStage'
import { Badge, PrimaryButton } from '../components/ui'
import { HERO, UI } from '../content'
import { useLang } from '../i18n/LangContext'
import { scrollToId } from '../lib/lenis'
import { extLink, LINKS } from '../lib/links'
import { EASE } from '../lib/motion'

const FADE_AT = 0.07 // opening tagline leaves as soon as scrubbing starts
const REVEAL_AT = 0.9 // final composition once the mark has settled
const PLAY = 3 // timeline units spent scrubbing
const HOLD = 2 // timeline units of static hold after the last frame

const CARD_ICONS = [Users, ScanLine, Award]

export function HeroSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const stageRef = useRef<StageApi | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      let lastReveal = false
      // progress is read from the playhead, not tweened on a proxy object,
      // so ScrollTrigger refreshes (resize, font load) can never reset it
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=500%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
        onUpdate: () => {
          const p = Math.min(1, tl.time() / PLAY)
          stageRef.current?.setProgress(p)
          if (counterRef.current) counterRef.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
          if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
          const r = p >= REVEAL_AT
          if (r !== lastReveal) {
            lastReveal = r
            setRevealed(r)
          }
        },
      })

      tl.to({}, { duration: PLAY + HOLD }, 0)
      tl.fromTo([taglineRef.current, hintRef.current], { opacity: 1, y: 0 }, { opacity: 0, y: -20, duration: 0.25, ease: 'power1.out' }, FADE_AT * PLAY)
    }, sectionRef)

    stageRef.current?.setProgress(0)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-brand-black">
      <ChevronStage scene="hero" apiRef={stageRef} />

      {/* legibility vignettes */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(6_11_20/0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-brand-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-brand-black to-transparent" />

      {/* Opening tagline */}
      <div ref={taglineRef} className="isolate absolute inset-x-0 top-0 flex flex-col items-center px-6 pt-32 text-center md:pt-36">
        {/* dims the particle cloud behind the opening lockup; leaves with it */}
        <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 h-[30rem] bg-[radial-gradient(ellipse_45%_50%_at_center,rgb(6_11_20/0.85),transparent)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.2 }}>
          <Badge>{t(HERO.badge)}</Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
          className="mt-8 leading-none! text-white"
        >
          <Wordmark className="text-[clamp(3rem,11vw,9rem)]" />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          className="mt-5 max-w-xl text-base text-slate-300 md:text-lg"
        >
          {t(HERO.sub)}
        </motion.p>
      </div>

      <div ref={hintRef} className="absolute inset-x-0 bottom-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex flex-col items-center gap-2 text-slate-400"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase">{t(UI.scroll)}</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
            <ChevronDown size={18} />
          </motion.span>
        </motion.div>
      </div>

      {/* keeps the motto legible over the settled mark */}
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-b from-brand-black/85 via-brand-black/40 to-transparent transition-opacity duration-700 lg:bg-linear-to-r lg:from-brand-black/90 lg:via-brand-black/45 lg:to-transparent ${
          revealed ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Final reveal */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="reveal"
            className="section-shell absolute inset-0 flex flex-col justify-between gap-6 pt-28 pb-16 lg:flex-row lg:items-center lg:pt-24 lg:pb-12"
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <motion.div
              className="max-w-xl"
              variants={{ hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Badge>ASCEND CO., LTD. · SINCE 2019</Badge>
              <h2 className="mt-5 font-display text-[clamp(1.75rem,3.9vw,3.4rem)] leading-[1.12] font-semibold tracking-tight text-balance">
                <span className="text-gradient-brand">{t(HERO.motto)}</span>
              </h2>
              <p className="mt-5 hidden max-w-md text-sm leading-relaxed text-slate-400 md:block">{t(HERO.finalKicker)}</p>
              <div className="mt-7 hidden items-center gap-3 md:flex">
                <PrimaryButton onClick={() => scrollToId('inside')}>
                  {t(UI.explore)} <ArrowUpRight size={16} />
                </PrimaryButton>
                <a
                  {...extLink(LINKS.virtualOffice)}
                  className="rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
                >
                  {t(UI.visitVirtualOffice)}
                </a>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-2.5 lg:w-80 lg:grid-cols-1 lg:gap-3">
              {HERO.cards.map((c, i) => {
                const Icon = CARD_ICONS[i]
                return (
                  <motion.div
                    key={c.value}
                    variants={{ hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.12 * i + 0.1 }}
                    className="glass rounded-2xl p-3.5 lg:rounded-3xl lg:p-4 [@media(min-height:820px)]:lg:p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs leading-tight font-medium text-slate-400">{t(c.label)}</span>
                      <Icon size={18} className="hidden shrink-0 text-slate-500 sm:block" />
                    </div>
                    <p className="mt-2 font-display text-lg font-semibold text-white sm:text-2xl lg:mt-3 lg:text-4xl">{c.value}</p>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full origin-left rounded-full bg-white/70"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.4, ease: EASE, delay: 0.4 + 0.12 * i }}
                      />
                    </div>
                    <p className="mt-2.5 hidden text-xs text-slate-500 [@media(min-height:820px)]:lg:block">{t(c.note)}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* scrub HUD */}
      <div className="pointer-events-none absolute bottom-6 left-6 hidden items-center gap-3 font-mono text-xs text-slate-500 md:flex md:left-12">
        <span>
          ASCEND <span ref={counterRef}>000</span>%
        </span>
        <span className="h-px w-24 overflow-hidden bg-white/10">
          <span ref={barRef} className="block h-full origin-left scale-x-0 bg-white" />
        </span>
      </div>
    </section>
  )
}
