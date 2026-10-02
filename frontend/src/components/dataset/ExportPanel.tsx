import { useState } from 'react'
import { Download, FileJson, FileSpreadsheet, FileText, Loader2, Settings2 } from 'lucide-react'
import { downloadDataset } from '../../api/dataset'
import type { ExportFormat } from '../../types/dataset'
import { useSimulation } from '../../hooks/useSimulation'
import { downloadJSON, slug } from '../../utils/export'
import { Panel } from '../ui/Primitives'

const FORMATS: { fmt: ExportFormat; title: string; desc: string; icon: JSX.Element }[] = [
  { fmt: 'csv', title: 'CSV', desc: 'Every sample as comma-separated values. Opens in any tool.', icon: <FileText size={20} /> },
  { fmt: 'xlsx', title: 'Excel (XLSX)', desc: 'Workbook with Dataset, Statistics and Configuration sheets.', icon: <FileSpreadsheet size={20} /> },
  { fmt: 'json', title: 'JSON', desc: 'Array of records, one object per sample.', icon: <FileJson size={20} /> },
  { fmt: 'config', title: 'Configuration JSON', desc: 'The exact parameters used to generate this dataset.', icon: <Settings2 size={20} /> },
]

export function ExportPanel() {
  const { result, config } = useSimulation()
  const [busy, setBusy] = useState<ExportFormat | null>(null)
  const [error, setError] = useState<string | null>(null)
  if (!result) return null
  const go = async (f: ExportFormat) => {
    setBusy(f); setError(null)
    try { await downloadDataset(f) } catch (e) { setError((e as Error).message) } finally { setBusy(null) }
  }
  return (
    <div className="stack">
      {error && <div className="banner error" role="alert">{error}</div>}
      <div className="grid g4">
        {FORMATS.map((f) => (
          <Panel key={f.fmt}>
            <div className="stack" style={{ gap: 10 }}>
              <span style={{ color: 'var(--cyan)' }}>{f.icon}</span>
              <div><b>{f.title}</b><p className="dim" style={{ fontSize: 12.5, marginTop: 2 }}>{f.desc}</p></div>
              <button className="btn primary" onClick={() => go(f.fmt)} disabled={busy !== null}>
                {busy === f.fmt ? <Loader2 size={14} className="spin" /> : <Download size={14} />}Download
              </button>
            </div>
          </Panel>
        ))}
      </div>
      <div className="row dim" style={{ fontSize: 12.5 }}>
        <span>Dataset downloads include all {result.meta.samples.toLocaleString()} rows.</span>
        <button className="btn ghost sm" onClick={() => config && downloadJSON(config, `${slug(config.name)}.form-state.json`)}>Download current form values as JSON</button>
      </div>
    </div>
  )
}
