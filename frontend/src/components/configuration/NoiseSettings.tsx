import { NumberField, SelectField, Toggle } from '../ui/Primitives'
import type { ExperimentConfig } from '../../types/configuration'

export function NoiseSettings({ c, set }: { c: ExperimentConfig; set: (n: ExperimentConfig['noise']) => void }) {
  const n = c.noise
  return (
    <div className="stack">
      <Toggle checked={n.enabled} onChange={(v) => set({ ...n, enabled: v })} label="Enable noise sources" />
      <div className="form-grid" style={{ opacity: n.enabled ? 1 : 0.45, pointerEvents: n.enabled ? 'auto' : 'none' }}>
        <NumberField label="Number of sources" value={n.count} min={0} max={16} step={1} integer onChange={(v) => set({ ...n, count: v })} />
        <SelectField label="Placement" value={n.placement} onChange={(v) => set({ ...n, placement: v })}
          options={[{ value: 'even', label: 'Spread across walls' }, { value: 'random', label: 'Random (seeded)' }, { value: 'corners', label: 'Near corners' }]} />
        <SelectField label="Noise type" value={n.type} onChange={(v) => set({ ...n, type: v })}
          options={[{ value: 'mixed', label: 'Mixed (N1 Gaussian, N2 tone, N3 impulsive…)' }, { value: 'gaussian', label: 'Gaussian (band-limited)' }, { value: 'sinusoidal', label: 'Sinusoidal flicker' }, { value: 'impulsive', label: 'Impulsive' }]} />
        <NumberField label="Intensity (RMS at 1 m)" unit="µW" value={n.intensity} min={0} max={100} step={0.5} onChange={(v) => set({ ...n, intensity: v })} />
        <NumberField label="Frequency" unit="Hz" value={n.frequency} min={0.1} max={1000} step={0.5} hint="Tone frequency, Gaussian cut-off or impulse rate" onChange={(v) => set({ ...n, frequency: v })} />
      </div>
    </div>
  )
}
