import { useState } from 'react'
import { HERO_FRAME_COUNT, LAYERS_FRAME_COUNT } from '../lib/assets'
import { getRenderMode, isRecordMode, setRenderMode } from '../lib/renderMode'
import { stages } from '../lib/stageRegistry'
import type { SceneKind } from '../three/ChevronScene'

// Chrome's File System Access API; not yet in the TS DOM lib
type DirHandle = {
  getDirectoryHandle: (name: string, o: { create: boolean }) => Promise<DirHandle>
  getFileHandle: (name: string, o: { create: boolean }) => Promise<{ createWritable: () => Promise<{ write: (b: Blob) => Promise<void>; close: () => Promise<void> }> }>
}

const JOBS: { scene: SceneKind; dir: string; count: number }[] = [
  { scene: 'hero', dir: 'frames_hero', count: HERO_FRAME_COUNT },
  { scene: 'layers', dir: 'frames_layers', count: LAYERS_FRAME_COUNT },
]

/**
 * Writes the current renderer's frames straight into a folder you pick
 * (choose public/assets). Opened with `?record`, Chrome/Edge only.
 */
function FrameRecorder() {
  const [status, setStatus] = useState('')

  const run = async () => {
    const picker = (window as unknown as { showDirectoryPicker?: (o?: object) => Promise<DirHandle> }).showDirectoryPicker
    if (!picker) {
      setStatus('Needs Chrome or Edge (File System Access API)')
      return
    }
    try {
      const root = await picker({ mode: 'readwrite' })
      for (const job of JOBS) {
        const stage = stages.get(job.scene)
        if (!stage) continue
        const dir = await root.getDirectoryHandle(job.dir, { create: true })
        for (let i = 0; i < job.count; i++) {
          const blob = await stage.capture(i / (job.count - 1), 1920, 1080)
          if (!blob) throw new Error('capture failed')
          const file = await dir.getFileHandle(`frame-${String(i + 1).padStart(3, '0')}.webp`, { create: true })
          const w = await file.createWritable()
          await w.write(blob)
          await w.close()
          setStatus(`${job.dir} ${i + 1}/${job.count}`)
        }
      }
      setStatus('Done — reload without ?record to see the frames')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={run} className="rounded-full bg-white px-3 py-1.5 font-semibold text-brand-black">
        Record frames
      </button>
      {status && <span className="max-w-56 truncate text-slate-300">{status}</span>}
    </div>
  )
}

/** Dev-only corner panel to flip between the canvas and Three.js renderers. */
export function DevTools() {
  const mode = getRenderMode()
  const record = isRecordMode()
  if (!import.meta.env.DEV && !record) return null
  return (
    <div className="fixed bottom-4 left-4 z-[90] flex flex-col gap-2 rounded-2xl border border-white/10 bg-brand-black/85 p-2 font-mono text-xs text-white shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-1">
        <span className="px-2 text-slate-500">renderer</span>
        {(['canvas', 'three'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => m !== mode && setRenderMode(m)}
            aria-pressed={m === mode}
            className={`rounded-full px-3 py-1.5 ${m === mode ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {m}
          </button>
        ))}
      </div>
      {record && <FrameRecorder />}
    </div>
  )
}
