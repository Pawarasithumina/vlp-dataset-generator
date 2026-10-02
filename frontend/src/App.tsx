import { AppShell } from './components/layout/AppShell'
import { useSimulation, type Page } from './hooks/useSimulation'
import About from './pages/About'
import Configuration from './pages/Configuration'
import Dashboard from './pages/Dashboard'
import DatasetExplorer from './pages/DatasetExplorer'
import ExportCenter from './pages/ExportCenter'
import Experiments from './pages/Experiments'
import LiveMonitor from './pages/LiveMonitor'
import NoiseAnalysis from './pages/NoiseAnalysis'
import Presets from './pages/Presets'
import RSSAnalysis from './pages/RSSAnalysis'
import Settings from './pages/Settings'
import SimulationLab from './pages/SimulationLab'
import TrajectoryAnalysis from './pages/TrajectoryAnalysis'

const PAGES: Record<Page, () => JSX.Element> = {
  dashboard: Dashboard, lab: SimulationLab, configuration: Configuration, monitor: LiveMonitor,
  rss: RSSAnalysis, noise: NoiseAnalysis, trajectory: TrajectoryAnalysis, dataset: DatasetExplorer,
  export: ExportCenter, experiments: Experiments, presets: Presets, settings: Settings, about: About,
}

export default function App() {
  const { page } = useSimulation()
  const Current = PAGES[page]
  return <AppShell><Current /></AppShell>
}
