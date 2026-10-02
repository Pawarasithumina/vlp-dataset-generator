import { useLayoutEffect, useRef, useState } from 'react'
import { AdditiveBlending, type Group, type Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import type { NoiseSourceInfo } from '../../types/simulation'
import { toThree } from '../../utils/geometry'
import { Tag } from './Room'

export function NoiseObject({ source, selected, onSelect, room, labels }: {
  source: NoiseSourceInfo; selected: boolean; onSelect: () => void
  room: { width: number; length: number }; labels: boolean
}) {
  const g = useRef<Group>(null)
  const ring = useRef<Mesh>(null)
  const [hover, setHover] = useState(false)
  const pos = toThree(source.x, source.y, source.z)
  useLayoutEffect(() => { g.current?.lookAt(room.width / 2, pos[1], -room.length / 2) }, [pos[0], pos[1], pos[2], room.width, room.length]) // eslint-disable-line
  useFrame(({ clock }) => {
    if (!ring.current) return
    const k = (clock.elapsedTime * 0.8) % 1
    ring.current.scale.setScalar(0.6 + k * 1.4)
    ;(ring.current.material as { opacity: number }).opacity = 0.7 * (1 - k)
  })
  const active = selected || hover
  return (
    <group position={pos}>
      <group ref={g}
        onClick={(e) => { e.stopPropagation(); onSelect() }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}>
        <mesh><octahedronGeometry args={[0.13, 0]} /><meshStandardMaterial color="#7f1d33" emissive="#fb7185" emissiveIntensity={active ? 0.9 : 0.5} flatShading /></mesh>
        <mesh><octahedronGeometry args={[0.18, 0]} /><meshBasicMaterial color="#fb7185" wireframe transparent opacity={0.8} /></mesh>
        <mesh><sphereGeometry args={[0.28, 16, 12]} /><meshBasicMaterial color="#fb7185" transparent opacity={active ? 0.2 : 0.1} blending={AdditiveBlending} depthWrite={false} /></mesh>
        <mesh ref={ring}><ringGeometry args={[0.2, 0.215, 40]} /><meshBasicMaterial color="#fb7185" transparent opacity={0.5} depthWrite={false} /></mesh>
        {selected && <mesh><torusGeometry args={[0.32, 0.012, 8, 40]} /><meshBasicMaterial color="#ffffff" /></mesh>}
      </group>
      {labels && <Tag pos={[0, 0.34, 0]} cls="red">{source.id}</Tag>}
    </group>
  )
}
