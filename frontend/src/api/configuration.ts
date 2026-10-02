import { get, post } from './client'
import type { ConfigValidation, ExperimentConfig } from '../types/configuration'

export const getDefaultConfig = () => get<ExperimentConfig>('/configuration/default')
export const validateConfig = (c: ExperimentConfig) => post<ConfigValidation>('/configuration/validate', c)
export const getHealth = () => get<{ status: string; version: string }>('/health')
