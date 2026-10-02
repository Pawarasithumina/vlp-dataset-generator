import { useEffect, useState } from 'react'
import { fetchStats, fetchTable } from '../api/dataset'
import type { ColumnStats, DatasetPage, DatasetQuery } from '../types/dataset'
import { useSimulation } from './useSimulation'

const INITIAL: DatasetQuery = {
  page: 1, page_size: 25, search: '', sort_by: null, sort_dir: 'asc', filter_col: null, filter_min: '', filter_max: '',
}

export function useDataset() {
  const { result } = useSimulation()
  const [query, setQuery] = useState<DatasetQuery>(INITIAL)
  const [data, setData] = useState<DatasetPage | null>(null)
  const [stats, setStats] = useState<ColumnStats[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const stamp = result?.meta.generated_at

  useEffect(() => {
    if (!stamp) return
    let cancelled = false
    setLoading(true)
    const id = window.setTimeout(() => {
      fetchTable(query)
        .then((d) => { if (!cancelled) { setData(d); setError(null) } })
        .catch((e: Error) => { if (!cancelled) setError(e.message) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, query.search ? 250 : 0)
    return () => { cancelled = true; window.clearTimeout(id) }
  }, [query, stamp])

  useEffect(() => {
    if (!stamp) return
    fetchStats().then(setStats).catch(() => setStats(null))
  }, [stamp])

  const patch = (p: Partial<DatasetQuery>) => setQuery((q) => ({ ...q, page: 1, ...p }))
  return { query, setQuery, patch, data, stats, loading, error }
}
