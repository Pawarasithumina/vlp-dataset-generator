import { useCallback, useState } from 'react'
import type { Vec3 } from '../utils/geometry'

export type Projection = 'perspective' | 'orthographic'
export type ViewPreset = 'perspective' | 'top' | 'front' | 'side'

export interface CameraState {
  projection: Projection; view: ViewPreset; nonce: number; focus: Vec3 | null
}

export function useCamera() {
  const [state, setState] = useState<CameraState>({ projection: 'perspective', view: 'perspective', nonce: 0, focus: null })
  const setProjection = useCallback((projection: Projection) => setState((s) => ({ ...s, projection, nonce: s.nonce + 1 })), [])
  const setView = useCallback((view: ViewPreset) => setState((s) => ({ ...s, view, focus: null, nonce: s.nonce + 1 })), [])
  const reset = useCallback(() => setState((s) => ({ ...s, view: 'perspective', focus: null, nonce: s.nonce + 1 })), [])
  const focusOn = useCallback((focus: Vec3) => setState((s) => ({ ...s, focus, nonce: s.nonce + 1 })), [])
  return { cam: state, setProjection, setView, reset, focusOn }
}
