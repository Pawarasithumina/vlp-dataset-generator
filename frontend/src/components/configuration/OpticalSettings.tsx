import { NumberField, SliderField } from '../ui/Primitives'
import type { ExperimentConfig } from '../../types/configuration'

export function OpticalSettings({ c, set }: { c: ExperimentConfig; set: (o: ExperimentConfig['optical']) => void }) {
  const o = c.optical
  return (
    <div className="form-grid">
      <NumberField label="Receiver area" unit="cm²" value={o.receiver_area} min={0.01} max={100} step={0.1} onChange={(v) => set({ ...o, receiver_area: v })} />
      <NumberField label="Filter gain" value={o.filter_gain} min={0.01} max={1} step={0.05} hint="Transmittance, 0 to 1" onChange={(v) => set({ ...o, filter_gain: v })} />
      <NumberField label="Concentrator gain" value={o.concentrator_gain} min={0.1} max={20} step={0.1} onChange={(v) => set({ ...o, concentrator_gain: v })} />
      <SliderField label="Field of view" unit="°" value={o.fov} min={5} max={90} step={1} onChange={(v) => set({ ...o, fov: v })} />
    </div>
  )
}
