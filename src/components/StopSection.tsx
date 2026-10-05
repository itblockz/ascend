import type { Stop } from '../journey/stops'
import { CareersPanel, ChoicePanel, ContactPanel, HeroPanel, ProjectPanel, TitlePanel, ValuesPanel } from './panels'

// One stop of the journey: a tall block in the page (its height is the scroll it takes to pass)
// holding a full-screen overlay that the journey shows while the camera is there.
export function StopSection({ stop, index }: { stop: Stop; index: number }) {
  return (
    <section id={stop.id} data-stop={index} aria-labelledby={`${stop.id}-title`} style={{ height: `${stop.length * 100}vh` }}>
      <div className="stop-overlay">
        {stop.kind === 'hero' && <HeroPanel />}
        {stop.kind === 'title' && <TitlePanel stop={stop} />}
        {stop.kind === 'poi' && <ProjectPanel stop={stop} index={index} />}
        {stop.kind === 'choice' && <ChoicePanel stop={stop} />}
        {stop.kind === 'values' && <ValuesPanel stop={stop} index={index} />}
        {stop.kind === 'careers' && <CareersPanel stop={stop} index={index} />}
        {stop.kind === 'end' && <ContactPanel stop={stop} />}
      </div>
    </section>
  )
}
