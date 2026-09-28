import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE } from '../lib/motion'

export function Badge({ children, tone = 'dark', className = '' }: { children: ReactNode; tone?: 'dark' | 'light'; className?: string }) {
  const toneCls =
    tone === 'dark'
      ? 'text-slate-400'
      : 'text-slate-500'
  return (
    <span
      className={`inline-block text-xs font-semibold tracking-[0.16em] uppercase ${toneCls} ${className}`}
    >
      {children}
    </span>
  )
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  x?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeader({
  badge,
  title,
  lead,
  tone = 'dark',
  align = 'center',
}: {
  badge: string
  title: ReactNode
  lead?: ReactNode
  tone?: 'dark' | 'light'
  align?: 'center' | 'left'
}) {
  const alignCls = align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-left'
  return (
    <Reveal className={`flex max-w-3xl flex-col gap-6 ${alignCls}`}>
      <Badge tone={tone}>{badge}</Badge>
      <h2
        className={`font-display text-4xl leading-[1.02] font-semibold tracking-tight text-balance md:text-6xl ${
          tone === 'dark' ? 'text-white' : 'text-brand-black'
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`max-w-2xl text-base leading-relaxed md:text-lg ${tone === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{lead}</p>
      )}
    </Reveal>
  )
}

export function PrimaryButton({
  children,
  onClick,
  tone = 'dark',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  /** background it sits on: white button on dark, obsidian button on light */
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-7 py-3.5 text-sm font-semibold transition-opacity ${tone === 'dark' ? 'bg-white text-brand-black' : 'bg-brand-black text-white'} duration-300 hover:opacity-85 ${className}`}
    >
      {children}
    </button>
  )
}
