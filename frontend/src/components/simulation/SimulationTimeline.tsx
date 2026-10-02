import { Pause, Play, RotateCcw } from 'lucide-react'
import { useSimulation } from '../../hooks/useSimulation'

const SPEEDS = [0.25, 0.5, 1, 2, 4, 8]

export function SimulationTimeline() {
  const { result, frame, seek, playing, play, pause, restart, speed, setSpeed } = useSimulation()
  if (!result) return null
  const n = result.meta.samples
  return (
    <div className="timeline">
      <button className="btn icon sm primary" onClick={playing ? pause : play} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? <Pause size={15} /> : <Play size={15} />}
      </button>
      <button className="btn icon sm" onClick={restart} aria-label="Restart" title="Restart"><RotateCcw size={14} /></button>
      <input className="slider" type="range" min={0} max={n - 1} value={frame} onChange={(e) => seek(Number(e.target.value))} aria-label="Timeline" />
      <span className="clock">t = {result.time[frame].toFixed(2)} s / {result.time[n - 1].toFixed(2)} s</span>
      <span className="faint mono" style={{ fontSize: 12 }}>#{frame + 1}/{n}</span>
      <label className="row dim" style={{ fontSize: 12 }}>Speed
        <select className="select" style={{ width: 74, height: 28 }} value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
          {SPEEDS.map((s) => <option key={s} value={s}>{s}×</option>)}
        </select>
      </label>
    </div>
  )
}
