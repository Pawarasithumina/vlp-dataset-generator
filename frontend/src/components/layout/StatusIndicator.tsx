import { useSimulation } from '../../hooks/useSimulation'

export function StatusIndicator() {
  const { backend, backendVersion } = useSimulation()
  const cls = backend === 'online' ? 'green' : backend === 'offline' ? 'red' : 'amber pulse'
  const label = backend === 'online' ? `Backend connected${backendVersion ? ` · v${backendVersion}` : ''}` : backend === 'offline' ? 'Backend offline' : 'Connecting…'
  return <span className="row dim" style={{ fontSize: 12.5 }} role="status"><span className={`dot ${cls}`} />{label}</span>
}
