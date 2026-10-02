import { NumberField } from '../ui/Primitives'
import type { ExperimentConfig } from '../../types/configuration'

export function RoomSettings({ c, set }: { c: ExperimentConfig; set: (r: ExperimentConfig['room']) => void }) {
  return (
    <div className="form-grid">
      <NumberField label="Width (X)" unit="m" value={c.room.width} min={1} max={50} step={0.5} onChange={(v) => set({ ...c.room, width: v })} />
      <NumberField label="Length (Y)" unit="m" value={c.room.length} min={1} max={50} step={0.5} onChange={(v) => set({ ...c.room, length: v })} />
      <NumberField label="Height (Z)" unit="m" value={c.room.height} min={1} max={15} step={0.1} onChange={(v) => set({ ...c.room, height: v })} />
    </div>
  )
}
