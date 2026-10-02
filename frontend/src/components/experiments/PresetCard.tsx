import { Play, Save } from 'lucide-react'
import type { PresetInfo } from '../../types/experiment'
import { Panel } from '../ui/Primitives'

export function PresetCard({ preset, onLoad, onSave }: { preset: PresetInfo; onLoad: () => void; onSave: () => void }) {
  const c = preset.config
  return (
    <Panel>
      <div className="preset-card" style={{ padding: 0 }}>
        <h4>{preset.name}</h4>
        <p className="dim" style={{ fontSize: 12.5, minHeight: 36 }}>{preset.description}</p>
        <dl className="kv" style={{ fontSize: 12 }}>
          <dt>Room</dt><dd>{c.room.width}×{c.room.length}×{c.room.height} m</dd>
          <dt>LEDs</dt><dd>{c.led.count} × {c.led.power} W</dd>
          <dt>Receiver</dt><dd>{c.receiver.movement.replace('_', ' ')}</dd>
          <dt>Noise</dt><dd>{c.noise.enabled ? `${c.noise.count} @ ${c.noise.intensity} µW` : 'off'}</dd>
        </dl>
        <div className="row"><button className="btn primary sm" onClick={onLoad}><Play size={13} />Load and run</button><button className="btn sm" onClick={onSave}><Save size={13} />Save as experiment</button></div>
      </div>
    </Panel>
  )
}
