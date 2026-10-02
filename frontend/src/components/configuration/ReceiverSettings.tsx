import { NumberField, SelectField } from '../ui/Primitives'
import type { ExperimentConfig } from '../../types/configuration'

export function ReceiverSettings({ c, set }: { c: ExperimentConfig; set: (r: ExperimentConfig['receiver']) => void }) {
  const r = c.receiver
  return (
    <div className="form-grid">
      <SelectField label="Movement type" value={r.movement} onChange={(v) => set({ ...r, movement: v })}
        options={[{ value: 'static', label: 'Static' }, { value: 'linear', label: 'Linear (bouncing)' }, { value: 'circular', label: 'Circular' }, { value: 'random_walk', label: 'Random walk' }]} />
      <NumberField label="X" unit="m" value={r.x} min={0} max={c.room.width} step={0.1} hint={r.movement === 'circular' ? 'Circle centre' : 'Start position'} onChange={(v) => set({ ...r, x: v })} />
      <NumberField label="Y" unit="m" value={r.y} min={0} max={c.room.length} step={0.1} onChange={(v) => set({ ...r, y: v })} />
      <NumberField label="Z (height)" unit="m" value={r.z} min={0} max={c.room.height - 0.01} step={0.1} onChange={(v) => set({ ...r, z: v })} />
      <NumberField label="Speed" unit="m/s" value={r.speed} min={0} max={10} step={0.1} onChange={(v) => set({ ...r, speed: v })} />
    </div>
  )
}
