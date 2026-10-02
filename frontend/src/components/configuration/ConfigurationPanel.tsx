import { useEffect, useState, type ReactNode } from 'react'
import { AlertTriangle, Loader2, Play, RotateCcw } from 'lucide-react'
import { getDefaultConfig, validateConfig } from '../../api/configuration'
import { useSimulation } from '../../hooks/useSimulation'
import type { ConfigIssue } from '../../types/configuration'
import { Field, Loading, Panel } from '../ui/Primitives'
import { LEDSettings } from './LEDSettings'
import { NoiseSettings } from './NoiseSettings'
import { OpticalSettings } from './OpticalSettings'
import { ReceiverSettings } from './ReceiverSettings'
import { RoomSettings } from './RoomSettings'
import { SimulationSettings } from './SimulationSettings'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <Panel title={title}>{children}</Panel>
}

export function ConfigurationPanel() {
  const { config, updateConfig, run, running, dirty, navigate, loadConfig } = useSimulation()
  const [issues, setIssues] = useState<ConfigIssue[]>([])

  useEffect(() => {
    if (!config) return
    const id = window.setTimeout(() => { validateConfig(config).then((v) => setIssues(v.issues)).catch(() => setIssues([])) }, 300)
    return () => window.clearTimeout(id)
  }, [config])

  if (!config) return <Loading label="Loading configuration…" />
  const errors = issues.filter((i) => i.level === 'error')

  const apply = async () => { if (await run()) navigate('lab') }
  const reset = async () => { const d = await getDefaultConfig(); await loadConfig(d, null, false) }

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row wrap" style={{ justifyContent: 'space-between' }}>
        <div className="row">{dirty && <span className="badge amber">Unsaved changes — not yet simulated</span>}</div>
        <div className="row">
          <button className="btn" onClick={reset}><RotateCcw size={14} />Reset to defaults</button>
          <button className="btn primary" onClick={apply} disabled={running || errors.length > 0}>
            {running ? <Loader2 size={14} className="spin" /> : <Play size={14} />}Apply and run
          </button>
        </div>
      </div>
      {issues.length > 0 && (
        <div className="stack" style={{ gap: 6 }}>
          {issues.map((i, k) => <div key={k} className={`banner ${i.level === 'error' ? 'error' : 'warn'}`}><AlertTriangle size={15} style={{ flex: 'none', marginTop: 2 }} /><div><b className="mono">{i.field}</b> — {i.message}</div></div>)}
        </div>
      )}
      <div className="grid g2">
        <Section title="Experiment">
          <div className="stack">
            <Field label="Experiment name"><input className="input" style={{ fontFamily: 'var(--sans)' }} value={config.name} maxLength={80} onChange={(e) => updateConfig((c) => ({ ...c, name: e.target.value }))} /></Field>
            <Field label="Description"><textarea className="textarea" value={config.description} maxLength={500} onChange={(e) => updateConfig((c) => ({ ...c, description: e.target.value }))} /></Field>
            <div style={{ maxWidth: 220 }}><Field label="Random seed" hint="Same seed gives identical datasets"><input className="input" type="number" min={0} value={config.seed} onChange={(e) => { const v = parseInt(e.target.value, 10); if (Number.isInteger(v) && v >= 0) updateConfig((c) => ({ ...c, seed: v })) }} /></Field></div>
          </div>
        </Section>
        <Section title="Room"><RoomSettings c={config} set={(room) => updateConfig((c) => ({ ...c, room }))} /></Section>
        <Section title="LED array"><LEDSettings c={config} set={(led) => updateConfig((c) => ({ ...c, led }))} /></Section>
        <Section title="Receiver"><ReceiverSettings c={config} set={(receiver) => updateConfig((c) => ({ ...c, receiver }))} /></Section>
        <Section title="Noise"><NoiseSettings c={config} set={(noise) => updateConfig((c) => ({ ...c, noise }))} /></Section>
        <Section title="Optical"><OpticalSettings c={config} set={(optical) => updateConfig((c) => ({ ...c, optical }))} /></Section>
        <Section title="Simulation"><SimulationSettings c={config} set={(simulation) => updateConfig((c) => ({ ...c, simulation }))} setSeed={(seed) => updateConfig((c) => ({ ...c, seed }))} /></Section>
      </div>
    </div>
  )
}
