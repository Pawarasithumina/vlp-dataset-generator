import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { CameraState, ViewPreset } from '../../hooks/useCamera'
import type { RoomConfig } from '../../types/configuration'
import type { Vec3 } from '../../utils/geometry'

export function cameraGoal(room: RoomConfig, view: ViewPreset, focus: Vec3 | null) {
  const target: Vec3 = focus ?? [room.width / 2, room.height * 0.35, -room.length / 2]
  const d = Math.max(room.width, room.length, room.height) * (focus ? 0.9 : 1.6)
  const offsets: Record<ViewPreset, Vec3> = {
    perspective: [d * 0.9, d * 0.7, d * 0.95], top: [0, d * 1.8, 0.001], front: [0, 0, d * 1.8], side: [d * 1.8, 0, 0],
  }
  const o = offsets[view]
  return { target, pos: [target[0] + o[0], target[1] + o[1], target[2] + o[2]] as Vec3 }
}

/** Smoothly animates the active camera and orbit target whenever a view/projection request arrives. */
export function CameraRig({ room, cam }: { room: RoomConfig; cam: CameraState }) {
  const { camera, controls, size } = useThree()
  const goal = useRef<{ pos: Vector3; target: Vector3; zoom: number } | null>(null)

  useEffect(() => {
    const g = cameraGoal(room, cam.view, cam.focus)
    const zoom = Math.min(size.width, size.height) / (Math.max(room.width, room.length, room.height) * (cam.focus ? 1 : 1.7))
    goal.current = { pos: new Vector3(...g.pos), target: new Vector3(...g.target), zoom }
  }, [cam.nonce, cam.projection]) // eslint-disable-line

  useEffect(() => {
    const c = controls as unknown as EventTarget | null
    if (!c) return
    const stop = () => { goal.current = null }
    c.addEventListener('start', stop)
    return () => c.removeEventListener('start', stop)
  }, [controls])

  useFrame((_, dt) => {
    const g = goal.current
    const c = controls as unknown as { target: Vector3; update: () => void } | null
    if (!g || !c) return
    const k = 1 - Math.exp(-dt * 5)
    camera.position.lerp(g.pos, k)
    c.target.lerp(g.target, k)
    let zoomDone = true
    if ('isOrthographicCamera' in camera) {
      camera.zoom += (g.zoom - camera.zoom) * k
      camera.updateProjectionMatrix()
      zoomDone = Math.abs(g.zoom - camera.zoom) < 0.05
    }
    c.update()
    if (zoomDone && camera.position.distanceTo(g.pos) < 0.01 && c.target.distanceTo(g.target) < 0.01) goal.current = null
  })
  return null
}
