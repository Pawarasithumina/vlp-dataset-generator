import type { ReactNode } from 'react'
import { useSimulation } from '../../hooks/useSimulation'
import type { SimulationResult } from '../../types/simulation'
import { EmptyState, ErrorState, Loading } from './Primitives'

/** Renders children only when a real backend result exists; otherwise a loading / error / empty state. */
export function ResultGate({ children }: { children: (r: SimulationResult) => ReactNode }) {
  const { result, running, error, backend, run } = useSimulation()
  if (result) return <>{children(result)}</>
  if (running || backend === 'checking') return <Loading label="Running simulation on the backend…" />
  if (error) return <ErrorState message={error} action={<button className="btn" onClick={() => run()}>Try again</button>} />
  return <EmptyState title="No simulation data yet" message="Run a simulation to see results here." action={<button className="btn primary" onClick={() => run()}>Run simulation</button>} />
}
