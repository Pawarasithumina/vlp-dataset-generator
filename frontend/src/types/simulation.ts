import type { ExperimentConfig } from './configuration'

export interface LedInfo { id: string; x: number; y: number; z: number; power: number; half_angle: number; lambertian_order: number }
export interface NoiseSourceInfo {
  id: string; wall: string; x: number; y: number; z: number; type: string; intensity: number; frequency: number
}
export interface SeriesStats { mean: number; std: number; min: number; max: number; rms: number }
export interface RssStats extends SeriesStats { id: string; snr_db: number | null; in_fov_fraction: number }
export interface NoiseStats extends SeriesStats { id: string }
export interface TrajectoryStats {
  path_length: number; avg_velocity: number; max_velocity: number; duration: number; displacement: number
}
export interface DatasetCheck { name: string; passed: boolean; severity: 'error' | 'warning'; detail: string }
export interface DatasetValidation { valid: boolean; rows: number; columns: number; checks: DatasetCheck[] }

export interface SimulationResult {
  meta: {
    samples: number; duration: number; time_step: number; n_leds: number; n_noise: number
    seed: number; generated_at: string; compute_ms: number
  }
  config: ExperimentConfig
  time: number[]
  receiver: { x: number[]; y: number[]; z: number[]; speed: number[]; path_length: number[] }
  leds: LedInfo[]
  noise_sources: NoiseSourceInfo[]
  rss: number[][]
  rss_clean: number[][]
  distances: number[][]
  noise: number[][]
  noise_total: number[]
  stats: {
    rss: RssStats[]; noise: NoiseStats[]; noise_total: SeriesStats | null; trajectory: TrajectoryStats
  }
  validation: DatasetValidation
}

export type Selection = { type: 'led' | 'noise' | 'receiver'; id: string } | null

export interface Layers {
  leds: boolean; cones: boolean; noise: boolean; receiver: boolean; fov: boolean
  trajectory: boolean; rays: boolean; grid: boolean; axes: boolean; room: boolean
}
export const DEFAULT_LAYERS: Layers = {
  leds: true, cones: true, noise: true, receiver: true, fov: true,
  trajectory: true, rays: true, grid: true, axes: true, room: true,
}
