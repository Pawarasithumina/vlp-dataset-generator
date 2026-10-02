import { AxisChart, PlanChart } from '../components/analysis/TrajectoryChart'
import { KeyStats } from '../components/analysis/StatisticsPanel'
import { LabScene } from '../components/simulation/VirtualLab'
import { PageHead, Panel } from '../components/ui/Primitives'
import { ResultGate } from '../components/ui/ResultGate'
import { useCamera } from '../hooks/useCamera'
import { useSimulation } from '../hooks/useSimulation'
import type { Layers } from '../types/simulation'
import { fmt } from '../utils/formatting'
import { buildRows } from '../utils/statistics'

const L3D: Layers = { leds: false, cones: false, noise: false, receiver: true, fov: false, trajectory: true, rays: false, grid: true, axes: true, room: true }

export default function TrajectoryAnalysis() {
  const { settings, frame } = useSimulation()
  const { cam } = useCamera()
  return (
    <div className="page">
      <PageHead title="Trajectory Analysis" subtitle="Receiver motion in time and space." />
      <ResultGate>{(r) => {
        const t = r.stats.trajectory
        const rx = r.receiver
        const rows = buildRows(r.time, [{ key: 'x', values: rx.x }, { key: 'y', values: rx.y }, { key: 'z', values: rx.z }, { key: 'v', values: rx.speed }], settings.maxChartPoints)
        const cur = r.time[frame]
        return (
          <>
            <div className="grid g-main">
              <Panel title="3D trajectory" flush><div style={{ height: 360 }}><LabScene result={r} frame={frame} layers={L3D} cam={cam} labels={false} /></div></Panel>
              <Panel title="Motion summary">
                <KeyStats items={[
                  { label: 'Total path length', value: `${fmt(t.path_length, 3)} m` },
                  { label: 'Net displacement', value: `${fmt(t.displacement, 3)} m` },
                  { label: 'Average velocity', value: `${fmt(t.avg_velocity, 3)} m/s` },
                  { label: 'Maximum velocity', value: `${fmt(t.max_velocity, 3)} m/s` },
                  { label: 'Duration', value: `${fmt(t.duration, 2)} s` },
                  { label: 'Movement', value: r.config.receiver.movement.replace('_', ' ') },
                ]} />
              </Panel>
            </div>
            <div className="grid g2">
              <Panel title="X versus time"><AxisChart rows={rows} dataKey="x" color="#f87171" label="X" cursor={cur} /></Panel>
              <Panel title="Y versus time"><AxisChart rows={rows} dataKey="y" color="#4ade80" label="Y" cursor={cur} /></Panel>
              <Panel title="Z versus time"><AxisChart rows={rows} dataKey="z" color="#60a5fa" label="Z" cursor={cur} /></Panel>
              <Panel title="Speed versus time"><AxisChart rows={rows} dataKey="v" color="#a78bfa" label="Speed" unit="m/s" cursor={cur} /></Panel>
            </div>
            <Panel title="2D trajectory (plan view, LEDs in cyan)"><PlanChart result={r} /></Panel>
          </>
        )
      }}</ResultGate>
    </div>
  )
}
