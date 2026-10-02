import { del, downloadFile, get, patch, post, put } from './client'
import type { ExperimentConfig } from '../types/configuration'
import type { ExperimentRecord, PresetInfo } from '../types/experiment'

export const listExperiments = () => get<ExperimentRecord[]>('/experiments')
export const listPresets = () => get<PresetInfo[]>('/experiments/presets')
export const createExperiment = (name: string, description: string, config?: ExperimentConfig) =>
  post<ExperimentRecord>('/experiments', { name, description, config })
export const saveExperiment = (id: string, config: ExperimentConfig, name?: string, description?: string) =>
  put<ExperimentRecord>(`/experiments/${id}`, { config, name, description })
export const renameExperiment = (id: string, name: string) => patch<ExperimentRecord>(`/experiments/${id}/rename`, { name })
export const duplicateExperiment = (id: string) => post<ExperimentRecord>(`/experiments/${id}/duplicate`)
export const deleteExperiment = (id: string) => del(`/experiments/${id}`)
export const exportExperimentConfig = (id: string) => downloadFile(`/experiments/${id}/export`, 'experiment.config.json')
