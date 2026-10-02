import type { ReactNode } from 'react'
import { useSimulation } from '../../hooks/useSimulation'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppShell({ children }: { children: ReactNode }) {
  const { backend, error } = useSimulation()
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <TopBar />
        {backend === 'offline' && (
          <div className="banner error" style={{ margin: '12px 20px 0' }} role="alert">
            <div><b>Backend not reachable.</b> {error ?? ''} Start it with <code className="mono">uvicorn app.main:app --reload --port 8000</code> from the <code className="mono">backend</code> folder.</div>
          </div>
        )}
        <main className="workspace">{children}</main>
      </div>
    </div>
  )
}
