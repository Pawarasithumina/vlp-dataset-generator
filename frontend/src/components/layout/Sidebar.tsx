import { Activity, AudioWaveform, Box, Download, FlaskConical, Info, LayoutDashboard, Layers, Radio, Route, Settings, SlidersHorizontal, Table2, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSimulation, type Page } from '../../hooks/useSimulation'

const GROUPS: { title: string; items: { page: Page; label: string; icon: ReactNode }[] }[] = [
  { title: 'Overview', items: [{ page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> }] },
  { title: 'Simulation', items: [
    { page: 'lab', label: 'Virtual Lab', icon: <Box size={16} /> },
    { page: 'configuration', label: 'Configuration', icon: <SlidersHorizontal size={16} /> },
    { page: 'monitor', label: 'Live Monitor', icon: <Activity size={16} /> }] },
  { title: 'Analysis', items: [
    { page: 'rss', label: 'RSS Analysis', icon: <TrendingUp size={16} /> },
    { page: 'noise', label: 'Noise Analysis', icon: <AudioWaveform size={16} /> },
    { page: 'trajectory', label: 'Trajectory', icon: <Route size={16} /> }] },
  { title: 'Data', items: [
    { page: 'dataset', label: 'Dataset Explorer', icon: <Table2 size={16} /> },
    { page: 'export', label: 'Export Center', icon: <Download size={16} /> }] },
  { title: 'Experiments', items: [
    { page: 'experiments', label: 'Experiments', icon: <FlaskConical size={16} /> },
    { page: 'presets', label: 'Presets', icon: <Layers size={16} /> }] },
  { title: 'System', items: [
    { page: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    { page: 'about', label: 'About', icon: <Info size={16} /> }] },
]

export function Sidebar() {
  const { page, navigate } = useSimulation()
  return (
    <nav className="sidebar" aria-label="Primary">
      <div className="brand">
        <div className="brand-mark"><Radio size={16} /></div>
        <div><b>VLP Lab</b><span>Visible light positioning</span></div>
      </div>
      {GROUPS.map((g) => (
        <div className="nav-group" key={g.title}>
          <div className="nav-title">{g.title}</div>
          {g.items.map((it) => (
            <button key={it.page} className={`nav-item ${page === it.page ? 'active' : ''}`} onClick={() => navigate(it.page)} aria-current={page === it.page ? 'page' : undefined} title={it.label}>
              {it.icon}<span>{it.label}</span>
            </button>
          ))}
        </div>
      ))}
    </nav>
  )
}
