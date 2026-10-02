import { useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { useExperiment } from '../../hooks/useExperiment'
import { useSimulation } from '../../hooks/useSimulation'
import { Field, Panel } from '../ui/Primitives'

export function SaveExperiment({ api }: { api: ReturnType<typeof useExperiment> }) {
  const { config, currentExperiment } = useSimulation()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [saved, setSaved] = useState(false)
  const flash = () => { setSaved(true); window.setTimeout(() => setSaved(false), 1800) }
  const effective = name.trim() || config?.name || ''
  return (
    <Panel title="Save or create">
      <div className="grid g3" style={{ alignItems: 'end' }}>
        <Field label="Name"><input className="input" style={{ fontFamily: 'var(--sans)' }} value={name} placeholder={config?.name} maxLength={80} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Description"><input className="input" style={{ fontFamily: 'var(--sans)' }} value={desc} maxLength={500} onChange={(e) => setDesc(e.target.value)} /></Field>
        <div className="row wrap">
          <button className="btn primary" disabled={!effective} onClick={async () => { if (await api.create(effective, desc)) { setName(''); setDesc(''); flash() } }}>
            <Save size={14} />Save as new
          </button>
          <button className="btn" disabled={!currentExperiment?.id} onClick={async () => { if (await api.saveCurrent()) flash() }} title={currentExperiment?.id ? 'Overwrite the loaded experiment' : 'Load or save an experiment first'}>
            Update “{currentExperiment?.id ? currentExperiment.name : '—'}”
          </button>
          <button className="btn" onClick={async () => { if (await api.createBlank(effective || 'New experiment')) flash() }}><Plus size={14} />Blank experiment</button>
        </div>
      </div>
      {saved && <p style={{ color: 'var(--green)', marginTop: 8, fontSize: 12.5 }}>Saved.</p>}
      {api.error && <p className="err" style={{ marginTop: 8 }}>{api.error}</p>}
    </Panel>
  )
}
