import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useSimulation } from '../../hooks/useSimulation'
import type { SimulationResult } from '../../types/simulation'
import { axisProps, ledColor, tooltipProps } from '../../utils/formatting'
import { buildRows } from '../../utils/statistics'

export function RSSPreview({ result }: { result: SimulationResult }) {
  const { settings } = useSimulation()
  const rows = buildRows(result.time, result.rss.map((v, i) => ({ key: result.leds[i].id, values: v })), Math.min(300, settings.maxChartPoints))
  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={rows} margin={{ top: 6, right: 8, bottom: 0, left: -10 }}>
          <CartesianGrid stroke="#1a2538" vertical={false} />
          <XAxis dataKey="t" {...axisProps} tickFormatter={(v) => `${v.toFixed(0)}s`} />
          <YAxis {...axisProps} width={44} />
          <Tooltip {...tooltipProps} labelFormatter={(v) => `t = ${Number(v).toFixed(2)} s`} formatter={(v: number) => `${v.toFixed(3)} µW`} />
          {result.leds.map((l, i) => <Line key={l.id} dataKey={l.id} stroke={ledColor(i)} dot={false} strokeWidth={1.3} isAnimationActive={false} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
