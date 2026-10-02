import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { Box, Crosshair, Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import { useCamera, type CameraState } from '../../hooks/useCamera'
import { useSimulation } from '../../hooks/useSimulation'
import { DEFAULT_LAYERS, type Layers, type Selection, type SimulationResult } from '../../types/simulation'
import { toThree, type Vec3 } from '../../utils/geometry'
import { EmptyState, ErrorState, Loading } from '../ui/Primitives'
import { CameraRig, cameraGoal } from './CameraControls'
import { LEDObject } from './LEDObject'
import { NoiseObject } from './NoiseObject'
import { ObjectInspector } from './ObjectInspector'
import { OpticalRays } from './OpticalRays'
import { ReceiverObject } from './ReceiverObject'
import { Room } from './Room'
import { SimulationTimeline } from './SimulationTimeline'
import { Trajectory } from './Trajectory'

interface SceneProps {
  result: SimulationResult; frame: number; layers: Layers; cam: CameraState
  selection?: Selection; onSelect?: (s: Selection) => void; labels?: boolean; autoRotate?: boolean
}

/** The R3F canvas. Reused by the Virtual Lab, the dashboard preview and the trajectory page. */
export function LabScene({ result, frame, layers, cam, selection = null, onSelect = () => {}, labels = true, autoRotate = false }: SceneProps) {
  const room = result.config.room
  const r = result.receiver
  const rx: Vec3 = toThree(r.x[frame], r.y[frame], r.z[frame])
  const init = cameraGoal(room, 'perspective', null)
  const orthoZoom = 60
  const selId = (t: string) => (selection?.type === t ? selection.id : null)

  return (
    <Canvas dpr={[1, 2]} onPointerMissed={() => onSelect(null)} gl={{ antialias: true }}>
      <color attach="background" args={['#0a0e16']} />
      {cam.projection === 'perspective'
        ? <PerspectiveCamera key="p" makeDefault fov={45} near={0.1} far={500} position={init.pos} />
        : <OrthographicCamera key="o" makeDefault near={-200} far={1000} zoom={orthoZoom} position={init.pos} />}
      <OrbitControls makeDefault enableDamping dampingFactor={0.12} target={init.target} autoRotate={autoRotate} autoRotateSpeed={0.6} />
      <CameraRig room={room} cam={cam} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 10, 4]} intensity={0.8} />

      <Room room={room} layers={layers} labels={labels} />
      {layers.leds && result.leds.map((l) => (
        <LEDObject key={l.id} led={l} selected={selId('led') === l.id} onSelect={() => onSelect({ type: 'led', id: l.id })}
          showCone={layers.cones} coneLength={Math.max(0.5, l.z - r.z[frame])} labels={labels} />
      ))}
      {layers.noise && result.noise_sources.map((n) => (
        <NoiseObject key={n.id} source={n} selected={selId('noise') === n.id} onSelect={() => onSelect({ type: 'noise', id: n.id })} room={room} labels={labels} />
      ))}
      {layers.trajectory && <Trajectory result={result} frame={frame} />}
      {layers.rays && layers.leds && <OpticalRays result={result} frame={frame} rx={rx} selectedId={selId('led')} />}
      {layers.receiver && (
        <ReceiverObject position={rx} selected={selection?.type === 'receiver'} onSelect={() => onSelect({ type: 'receiver', id: 'rx' })}
          fov={result.config.optical.fov} coneLength={Math.max(0.5, room.height - r.z[frame])} showFov={layers.fov} labels={labels} />
      )}
    </Canvas>
  )
}

const LAYER_ROWS: { key: keyof Layers; label: string; color: string }[] = [
  { key: 'leds', label: 'LEDs', color: '#22d3ee' }, { key: 'cones', label: 'Radiation cones', color: '#22d3ee' },
  { key: 'noise', label: 'Noise sources', color: '#fb7185' }, { key: 'receiver', label: 'Receiver', color: '#fbbf24' },
  { key: 'fov', label: 'Receiver FOV', color: '#fbbf24' }, { key: 'trajectory', label: 'Trajectory', color: '#a78bfa' },
  { key: 'rays', label: 'Optical rays', color: '#22d3ee' }, { key: 'grid', label: 'Grid', color: '#35507e' },
  { key: 'axes', label: 'Coordinate axes', color: '#f87171' }, { key: 'room', label: 'Room boundaries', color: '#3b6fb6' },
]

export default function VirtualLab() {
  const { result, frame, running, error, settings } = useSimulation()
  const { cam, setProjection, setView, reset, focusOn } = useCamera()
  const [layers, setLayers] = useState<Layers>(DEFAULT_LAYERS)
  const [selection, setSelection] = useState<Selection>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = () => setFullscreen(document.fullscreenElement === box.current)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  if (!result) {
    if (running) return <Loading label="Running simulation…" />
    return error ? <ErrorState message={error} /> : <EmptyState title="No simulation yet" message="Run a simulation to populate the virtual lab." />
  }

  const focusSelected = () => {
    if (!selection) return
    if (selection.type === 'receiver') focusOn(toThree(result.receiver.x[frame], result.receiver.y[frame], result.receiver.z[frame]))
    else {
      const o = selection.type === 'led' ? result.leds.find((l) => l.id === selection.id) : result.noise_sources.find((n) => n.id === selection.id)
      if (o) focusOn(toThree(o.x, o.y, o.z))
    }
  }
  const toggleFs = () => (document.fullscreenElement ? document.exitFullscreen() : box.current?.requestFullscreen())
  const views: [typeof cam.view, string][] = [['perspective', 'Perspective'], ['top', 'Top'], ['front', 'Front'], ['side', 'Side']]

  return (
    <div className="lab" ref={box}>
      <div className="lab-canvas">
        <LabScene result={result} frame={frame} layers={layers} cam={cam} selection={selection} onSelect={setSelection} labels={settings.labels3d} />
        <div className="lab-toolbar">
          <div className="seg" role="group" aria-label="Projection">
            <button className={cam.projection === 'perspective' ? 'on' : ''} onClick={() => setProjection('perspective')}>Perspective cam</button>
            <button className={cam.projection === 'orthographic' ? 'on' : ''} onClick={() => setProjection('orthographic')}>Orthographic cam</button>
          </div>
          <div className="seg" role="group" aria-label="View">
            {views.map(([v, label]) => <button key={v} className={cam.view === v && !cam.focus ? 'on' : ''} onClick={() => setView(v)}>{label}</button>)}
          </div>
          <div className="seg">
            <button onClick={reset}><RotateCcw size={13} />Reset</button>
            <button onClick={focusSelected} disabled={!selection}><Crosshair size={13} />Focus selected</button>
            <button onClick={toggleFs}>{fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}{fullscreen ? 'Exit' : 'Fullscreen'}</button>
          </div>
        </div>
        <div className="float layers" role="group" aria-label="Visual layers">
          {LAYER_ROWS.map((l) => (
            <label key={l.key}>
              <input type="checkbox" checked={layers[l.key]} onChange={(e) => setLayers((s) => ({ ...s, [l.key]: e.target.checked }))} />
              {l.label}<i className="sw" style={{ background: l.color }} />
            </label>
          ))}
        </div>
        {selection
          ? <ObjectInspector selection={selection} result={result} frame={frame} onClose={() => setSelection(null)} />
          : <div className="float inspector" style={{ padding: 12, width: 220 }}><div className="row dim"><Box size={14} />Click an LED, noise source or the receiver to inspect it.</div></div>}
      </div>
      <SimulationTimeline />
    </div>
  )
}
