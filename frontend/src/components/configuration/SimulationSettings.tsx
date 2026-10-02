import { NumberField } from '../ui/Primitives'
import type { ExperimentConfig } from '../../types/configuration'

export function SimulationSettings({ c, set, setSeed }: {
  c: ExperimentConfig; set: (s: ExperimentConfig['simulation']) => void; setSeed: (n: number) => void
}) {
  const s = c.simulation
  return (
    <div className="form-grid">
      <NumberField label="Samples" value={s.samples} min={10} max={20000} step={10} integer onChange={(v) => set({ ...s, samples: v })} />
      <NumberField label="Time step" unit="s" value={s.time_step} min={0.001} max={1} step={0.005} onChange={(v) => set({ ...s, time_step: v })} />
      <NumberField label="Random seed" value={c.seed} min={0} max={2147483647} step={1} integer hint="Shared with the Experiment section" onChange={setSeed} />
      <div className="field"><label>Duration</label><div className="mono" style={{ height: 32, display: 'flex', alignItems: 'center' }}>{((s.samples - 1) * s.time_step).toFixed(2)} s</div>
        <span className="hint">Nyquist limit {(0.5 / s.time_step).toFixed(1)} Hz</span></div>
    </div>
  )
}
