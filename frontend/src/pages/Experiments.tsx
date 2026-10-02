import { ExperimentList } from '../components/experiments/ExperimentList'
import { SaveExperiment } from '../components/experiments/SaveExperiment'
import { PageHead } from '../components/ui/Primitives'
import { useExperiment } from '../hooks/useExperiment'

export default function Experiments() {
  const api = useExperiment()
  return (
    <div className="page">
      <PageHead title="Experiments" subtitle="Saved configurations. Loading one re-runs the simulation on the backend." />
      <SaveExperiment api={api} />
      <ExperimentList api={api} />
    </div>
  )
}
