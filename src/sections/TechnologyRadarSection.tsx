import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Boxes, Gamepad2, Glasses, Globe2, MessagesSquare, ScanLine, ShoppingBag, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { ChevronStage } from '../components/ChevronStage'
import { SectionHeader } from '../components/ui'
import { TECH } from '../content'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'

const ICONS: LucideIcon[] = [MessagesSquare, Bot, ScanLine, Globe2, Gamepad2, Boxes, ShoppingBag, Glasses]

const SENSORS = TECH.nodes.map((n, i) => ({ ...n, icon: ICONS[i] }))

const RADIUS = 43 // % of stage
const nodePos = (i: number) => {
  const a = (i / SENSORS.length) * Math.PI * 2 - Math.PI / 2
  return { x: 50 + Math.cos(a) * RADIUS, y: 50 + Math.sin(a) * RADIUS }
}

export function TechnologyRadarSection() {
  const { t } = useLang()
  // angle is kept continuous so the laser always turns the short way round
  const [{ active, angle }, setSel] = useState({ active: 0, angle: 0 })
  const [hovering, setHovering] = useState(false)

  const setActive = useCallback((i: number) => {
    setSel((s) => {
      const target = (i / SENSORS.length) * 360
      const delta = ((((target - s.angle) % 360) + 540) % 360) - 180
      return { active: i, angle: s.angle + delta }
    })
  }, [])

  // auto-cycle until the visitor takes over
  useEffect(() => {
    if (hovering) return
    const id = window.setInterval(() => setSel((s) => {
      const i = (s.active + 1) % SENSORS.length
      return { active: i, angle: s.angle + 360 / SENSORS.length }
    }), 3200)
    return () => window.clearInterval(id)
  }, [hovering])

  const current = SENSORS[active]

  return (
    <section id="technology" className="relative overflow-hidden bg-white py-36 text-brand-black">
      <div className="section-shell">
        <SectionHeader tone="light" badge={t(TECH.badge)} title={<span className="text-gradient-blue">{t(TECH.title)}</span>} lead={t(TECH.lead)} />

        <div className="mt-16 grid items-center gap-12 lg:mt-20 lg:grid-cols-[1fr_minmax(0,40rem)_1fr]">
          {/* detail panel (desktop left) */}
          <div className="hidden lg:block" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="font-mono text-xs tracking-[0.22em] text-brand-blue">0{active + 1} / 08</p>
                <p className="mt-3 font-display text-2xl font-semibold">{t(current.name)}</p>
                <p className="mt-1 font-mono text-sm text-slate-500">{current.spec}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">{t(current.body)}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* radar stage */}
          <div className="relative mx-auto aspect-square w-full max-w-[40rem]" onMouseLeave={() => setHovering(false)}>
            {/* rings */}
            {[100, 78, 56].map((s) => (
              <span
                key={s}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200"
                style={{ width: `${s}%`, height: `${s}%` }}
              />
            ))}
            <span
              className="radar-sweep absolute inset-[4%] rounded-full opacity-70"
              style={{ background: 'conic-gradient(from 0deg, rgb(6 11 20 / 0.06), transparent 22%)' }}
            />

            {/* laser lines */}
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 hidden size-full md:block" aria-hidden>
              <defs>
                <linearGradient id="laser" gradientUnits="userSpaceOnUse" x1="50" y1="50" x2="50" y2={50 - RADIUS}>
                  <stop offset="0" stopColor="#060B14" stopOpacity="0.1" />
                  <stop offset="1" stopColor="#060B14" />
                </linearGradient>
              </defs>
              {SENSORS.map((_, i) => {
                const q = nodePos(i)
                return <line key={i} x1="50" y1="50" x2={q.x} y2={q.y} stroke="rgb(15 23 42 / 0.07)" strokeWidth="0.2" />
              })}
              <g
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '50px 50px',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <line x1="50" y1="50" x2="50" y2={50 - RADIUS} stroke="url(#laser)" strokeWidth="0.55" strokeDasharray="2 1" className="dash-flow" />
                <circle cx="50" cy={50 - RADIUS} r="1.2" fill="#060B14" />
              </g>
            </svg>

            {/* central video stage */}
            <div className="absolute top-1/2 left-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-slate-50 shadow-[0_40px_100px_-40px_rgb(6_11_20/0.15)] ring-1 ring-slate-200 md:size-[52%]">
              <ChevronStage scene="loop" className="" />
            </div>

            {/* nodes (tablet/desktop) */}
            {SENSORS.map((s, i) => {
              const q = nodePos(i)
              const on = i === active
              return (
                <div
                  key={s.spec + i}
                  className="absolute hidden -translate-x-1/2 -translate-y-1/2 md:block"
                  style={{ left: `${q.x}%`, top: `${q.y}%` }}
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                    onMouseEnter={() => {
                      setHovering(true)
                      setActive(i)
                    }}
                    onFocus={() => {
                      setHovering(true)
                      setActive(i)
                    }}
                    onClick={() => setActive(i)}
                    aria-label={t(s.name)}
                    aria-pressed={on}
                    className={`relative grid size-14 place-items-center rounded-full border bg-white transition-colors duration-300 ${
                      on ? 'border-brand-blue text-brand-blue shadow-glow-blue' : 'border-slate-200 text-slate-500 shadow-lg shadow-slate-200/60'
                    }`}
                  >
                    <s.icon size={22} className="relative" />
                  </motion.button>
                </div>
              )
            })}
          </div>

          {/* legend (desktop right) */}
          <ul className="hidden gap-1 lg:grid">
            {SENSORS.map((s, i) => (
              <li key={s.spec + i}>
                <button
                  type="button"
                  onMouseEnter={() => {
                    setHovering(true)
                    setActive(i)
                  }}
                  onMouseLeave={() => setHovering(false)}
                  onClick={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    i === active ? 'bg-brand-blue/8 font-semibold text-brand-blue' : 'text-slate-500 hover:text-brand-black'
                  }`}
                >
                  <span className="font-mono text-xs opacity-60">0{i + 1}</span>
                  {t(s.name)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* touch grid (mobile) + detail (tablet) */}
        <div className="mt-12 lg:hidden">
          <div className="glass-light rounded-2xl p-5" aria-live="polite">
            <p className="font-mono text-xs tracking-[0.2em] text-brand-blue">
              0{active + 1} / 08 · {current.spec}
            </p>
            <p className="mt-2 font-display text-lg font-semibold">{t(current.name)}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{t(current.body)}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
            {SENSORS.map((s, i) => (
              <button
                key={s.spec + i}
                type="button"
                onClick={() => {
                  setHovering(true)
                  setActive(i)
                }}
                aria-pressed={i === active}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-sm font-medium transition-colors ${
                  i === active ? 'border-brand-blue bg-brand-blue/5 text-brand-blue' : 'border-slate-200 text-slate-600'
                }`}
              >
                <s.icon size={18} className="shrink-0" />
                <span className="leading-snug">{t(s.name)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
