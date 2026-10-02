import { Fragment } from 'react'
import { X } from 'lucide-react'
import type { SimulationResult, Selection } from '../../types/simulation'
import { fmt, titleCase } from '../../utils/formatting'

function KV({ rows }: { rows: [string, string][] }) {
  return <dl className="kv">{rows.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
}

export function ObjectInspector({ selection, result, frame, onClose }: {
  selection: NonNullable<Selection>; result: SimulationResult; frame: number; onClose: () => void
}) {
  const r = result.receiver
  let title = '', color = '', body: React.ReactNode = null

  if (selection.type === 'led') {
    const i = result.leds.findIndex((l) => l.id === selection.id)
    const l = result.leds[i]
    if (!l) return null
    title = `LED ${l.id}`; color = 'var(--cyan)'
    body = <KV rows={[
      ['LED ID', l.id], ['X', `${fmt(l.x)} m`], ['Y', `${fmt(l.y)} m`], ['Z', `${fmt(l.z)} m`],
      ['Power', `${fmt(l.power, 2)} W`], ['Half-power angle', `${fmt(l.half_angle, 1)}°`],
      ['Lambertian order', fmt(l.lambertian_order, 2)],
      ['Distance to receiver', `${fmt(result.distances[i][frame])} m`],
      ['Current RSS', `${fmt(result.rss[i][frame], 4)} µW`],
      ['RSS (noise-free)', `${fmt(result.rss_clean[i][frame], 4)} µW`],
    ]} />
  } else if (selection.type === 'noise') {
    const i = result.noise_sources.findIndex((n) => n.id === selection.id)
    const n = result.noise_sources[i]
    if (!n) return null
    title = `Noise ${n.id}`; color = 'var(--red)'
    body = <KV rows={[
      ['Noise source ID', n.id], ['Wall', n.wall], ['X', `${fmt(n.x)} m`], ['Y', `${fmt(n.y)} m`], ['Z', `${fmt(n.z)} m`],
      ['Noise type', titleCase(n.type)], ['Intensity', `${fmt(n.intensity, 2)} µW`], ['Frequency', `${fmt(n.frequency, 1)} Hz`],
      ['Value at receiver', `${fmt(result.noise[i][frame], 4)} µW`],
    ]} />
  } else {
    title = 'Receiver'; color = 'var(--amber)'
    body = (
      <div className="stack" style={{ gap: 14 }}>
        <KV rows={[
          ['X', `${fmt(r.x[frame])} m`], ['Y', `${fmt(r.y[frame])} m`], ['Z', `${fmt(r.z[frame])} m`],
          ['Current time', `${fmt(result.time[frame], 2)} s`], ['FOV (semi-angle)', `${fmt(result.config.optical.fov, 1)}°`],
          ['Movement', titleCase(result.config.receiver.movement)],
          ['Current speed', `${fmt(r.speed[frame], 3)} m/s`], ['Path travelled', `${fmt(r.path_length[frame], 3)} m`],
        ]} />
        <div>
          <div className="dim" style={{ marginBottom: 6 }}>RSS per LED</div>
          <KV rows={result.leds.map((l, i) => [l.id, `${fmt(result.rss[i][frame], 4)} µW`] as [string, string])} />
        </div>
      </div>
    )
  }

  return (
    <aside className="float inspector" aria-label="Object inspector">
      <div className="panel-head">
        <h3><span className="dot" style={{ background: color }} />{title}</h3>
        <button className="btn ghost icon sm" onClick={onClose} aria-label="Close inspector"><X size={14} /></button>
      </div>
      <div className="panel-body">{body}</div>
    </aside>
  )
}
