import { NumberField, SelectField, SliderField } from '../ui/Primitives'
import type { ExperimentConfig } from '../../types/configuration'

export function LEDSettings({ c, set }: { c: ExperimentConfig; set: (l: ExperimentConfig['led']) => void }) {
  return (
    <div className="form-grid">
      <NumberField label="Number of LEDs" value={c.led.count} min={1} max={64} step={1} integer onChange={(v) => set({ ...c.led, count: v })} />
      <SelectField label="Placement" value={c.led.placement} onChange={(v) => set({ ...c.led, placement: v })}
        options={[{ value: 'grid', label: 'Ceiling grid' }, { value: 'ring', label: 'Ring' }, { value: 'random', label: 'Random (seeded)' }]} />
      <NumberField label="Power per LED" unit="W" value={c.led.power} min={0.1} max={100} step={0.5} onChange={(v) => set({ ...c.led, power: v })} />
      <SliderField label="Half-power angle" unit="°" value={c.led.half_angle} min={5} max={85} step={1} onChange={(v) => set({ ...c.led, half_angle: v })} />
    </div>
  )
}
