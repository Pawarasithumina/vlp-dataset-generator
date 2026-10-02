export const fmt = (n: number | null | undefined, d = 3): string =>
  n === null || n === undefined || !Number.isFinite(n) ? '—' : n.toFixed(d)

export const fmtTime = (s: number): string => `${s.toFixed(2)} s`

export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export const titleCase = (s: string): string => s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

const LED_PALETTE = ['#22d3ee', '#60a5fa', '#2dd4bf', '#a5b4fc', '#7dd3fc', '#67e8f9', '#38bdf8', '#5eead4']
export const ledColor = (i: number): string => LED_PALETTE[i % LED_PALETTE.length]

export const COLORS = {
  led: '#22d3ee', receiver: '#fbbf24', noise: '#fb7185', trajectory: '#a78bfa', valid: '#34d399',
  grid: '#1d2a40', axis: '#5b6b85', text: '#9fb0c7',
}

/** Shared Recharts axis / tooltip styling. */
export const axisProps = {
  stroke: COLORS.axis, tick: { fill: COLORS.text, fontSize: 11 }, tickLine: false, axisLine: { stroke: '#2a3a55' },
}
export const tooltipProps = {
  contentStyle: { background: '#0f1623', border: '1px solid #2a3a55', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#9fb0c7' }, itemStyle: { padding: 0 }, isAnimationActive: false,
}
