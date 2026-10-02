import { Fragment, type ReactNode } from 'react'
import { fmt } from '../../utils/formatting'

export interface StatRow {
  id: string; mean: number; std: number; min: number; max: number; rms: number; snr_db?: number | null
}

export function StatisticsPanel({ rows, unit = 'µW', showSnr }: { rows: StatRow[]; unit?: string; showSnr?: boolean }) {
  return (
    <div className="table-wrap">
      <table className="t">
        <thead><tr><th>Signal</th><th>Mean ({unit})</th><th>Std dev</th><th>Min</th><th>Max</th><th>RMS</th>{showSnr && <th>SNR (dB)</th>}</tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}><td>{r.id}</td><td>{fmt(r.mean, 4)}</td><td>{fmt(r.std, 4)}</td><td>{fmt(r.min, 4)}</td><td>{fmt(r.max, 4)}</td><td>{fmt(r.rms, 4)}</td>{showSnr && <td>{r.snr_db == null ? '—' : fmt(r.snr_db, 2)}</td>}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function KeyStats({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="kv">{items.map((i) => <Fragment key={i.label}><dt>{i.label}</dt><dd>{i.value}</dd></Fragment>)}</dl>
  )
}
