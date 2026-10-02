import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import type { SimulationResult } from '../../types/simulation'
import { COLORS, axisProps, tooltipProps } from '../../utils/formatting'

const Hidden = () => <g />

export function TrajectoryPreview({ result, height = 220 }: { result: SimulationResult; height?: number }) {
  const { width: W, length: L } = result.config.room
  const step = Math.max(1, Math.floor(result.time.length / 400))
  const path = result.receiver.x.filter((_, i) => i % step === 0).map((x, k) => ({ x, y: result.receiver.y[k * step] }))
  const leds = result.leds.map((l) => ({ x: l.x, y: l.y, id: l.id }))
  return (
    <div style={{ height }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 6, right: 12, bottom: 0, left: -10 }}>
          <CartesianGrid stroke="#1a2538" />
          <XAxis type="number" dataKey="x" name="X" domain={[0, W]} {...axisProps} unit=" m" />
          <YAxis type="number" dataKey="y" name="Y" domain={[0, L]} {...axisProps} width={48} unit=" m" />
          <ZAxis range={[40, 40]} />
          <Tooltip {...tooltipProps} cursor={{ stroke: '#2a3a55' }} formatter={(v: number) => v.toFixed(3)} />
          <Scatter name="LEDs" data={leds} fill={COLORS.led} isAnimationActive={false} />
          <Scatter name="Path" data={path} line={{ stroke: COLORS.trajectory, strokeWidth: 1.6 }} shape={<Hidden />} isAnimationActive={false} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
