import { downloadFile, get } from './client'
import type { ColumnStats, DatasetPage, DatasetQuery, ExportFormat } from '../types/dataset'

export function fetchTable(q: DatasetQuery) {
  const p = new URLSearchParams({
    page: String(q.page), page_size: String(q.page_size), search: q.search, sort_dir: q.sort_dir,
  })
  if (q.sort_by) p.set('sort_by', q.sort_by)
  if (q.filter_col) {
    p.set('filter_col', q.filter_col)
    if (q.filter_min !== '') p.set('filter_min', q.filter_min)
    if (q.filter_max !== '') p.set('filter_max', q.filter_max)
  }
  return get<DatasetPage>(`/dataset/table?${p}`)
}
export const fetchStats = () => get<ColumnStats[]>('/dataset/stats')
export const downloadDataset = (fmt: ExportFormat) => downloadFile(`/dataset/export/${fmt}`, `vlp-dataset.${fmt}`)
