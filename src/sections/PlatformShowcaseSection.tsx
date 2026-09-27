import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { SectionHeader } from '../components/ui'
import { PLATFORMS, UI } from '../content'
import { useLang } from '../i18n/LangContext'
import { ASSETS } from '../lib/assets'
import { extLink, LINKS } from '../lib/links'
import { EASE } from '../lib/motion'

/* ---------- stand-in screens (shown until the platform PNGs exist) ---------- */

function ScreenShell({ brand, children }: { brand: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-linear-to-b from-brand-navy to-brand-black px-[7%] pt-[16%] text-white">
      <div className="flex items-center justify-between text-[0.6rem] text-slate-400">
        <span>9:41</span>
        <span className="font-semibold tracking-widest text-brand-cyan">{brand}</span>
      </div>
      {children}
    </div>
  )
}

function QuantumSoulScreen() {
  return (
    <ScreenShell brand="QUANTUMSOUL">
      <div className="mx-auto mt-[10%] grid aspect-square w-[46%] place-items-center rounded-full bg-radial from-brand-cyan/50 via-brand-blue/25 to-transparent ring-1 ring-brand-cyan/40">
        <span className="size-1/2 rounded-full bg-linear-to-b from-brand-teal to-brand-blue opacity-80" />
      </div>
      <div className="mt-[10%] grid gap-1.5 text-[0.55rem] leading-snug">
        <span className="max-w-[80%] rounded-lg rounded-bl-sm bg-white/8 px-2 py-1.5 text-slate-200">
          <span className="block h-1 w-16 rounded bg-white/30" />
          <span className="mt-1 block h-1 w-10 rounded bg-white/20" />
        </span>
        <span className="ml-auto max-w-[70%] rounded-lg rounded-br-sm bg-brand-cyan/20 px-2 py-1.5">
          <span className="block h-1 w-12 rounded bg-brand-cyan/60" />
        </span>
        <span className="max-w-[85%] rounded-lg rounded-bl-sm bg-white/8 px-2 py-1.5">
          <span className="block h-1 w-20 rounded bg-white/30" />
          <span className="mt-1 block h-1 w-14 rounded bg-white/20" />
        </span>
      </div>
      <div className="mt-auto mb-[12%] flex h-6 items-center justify-center gap-[2px]">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} className="w-[2px] rounded-full bg-brand-cyan" style={{ height: `${25 + Math.abs(Math.sin(i * 1.3)) * 75}%` }} />
        ))}
      </div>
    </ScreenShell>
  )
}

function EdenVerdenScreen() {
  const iso = (x: number, y: number) => [50 + (x - y) * 9, 20 + (x + y) * 5.2]
  return (
    <ScreenShell brand="EDENVERDEN">
      <p className="mt-[8%] font-display text-[0.95rem] font-semibold">Virtual World</p>
      <svg viewBox="0 0 100 80" className="mt-3 w-full" aria-hidden>
        {Array.from({ length: 25 }, (_, i) => {
          const x = i % 5
          const y = Math.floor(i / 5)
          const [cx, cy] = iso(x, y)
          const h = ((x * 3 + y * 5) % 4) * 2.5
          return (
            <g key={i}>
              <polygon points={`${cx - 9},${cy + 5.2 - h} ${cx},${cy + 10.4 - h} ${cx},${cy + 10.4} ${cx - 9},${cy + 5.2}`} fill="#0d1f4a" />
              <polygon points={`${cx + 9},${cy + 5.2 - h} ${cx},${cy + 10.4 - h} ${cx},${cy + 10.4} ${cx + 9},${cy + 5.2}`} fill="#0a1838" />
              <polygon points={`${cx},${cy - h} ${cx + 9},${cy + 5.2 - h} ${cx},${cy + 10.4 - h} ${cx - 9},${cy + 5.2 - h}`} fill={h > 4 ? '#2F6BFF' : '#12295e'} stroke="#00E5FF55" strokeWidth="0.3" />
            </g>
          )
        })}
      </svg>
      <div className="mt-3 flex -space-x-1.5">
        {['#00E5FF', '#14F1C6', '#2F6BFF', '#8fb1ff'].map((c) => (
          <span key={c} className="size-4 rounded-full ring-2 ring-brand-black" style={{ background: c }} />
        ))}
        <span className="ml-3 self-center text-[0.55rem] text-slate-400">+ online</span>
      </div>
    </ScreenShell>
  )
}

