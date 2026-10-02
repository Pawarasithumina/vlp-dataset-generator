import { useEffect, useState } from 'react'
import { RSSChart } from '../components/analysis/RSSChart'
import { SignalSelector } from '../components/analysis/SignalSelector'
import { StatisticsPanel } from '../components/analysis/StatisticsPanel'
import { PageHead, Panel } from '../components/ui/Primitives'
import { ResultGate } from '../components/ui/ResultGate'
import { useSimulation } from '../hooks/useSimulation'
import type { SimulationResult } from '../types/simulation'
import { ledColor } from '../utils/formatting'
import { buildRows } from '../utils/statistics'

function Body({ r }: { r: SimulationResult }) {
  const { settings, frame } = useSimulation()
  const ids = r.leds.map((l) => l.id)
  const [sel, setSel] = useState<string[]>(ids.slice(0, Math.min(4, ids.length)))
  const [mode, setMode] = useState<'measured' | 'clean'>('measured')
  useEffect(() => { setSel(ids.slice(0, Math.min(4, ids.length))) }, [r.meta.generated_at]) // eslint-disable-line
  const data = mode === 'measured' ? r.rss : r.rss_clean
  const chosen = ids.map((id, i) => ({ id, i })).filter((x) => sel.includes(x.id))
  const rows = buildRows(r.time, chosen.map(({ id, i }) => ({ key: id, values: data[i] })), settings.maxChartPoints)
  const stats = chosen.map(({ i }) => r.stats.rss[i])
  return (
    <>
      <Panel title="RSS versus time" actions={
        <div className="seg">
          <button className={mode === 'measured' ? 'on' : ''} onClick={() => setMode('measured')}>With noise</button>
          <button className={mode === 'clean' ? 'on' : ''} onClick={() => setMode('clean')}>Noise-free</button>
        </div>}>
        <div className="stack">
          <SignalSelector ids={ids} selected={sel} onChange={setSel} label="LED selector" />
          {chosen.length === 0
            ? <p className="dim" style={{ padding: 40, textAlign: 'center' }}>Select at least one LED to plot.</p>
            : <RSSChart rows={rows} series={chosen.map(({ id, i }) => ({ key: id, color: ledColor(i) }))} cursor={r.time[frame]} />}
        </div>
      </Panel>
      <Panel title="Statistics" flush>
        {stats.length ? <StatisticsPanel rows={stats} showSnr /> : <p className="dim" style={{ padding: 16 }}>No LEDs selected.</p>}
      </Panel>
      <p className="faint" style={{ fontSize: 12 }}>
        Statistics are computed by the backend over the measured (noisy) signal. SNR compares noise-free signal power to total noise power and is blank when noise is disabled or the LED is never in view.
      </p>
    </>
  )
}

export default function RSSAnalysis() {
  return (
    <div className="page">
      <PageHead title="RSS Analysis" subtitle="Received signal strength per LED, with summary statistics." />
      <ResultGate>{(r) => <Body r={r} />}</ResultGate>
    </div>
  )
}
