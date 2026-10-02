import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import type { SimulationResult } from '../../types/simulation'
import { toThree, type Vec3 } from '../../utils/geometry'

export function Trajectory({ result, frame }: { result: SimulationResult; frame: number }) {
  const pts = useMemo<Vec3[]>(() => {
    const { x, y, z } = result.receiver
    // Cap vertex count so very long runs stay smooth.
    const step = Math.max(1, Math.floor(x.length / 1500))
    const out: Vec3[] = []
    for (let i = 0; i < x.length; i += step) out.push(toThree(x[i], y[i], z[i]))
    return out
  }, [result])
  const step = Math.max(1, Math.floor(result.receiver.x.length / 1500))
  const done = pts.slice(0, Math.max(2, Math.floor(frame / step) + 1))
  return (
    <>
      <Line points={pts} color="#a78bfa" lineWidth={1} transparent opacity={0.3} />
      {done.length > 1 && <Line points={done} color="#a78bfa" lineWidth={2.4} />}
    </>
  )
}
