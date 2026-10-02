import { useExperiment } from '../../hooks/useExperiment'
import { useSimulation } from '../../hooks/useSimulation'
import { fmtDate } from '../../utils/formatting'
import { EmptyState } from '../ui/Primitives'

export function ExperimentSummary() {
  const { items, loading, load } = useExperiment()
  const { navigate } = useSimulation()
  if (loading) return <p className="dim">Loading experiments…</p>
  if (items.length === 0) {
    return <EmptyState title="No saved experiments" message="Save the current configuration to keep it for later." action={<button className="btn sm" onClick={() => navigate('experiments')}>Open experiments</button>} />
  }
  return (
    <div className="stack" style={{ gap: 6 }}>
      {items.slice(0, 4).map((e) => (
        <div key={e.id} className="row" style={{ justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-soft)' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</div>
            <div className="faint" style={{ fontSize: 11.5 }}>{e.config.led.count} LEDs · {e.config.room.width}×{e.config.room.length}×{e.config.room.height} m · {fmtDate(e.updated_at)}</div>
          </div>
          <button className="btn sm" onClick={() => { void load(e).then(() => navigate('dashboard')) }}>Load</button>
        </div>
      ))}
    </div>
  )
}
