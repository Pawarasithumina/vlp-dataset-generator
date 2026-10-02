import { AdditiveBlending, DoubleSide } from 'three'

/** Translucent cone. `direction` is where the cone opens to; the apex sits at the group origin. */
export function RadiationCone({ halfAngleDeg, length, color, direction, opacity = 0.05 }: {
  halfAngleDeg: number; length: number; color: string; direction: 'down' | 'up'; opacity?: number
}) {
  const radius = length * Math.tan((halfAngleDeg * Math.PI) / 180)
  const down = direction === 'down'
  return (
    <group position={[0, down ? -length / 2 : length / 2, 0]} rotation={[down ? 0 : Math.PI, 0, 0]}>
      <mesh>
        <coneGeometry args={[radius, length, 40, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} side={DoubleSide} depthWrite={false} blending={AdditiveBlending} />
      </mesh>
      <mesh>
        <coneGeometry args={[radius, length, 16, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 1.6} wireframe depthWrite={false} />
      </mesh>
    </group>
  )
}
