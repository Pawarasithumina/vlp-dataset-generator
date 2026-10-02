import type { ColumnStats } from '../../types/dataset'
import { fmt } from '../../utils/formatting'

export function DatasetStatistics({ stats }: { stats: ColumnStats[] }) {
  return (
    <div className="table-wrap" style={{ maxHeight: 360 }}>
      <table className="t">
        <thead><tr><th>Column</th><th>Count</th><th>Mean</th><th>Std</th><th>Min</th><th>25%</th><th>Median</th><th>75%</th><th>Max</th></tr></thead>
        <tbody>
          {stats.map((s) => (
            <tr key={s.column}><td>{s.column}</td><td>{s.count}</td><td>{fmt(s.mean, 4)}</td><td>{fmt(s.std, 4)}</td><td>{fmt(s.min, 4)}</td><td>{fmt(s.q25, 4)}</td><td>{fmt(s.median, 4)}</td><td>{fmt(s.q75, 4)}</td><td>{fmt(s.max, 4)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
