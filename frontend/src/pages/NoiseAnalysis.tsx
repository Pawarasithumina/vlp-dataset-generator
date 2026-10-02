import { NoiseChart } from '../components/analysis/NoiseChart'
import { StatisticsPanel } from '../components/analysis/StatisticsPanel'
import { EmptyState, PageHead, Panel } from '../components/ui/Primitives'
import { ResultGate } from '../components/ui/ResultGate'
import { useSimulation } from '../hooks/useSimulation'
import { fmt, titleCase } from '../utils/formatting'
import { buildRows } from '../utils/statistics'

const NOISE_COLORS = ['#fb7185', '#f472b6', '#fda4af', '#f87171', '#e879a9', '#fb923c', '#fca5a5', '#f9a8d4']

export default function NoiseAnalysis() {
  const { settings, frame, navigate } = useSimulation()
  return (
    <div className="page">
      <PageHead title="Noise Analysis" subtitle="Contribution of each noise source at the receiver and their sum." />
      <ResultGate>{(r) => {
        if (r.meta.n_noise === 0) {
          return <Panel><EmptyState title="Noise is disabled" message="Enable noise sources in the configuration to analyse them here." action={<button className="btn" onClick={() => navigate('configuration')}>Open configuration</button>} /></Panel>
        }
        const series = [...r.noise_sources.map((s, i) => ({ key: s.id, values: r.noise[i] })), { key: 'Total', values: r.noise_total }]
        const rows = buildRows(r.time, series, settings.maxChartPoints)
        const chart = [...r.noise_sources.map((s, i) => ({ key: s.id, color: NOISE_COLORS[i % NOISE_COLORS.length] })), { key: 'Total', color: '#ffffff' }]
        const stats = [...r.stats.noise, ...(r.stats.noise_total ? [{ id: 'Total', ...r.stats.noise_total }] : [])]
        return (
          <>
            <Panel title="Noise power at the receiver"><NoiseChart rows={rows} series={chart} cursor={r.time[frame]} height={340} /></Panel>
            <div className="grid g-main">
              <Panel title="Statistics" flush><StatisticsPanel rows={stats} /></Panel>
              <Panel title="Noise sources" flush>
                <div className="table-wrap"><table className="t">
                  <thead><tr><th>ID</th><th>Wall</th><th>Type</th><th>Intensity</th><th>Freq</th></tr></thead>
                  <tbody>{r.noise_sources.map((s) => <tr key={s.id}><td>{s.id}</td><td className="txt">{s.wall}</td><td className="txt">{titleCase(s.type)}</td><td>{fmt(s.intensity, 2)} µW</td><td>{fmt(s.frequency, 1)} Hz</td></tr>)}</tbody>
                </table></div>
              </Panel>
            </div>
          </>
        )
      }}</ResultGate>
    </div>
  )
}
