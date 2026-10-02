import { useMemo } from 'react'
import { BoxGeometry, DoubleSide, EdgesGeometry } from 'three'
import { Grid, Html, Line } from '@react-three/drei'
import type { RoomConfig } from '../../types/configuration'
import type { Layers } from '../../types/simulation'

function Tag({ children, pos, cls = '' }: { children: React.ReactNode; pos: [number, number, number]; cls?: string }) {
  return (
    <Html position={pos} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
      <div className={`tag3d ${cls}`}>{children}</div>
    </Html>
  )
}

export function Room({ room, layers, labels }: { room: RoomConfig; layers: Layers; labels: boolean }) {
  const { width: W, length: L, height: H } = room
  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(W, H, L)), [W, L, H])
  const wall = { color: '#1d2c47', transparent: true, opacity: 0.1, side: DoubleSide, depthWrite: false } as const
  const axisLen = Math.min(1.5, Math.min(W, L) * 0.4)
  const o = 0.35 // dimension-line offset outside the room

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[W / 2, -0.002, -L / 2]}>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color="#0e1522" roughness={1} />
      </mesh>
      {layers.room && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[W / 2, H, -L / 2]}>
            <planeGeometry args={[W, L]} /><meshBasicMaterial color="#22d3ee" transparent opacity={0.035} side={DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[W / 2, H / 2, 0]}><planeGeometry args={[W, H]} /><meshBasicMaterial {...wall} /></mesh>
          <mesh position={[W / 2, H / 2, -L]}><planeGeometry args={[W, H]} /><meshBasicMaterial {...wall} /></mesh>
          <mesh position={[0, H / 2, -L / 2]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[L, H]} /><meshBasicMaterial {...wall} /></mesh>
          <mesh position={[W, H / 2, -L / 2]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[L, H]} /><meshBasicMaterial {...wall} /></mesh>
          <lineSegments geometry={edges} position={[W / 2, H / 2, -L / 2]}>
            <lineBasicMaterial color="#3b6fb6" transparent opacity={0.65} />
          </lineSegments>
          {labels && (
            <>
              <Line points={[[0, 0, o], [W, 0, o]]} color="#5b6b85" lineWidth={1} />
              <Tag pos={[W / 2, 0, o + 0.05]}>W {W.toFixed(1)} m</Tag>
              <Line points={[[-o, 0, 0], [-o, 0, -L]]} color="#5b6b85" lineWidth={1} />
              <Tag pos={[-o - 0.05, 0, -L / 2]}>L {L.toFixed(1)} m</Tag>
              <Line points={[[-o, 0, o], [-o, H, o]]} color="#5b6b85" lineWidth={1} />
              <Tag pos={[-o, H / 2, o + 0.05]}>H {H.toFixed(1)} m</Tag>
            </>
          )}
        </>
      )}
      {layers.grid && (
        <Grid position={[W / 2, 0.003, -L / 2]} args={[W, L]} cellSize={0.5} cellThickness={0.6} cellColor="#23334f"
          sectionSize={1} sectionThickness={1} sectionColor="#35507e" fadeDistance={80} infiniteGrid={false} />
      )}
      {layers.axes && (
        <group position={[0, 0.01, 0]}>
          <Line points={[[0, 0, 0], [axisLen, 0, 0]]} color="#f87171" lineWidth={2} />
          <Line points={[[0, 0, 0], [0, 0, -axisLen]]} color="#4ade80" lineWidth={2} />
          <Line points={[[0, 0, 0], [0, axisLen, 0]]} color="#60a5fa" lineWidth={2} />
          {labels && (
            <>
              <Tag pos={[axisLen + 0.12, 0, 0]}>X</Tag>
              <Tag pos={[0, 0, -axisLen - 0.12]}>Y</Tag>
              <Tag pos={[0, axisLen + 0.12, 0]}>Z</Tag>
            </>
          )}
        </group>
      )}
    </group>
  )
}
export { Tag }
