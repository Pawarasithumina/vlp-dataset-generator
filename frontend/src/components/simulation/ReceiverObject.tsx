import { useState } from 'react'
import { AdditiveBlending } from 'three'
import { Line } from '@react-three/drei'
import { RadiationCone } from './RadiationCone'
import { Tag } from './Room'

export function ReceiverObject({ position, selected, onSelect, fov, coneLength, showFov, labels }: {
  position: [number, number, number]; selected: boolean; onSelect: () => void
  fov: number; coneLength: number; showFov: boolean; labels: boolean
}) {
  const [hover, setHover] = useState(false)
  const active = selected || hover
  return (
    <>
      {/* position projection on the floor */}
      <Line points={[[position[0], 0.005, position[2]], position]} color="#fbbf24" lineWidth={1} dashed dashSize={0.06} gapSize={0.05} transparent opacity={0.45} />
      <mesh position={[position[0], 0.006, position[2]]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.07, 0.1, 28]} /><meshBasicMaterial color="#fbbf24" transparent opacity={0.6} /></mesh>
      <group position={position}
        onClick={(e) => { e.stopPropagation(); onSelect() }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}>
        <mesh><boxGeometry args={[0.2, 0.05, 0.2]} /><meshStandardMaterial color="#8a6a12" metalness={0.5} roughness={0.4} /></mesh>
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.065, 24]} /><meshBasicMaterial color={active ? '#fff3c4' : '#fbbf24'} /></mesh>
        <mesh><sphereGeometry args={[0.22, 20, 14]} /><meshBasicMaterial color="#fbbf24" transparent opacity={active ? 0.26 : 0.13} blending={AdditiveBlending} depthWrite={false} /></mesh>
        {/* orientation (surface normal) */}
        <Line points={[[0, 0.04, 0], [0, 0.4, 0]]} color="#fbbf24" lineWidth={1.5} />
        <mesh position={[0, 0.43, 0]}><coneGeometry args={[0.035, 0.09, 12]} /><meshBasicMaterial color="#fbbf24" /></mesh>
        {selected && <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.26, 0.012, 8, 40]} /><meshBasicMaterial color="#ffffff" /></mesh>}
        {showFov && <RadiationCone halfAngleDeg={fov} length={coneLength} color="#fbbf24" direction="up" opacity={active ? 0.08 : 0.04} />}
        {labels && <Tag pos={[0, -0.22, 0]} cls="amber">Receiver</Tag>}
      </group>
    </>
  )
}
