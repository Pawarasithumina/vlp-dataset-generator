import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ApiError } from '../api/client'
import { getDefaultConfig, getHealth } from '../api/configuration'
import { runSimulation } from '../api/simulation'
import type { ExperimentConfig } from '../types/configuration'
import type { CurrentExperiment } from '../types/experiment'
import type { SimulationResult } from '../types/simulation'

export type Page =
  | 'dashboard' | 'lab' | 'configuration' | 'monitor' | 'rss' | 'noise' | 'trajectory'
  | 'dataset' | 'export' | 'experiments' | 'presets' | 'settings' | 'about'

export interface Settings { labels3d: boolean; maxChartPoints: number; defaultSpeed: number }
const DEFAULT_SETTINGS: Settings = { labels3d: true, maxChartPoints: 800, defaultSpeed: 1 }

interface Ctx {
  page: Page; navigate: (p: Page) => void
  backend: 'checking' | 'online' | 'offline'; backendVersion: string
  config: ExperimentConfig | null
  updateConfig: (fn: (c: ExperimentConfig) => ExperimentConfig) => void
  loadConfig: (c: ExperimentConfig, exp?: CurrentExperiment | null, run?: boolean) => Promise<void>
  result: SimulationResult | null; running: boolean; error: string | null; dirty: boolean
  run: (cfg?: ExperimentConfig) => Promise<boolean>
  currentExperiment: CurrentExperiment | null; setCurrentExperiment: (e: CurrentExperiment | null) => void
  frame: number; seek: (f: number) => void
  playing: boolean; play: () => void; pause: () => void; restart: () => void
  speed: number; setSpeed: (s: number) => void
  settings: Settings; updateSettings: (p: Partial<Settings>) => void
}

const SimCtx = createContext<Ctx | null>(null)
export const useSimulation = (): Ctx => {
  const c = useContext(SimCtx)
  if (!c) throw new Error('useSimulation must be used inside <SimulationProvider>')
  return c
}

const PAGES: Page[] = ['dashboard', 'lab', 'configuration', 'monitor', 'rss', 'noise', 'trajectory', 'dataset', 'export', 'experiments', 'presets', 'settings', 'about']
const fromHash = (): Page => {
  const h = window.location.hash.replace('#/', '') as Page
  return PAGES.includes(h) ? h : 'dashboard'
}
const loadSettings = (): Settings => {
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('vlp-lab-settings') ?? '{}') } } catch { return DEFAULT_SETTINGS }
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>(fromHash)
  const [backend, setBackend] = useState<Ctx['backend']>('checking')
  const [backendVersion, setBackendVersion] = useState('')
  const [config, setConfig] = useState<ExperimentConfig | null>(null)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [ranJson, setRanJson] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentExperiment, setCurrentExperiment] = useState<CurrentExperiment | null>(null)
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(settings.defaultSpeed)
  const frameRef = useRef(0)

  const navigate = useCallback((p: Page) => { window.location.hash = `#/${p}`; setPage(p) }, [])
  useEffect(() => {
    const h = () => setPage(fromHash())
    window.addEventListener('hashchange', h)
    return () => window.removeEventListener('hashchange', h)
  }, [])

  const seek = useCallback((f: number) => { frameRef.current = f; setFrame(f) }, [])

  const run = useCallback(async (cfg?: ExperimentConfig): Promise<boolean> => {
    const c = cfg ?? config
    if (!c) return false
    setRunning(true); setError(null); setPlaying(false)
    try {
      const r = await runSimulation(c)
      setResult(r); setRanJson(JSON.stringify(c)); seek(0)
      setBackend('online')
      return true
    } catch (e) {
      const err = e as ApiError
      setError(err.message)
      if (err.status === 0) setBackend('offline')
      return false
    } finally { setRunning(false) }
  }, [config, seek])

  const loadConfig = useCallback(async (c: ExperimentConfig, exp: CurrentExperiment | null = null, doRun = true) => {
    setConfig(c); setCurrentExperiment(exp ?? { id: null, name: c.name })
    if (doRun) await run(c)
  }, [run])

  const updateConfig = useCallback((fn: (c: ExperimentConfig) => ExperimentConfig) => {
    setConfig((c) => (c ? fn(c) : c))
  }, [])

  // Boot: check backend, load default configuration, run once so every view has real data.
  const boot = useCallback(async () => {
    setBackend('checking')
    try {
      const h = await getHealth()
      setBackend('online'); setBackendVersion(h.version)
      const cfg = await getDefaultConfig()
      setConfig(cfg); setCurrentExperiment({ id: null, name: cfg.name })
      await run(cfg)
    } catch (e) {
      setBackend('offline'); setError((e as Error).message)
    }
  }, [run])
  useEffect(() => { void boot() }, []) // eslint-disable-line

  useEffect(() => {
    const id = window.setInterval(async () => {
      try { await getHealth(); setBackend('online') } catch { setBackend('offline') }
    }, 10000)
    return () => window.clearInterval(id)
  }, [])

  // Playback loop (UI state commits are throttled to ~30 Hz).
  useEffect(() => {
    if (!playing || !result) return
    const n = result.meta.samples, dt = result.meta.time_step
    let acc = frameRef.current, last = performance.now(), lastCommit = 0, raf = 0
    const tick = (now: number) => {
      acc += ((now - last) / 1000) * speed / dt
      last = now
      if (acc >= n - 1) { seek(n - 1); setPlaying(false); return }
      if (now - lastCommit > 33) { lastCommit = now; const f = Math.floor(acc); if (f !== frameRef.current) seek(f) }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, speed, result, seek])

  const value = useMemo<Ctx>(() => ({
    page, navigate, backend, backendVersion, config, updateConfig, loadConfig, result, running, error,
    dirty: !!config && !!ranJson && JSON.stringify(config) !== ranJson,
    run, currentExperiment, setCurrentExperiment, frame, seek, playing,
    play: () => { if (result && frameRef.current >= result.meta.samples - 1) seek(0); setPlaying(true) },
    pause: () => setPlaying(false),
    restart: () => { seek(0); setPlaying(true) },
    speed, setSpeed, settings,
    updateSettings: (p) => setSettings((s) => { const n = { ...s, ...p }; localStorage.setItem('vlp-lab-settings', JSON.stringify(n)); return n }),
  }), [page, navigate, backend, backendVersion, config, updateConfig, loadConfig, result, running, error, ranJson,
       run, currentExperiment, frame, seek, playing, speed, settings])

  return <SimCtx.Provider value={value}>{children}</SimCtx.Provider>
}
