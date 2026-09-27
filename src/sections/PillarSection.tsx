import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '../components/ui'
import type { PILLARS } from '../content'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'

type Pillar = (typeof PILLARS)[number]

const slide = (x: number) => ({
  initial: { opacity: 0, x },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-15% 0px' },
  transition: { duration: 1.1, ease: EASE },
})

const ACCENT = {
  cyan: { text: 'text-brand-cyan', glow: 'rgb(0 229 255 / 0.14)', hex: '#00E5FF' },
  blue: { text: 'text-[#7ea2ff]', glow: 'rgb(47 107 255 / 0.18)', hex: '#2F6BFF' },
  teal: { text: 'text-brand-teal', glow: 'rgb(20 241 198 / 0.14)', hex: '#14F1C6' },
}

/* ---------- coded visuals, one per pillar ---------- */

function AvatarVisual({ color }: { color: string }) {
  const bars = Array.from({ length: 28 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 1.7)) * 0.75)
  return (
    <div className="relative flex aspect-square w-full flex-col items-center justify-center">
      {[1, 0.78, 0.56].map((s, i) => (
        <motion.span
          key={s}
          className="absolute rounded-full border"
          style={{ width: `${s * 80}%`, height: `${s * 80}%`, borderColor: `${color}33` }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}
      <div className="relative grid size-[34%] place-items-center rounded-full bg-radial from-brand-cyan/40 via-brand-blue/20 to-transparent">
        <svg viewBox="0 0 64 64" className="w-1/2" aria-hidden>
          <path d="M32 8 L58 52 L47.5 52 L32 26 L16.5 52 L6 52 Z" fill={color} opacity="0.9" />
        </svg>
      </div>
      <div className="absolute bottom-[12%] flex h-10 items-end gap-[3px]">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full"
            style={{ background: color }}
            animate={{ height: [`${h * 30}%`, `${h * 100}%`, `${h * 30}%`] }}
            transition={{ duration: 1.1 + (i % 5) * 0.12, repeat: Infinity, ease: 'easeInOut', delay: i * 0.03 }}
          />
        ))}
      </div>
      <p className="absolute top-[10%] font-mono text-xs tracking-[0.22em] text-slate-400">REAL-TIME · RAG · MULTILINGUAL</p>
    </div>
  )
}

function WorldVisual({ color }: { color: string }) {
  // isometric tile world
  const tiles: { x: number; y: number; h: number }[] = []
  for (let gx = 0; gx < 6; gx++) for (let gy = 0; gy < 6; gy++) tiles.push({ x: gx, y: gy, h: ((gx * 7 + gy * 13) % 5) * 4 })
  const iso = (x: number, y: number) => [150 + (x - y) * 20, 90 + (x + y) * 11.5]
  return (
    <div className="relative aspect-square w-full">
      <svg viewBox="0 0 300 300" className="size-full" aria-hidden>
        {tiles.map(({ x, y, h }, i) => {
          const [cx, cy] = iso(x, y)
          const top = `${cx},${cy - h} ${cx + 20},${cy + 11.5 - h} ${cx},${cy + 23 - h} ${cx - 20},${cy + 11.5 - h}`
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.02 * i, duration: 0.6, ease: EASE }}
            >
              <polygon points={`${cx - 20},${cy + 11.5 - h} ${cx},${cy + 23 - h} ${cx},${cy + 23} ${cx - 20},${cy + 11.5}`} fill="#0d1f4a" />
              <polygon points={`${cx + 20},${cy + 11.5 - h} ${cx},${cy + 23 - h} ${cx},${cy + 23} ${cx + 20},${cy + 11.5}`} fill="#0a1838" />
              <polygon points={top} fill={h > 10 ? `${color}55` : '#12295e'} stroke={`${color}66`} strokeWidth="0.6" />
            </motion.g>
          )
        })}
        {[
          [1, 1],
          [4, 2],
          [2, 4],
        ].map(([x, y], i) => {
          const [cx, cy] = iso(x, y)
          return (
            <motion.g key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}>
              <line x1={cx} y1={cy - 30} x2={cx} y2={cy} stroke={`${color}66`} strokeDasharray="2 3" />
              <circle cx={cx} cy={cy - 34} r="5" fill={color} />
              <circle cx={cx} cy={cy - 34} r="10" fill="none" stroke={`${color}55`} />
            </motion.g>
          )
        })}
      </svg>
      <p className="absolute top-[6%] w-full text-center font-mono text-xs tracking-[0.22em] text-slate-400">SOCIAL · LEARNING · ENTERPRISE</p>
    </div>
  )
}

