import { RSSChart } from './RSSChart'
import { TrajectoryPreview } from '../dashboard/TrajectoryPreview'
import type { SimulationResult } from '../../types/simulation'

/** Single-axis time series (X, Y, Z or speed) for the receiver. */
export function AxisChart({ rows, dataKey, color, unit = 'm', label, height = 200, cursor }: {
  rows: Record<string, number>[]; dataKey: string; color: string; unit?: string; label: string; height?: number; cursor?: number
}) {
  return <RSSChart rows={rows} series={[{ key: dataKey, color }]} unit={unit} yLabel={label} height={height} cursor={cursor} legend={false} />
}

export function PlanChart({ result }: { result: SimulationResult }) {
  return <TrajectoryPreview result={result} height={300} />
}
