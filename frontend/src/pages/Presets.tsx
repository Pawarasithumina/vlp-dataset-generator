import { useEffect, useState } from 'react'
import { listPresets, createExperiment } from '../api/experiments'
import { PresetCard } from '../components/experiments/PresetCard'
import { ErrorState, Loading, PageHead } from '../components/ui/Primitives'
import { useSimulation } from '../hooks/useSimulation'
import type { PresetInfo } from '../types/experiment'

export default function Presets() {
  const { loadConfig, navigate } = useSimulation()
  const [presets, setPresets] = useState<PresetInfo[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)
  useEffect(() => { listPresets().then(setPresets).catch((e: Error) => setError(e.message)) }, [])
  return (
    <div className="page">
      <PageHead title="Presets" subtitle="Starting points for common VLP scenarios." />
      {note && <div className="banner" role="status">{note}</div>}
      {error ? <ErrorState message={error} /> : !presets ? <Loading /> : (
        <div className="grid g3">
          {presets.map((p) => (
            <PresetCard key={p.id} preset={p}
              onLoad={async () => { await loadConfig(p.config, { id: null, name: p.name }); navigate('lab') }}
              onSave={async () => { try { await createExperiment(p.name, p.description, p.config); setNote(`Saved “${p.name}” to Experiments.`) } catch (e) { setNote((e as Error).message) } }} />
          ))}
        </div>
      )}
    </div>
  )
}
