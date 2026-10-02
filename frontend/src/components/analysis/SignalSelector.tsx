import { ledColor } from '../../utils/formatting'

export function SignalSelector({ ids, selected, onChange, colorFor = (i) => ledColor(i), label = 'Signals' }: {
  ids: string[]; selected: string[]; onChange: (ids: string[]) => void; colorFor?: (i: number) => string; label?: string
}) {
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  return (
    <div className="row wrap" role="group" aria-label={label}>
      {ids.map((id, i) => (
        <button key={id} className={`chip ${selected.includes(id) ? 'on' : ''}`} onClick={() => toggle(id)} aria-pressed={selected.includes(id)}>
          <i style={{ width: 8, height: 8, borderRadius: 2, background: colorFor(i) }} />{id}
        </button>
      ))}
      <button className="btn ghost sm" onClick={() => onChange(ids)}>All</button>
      <button className="btn ghost sm" onClick={() => onChange([])}>None</button>
    </div>
  )
}
