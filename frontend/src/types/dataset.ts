export interface DatasetPage {
  columns: string[]; rows: number[][]; total_rows: number; filtered_rows: number
  page: number; pages: number; page_size: number
}
export interface DatasetQuery {
  page: number; page_size: number; search: string
  sort_by: string | null; sort_dir: 'asc' | 'desc'
  filter_col: string | null; filter_min: string; filter_max: string
}
export interface ColumnStats {
  column: string; count: number; mean: number; std: number; min: number
  q25: number; median: number; q75: number; max: number
}
export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'config'
