import type { ExperimentConfig } from './configuration'

export interface ExperimentRecord {
  id: string; name: string; description: string
  created_at: string; updated_at: string; config: ExperimentConfig
}
export interface PresetInfo { id: string; name: string; description: string; config: ExperimentConfig }
export interface CurrentExperiment { id: string | null; name: string }
