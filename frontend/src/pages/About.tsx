import { PageHead, Panel } from '../components/ui/Primitives'

export default function About() {
  return (
    <div className="page">
      <PageHead title="About VLP Lab" subtitle="A simulation and dataset generation platform for visible light positioning research." />
      <div className="grid g2">
        <Panel title="Channel model">
          <div className="stack" style={{ gap: 10 }}>
            <p className="dim">LEDs on the ceiling face down and the receiver faces up. Each LED is a Lambertian emitter and the line-of-sight channel gives the received power:</p>
            <pre className="mono" style={{ margin: 0, padding: 12, background: 'var(--bg-2)', borderRadius: 8, overflow: 'auto', fontSize: 12.5 }}>
{`P_r = P_t · (m+1)·A / (2π·d²) · cosᵐ(φ) · T_s · g · cos(ψ)   for ψ ≤ FOV
m   = −ln 2 / ln cos(Φ½)`}</pre>
            <p className="dim">P_t is LED power, A the detector area, d the distance, φ the emission angle, ψ the incidence angle, T_s the filter gain, g the concentrator gain and Φ½ the half-power angle. Noise sources add band-limited Gaussian, sinusoidal or impulsive power, attenuated by 1/(1+d²) from each source to the receiver. All of this runs in the FastAPI backend.</p>
          </div>
        </Panel>
        <Panel title="Colour key">
          <div className="legend" style={{ flexDirection: 'column', gap: 8 }}>
            <span><i style={{ background: 'var(--cyan)' }} />LEDs and optical signals</span>
            <span><i style={{ background: 'var(--amber)' }} />Receiver</span>
            <span><i style={{ background: 'var(--red)' }} />Noise</span>
            <span><i style={{ background: 'var(--violet)' }} />Receiver trajectory</span>
            <span><i style={{ background: 'var(--green)' }} />Valid / connected</span>
          </div>
        </Panel>
        <Panel title="Stack"><p className="dim">Frontend: React, TypeScript, Vite, Three.js with React Three Fiber and Drei, Recharts, Lucide. Backend: FastAPI, NumPy, Pandas, Pydantic.</p></Panel>
        <Panel title="Coordinates"><p className="dim">X is room width, Y is room length and Z is height, in metres. The origin is the floor corner. RSS and noise are reported in µW.</p></Panel>
      </div>
    </div>
  )
}
