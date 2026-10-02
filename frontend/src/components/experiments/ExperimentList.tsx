import { useExperiment } from '../../hooks/useExperiment'
import { useSimulation } from '../../hooks/useSimulation'
import { EmptyState, ErrorState, Loading } from '../ui/Primitives'
import { ExperimentCard } from './ExperimentCard'

export function ExperimentList({ api }: { api: ReturnType<typeof useExperiment> }) {
  const { navigate } = useSimulation()
  if (api.loading) return <Loading label="Loading experiments…" />
  if (api.error && api.items.length === 0) return <ErrorState message={api.error} />
  if (api.items.length === 0) return <EmptyState title="No saved experiments" message="Save the current configuration above, or load a preset and save it." />
  return (
    <div className="grid g3">
      {api.items.map((rec) => (
        <ExperimentCard key={rec.id} rec={rec} active={api.current?.id === rec.id}
          onLoad={() => { void api.load(rec).then(() => navigate('dashboard')) }}
          onDuplicate={() => void api.duplicate(rec.id)} onRename={(n) => void api.rename(rec.id, n)}
          onDelete={() => void api.remove(rec.id)} onExport={() => void api.exportConfig(rec.id)} />
      ))}
    </div>
  )
}
