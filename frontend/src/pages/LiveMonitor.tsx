import { RSSChart } from '../components/analysis/RSSChart'
import { LabScene } from '../components/simulation/VirtualLab'
import { SimulationTimeline } from '../components/simulation/SimulationTimeline'
import { PageHead, Panel } from '../components/ui/Primitives'
import { ResultGate } from '../components/ui/ResultGate'
import { useCamera } from '../hooks/useCamera'
import { useSimulation } from '../hooks/useSimulation'
import { DEFAULT_LAYERS } from '../types/simulation'
import { fmt, ledColor } from '../utils/formatting'
import { buildRows } from '../utils/statistics'

const WINDOW = 200

export default function LiveMonitor() {
  const { frame } = useSimulation()
  const { cam } = useCamera()
  return (
    <div className="page">
      <PageHead title="Live Monitor" subtitle="Streaming view of the running simulation: values follow the playback head." />
      <ResultGate>{(r) => {
        const from = Math.max(0, frame - WINDOW)
        const series = r.rss.map((v, i) => ({ key: r.leds[i].id, values: v }))
        const rows = buildRows(r.time, series, WINDOW + 1, frame, from)
        const noiseRows = buildRows(r.time, [{ key: 'Total noise', values: r.noise_total }], WINDOW + 1, frame, from)
        const peak = Math.max(...r.rss_clean.map((row) => Math.max(...row)), 1e-9)
        return (
          <>
            <div className="panel"><SimulationTimeline /></div>
            <div className="grid g-main">
              <Panel title={`RSS, last ${WINDOW} samples`}><RSSChart rows={rows} series={r.leds.map((l, i) => ({ key: l.id, color: ledColor(i) }))} height={300} /></Panel>
              <Panel title="Scene" flush><div style={{ height: 346 }}><LabScene result={r} frame={frame} layers={{ ...DEFAULT_LAYERS, cones: false, fov: false }} cam={cam} labels={false} /></div></Panel>
            </div>
            <div className="grid g2">
              <Panel title="Current RSS per LED">
                <div className="stack" style={{ gap: 9 }}>
                  {r.leds.map((l, i) => (
                    <div key={l.id}>
                      <div className="row" style={{ justifyContent: 'space-between' }}><span className="mono">{l.id}</span><span className="mono dim">{fmt(r.rss[i][frame], 4)} µW · {fmt(r.distances[i][frame], 2)} m</span></div>
                      <div className="bar"><div style={{ width: `${Math.min(100, (r.rss_clean[i][frame] / peak) * 100)}%`, background: ledColor(i) }} /></div>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title="Receiver and noise">
                <dl className="kv" style={{ marginBottom: 12 }}>
                  <dt>Position</dt><dd>({fmt(r.receiver.x[frame], 2)}, {fmt(r.receiver.y[frame], 2)}, {fmt(r.receiver.z[frame], 2)}) m</dd>
                  <dt>Speed</dt><dd>{fmt(r.receiver.speed[frame], 3)} m/s</dd>
                  <dt>Total noise</dt><dd>{fmt(r.noise_total[frame], 4)} µW</dd>
                </dl>
                {r.meta.n_noise > 0
                  ? <RSSChart rows={noiseRows} series={[{ key: 'Total noise', color: '#fb7185' }]} height={150} yLabel="Noise" legend={false} />
                  : <p className="dim">Noise is disabled for this experiment.</p>}
              </Panel>
            </div>
          </>
        )
      }}</ResultGate>
    </div>
  )
}
