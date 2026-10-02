import { RSSChart, type ChartSeries } from './RSSChart'

export function NoiseChart({ rows, series, height = 320, cursor }: { rows: Record<string, number>[]; series: ChartSeries[]; height?: number; cursor?: number }) {
  return <RSSChart rows={rows} series={series} height={height} cursor={cursor} yLabel="Noise" />
}
