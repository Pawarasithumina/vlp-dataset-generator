import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import type { SimulationResult } from '../../types/simulation'
import { toThree, type Vec3 } from '../../utils/geometry'

export function OpticalRays({ result, frame, rx, selectedId }: {
  result: SimulationResult; frame: number; rx: Vec3; selectedId: string | null
}) {
  const maxClean = useMemo(() => {
    let m = 1e-9
    for (const row of result.rss_clean) for (const v of row) if (v > m) m = v
    return m
  }, [result])
  return (
    <>
      {result.leds.map((led, i) => {
        const clean = result.rss_clean[i][frame]
        const inView = clean > 0
        const sel = selectedId === led.id
        return (
          <Line key={led.id} points={[toThree(led.x, led.y, led.z), rx]}
            color={inView ? '#22d3ee' : '#4b5b75'} lineWidth={sel ? 2.4 : inView ? 1.4 : 0.8}
            dashed={!inView} dashSize={0.1} gapSize={0.1} transparent
            opacity={inView ? 0.25 + 0.75 * Math.min(1, clean / maxClean) : 0.22} />
        )
      })}
    </>
  )
}