function PoseVisual({ color }: { color: string }) {
  // a Muay Thai roundhouse kick as pose-estimation keypoints
  const k: Record<string, [number, number]> = {
    head: [120, 70],
    neck: [124, 96],
    ls: [104, 102],
    rs: [146, 100],
    le: [86, 80],
    re: [168, 84],
    lw: [98, 60],
    rw: [180, 64],
    hip: [132, 170],
    lh: [120, 172],
    rh: [146, 168],
    lk: [112, 222],
    la: [104, 270],
    rk: [196, 150],
    ra: [246, 128],
  }
  const bones = [
    ['head', 'neck'],
    ['neck', 'ls'],
    ['neck', 'rs'],
    ['ls', 'le'],
    ['le', 'lw'],
    ['rs', 're'],
    ['re', 'rw'],
    ['neck', 'hip'],
    ['hip', 'lh'],
    ['hip', 'rh'],
    ['lh', 'lk'],
    ['lk', 'la'],
    ['rh', 'rk'],
    ['rk', 'ra'],
  ]
  return (
    <div className="relative aspect-square w-full">
      <svg viewBox="0 0 300 300" className="size-full" aria-hidden>
        <rect x="60" y="40" width="210" height="245" rx="6" fill="none" stroke={`${color}44`} strokeDasharray="6 5" />
        {bones.map(([a, b2], i) => (
          <motion.line
            key={i}
            x1={k[a][0]}
            y1={k[a][1]}
            x2={k[b2][0]}
            y2={k[b2][1]}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
          />
        ))}
        {Object.values(k).map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4.5" fill="#060B14" stroke={color} strokeWidth="2" />
            <motion.circle cx={x} cy={y} r="9" fill="none" stroke={`${color}66`} animate={{ r: [5, 12, 5], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.1 }} />
          </g>
        ))}
        <circle cx="120" cy="70" r="14" fill="none" stroke={color} strokeWidth="2" />
      </svg>
      <div className="absolute top-[6%] right-[6%] rounded-lg border border-white/10 bg-brand-black/70 px-3 py-2 font-mono text-xs">
        <p className="text-slate-500">POSE MATCH</p>
        <p className="text-lg" style={{ color }}>
          &gt;90%
        </p>
      </div>
    </div>
  )
}

const VISUALS = { cyan: AvatarVisual, blue: WorldVisual, teal: PoseVisual }

export function PillarSection({ pillar, flip = false }: { pillar: Pillar; flip?: boolean }) {
  const { t } = useLang()
  const a = ACCENT[pillar.accent]
  const Visual = VISUALS[pillar.accent]

  return (
    <section id={pillar.id} className="relative overflow-hidden bg-brand-black py-36">
      <div
        className={`pointer-events-none absolute top-1/3 size-[36rem] ${flip ? '-right-40' : '-left-40'}`}
        style={{ background: `radial-gradient(closest-side, ${a.glow}, transparent)` }}
      />
      <div className="section-shell grid items-center gap-16 lg:grid-cols-12">
        <motion.div {...slide(flip ? 80 : -80)} className={`lg:col-span-6 ${flip ? 'lg:order-2' : ''}`}>
          <Badge>{t(pillar.badge)}</Badge>
          <h2 className="mt-6 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">
            <span className="mr-3 font-mono text-2xl align-top text-slate-600 md:text-3xl">{pillar.no}</span>
            {t(pillar.title)}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400 md:text-lg">{t(pillar.lead)}</p>

          <ul className="mt-10 grid gap-3">
            {pillar.items.map((item, i) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: EASE }}
                className="group glass rounded-2xl p-5 transition-colors hover:border-white/25"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-semibold text-white">{item.name}</p>
                    <p className={`mt-0.5 font-mono text-xs tracking-wide ${a.text}`}>{t(item.tag)}</p>
                  </div>
                  <ArrowUpRight size={18} className="shrink-0 text-slate-600 transition-colors group-hover:text-white" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{t(item.body)}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...slide(flip ? -80 : 80)} className={`lg:col-span-6 ${flip ? 'lg:order-1' : ''}`}>
          <div className="glass relative mx-auto max-w-xl overflow-hidden rounded-[2rem] p-6 md:p-8">
            <Visual color={a.hex} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
