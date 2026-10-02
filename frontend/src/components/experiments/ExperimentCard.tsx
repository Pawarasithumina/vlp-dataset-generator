import { useState } from 'react'
import { Check, Copy, Download, FolderOpen, Pencil, Trash2, X } from 'lucide-react'
import type { ExperimentRecord } from '../../types/experiment'
import { fmtDate } from '../../utils/formatting'
import { Panel } from '../ui/Primitives'

export function ExperimentCard({ rec, active, onLoad, onDuplicate, onRename, onDelete, onExport }: {
  rec: ExperimentRecord; active: boolean
  onLoad: () => void; onDuplicate: () => void; onRename: (n: string) => void; onDelete: () => void; onExport: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(rec.name)
  const [confirm, setConfirm] = useState(false)
  const c = rec.config
  return (
    <Panel className={active ? 'active-card' : ''} style={active ? { borderColor: '#1d5766' } : undefined}>
      <div className="exp-card" style={{ padding: 0 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {editing ? (
            <div className="row" style={{ flex: 1 }}>
              <input className="input" style={{ fontFamily: 'var(--sans)' }} value={name} autoFocus maxLength={80} onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { onRename(name.trim()); setEditing(false) } if (e.key === 'Escape') setEditing(false) }} />
              <button className="btn icon sm" onClick={() => { if (name.trim()) { onRename(name.trim()); setEditing(false) } }} aria-label="Save name"><Check size={14} /></button>
              <button className="btn icon sm ghost" onClick={() => { setName(rec.name); setEditing(false) }} aria-label="Cancel"><X size={14} /></button>
            </div>
          ) : <h4>{rec.name}</h4>}
          {active && <span className="badge cyan">Current</span>}
        </div>
        {rec.description && <p className="dim" style={{ fontSize: 12.5 }}>{rec.description}</p>}
        <div className="faint mono" style={{ fontSize: 11.5 }}>
          {c.led.count} LEDs · {c.room.width}×{c.room.length}×{c.room.height} m · {c.receiver.movement.replace('_', ' ')} · {c.simulation.samples} samples · seed {c.seed}
        </div>
        <div className="faint" style={{ fontSize: 11.5 }}>Updated {fmtDate(rec.updated_at)}</div>
        <div className="row wrap">
          <button className="btn sm primary" onClick={onLoad}><FolderOpen size={13} />Load</button>
          <button className="btn sm" onClick={() => setEditing(true)}><Pencil size={13} />Rename</button>
          <button className="btn sm" onClick={onDuplicate}><Copy size={13} />Duplicate</button>
          <button className="btn sm" onClick={onExport}><Download size={13} />Config</button>
          {confirm ? (
            <>
              <button className="btn sm danger" onClick={() => { onDelete(); setConfirm(false) }}>Confirm delete</button>
              <button className="btn sm ghost" onClick={() => setConfirm(false)}>Cancel</button>
            </>
          ) : <button className="btn sm danger" onClick={() => setConfirm(true)}><Trash2 size={13} />Delete</button>}
        </div>
      </div>
    </Panel>
  )
}
