import { useState } from 'react'
import { AdditiveBlending } from 'three'
import { Line } from '@react-three/drei'
import type { LedInfo } from '../../types/simulation'
import { toThree } from '../../utils/geometry'
import { RadiationCone } from './RadiationCone'
import { Tag } from './Room'

export function LEDObject({ led, selected, onSelect, showCone, coneLength, labels }: {
  led: LedInfo; selected: boolean; onSelect: () => void; showCone: boolean; coneLength: number; labels: boolean
}) {
  const [hover, setHover] = useState(false)
  const active = selected || hover
  return (
    <group position={toThree(led.x, led.y, led.z)}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}>
      {/* housing */}
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.1, 0.12, 0.06, 24]} /><meshStandardMaterial color="#12303d" metalness={0.6} roughness={0.35} /></mesh>
      {/* emitting face */}
      <mesh position={[0, -0.012, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.085, 24]} /><meshBasicMaterial color={active ? '#a5f3fc' : '#22d3ee'} /></mesh>
      {/* glow */}
      <mesh position={[0, -0.05, 0]}><sphereGeometry args={[0.2, 20, 14]} /><meshBasicMaterial color="#22d3ee" transparent opacity={active ? 0.3 : 0.16} blending={AdditiveBlending} depthWrite={false} /></mesh>
      {/* optical axis */}
      <Line points={[[0, -0.06, 0], [0, -0.42, 0]]} color="#22d3ee" lineWidth={1.5} transparent opacity={0.9} />
      <mesh position={[0, -0.45, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.035, 0.09, 12]} /><meshBasicMaterial color="#22d3ee" /></mesh>
      {selected && <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.2, 0.012, 8, 40]} /><meshBasicMaterial color="#ffffff" /></mesh>}
      {showCone && <RadiationCone halfAngleDeg={led.half_angle} length={coneLength} color="#22d3ee" direction="down" opacity={active ? 0.09 : 0.045} />}
      {labels && <Tag pos={[0, 0.24, 0]} cls="cyan">{led.id}</Tag>}
    </group>
  )
}