function KruMuayThaiScreen() {
  return (
    <ScreenShell brand="KRU MUAY THAI">
      <div className="relative mt-[10%] aspect-[3/4] w-full overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
        <svg viewBox="0 0 60 80" className="absolute inset-0 size-full" aria-hidden>
          {[
            [26, 14, 27, 22],
            [27, 22, 20, 26],
            [20, 26, 18, 18],
            [27, 22, 34, 25],
            [34, 25, 37, 18],
            [27, 22, 29, 44],
            [29, 44, 25, 60],
            [25, 60, 23, 74],
            [29, 44, 42, 38],
            [42, 38, 54, 32],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#14F1C6" strokeWidth="1.2" strokeLinecap="round" />
          ))}
          <circle cx="26" cy="11" r="3.5" fill="none" stroke="#14F1C6" strokeWidth="1" />
        </svg>
        <span className="absolute top-2 left-2 rounded bg-brand-black/70 px-1.5 py-0.5 font-mono text-[0.5rem] text-brand-teal">● LIVE</span>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-white/5 px-2 py-1.5 text-[0.6rem]">
        <span className="text-slate-400">Pose match</span>
        <span className="font-semibold text-brand-teal">&gt;90%</span>
      </div>
    </ScreenShell>
  )
}

const FALLBACK = { quantumSoul: QuantumSoulScreen, edenVerden: EdenVerdenScreen, kruMuayThai: KruMuayThaiScreen }
const SRC = { quantumSoul: ASSETS.platformQuantumSoul, edenVerden: ASSETS.platformEdenVerden, kruMuayThai: ASSETS.platformKruMuayThai }

function Phone({ src, alt, fallback }: { src: string; alt: string; fallback: ReactNode }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.6rem] border-[3px] border-slate-700/80 bg-brand-black ring-1 ring-white/10 md:rounded-[2.4rem] md:border-[5px]">
      <span className="absolute top-[1.8%] left-1/2 z-10 h-[3.2%] w-[32%] -translate-x-1/2 rounded-full bg-black" />
      {failed ? fallback : <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className="size-full object-cover" />}
    </div>
  )
}

const LAYOUT = [
  { cls: 'relative z-10 scale-95', from: { opacity: 0, x: 80 }, delay: 0.15 },
  { cls: 'relative z-30 scale-120 rounded-[1.6rem] shadow-glow-blue drop-shadow-2xl filter md:scale-125 md:rounded-[2.4rem]', from: { opacity: 0, y: 60 }, delay: 0 },
  { cls: 'relative z-10 scale-95', from: { opacity: 0, x: -80 }, delay: 0.15 },
]

export function PlatformShowcaseSection() {
  const { t } = useLang()
  return (
    <section id="platforms" className="relative overflow-hidden bg-brand-black py-36">
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[50rem] -translate-x-1/2 -translate-y-1/4 bg-[radial-gradient(closest-side,rgb(47_107_255/0.16),transparent)]" />
      <div className="section-shell relative">
        <SectionHeader badge={t(PLATFORMS.badge)} title={<span className="text-gradient-brand">{t(PLATFORMS.title)}</span>} lead={t(PLATFORMS.lead)} />

        <div className="mx-auto mt-24 grid max-w-4xl grid-cols-3 items-center gap-3 sm:gap-6 md:gap-10">
          {PLATFORMS.screens.map((s, i) => {
            const Fallback = FALLBACK[s.key]
            const l = LAYOUT[i]
            return (
              <motion.div
                key={s.key}
                initial={l.from}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 1.1, ease: EASE, delay: l.delay }}
                className={l.cls}
              >
                <Phone src={SRC[s.key]} alt={`${s.name} screen`} fallback={<Fallback />} />
              </motion.div>
            )
          })}
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl gap-3 sm:grid-cols-3">
          {PLATFORMS.screens.map((s) => {
            const href = LINKS.platforms[s.key]
            return (
              <a
                key={s.key}
                {...extLink(href)}
                className="group glass flex items-center justify-between gap-3 rounded-2xl px-5 py-4 transition-transform duration-300 hover:scale-105"
              >
                <span>
                  <span className="block font-display text-base font-semibold text-white">{s.name}</span>
                  <span className="block text-xs text-slate-400">{href === '#' ? t(UI.comingSoon) : t(s.caption)}</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-brand-cyan transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
