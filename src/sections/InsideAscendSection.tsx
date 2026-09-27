import gsap from 'gsap'
import { Bot, Globe2, Layers, Sparkles, type LucideIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { ChevronStage, type StageApi } from '../components/ChevronStage'
import { Badge } from '../components/ui'
import { INSIDE } from '../content'
import { useLang } from '../i18n/LangContext'
import { layerFrames } from '../lib/assets'
import { LAYER_Y } from '../lib/chevronRenderer'

const ICONS: LucideIcon[] = [Bot, Globe2, Sparkles, Layers]
/** progress (0..1 of the separation) at which each label appears */
const AT = [0.35, 0.5, 0.65, 0.8]

const PLAY = 1
const HOLD = 2

export function InsideAscendSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const pinRefs = useRef<(HTMLDivElement | null)[]>([])
  const stageRef = useRef<StageApi | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // progress comes from the playhead so refreshes can't reset it (see HeroSection)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
        onUpdate: () => stageRef.current?.setProgress(Math.min(1, tl.time() / PLAY)),
      })
      tl.to({}, { duration: PLAY + HOLD }, 0)
      pinRefs.current.forEach((el, i) => {
        if (!el) return
        tl.fromTo(el, { opacity: 0, x: i % 2 === 0 ? -30 : 30 }, { opacity: 1, x: 0, duration: 0.14, ease: 'power2.out' }, AT[i] * PLAY)
      })
    }, sectionRef)
    stageRef.current?.setProgress(0)
    return () => ctx.revert()
  }, [])

  return (
    <section id="inside" ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-brand-black">
      <ChevronStage scene="layers" frames={layerFrames} apiRef={stageRef} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(6_11_20/0.8)_100%)]" />

      <div className="section-shell relative flex flex-col items-center pt-24 text-center md:pt-28">
        <Badge>02 — {t(INSIDE.badge)}</Badge>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance md:text-5xl">
          <span className="text-gradient-brand">{t(INSIDE.title)}</span>
        </h2>
        <p className="mt-3 hidden max-w-2xl text-sm leading-relaxed text-slate-400 [@media(min-height:860px)]:lg:block">{t(INSIDE.lead)}</p>
      </div>

      {INSIDE.layers.map((layer, i) => {
        const Icon = ICONS[i]
        const left = i % 2 === 0
        return (
          <div
            key={layer.name.en}
            ref={(el) => {
              pinRefs.current[i] = el
            }}
            className={`absolute w-[38%] max-w-80 -translate-y-1/2 opacity-0 ${left ? 'left-[3%] lg:left-[10%]' : 'right-[3%] lg:right-[10%]'}`}
            style={{ top: `${LAYER_Y[i] * 100}%` }}
          >
            <div className={`flex items-center gap-3 ${left ? '' : 'flex-row-reverse text-right'}`}>
              <span className="relative hidden shrink-0 sm:block">
                <span className="pulse-ring absolute inset-0 rounded-full bg-brand-cyan/60" />
                <span className="relative grid size-9 place-items-center rounded-full border border-brand-cyan/40 bg-brand-black/70 text-brand-cyan">
                  <Icon size={16} />
                </span>
              </span>
              <div className="glass rounded-2xl px-3.5 py-2.5 md:px-4 md:py-3">
                <p className="font-mono text-[11px] tracking-[0.18em] text-brand-cyan">{layer.no}</p>
                <p className="text-xs leading-snug font-semibold text-white md:text-sm">{t(layer.name)}</p>
                <p className="mt-1 hidden text-xs leading-relaxed text-slate-400 md:block">{t(layer.body)}</p>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
