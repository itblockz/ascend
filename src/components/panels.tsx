import { useEffect, useState } from 'react'
import { CAREERS, CHOICE, COMPANY, CONTACT, HERO, LINKS, PARTNERS, PROJECTS, SOCIALS, TITLES, VALUES } from '../content'
import { useLang, useT } from '../i18n'
import { useJourney } from '../journey/context'
import type { Stop } from '../journey/stops'
import { usePlayVideo } from '../video'
import { order } from './order'
import { Arrow, ExternalArrow, Facts, HudLabel, Lines, Play } from './ui'

const pad = (n: number) => String(n).padStart(2, '0')

export function HeroPanel() {
  const t = useT()
  const { lang } = useLang()
  return (
    <div className="flex h-full flex-col px-5 pt-40 md:px-40 md:pt-64">
      <p className="rise eyebrow mb-4 text-accent" style={order(0)}>
        {t(HERO.eyebrow)}
      </p>
      <h1 id="top-title" className="title text-ink">
        <Lines lines={HERO.title[lang]} />
      </h1>
      <p className="rise mt-8 max-w-sm text-base leading-relaxed text-muted" style={order(2)}>
        {t(HERO.body)}
      </p>
      <a href="#impact" className="rise hit group mt-12 inline-flex items-center gap-6 self-start text-ink" style={order(3)}>
        <span className="h-px w-10 bg-ink transition-[width] duration-500 group-hover:w-14" aria-hidden />
        <span className="eyebrow">{t(HERO.cta)}</span>
        <Arrow className="ml-2 text-accent transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  )
}

/** Chapter opener: big outlined numeral, name, title, one line of intro. */
export function TitlePanel({ stop }: { stop: Stop }) {
  const t = useT()
  const { lang } = useLang()
  const card = TITLES[stop.id]
  return (
    <div className="flex h-full items-center px-5 md:px-40">
      <div>
        <span className="line mb-6" style={order(0)} aria-hidden>
          <span className="numeral">{pad(stop.chapter)}</span>
        </span>
        <p className="rise eyebrow text-accent" style={order(1)}>
          {t(card.eyebrow)}
        </p>
        <h2 id={`${stop.id}-title`} className="title mt-5 text-ink">
          <Lines lines={card.title[lang]} start={1} />
        </h2>
        <p className="rise mt-8 max-w-md leading-relaxed text-muted" style={order(3)}>
          {t(card.intro)}
        </p>
        {stop.id === 'impact' && (
          <ul className="rise mt-10 flex max-w-xl flex-wrap gap-x-6 gap-y-3" style={order(4)}>
            {PARTNERS.map((p) => (
              <li key={p.en} className="eyebrow flex items-center gap-2 text-ink/70">
                <span className="size-1 rotate-45 bg-accent" aria-hidden />
                {t(p)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/** A project beside its landmark. */
export function ProjectPanel({ stop, index }: { stop: Stop; index: number }) {
  const t = useT()
  const play = usePlayVideo()
  const project = PROJECTS[stop.id]
  const right = stop.side === -1
  return (
    <div className={`fade-bottom flex h-full items-end px-5 pb-16 lg:items-center lg:pb-0 ${right ? 'lg:justify-end lg:pr-40' : 'lg:pl-40'}`}>
      {project.hud.map((h) => (
        <HudLabel key={h.anchor} stop={index} anchor={h.anchor} kind={h.kind}>
          {t(h.label)}
        </HudLabel>
      ))}
      <article className="relative w-full max-w-md" aria-labelledby={`${stop.id}-title`}>
        <p className="rise eyebrow leading-normal text-muted" style={order(0)}>
          {pad(stop.chapter)} · {t(project.tag)}
        </p>
        <h3 id={`${stop.id}-title`} className="mt-4 text-[clamp(1.75rem,2vw+0.9rem,2.5rem)] leading-tight font-light tracking-tight text-ink">
          <Lines lines={[t(project.title)]} start={1} />
        </h3>
        {project.award && (
          <p className="rise eyebrow mt-4 flex items-center gap-2 text-accent" style={order(2)}>
            <span className="size-1.5 rotate-45 border border-accent" aria-hidden />
            {t(project.award)}
          </p>
        )}
        <p className="rise mt-5 text-[0.95rem] leading-relaxed text-muted" style={order(2)}>
          {t(project.body)}
        </p>
        {project.facts && (
          <div className="rise mt-7" style={order(3)}>
            <Facts items={project.facts.map((f) => ({ value: t(f.value), label: t(f.label) }))} />
          </div>
        )}
        {project.chips && (
          <ul className="rise mt-6 flex flex-wrap gap-2" style={order(3)}>
            {project.chips.map((c) => (
              <li key={c.en} className="chip">
                {t(c)}
              </li>
            ))}
          </ul>
        )}
        {(project.videos || project.links) && (
          <div className="rise hit mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" style={order(4)}>
            {project.videos?.map((v, i) => (
              <button key={v.youtube} type="button" className="watch group" onClick={() => play(v)}>
                <span className="watch-icon">
                  <Play />
                </span>
                <span className="eyebrow">{i === 0 ? t({ en: 'Watch', th: 'ชมวิดีโอ' }) : t(v.title)}</span>
              </button>
            ))}
            {project.links?.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener" className="text-link eyebrow">
                {t(l.label)}
                <ExternalArrow />
              </a>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}

/** "Choose your path": three kinds of partner, each with its own message. */
export function ChoicePanel({ stop }: { stop: Stop }) {
  const t = useT()
  const { lang } = useLang()
  const { journey } = useJourney()
  const [selected, setSelected] = useState(0)
  const option = CHOICE.options[selected]

  useEffect(() => {
    journey?.select(selected)
  }, [journey, selected])

  return (
    <div className="fade-bottom flex h-full items-end px-5 pb-12 lg:items-center lg:px-40 lg:pb-0">
      <div className="w-full max-w-md">
        <p className="rise eyebrow text-accent" style={order(0)}>
          {pad(stop.chapter)} · {t(CHOICE.eyebrow)}
        </p>
        <h2 id={`${stop.id}-title`} className="title mt-5 text-ink">
          <Lines lines={CHOICE.title[lang]} start={1} />
        </h2>
        <p className="rise mt-5 hidden leading-relaxed text-muted sm:block" style={order(2)}>
          {t(CHOICE.intro)}
        </p>
        <div role="tablist" aria-label={t(CHOICE.eyebrow)} className="rise hit mt-7 flex flex-col" style={order(3)}>
          {CHOICE.options.map((o, i) => (
            <button
              key={o.label.en}
              type="button"
              role="tab"
              id={`path-${i}`}
              aria-selected={i === selected}
              aria-controls="path-panel"
              className="choice"
              onClick={() => setSelected(i)}
            >
              <span className="eyebrow choice-index">{pad(i + 1)}</span>
              <span>{t(o.label)}</span>
            </button>
          ))}
        </div>
        <div id="path-panel" role="tabpanel" aria-labelledby={`path-${selected}`} className="rise hit mt-7" style={order(4)}>
          <p key={selected} className="swap text-lg leading-snug font-light text-ink">
            {t(option.message)}
          </p>
          <ul className="mt-4 hidden flex-wrap gap-2 sm:flex">
            {option.refs.map((r) => (
              <li key={r.en} className="chip">
                {t(r)}
              </li>
            ))}
          </ul>
          <a href={`#${option.cta.to}`} className="btn mt-6">
            <span className="eyebrow">{t(option.cta.label)}</span>
            <Arrow className="text-accent" />
          </a>
        </div>
      </div>
    </div>
  )
}

/** A-S-C-E-N-D: one value at a time as the visitor scrolls, the constellation lighting up. */
export function ValuesPanel({ stop, index }: { stop: Stop; index: number }) {
  const t = useT()
  const { lang } = useLang()
  const { state, journey } = useJourney()
  const current = Math.min(Math.max(state.value, 0), VALUES.items.length - 1)
  const value = VALUES.items[current]
  return (
    <div className="fade-bottom flex h-full items-end px-5 pb-14 lg:items-center lg:px-40 lg:pb-0">
      {VALUES.items.map((v, i) => (
        <HudLabel key={v.letter} stop={index} anchor={String(i)} kind="tag">
          {v.letter}
        </HudLabel>
      ))}
      <div className="w-full max-w-md">
        <p className="rise eyebrow text-accent" style={order(0)}>
          {pad(stop.chapter)} · {t(VALUES.eyebrow)}
        </p>
        <h2 id={`${stop.id}-title`} className="title mt-5 text-ink">
          <Lines lines={VALUES.title[lang]} start={1} />
        </h2>
        <div className="rise mt-9" style={order(3)} aria-hidden>
          <div key={current} className="swap flex items-center gap-6">
            <span className="value-letter">{value.letter}</span>
            <div>
              <p className="text-xl leading-tight font-light text-ink">{t(value.name)}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(value.text)}</p>
            </div>
          </div>
        </div>
        <ol className="rise hit mt-8 flex gap-1" style={order(4)} aria-label={t(VALUES.eyebrow)}>
          {VALUES.items.map((v, i) => (
            <li key={v.letter}>
              <button
                type="button"
                className="value-step eyebrow"
                aria-current={i === current ? 'step' : undefined}
                aria-label={t(v.name)}
                onClick={() => journey && window.scrollTo({ top: journey.valueAnchor(i), behavior: 'smooth' })}
              >
                {v.letter}
              </button>
            </li>
          ))}
        </ol>
        {/* the full list, for screen readers and search engines */}
        <dl className="sr-only">
          {VALUES.items.map((v) => (
            <div key={v.letter}>
              <dt>
                {v.letter} — {t(v.name)}
              </dt>
              <dd>{t(v.text)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export function CareersPanel({ stop, index }: { stop: Stop; index: number }) {
  const t = useT()
  const { lang } = useLang()
  return (
    <div className="fade-bottom flex h-full items-end px-5 pb-14 lg:items-center lg:px-40 lg:pb-0">
      <HudLabel stop={index} anchor="core">
        {t({ en: '8 project tracks', th: '8 แทร็กโปรเจกต์' })}
      </HudLabel>
      <div className="w-full max-w-lg">
        <p className="rise eyebrow text-accent" style={order(0)}>
          {pad(stop.chapter)} · {t(CAREERS.eyebrow)}
        </p>
        <h2 id={`${stop.id}-title`} className="title mt-5 text-ink">
          <Lines lines={CAREERS.title[lang]} start={1} />
        </h2>
        <p className="rise mt-6 max-w-md leading-relaxed text-muted" style={order(2)}>
          {t(CAREERS.intro)}
        </p>
        <div className="rise mt-8" style={order(3)}>
          <Facts items={CAREERS.facts.map((f) => ({ value: f.value, label: t(f.label) }))} />
        </div>
        <p className="rise mt-7 hidden max-w-md text-sm leading-relaxed text-muted sm:block" style={order(4)}>
          {t(CAREERS.program)}
        </p>
        <div className="rise hit mt-8 flex flex-wrap gap-3" style={order(5)}>
          {LINKS.coWorkingForm && (
            <a href={LINKS.coWorkingForm} target="_blank" rel="noopener" className="btn btn-solid">
              <span className="eyebrow">{t(CAREERS.apply)}</span>
              <ExternalArrow />
            </a>
          )}
          <a href="#contact" className="btn">
            <span className="eyebrow">{t(CAREERS.talk)}</span>
            <Arrow className="text-accent" />
          </a>
        </div>
      </div>
    </div>
  )
}

export function ContactPanel({ stop }: { stop: Stop }) {
  const t = useT()
  const { lang } = useLang()
  return (
    <div className="fade-bottom flex h-full flex-col justify-end px-5 pb-6 md:px-20 md:pb-10">
      <div className="flex flex-1 items-end pb-8 lg:items-center lg:pb-0 lg:pl-20">
        <div className="w-full max-w-md">
          <p className="rise eyebrow text-accent" style={order(0)}>
            {t(CONTACT.eyebrow)}
          </p>
          <h2 id={`${stop.id}-title`} className="title mt-5 text-ink">
            <Lines lines={CONTACT.title[lang]} start={1} />
          </h2>
          <p className="rise mt-6 leading-relaxed text-muted" style={order(2)}>
            {t(CONTACT.body)}
          </p>
          <div className="rise hit mt-8 flex flex-wrap gap-3" style={order(3)}>
            {LINKS.virtualOffice && (
              <a href={LINKS.virtualOffice} target="_blank" rel="noopener" className="btn btn-solid">
                <span className="eyebrow">{t({ en: 'Visit virtual office', th: 'เข้าออฟฟิศเสมือน' })}</span>
                <ExternalArrow />
              </a>
            )}
            <a href={LINKS.website} target="_blank" rel="noopener" className="btn">
              <span className="eyebrow">ascendgroup.asia</span>
              <ExternalArrow className="text-accent" />
            </a>
          </div>
        </div>
      </div>
      <footer className="rise hit grid gap-5 border-t border-ink/10 pt-5 text-sm text-muted md:grid-cols-[1.3fr_1.4fr_1fr] md:gap-8 md:pt-6" style={order(4)}>
        <div>
          <p className="eyebrow text-ink">{t(CONTACT.office)}</p>
          <address className="mt-2 leading-relaxed not-italic">
            {t(COMPANY.name)}
            <br />
            {t(COMPANY.address)}
          </address>
        </div>
        <div>
          <p className="eyebrow text-ink">{t(CONTACT.follow)}</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {SOCIALS.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener" className="transition-colors hover:text-ink">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <p className="hidden leading-relaxed md:block">{t(COMPANY.positioning)}</p>
          <p className="text-xs">© 2026 {t(COMPANY.name)}</p>
        </div>
      </footer>
    </div>
  )
}
