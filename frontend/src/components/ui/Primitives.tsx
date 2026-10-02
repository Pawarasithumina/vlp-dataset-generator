import { useEffect, useState, type ReactNode } from 'react'
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'

export function Panel({ title, icon, actions, children, flush, className = '', style }: {
  title?: ReactNode; icon?: ReactNode; actions?: ReactNode; children: ReactNode
  flush?: boolean; className?: string; style?: React.CSSProperties
}) {
  return (
    <section className={`panel ${className}`} style={style}>
      {(title || actions) && (
        <header className="panel-head">
          <h3>{icon}{title}</h3>
          {actions && <div className="row">{actions}</div>}
        </header>
      )}
      <div className={`panel-body ${flush ? 'flush' : ''}`}>{children}</div>
    </section>
  )
}

export function Metric({ label, value, unit, sub, icon, color }: {
  label: string; value: ReactNode; unit?: string; sub?: ReactNode; icon?: ReactNode; color?: string
}) {
  return (
    <div className="panel metric">
      <div className="label"><span style={{ color }}>{icon}</span>{label}</div>
      <div className="value">{value}{unit && <small>{unit}</small>}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  )
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div className="state"><Loader2 className="spin" size={22} /><p>{label}</p></div>
}
export function ErrorState({ title = 'Something went wrong', message, action }: { title?: string; message: string; action?: ReactNode }) {
  return <div className="state error"><AlertTriangle size={26} /><h4>{title}</h4><p>{message}</p>{action}</div>
}
export function EmptyState({ title, message, action }: { title: string; message?: string; action?: ReactNode }) {
  return <div className="state"><Inbox size={26} /><h4>{title}</h4>{message && <p>{message}</p>}{action}</div>
}

export function PageHead({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
      <div className="row wrap">{actions}</div>
    </div>
  )
}

export function Field({ label, unit, hint, error, children }: {
  label: string; unit?: string; hint?: string; error?: string; children: ReactNode
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {unit ? <div className="with-unit">{children}<em>{unit}</em></div> : children}
      {error ? <span className="err">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  )
}

export function NumberField({ label, value, onChange, unit, min, max, step = 0.1, integer, hint }: {
  label: string; value: number; onChange: (v: number) => void; unit?: string
  min?: number; max?: number; step?: number; integer?: boolean; hint?: string
}) {
  const [text, setText] = useState(String(value))
  useEffect(() => { if (parseFloat(text) !== value) setText(String(value)) }, [value]) // eslint-disable-line
  const n = parseFloat(text)
  const range = min !== undefined && max !== undefined ? `${min} to ${max}` : ''
  const bad = !Number.isFinite(n) || (integer && !Number.isInteger(n)) || (min !== undefined && n < min) || (max !== undefined && n > max)
  return (
    <Field label={label} unit={unit} hint={hint} error={bad ? `Enter ${integer ? 'a whole number' : 'a value'}${range ? ` from ${range}` : ''}.` : undefined}>
      <input className={`input ${bad ? 'bad' : ''}`} type="number" inputMode="decimal" value={text} step={step} min={min} max={max}
        onChange={(e) => {
          setText(e.target.value)
          const v = parseFloat(e.target.value)
          const ok = Number.isFinite(v) && (!integer || Number.isInteger(v)) && (min === undefined || v >= min) && (max === undefined || v <= max)
          if (ok) onChange(v)
        }} />
    </Field>
  )
}

export function SelectField<T extends string>({ label, value, onChange, options, hint }: {
  label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; hint?: string
}) {
  return (
    <Field label={label} hint={hint}>
      <select className="select" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  )
}

export function SliderField({ label, value, onChange, min, max, step = 1, unit }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit?: string
}) {
  return (
    <div className="field">
      <label><span>{label}</span><span className="num" style={{ color: 'var(--text)' }}>{value}{unit ? ` ${unit}` : ''}</span></label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" /><span>{label}</span>
    </label>
  )
}
