import { FlaskConical, Loader2, Play } from 'lucide-react'
import { useSimulation, type Page } from '../../hooks/useSimulation'
import { StatusIndicator } from './StatusIndicator'

const TITLES: Record<Page, string> = {
  dashboard: 'Dashboard', lab: 'Virtual Lab', configuration: 'Configuration', monitor: 'Live Monitor',
  rss: 'RSS Analysis', noise: 'Noise Analysis', trajectory: 'Trajectory Analysis', dataset: 'Dataset Explorer',
  export: 'Export Center', experiments: 'Experiments', presets: 'Presets', settings: 'Settings', about: 'About',
}

export function TopBar() {
  const { page, currentExperiment, dirty, run, running, backend, navigate } = useSimulation()
  return (
    <header className="topbar">
      <h1>{TITLES[page]}</h1>
      <button className="badge cyan" style={{ cursor: 'pointer' }} onClick={() => navigate('experiments')} title="Current experiment">
        <FlaskConical size={12} />{currentExperiment?.name ?? 'No experiment'}{dirty && <span className="dot amber" title="Configuration changed since last run" />}
      </button>
      <span className="sp" />
      <StatusIndicator />
      <button className="btn primary sm" onClick={() => run()} disabled={running || backend !== 'online'}>
        {running ? <Loader2 size={14} className="spin" /> : <Play size={14} />}{running ? 'Running…' : dirty ? 'Run (config changed)' : 'Run simulation'}
      </button>
    </header>
  )
}
