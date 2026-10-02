import { get, post } from './client'
import type { ExperimentConfig } from '../types/configuration'
import type { SimulationResult } from '../types/simulation'

export const runSimulation = (c: ExperimentConfig) => post<SimulationResult>('/simulation/run', c)
export const getLatest = () => get<SimulationResult>('/simulation/latest')
