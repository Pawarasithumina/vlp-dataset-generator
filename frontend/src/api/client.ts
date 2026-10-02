const BASE = '/api'

export interface ApiIssue { level: string; field: string; message: string }

export class ApiError extends Error {
  status: number
  issues: ApiIssue[]
  constructor(message: string, status = 0, issues: ApiIssue[] = []) {
    super(message)
    this.status = status
    this.issues = issues
  }
}

async function toError(res: Response): Promise<ApiError> {
  let message = `${res.status} ${res.statusText}`
  let issues: ApiIssue[] = []
  try {
    const d = (await res.json()).detail
    if (typeof d === 'string') message = d
    else if (Array.isArray(d)) message = d.map((e) => `${(e.loc ?? []).slice(1).join('.')}: ${e.msg}`).join('; ')
    else if (d && typeof d === 'object') { message = d.message ?? message; issues = d.issues ?? [] }
  } catch { /* non-JSON error body */ }
  return new ApiError(message, res.status, issues)
}

async function send(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...init })
  } catch {
    throw new ApiError('Cannot reach the VLP Lab backend. Start it with: uvicorn app.main:app --reload --port 8000', 0)
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await send(path, init)
  if (!res.ok) throw await toError(res)
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T)
}

export const get = <T>(p: string) => request<T>(p)
export const post = <T>(p: string, body?: unknown) => request<T>(p, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) })
export const put = <T>(p: string, body: unknown) => request<T>(p, { method: 'PUT', body: JSON.stringify(body) })
export const patch = <T>(p: string, body: unknown) => request<T>(p, { method: 'PATCH', body: JSON.stringify(body) })
export const del = (p: string) => request<void>(p, { method: 'DELETE' })

/** Download a backend-generated file (full dataset, never a preview). */
export async function downloadFile(path: string, fallbackName: string): Promise<void> {
  const res = await send(path)
  if (!res.ok) throw await toError(res)
  const cd = res.headers.get('Content-Disposition') ?? ''
  const name = /filename="?([^";]+)"?/.exec(cd)?.[1] ?? fallbackName
  const url = URL.createObjectURL(await res.blob())
  const a = document.createElement('a')
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}
