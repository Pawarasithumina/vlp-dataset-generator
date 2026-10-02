import { useState } from 'react'
import { AudioWaveform, CheckCircle2, Clock, Database, Lightbulb, AlertTriangle } from 'lucide-react'
import { ExperimentSummary } from '../components/dashboard/ExperimentSummary'
import { MetricCard } from '../components/dashboard/MetricCard'
import { RSSPreview } from '../components/dashboard/RSSPreview'
import { TrajectoryPreview } from '../components/dashboard/TrajectoryPreview'
import { LabScene } from '../components/simulation/VirtualLab'
import { Panel } from '../components/ui/Primitives'
import { ResultGate } from '../components/ui/ResultGate'
import { useCamera } from '../hooks/useCamera'
import { useSimulation } from '../hooks/useSimulation'
import { DEFAULT_LAYERS } from '../types/simulation'
import { titleCase } from '../utils/formatting'

export default function Dashboard() {
  const { currentExperiment, navigate, frame } = useSimulation()
  const { cam } = useCamera()
  const [layers] = useState({ ...DEFAULT_LAYERS, cones: false, fov: false, axes: true })
  return (
    <div className="page">
      <ResultGate>{(r) => {
        const v = r.validation
        const c = r.config
        return (
          <>
            <div className="grid g5">
              <MetricCard label="Samples" icon={<Database size={14} />} value={r.meta.samples.toLocaleString()} sub={`Δt = ${r.meta.time_step} s`} />
              <MetricCard label="LEDs" icon={<Lightbulb size={14} />} color="var(--cyan)" value={r.meta.n_leds} sub={`${c.led.placement} · ${c.led.power} W each`} />
              <MetricCard label="Noise sources" icon={<AudioWaveform size={14} />} color="var(--red)" value={r.meta.n_noise} sub={c.noise.enabled ? titleCase(c.noise.type) : 'Disabled'} />
              <MetricCard label="Duration" icon={<Clock size={14} />} value={r.meta.duration.toFixed(2)} unit="s" sub={`Computed in ${r.meta.compute_ms.toFixed(0)} ms`} />
              <MetricCard label="Dataset validation" icon={v.valid ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} color={v.valid ? 'var(--green)' : 'var(--red)'}
                value={v.valid ? 'Valid' : 'Failed'} sub={`${v.rows} rows × ${v.columns} columns`} />
            </div>

            <div className="grid g-main">
              <Panel title="3D environment" actions={<button className="btn sm" onClick={() => navigate('lab')}>Open Virtual Lab</button>} flush>
                <div style={{ height: 380 }}><LabScene result={r} frame={frame} layers={layers} cam={cam} labels={false} autoRotate /></div>
              </Panel>
              <Panel title="Configuration summary">
                <dl className="kv" style={{ rowGap: 8 }}>
                  <dt>Experiment</dt><dd style={{ fontFamily: 'var(--sans)' }}>{currentExperiment?.name}</dd>
                  <dt>Room</dt><dd>{c.room.width} × {c.room.length} × {c.room.height} m</dd>
                  <dt>LED array</dt><dd>{c.led.count} · {c.led.placement}</dd>
                  <dt>Half-power angle</dt><dd>{c.led.half_angle}°</dd>
                  <dt>Receiver</dt><dd>{titleCase(c.receiver.movement)} · {c.receiver.speed} m/s</dd>
                  <dt>Receiver FOV</dt><dd>{c.optical.fov}°</dd>
                  <dt>Receiver area</dt><dd>{c.optical.receiver_area} cm²</dd>
                  <dt>Noise</dt><dd>{c.noise.enabled ? `${c.noise.count} × ${c.noise.intensity} µW` : 'off'}</dd>
                  <dt>Seed</dt><dd>{c.seed}</dd>
                </dl>
                <button className="btn sm" style={{ marginTop: 14 }} onClick={() => navigate('configuration')}>Edit configuration</button>
              </Panel>
            </div>

            <div className="grid g3">
              <Panel title="RSS preview" actions={<button className="btn ghost sm" onClick={() => navigate('rss')}>Analyse</button>}><RSSPreview result={r} /></Panel>
              <Panel title="Receiver trajectory (XY)" actions={<button className="btn ghost sm" onClick={() => navigate('trajectory')}>Analyse</button>}><TrajectoryPreview result={r} /></Panel>
              <Panel title="Recent experiments"><ExperimentSummary /></Panel>
            </div>

            {!v.valid || v.checks.some((k) => !k.passed) ? (
              <Panel title="Validation notes">
                <div className="stack" style={{ gap: 6 }}>{v.checks.filter((k) => !k.passed).map((k) => <div key={k.name} className={`banner ${k.severity === 'error' ? 'error' : 'warn'}`}><b>{k.name}</b> — {k.detail}</div>)}</div>
              </Panel>
            ) : null}
          </>
        )
      }}</ResultGate>
    </div>
  )
}
