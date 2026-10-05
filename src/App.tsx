import { Header } from './components/Header'
import { Hud } from './components/Hud'
import { JourneyProvider } from './components/JourneyProvider'
import { LangProvider } from './components/LangProvider'
import { Rail } from './components/Rail'
import { StopSection } from './components/StopSection'
import { VideoProvider } from './components/VideoProvider'
import { STOPS } from './journey/stops'

export default function App() {
  return (
    <LangProvider>
      <VideoProvider>
        <JourneyProvider>
          <Header />
          <main>
            {STOPS.map((stop, i) => (
              <StopSection key={stop.id} stop={stop} index={i} />
            ))}
          </main>
          <Rail />
          <Hud />
        </JourneyProvider>
      </VideoProvider>
    </LangProvider>
  )
}
