import { useCallback, useEffect, useState } from 'react'
import * as api from '../api/experiments'
import type { ExperimentRecord } from '../types/experiment'
import { useSimulation } from './useSimulation'

export function useExperiment() {
  const { config, loadConfig, currentExperiment, setCurrentExperiment } = useSimulation()
  const [items, setItems] = useState<ExperimentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try { setItems(await api.listExperiments()); setError(null) }
    catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void refresh() }, [refresh])

  const guard = async (fn: () => Promise<unknown>) => {
    try { await fn(); await refresh(); return true } catch (e) { setError((e as Error).message); return false }
  }

  return {
    items, loading, error, refresh, current: currentExperiment,
    create: (name: string, description: string) => guard(async () => {
      const rec = await api.createExperiment(name, description, config ?? undefined)
      setCurrentExperiment({ id: rec.id, name: rec.name })
    }),
    createBlank: (name: string) => guard(async () => {
      const rec = await api.createExperiment(name, '')
      await loadConfig(rec.config, { id: rec.id, name: rec.name })
    }),
    saveCurrent: () => guard(async () => {
      if (!currentExperiment?.id || !config) return
      await api.saveExperiment(currentExperiment.id, config)
    }),
    load: (rec: ExperimentRecord) => loadConfig(rec.config, { id: rec.id, name: rec.name }),
    duplicate: (id: string) => guard(() => api.duplicateExperiment(id)),
    rename: (id: string, name: string) => guard(async () => {
      await api.renameExperiment(id, name)
      if (currentExperiment?.id === id) setCurrentExperiment({ id, name })
    }),
    remove: (id: string) => guard(async () => {
      await api.deleteExperiment(id)
      if (currentExperiment?.id === id) setCurrentExperiment({ id: null, name: config?.name ?? 'Untitled' })
    }),
    exportConfig: (id: string) => guard(() => api.exportExperimentConfig(id)),
  }
}
