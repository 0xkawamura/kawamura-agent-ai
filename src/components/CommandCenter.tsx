import { useEffect, useRef, useState } from 'react'

const ENGINE_URL = 'http://127.0.0.1:8787'
const OG = '#F97316'                          // orange
const OG_BG = 'rgba(249,115,22,0.08)'
const OG_BD = 'rgba(249,115,22,0.22)'

/* ── Types ────────────────────────────────── */
interface LogEntry {
  id: string; timestamp: string
  level: 'info' | 'warn' | 'error' | 'success'
  source: string; message: string
}
interface EngineState {
  running: boolean; stage: string; processing: boolean
  lastTickAt?: string; lastJobId?: string; lastTemplateSlug?: string
  lastSubmissionAt?: string; lastSubmissionId?: string
  lastError?: string; jobsProcessed: number; agentId?: string
}
interface Job {
  id: string; num: number; jobId?: string; submissionId?: string
  template?: string; prompt?: string; timestamp: string; success: boolean
  responseType?: 'TEXT' | 'FILE'
  jobType?: 'STANDARD' | 'SWARM'
}

/* ── Shared card shell ────────────────────── */
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0,
      ...style,
    }}>
      {children}
    </div>
  )
}

function CardHeader({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{
      padding: '11px 14px',
      borderBottom: '1px solid #F3F4F6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{left}</span>
      {right && <span>{right}</span>}
    </div>
  )
}

/* ── Inject Modal ────────────────────────── */
function InjectModal({ onSubmit, onClose }: { onSubmit: (p: string) => void; onClose: () => void }) {
  const [value, setValue] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    taRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = () => { if (value.trim()) { onSubmit(value.trim()); onClose() } }

  const EXAMPLES = [
    'Build a portfolio for a creative developer',
    'Create a SaaS landing page for a note-taking app',
    'Make a quiz game about world capitals',
  ]

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(3px)',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: '40px 40px 32px',
          width: 560,
          maxWidth: '92vw',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          animation: 'slideUp 0.18s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Title */}
        <div>
          <h2 style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: 28,
            color: OG,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            INJECT PROMPT
          </h2>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65 }}>
            Manually send a <strong>mystery prompt</strong> to the engine. The agent will classify it,
            pick the best template or use full AI generation, build a complete front-end,
            and submit it — just like a real hackathon job.
          </p>
        </div>

        {/* Textarea */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Prompt
          </label>
          <textarea
            ref={taRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
            placeholder="e.g. Build a landing page for a meditation app..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              color: '#111827',
              background: '#FAFAF9',
              border: `1.5px solid ${value.trim() ? OG_BD : '#E5E7EB'}`,
              borderRadius: 10,
              resize: 'vertical',
              outline: 'none',
              lineHeight: 1.6,
              transition: 'border-color 0.15s',
            }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {EXAMPLES.map(ex => (
              <span
                key={ex}
                onClick={() => setValue(ex)}
                style={{
                  fontSize: 10, padding: '3px 9px', borderRadius: 99,
                  background: '#F3F4F6', color: '#6B7280', cursor: 'pointer',
                  border: '1px solid #E5E7EB',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = OG_BG)}
                onMouseLeave={e => (e.currentTarget.style.background = '#F3F4F6')}
              >
                {ex.slice(0, 38)}…
              </span>
            ))}
          </div>
        </div>

        {/* Submit button — Nobel style */}
        <button
          onClick={submit}
          disabled={!value.trim()}
          style={{
            width: '100%',
            padding: '18px',
            background: value.trim() ? '#F0EBE3' : '#F9FAFB',
            border: 'none',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
            color: value.trim() ? '#111827' : '#9CA3AF',
            cursor: value.trim() ? 'pointer' : 'not-allowed',
            letterSpacing: '0.02em',
            transition: 'background 0.15s, transform 0.1s',
          }}
          onMouseEnter={e => { if (value.trim()) e.currentTarget.style.background = '#E8DDD3' }}
          onMouseLeave={e => { if (value.trim()) e.currentTarget.style.background = '#F0EBE3' }}
          onMouseDown={e => { if (value.trim()) e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          inject
        </button>

        {/* Dots + hint */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2, 3].map(i => (
              <span key={i} style={{
                width: i === 0 ? 8 : 6,
                height: i === 0 ? 8 : 6,
                borderRadius: '50%',
                background: i === 0 ? OG : '#D1D5DB',
                display: 'inline-block',
                marginTop: i === 0 ? 0 : 1,
              }} />
            ))}
          </div>
          <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace' }}>
            ⌘↵ to submit · esc to close
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Live Feed ────────────────────────────── */
function LiveFeed({ logs }: { logs: LogEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [logs])

  const lc = (l: string) => l === 'success' ? OG : l === 'error' ? '#EF4444' : l === 'warn' ? '#F59E0B' : '#9CA3AF'

  return (
    <Card style={{ flex: 1 }}>
      <CardHeader
        left="Live Feed"
        right={
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#22C55E' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            LIVE
          </span>
        }
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, minHeight: 0 }}>
        {logs.length === 0
          ? <div style={{ color: '#9CA3AF', textAlign: 'center', paddingTop: 32, fontSize: 12 }}>Waiting for events...</div>
          : logs.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: 6, padding: '2px 0', borderBottom: '1px solid #F9FAFB', alignItems: 'flex-start' }}>
              <span style={{ color: '#D1D5DB', flexShrink: 0, fontSize: 10 }}>
                {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
              </span>
              <span style={{ color: lc(log.level), flexShrink: 0, width: 36, textTransform: 'uppercase', fontSize: 9, paddingTop: 1 }}>
                [{log.level.slice(0, 3)}]
              </span>
              <span style={{ color: log.level === 'error' ? '#EF4444' : '#4B5563', lineHeight: 1.4, wordBreak: 'break-word' }}>
                {log.message}
              </span>
            </div>
          ))
        }
        <div ref={bottomRef} />
      </div>
    </Card>
  )
}

