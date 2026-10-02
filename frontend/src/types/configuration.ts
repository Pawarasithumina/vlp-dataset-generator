export interface RoomConfig { width: number; length: number; height: number }
export interface LEDConfig { count: number; placement: 'grid' | 'ring' | 'random'; power: number; half_angle: number }
export interface ReceiverConfig {
  movement: 'static' | 'linear' | 'circular' | 'random_walk'
  x: number; y: number; z: number; speed: number
}
export interface NoiseConfig {
  enabled: boolean; count: number; placement: 'even' | 'random' | 'corners'
  type: 'gaussian' | 'sinusoidal' | 'impulsive' | 'mixed'; intensity: number; frequency: number
}
export interface OpticalConfig { receiver_area: number; filter_gain: number; concentrator_gain: number; fov: number }
export interface SimulationConfig { samples: number; time_step: number }

export interface ExperimentConfig {
  name: string; description: string; seed: number
  room: RoomConfig; led: LEDConfig; receiver: ReceiverConfig
  noise: NoiseConfig; optical: OpticalConfig; simulation: SimulationConfig
}

export interface ConfigIssue { level: 'error' | 'warning'; field: string; message: string }
export interface ConfigValidation { valid: boolean; issues: ConfigIssue[] }
