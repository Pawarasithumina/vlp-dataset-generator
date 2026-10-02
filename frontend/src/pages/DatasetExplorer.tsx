import { useState } from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { DatasetFilters } from '../components/dataset/DatasetFilters'
import { DatasetStatistics } from '../components/dataset/DatasetStatistics'
import { DatasetTable } from '../components/dataset/DatasetTable'
import { ErrorState, Loading, PageHead, Panel } from '../components/ui/Primitives'
import { ResultGate } from '../components/ui/ResultGate'
import { useDataset } from '../hooks/useDataset'
import type { SimulationResult } from '../types/simulation'

function Body({ r }: { r: SimulationResult }) {
  const { query, setQuery, patch, data, stats, loading, error } = useDataset()
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const v = r.validation
  const sort = (col: string) => patch({ sort_by: col, sort_dir: query.sort_by === col && query.sort_dir === 'asc' ? 'desc' : 'asc', page: query.page })
  return (
    <>
      <div className="row wrap">
        <span className={`badge ${v.valid ? 'green' : 'red'}`}>{v.valid ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}{v.valid ? 'Dataset valid' : 'Validation failed'}</span>
        <span className="badge mono">{v.rows.toLocaleString()} rows</span>
        <span className="badge mono">{v.columns} columns</span>
        {data && data.filtered_rows !== data.total_rows && <span className="badge cyan mono">{data.filtered_rows.toLocaleString()} match</span>}
      </div>
      <Panel title="Full dataset" actions={data ? <DatasetFilters columns={data.columns} query={query} patch={patch} hidden={hidden} setHidden={setHidden} /> : null} flush>
        {error ? <ErrorState message={error} />
          : !data ? <Loading label="Loading dataset…" />
          : <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity .15s' }}>
              <DatasetTable data={data} query={query} hidden={hidden} onSort={sort} onPage={(p) => setQuery((q) => ({ ...q, page: p }))} />
            </div>}
      </Panel>
      <Panel title="Validation checks">
        <div className="stack" style={{ gap: 6 }}>
          {v.checks.map((c) => (
            <div key={c.name} className="row" style={{ justifyContent: 'space-between' }}>
              <span className="row">{c.passed ? <CheckCircle2 size={14} color="var(--green)" /> : <AlertTriangle size={14} color={c.severity === 'error' ? 'var(--red)' : 'var(--amber)'} />}{c.name}</span>
              <span className="faint" style={{ fontSize: 12 }}>{c.detail}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Column statistics" flush>{stats ? <DatasetStatistics stats={stats} /> : <Loading />}</Panel>
    </>
  )
}

export default function DatasetExplorer() {
  return (
    <div className="page">
      <PageHead title="Dataset Explorer" subtitle="Search, sort, filter and page through every generated sample." />
      <ResultGate>{(r) => <Body r={r} />}</ResultGate>
    </div>
  )
}
