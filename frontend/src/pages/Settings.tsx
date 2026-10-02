import { PageHead, Panel, SelectField, Toggle } from '../components/ui/Primitives'
import { useSimulation } from '../hooks/useSimulation'

export default function Settings() {
  const { settings, updateSettings, setSpeed, backend, backendVersion } = useSimulation()
  return (
    <div className="page">
      <PageHead title="Settings" subtitle="Display preferences, stored in this browser only." />
      <div className="grid g2">
        <Panel title="Display">
          <div className="stack">
            <Toggle checked={settings.labels3d} onChange={(v) => updateSettings({ labels3d: v })} label="Show labels in 3D views" />
            <SelectField label="Maximum points per chart" value={String(settings.maxChartPoints)} onChange={(v) => updateSettings({ maxChartPoints: Number(v) })}
              options={[400, 800, 1500, 3000].map((n) => ({ value: String(n), label: `${n} points` }))} hint="Charts are downsampled for responsiveness. Exports always contain every sample." />
            <SelectField label="Default playback speed" value={String(settings.defaultSpeed)} onChange={(v) => { updateSettings({ defaultSpeed: Number(v) }); setSpeed(Number(v)) }}
              options={[0.25, 0.5, 1, 2, 4, 8].map((n) => ({ value: String(n), label: `${n}×` }))} />
          </div>
        </Panel>
        <Panel title="Backend">
          <dl className="kv"><dt>Status</dt><dd>{backend}</dd><dt>Version</dt><dd>{backendVersion || '—'}</dd><dt>API base</dt><dd>/api (proxied to port 8000)</dd></dl>
        </Panel>
      </div>
    </div>
  )
}
