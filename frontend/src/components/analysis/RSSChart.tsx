import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { axisProps, tooltipProps } from '../../utils/formatting'

export interface ChartSeries { key: string; color: string; dashed?: boolean }

export function RSSChart({ rows, series, height = 320, unit = 'µW', cursor, yLabel = 'RSS', legend = true }: {
  rows: Record<string, number>[]; series: ChartSeries[]; height?: number; unit?: string; cursor?: number; yLabel?: string; legend?: boolean
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer>
        <LineChart data={rows} margin={{ top: 8, right: 14, bottom: 4, left: 0 }}>
          <CartesianGrid stroke="#1a2538" vertical={false} />
          <XAxis dataKey="t" type="number" domain={['dataMin', 'dataMax']} {...axisProps} tickFormatter={(v) => `${Number(v).toFixed(1)}`} label={{ value: 'time (s)', position: 'insideBottomRight', offset: -2, fill: '#66768f', fontSize: 11 }} />
          <YAxis {...axisProps} width={56} label={{ value: `${yLabel} (${unit})`, angle: -90, position: 'insideLeft', fill: '#66768f', fontSize: 11 }} />
          <Tooltip {...tooltipProps} labelFormatter={(v) => `t = ${Number(v).toFixed(2)} s`} formatter={(v: number) => `${v.toFixed(4)} ${unit}`} />
          {legend && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {cursor !== undefined && <ReferenceLine x={cursor} stroke="#fbbf24" strokeDasharray="4 3" />}
          {series.map((s) => <Line key={s.key} dataKey={s.key} stroke={s.color} strokeDasharray={s.dashed ? '4 3' : undefined} dot={false} strokeWidth={1.4} isAnimationActive={false} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