/* ── Recent Jobs ──────────────────────────── */
const TEMPLATE_COLORS: Record<string, { bg: string; text: string }> = {
  'landing-page':    { bg: '#FEF3C7', text: '#D97706' },
  'portfolio':       { bg: '#EDE9FE', text: '#7C3AED' },
  'dashboard':       { bg: '#DBEAFE', text: '#2563EB' },
  'tool-app':        { bg: '#D1FAE5', text: '#059669' },
  'ai-agent-profile':{ bg: OG_BG,    text: OG        },
  'ecommerce':       { bg: '#FCE7F3', text: '#DB2777' },
  'blog':            { bg: '#ECFDF5', text: '#047857' },
  'game':            { bg: '#FFF7ED', text: '#EA580C' },
  'form-builder':    { bg: '#F0F9FF', text: '#0369A1' },
  'none':            { bg: '#F3F0FF', text: '#6D28D9' },  // full LLM path
}

// Normalize slug: 'none' → display as 'AI GEN'
function slugLabel(t?: string) {
  if (!t || t === 'none') return 'AI GEN'
  return t.replace(/-/g, ' ')
}

function RecentJobs({ jobs, state }: { jobs: Job[]; state: EngineState | null }) {
  const tc = (t?: string) => TEMPLATE_COLORS[t ?? ''] ?? { bg: '#F3F0FF', text: '#6D28D9' }

  return (
    <Card style={{ flex: 1 }}>
      <CardHeader
        left="Recent Jobs"
        right={<span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace' }}>{jobs.length} total</span>}
      />
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>

        {/* Active job banner */}
        {state?.processing && (
          <div style={{ margin: '10px 12px', padding: '10px 12px', background: OG_BG, border: `1px solid ${OG_BD}`, borderRadius: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: OG }}>
                #{String(jobs.length + 1).padStart(2, '0')} {slugLabel(state.lastTemplateSlug).toUpperCase()}
              </span>
              <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 'auto' }}>now</span>
            </div>
            <div style={{ padding: '6px 10px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 4, fontSize: 11, color: '#374151', fontFamily: 'JetBrains Mono, monospace' }}>
              {state.stage}…
            </div>
          </div>
        )}

        {jobs.length === 0 && !state?.processing
          ? <div style={{ color: '#9CA3AF', textAlign: 'center', paddingTop: 32, fontSize: 12 }}>Waiting for mystery prompt...</div>
          : [...jobs].reverse().map(job => {
            const { bg, text } = tc(job.template)
            return (
              <div key={job.id} style={{ padding: '12px 14px', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 12, color: OG }}>#{String(job.num).padStart(2, '0')}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: bg, color: text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {slugLabel(job.template)}
                  </span>
                  {job.responseType && (
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: job.responseType === 'TEXT' ? '#EFF6FF' : '#F0FDF4', color: job.responseType === 'TEXT' ? '#2563EB' : '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {job.responseType}
                    </span>
                  )}
                  {job.jobType === 'SWARM' && (
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: '#FDF4FF', color: '#A855F7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      SWARM
                    </span>
                  )}
                  <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 'auto' }}>
                    {new Date(job.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {job.prompt && (
                  <div style={{ padding: '7px 10px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 4, fontSize: 11, color: '#374151', lineHeight: 1.5, marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>
                    {job.prompt.slice(0, 120)}{job.prompt.length > 120 ? '…' : ''}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace' }}>
                    🏆 {job.jobId ? `${job.jobId.slice(0, 12)}…` : 'manual'}
                  </span>
                  <span style={{
                    fontSize: 10, padding: '2px 9px', borderRadius: 3, cursor: 'default',
                    border: `1px solid ${job.success ? OG_BD : '#FCA5A5'}`,
                    color: job.success ? OG : '#EF4444',
                    background: job.success ? OG_BG : '#FEF2F2',
                  }}>
                    {job.success ? 'submitted ›' : 'failed'}
                  </span>
                </div>
              </div>
            )
          })
        }
      </div>
    </Card>
  )
}

/* ── Pipeline (Leaderboard) ───────────────── */
const STAGES = ['watching', 'prompt_received', 'classifying', 'generating', 'building', 'packing', 'submitting', 'completed']
const STAGE_LABEL: Record<string, string> = {
  idle: 'Idle', watching: 'Watching', prompt_received: 'Received',
  classifying: 'Detecting', generating: 'Generating', building: 'Building',
  packing: 'Packing', submitting: 'Submitting', completed: 'Completed', error: 'Error',
}

function Pipeline({ stage, onRefresh }: { stage: string; onRefresh?: () => void }) {
  const idx = STAGES.indexOf(stage)
  return (
    <Card>
      <CardHeader
        left="Pipeline"
        right={
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#9CA3AF', border: '1px solid #E5E7EB', padding: '2px 8px', borderRadius: 4 }}>
              {STAGE_LABEL[stage] ?? stage}
            </span>
            <span onClick={onRefresh} style={{ fontSize: 12, color: '#9CA3AF', cursor: 'pointer' }}>↺</span>
          </div>
        }
      />
      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 60px', gap: 6, padding: '6px 14px 4px', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
        {['#', 'Stage', 'Status'].map(h => (
          <span key={h} style={{ fontSize: 9, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
        ))}
      </div>
      {/* Rows — no internal scroll needed, fixed list */}
      {STAGES.map((s, i) => {
        const isActive = s === stage
        const isPast = idx > i && idx >= 0
        return (
          <div key={s} style={{
            display: 'grid', gridTemplateColumns: '20px 1fr 60px', gap: 6,
            padding: '7px 14px',
            background: isActive ? OG_BG : 'transparent',
            borderBottom: '1px solid #F9FAFB',
          }}>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace' }}>{i + 1}</span>
            <span style={{ fontSize: 11, color: isActive ? OG : isPast ? '#6B7280' : '#9CA3AF', fontWeight: isActive ? 600 : 400 }}>
              {STAGE_LABEL[s]}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%', display: 'inline-block', flexShrink: 0,
                background: isActive ? '#22C55E' : isPast ? '#D1D5DB' : '#F3F4F6',
                boxShadow: isActive ? '0 0 4px #22C55E' : 'none',
              }} />
              <span style={{ fontSize: 10, color: isActive ? '#22C55E' : isPast ? '#D1D5DB' : '#F3F4F6' }}>
                {isActive ? 'Active' : isPast ? 'Done' : '—'}
              </span>
            </span>
          </div>
        )
      })}
    </Card>
  )
}

/* ── Engine Stats (Burn Stats) ────────────── */
function EngineStats({ state, connected }: { state: EngineState | null; connected: boolean }) {
  const rows: [string, string, boolean?][] = [
    ['Model', 'claude-sonnet-4-5', false],
    ['Jobs Done', String(state?.jobsProcessed ?? 0), true],
    ['Last Submit', state?.lastSubmissionAt
      ? new Date(state.lastSubmissionAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      : '—', false],
    ['Engine', state?.running && connected ? 'Online' : connected ? 'Stopped' : 'Offline', false],
  ]
  return (
    <Card style={{ flexShrink: 0 }}>
      <CardHeader left="Engine Stats" />
      {rows.map(([label, value, accent]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '1px solid #F9FAFB' }}>
          <span style={{ fontSize: 12, color: '#6B7280' }}>{label}</span>
          <span style={{
            fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace',
            color: label === 'Engine'
              ? (state?.running && connected ? '#22C55E' : '#EF4444')
              : accent ? OG : '#374151',
          }}>
            {value}
          </span>
        </div>
      ))}
    </Card>
  )
}

/* ── Stat cards (top row) ─────────────────── */
function StatCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <Card style={{ padding: '14px 16px', flexShrink: 0 }}>
      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent ? OG : '#111827', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
        {value}
      </div>
    </Card>
  )
}

/* ── Root ─────────────────────────────────── */
export default function CommandCenter() {
  const [connected, setConnected]   = useState(false)
  const [state, setState]           = useState<EngineState | null>(null)
  const [logs, setLogs]             = useState<LogEntry[]>([])
  const [jobs, setJobs]             = useState<Job[]>([])
  const [showInject, setShowInject] = useState(false)
  const esRef                       = useRef<EventSource | null>(null)
  const counterRef                  = useRef(0)
  const promptRef                   = useRef<string | undefined>(undefined)
  const agentIdRef                  = useRef<string | undefined>(undefined)

  const addLog  = (l: LogEntry)  => setLogs(p => [...p.slice(-499), l])
  const addJob  = (j: Omit<Job, 'num'>) => {
    counterRef.current += 1
    setJobs(p => [...p, { ...j, num: counterRef.current }])
  }

  useEffect(() => {
    const connect = () => {
      const es = new EventSource(`${ENGINE_URL}/events`)
      esRef.current = es
      es.onopen  = () => setConnected(true)
      es.onerror = () => { setConnected(false); es.close(); setTimeout(connect, 3000) }

      es.addEventListener('engine-log',   e => { try { addLog(JSON.parse((e as MessageEvent).data) as LogEntry) }       catch {/**/} })
      es.addEventListener('engine-state', e => { try { setState(JSON.parse((e as MessageEvent).data) as EngineState) }  catch {/**/} })

      es.addEventListener('submitted', e => {
        try {
          const d = JSON.parse((e as MessageEvent).data) as { submissionId?: string; jobId?: string; responseType?: 'TEXT' | 'FILE'; jobType?: 'STANDARD' | 'SWARM' }
          addJob({ id: `${Date.now()}-${Math.random()}`, jobId: d.jobId, submissionId: d.submissionId, prompt: promptRef.current, timestamp: new Date().toISOString(), success: true, responseType: d.responseType, jobType: d.jobType })
          promptRef.current = undefined
        } catch {/**/}
      })

      es.addEventListener('engine-error', () => {
        try { addJob({ id: `${Date.now()}-${Math.random()}`, timestamp: new Date().toISOString(), success: false }) } catch {/**/}
      })
    }

    connect()

    const iv = setInterval(async () => {
      try {
        const r = await fetch(`${ENGINE_URL}/state`)
        if (r.ok) {
          const d = await r.json() as EngineState
          setState(d)
          setConnected(true)
          if (d.agentId) agentIdRef.current = d.agentId
        }
      } catch { setConnected(false) }
    }, 5000)

    ;(async () => {
      try {
        const [stateRes, jobsRes] = await Promise.all([
          fetch(`${ENGINE_URL}/state`),
          fetch(`${ENGINE_URL}/jobs`),
        ])
        if (stateRes.ok) {
          const d = await stateRes.json() as EngineState
          setState(d)
          setConnected(true)
          if (d.agentId) agentIdRef.current = d.agentId
        }
        if (jobsRes.ok) {
          const d = await jobsRes.json() as { jobs: Array<{ jobId: string; prompt: string; template?: string; responseType?: 'TEXT' | 'FILE'; jobType?: string; submissionId?: string; success: boolean; timestamp: string }> }
          if (d.jobs?.length) {
            const mapped = d.jobs.map((j, i) => ({
              id: `server-${i}`,
              num: i + 1,
              jobId: j.jobId,
              submissionId: j.submissionId,
              template: j.template,
              prompt: j.prompt,
              timestamp: j.timestamp,
              success: j.success,
              responseType: j.responseType,
              jobType: j.jobType as 'STANDARD' | 'SWARM' | undefined,
            }))
            counterRef.current = mapped.length
            setJobs(mapped)
          }
        }
      } catch {/**/}
    })()

    return () => { esRef.current?.close(); clearInterval(iv) }
  }, [])

  const toggle = async () => {
    try { await fetch(`${ENGINE_URL}${state?.running ? '/control/stop' : '/control/start'}`, { method: 'POST' }) } catch {/**/}
  }

  const inject = async (p: string) => {
    promptRef.current = p
    try { await fetch(`${ENGINE_URL}/control/prompt`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: p }) }) } catch {/**/}
  }

  // Merge latest template slug into last job without a useEffect
  const jobsDisplay = jobs.map((j, i) =>
    i === jobs.length - 1 && !j.template && state?.lastTemplateSlug
      ? { ...j, template: state.lastTemplateSlug }
      : j
  )

  const TICKER = '/ kawamura agent is live · watching for mystery prompt · claude sonnet 4-5 · template fast-path ~200ms · 9 templates loaded · static html · fflate zip · seedstr api v2 · '

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      background: '#FAFAF9',
      backgroundImage: `
        linear-gradient(rgba(249,115,22,0.065) 1px, transparent 1px),
        linear-gradient(90deg, rgba(249,115,22,0.065) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}>

      {/* ── Header ── */}
      <header style={{
        height: 52, flexShrink: 0,
        background: '#fff', borderBottom: '1px solid #E5E7EB',
        padding: '0 20px',
        display: 'flex', alignItems: 'center', gap: 18,
        zIndex: 10,
      }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: OG, letterSpacing: '-0.03em' }}>KAWAMURA</span>
        <span style={{ background: OG, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.05em' }}>
          AGENT
        </span>

        <div style={{ flex: 1 }} />

        <button onClick={toggle} style={{
          background: state?.running ? 'rgba(183,80,178,0.1)' : OG_BG,
          border: `1px solid ${state?.running ? 'rgba(183,80,178,0.25)' : OG_BD}`,
          color: state?.running ? '#B750B2' : OG,
          fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 999,
          cursor: 'pointer', letterSpacing: '0.04em',
        }}>
          {state?.running ? '■ STOP ENGINE' : '▶ START ENGINE'}
        </button>

        <button onClick={() => setShowInject(true)} style={{
          background: 'transparent', border: '1px solid #E5E7EB',
          color: '#6B7280', fontSize: 11, fontWeight: 500,
          padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
        }}>
          💉 Inject
        </button>
      </header>

      {/* ── Ticker ── */}
      <div style={{
        height: 30, flexShrink: 0,
        background: '#fff', borderBottom: '1px solid #E5E7EB',
        overflow: 'hidden', display: 'flex', alignItems: 'center',
        fontSize: 11, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace',
      }}>
        <div style={{ whiteSpace: 'nowrap', animation: 'ticker 28s linear infinite' }}>
          {TICKER.repeat(4)}
        </div>
      </div>

      {/* ── Inner body (padding + flex column) ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 20px 12px', gap: 10, minHeight: 0, overflow: 'hidden' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, flexShrink: 0 }}>
          <StatCard label="Jobs Processed"  value={state?.jobsProcessed ?? 0} accent />
          <StatCard label="Submitted"        value={jobs.filter(j => j.success).length} accent />
          <StatCard label="Templates"        value={9} />
          <StatCard label="Agent ID"         value={agentIdRef.current ? `${agentIdRef.current.slice(0, 8)}…` : '—'} />
          <StatCard label="Stage"            value={STAGE_LABEL[state?.stage ?? 'idle'] ?? 'Idle'} accent />
        </div>

        {/* 3-column content area — fills remaining height */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: 10, minHeight: 0, overflow: 'hidden' }}>

          {/* Left: Live Feed */}
          <LiveFeed logs={logs} />

          {/* Center: Recent Jobs */}
          <RecentJobs jobs={jobsDisplay} state={state} />

          {/* Right: Pipeline + Engine Stats stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflow: 'hidden' }}>
            <Pipeline stage={state?.stage ?? 'idle'} />
            <EngineStats state={state} connected={connected} />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        height: 34, flexShrink: 0,
        background: '#fff', borderTop: '1px solid #E5E7EB',
        padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, color: '#9CA3AF', zIndex: 10,
      }}>
        <span>Kawamura Agent — Seedstr Hackathon 2026</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ cursor: 'pointer' }}>Terms</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: connected ? '#22C55E' : '#EF4444' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: connected ? '#22C55E' : '#EF4444', display: 'inline-block' }} />
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </span>
      </footer>

      {showInject && (
        <InjectModal
          onSubmit={inject}
          onClose={() => setShowInject(false)}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes ticker  { 0%{transform:translateX(0)} 100%{transform:translateX(-25%)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; overflow: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: ${OG}33; }
      `}</style>
    </div>
  )
}
