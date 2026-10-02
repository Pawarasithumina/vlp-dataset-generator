import { useState } from 'react'
import { Columns3, Search } from 'lucide-react'
import type { DatasetQuery } from '../../types/dataset'

export function DatasetFilters({ columns, query, patch, hidden, setHidden }: {
  columns: string[]; query: DatasetQuery; patch: (p: Partial<DatasetQuery>) => void
  hidden: Set<string>; setHidden: (s: Set<string>) => void
}) {
  const [open, setOpen] = useState(false)
  const toggle = (c: string) => { const n = new Set(hidden); n.has(c) ? n.delete(c) : n.add(c); setHidden(n) }
  return (
    <div className="row wrap" style={{ position: 'relative' }}>
      <div className="with-unit" style={{ width: 220 }}>
        <input className="input" style={{ paddingLeft: 30, fontFamily: 'var(--sans)' }} placeholder="Search all columns" value={query.search} onChange={(e) => patch({ search: e.target.value })} aria-label="Search" />
        <Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-3)' }} />
      </div>
      <select className="select" style={{ width: 170 }} value={query.filter_col ?? ''} onChange={(e) => patch({ filter_col: e.target.value || null })} aria-label="Filter column">
        <option value="">Filter column…</option>
        {columns.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input className="input" style={{ width: 90 }} type="number" placeholder="min" value={query.filter_min} disabled={!query.filter_col} onChange={(e) => patch({ filter_min: e.target.value })} aria-label="Minimum" />
      <input className="input" style={{ width: 90 }} type="number" placeholder="max" value={query.filter_max} disabled={!query.filter_col} onChange={(e) => patch({ filter_max: e.target.value })} aria-label="Maximum" />
      <select className="select" style={{ width: 110 }} value={query.page_size} onChange={(e) => patch({ page_size: Number(e.target.value) })} aria-label="Rows per page">
        {[10, 25, 50, 100, 250].map((n) => <option key={n} value={n}>{n} rows</option>)}
      </select>
      <button className={`btn ${open ? 'on' : ''}`} onClick={() => setOpen(!open)}><Columns3 size={14} />Columns ({columns.length - hidden.size}/{columns.length})</button>
      {open && (
        <div className="panel" style={{ position: 'absolute', right: 0, top: 38, zIndex: 20, width: 260, maxHeight: 320, overflow: 'auto', padding: 8, boxShadow: '0 8px 24px #0008' }}>
          <div className="row" style={{ padding: '2px 6px 6px' }}>
            <button className="btn ghost sm" onClick={() => setHidden(new Set())}>Show all</button>
            <button className="btn ghost sm" onClick={() => setHidden(new Set(columns.filter((c) => !['sample', 'time_s'].includes(c))))}>Hide all</button>
          </div>
          {columns.map((c) => (
            <label key={c} className="row" style={{ padding: '3px 6px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 12 }}>
              <input type="checkbox" checked={!hidden.has(c)} onChange={() => toggle(c)} style={{ accentColor: 'var(--cyan)' }} />{c}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
