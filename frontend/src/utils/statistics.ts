/** Presentation helpers only. All scientific statistics come from the backend. */

export function downsampleIndices(n: number, max: number, upTo = n - 1): number[] {
  const last = Math.min(n - 1, upTo)
  const count = last + 1
  if (count <= max) return Array.from({ length: count }, (_, i) => i)
  const step = (count - 1) / (max - 1)
  return Array.from({ length: max }, (_, i) => Math.round(i * step))
}

export function buildRows(
  time: number[], series: { key: string; values: number[] }[], maxPoints: number, upTo?: number, from = 0,
): Record<string, number>[] {
  const idx = downsampleIndices(time.length, maxPoints, upTo).filter((i) => i >= from)
  return idx.map((i) => {
    const row: Record<string, number> = { t: time[i] }
    for (const s of series) row[s.key] = s.values[i]
    return row
  })
}
