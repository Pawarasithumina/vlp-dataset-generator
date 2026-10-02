import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react'
import type { DatasetPage, DatasetQuery } from '../../types/dataset'

export function DatasetTable({ data, query, hidden, onSort, onPage }: {
  data: DatasetPage; query: DatasetQuery; hidden: Set<string>
  onSort: (col: string) => void; onPage: (p: number) => void
}) {
  const cols = data.columns.map((c, i) => ({ c, i })).filter(({ c }) => !hidden.has(c))
  const from = data.filtered_rows === 0 ? 0 : (data.page - 1) * data.page_size + 1
  const to = Math.min(data.page * data.page_size, data.filtered_rows)
  return (
    <>
      <div className="table-wrap" style={{ maxHeight: 520 }}>
        <table className="t">
          <thead>
            <tr>{cols.map(({ c }) => (
              <th key={c} aria-sort={query.sort_by === c ? (query.sort_dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button onClick={() => onSort(c)} title={`Sort by ${c}`}>{c}{query.sort_by === c && (query.sort_dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}</button>
              </th>))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, r) => <tr key={r}>{cols.map(({ c, i }) => <td key={c}>{Number.isInteger(row[i]) ? row[i] : Number(row[i]).toFixed(4)}</td>)}</tr>)}
            {data.rows.length === 0 && <tr><td colSpan={Math.max(1, cols.length)} className="txt dim" style={{ padding: 24, textAlign: 'center' }}>No rows match the current search and filter.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="row" style={{ justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid var(--border-soft)' }}>
        <span className="dim mono" style={{ fontSize: 12 }}>{from}–{to} of {data.filtered_rows.toLocaleString()} rows</span>
        <div className="row">
          <button className="btn sm icon" disabled={data.page <= 1} onClick={() => onPage(data.page - 1)} aria-label="Previous page"><ChevronLeft size={15} /></button>
          <span className="mono dim" style={{ fontSize: 12 }}>page {data.page} / {data.pages}</span>
          <button className="btn sm icon" disabled={data.page >= data.pages} onClick={() => onPage(data.page + 1)} aria-label="Next page"><ChevronRight size={15} /></button>
        </div>
      </div>
    </>
  )
}
