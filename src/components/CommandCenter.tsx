import { useEffect, useRef, useState } from 'react'
import { Download, Eye, Play, RotateCcw, Square, Syringe, Trophy } from 'lucide-react'

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
const TEMPLATES_META = [
  { slug: 'landing-page', label: 'Landing Page', bg: '#FEF3C7', text: '#D97706', prompt: 'Create a landing page for a SaaS productivity app called Flowdesk' },
  { slug: 'portfolio', label: 'Portfolio', bg: '#EDE9FE', text: '#7C3AED', prompt: 'Build a portfolio for a full-stack developer named Alex Chen' },
  { slug: 'dashboard', label: 'Dashboard', bg: '#DBEAFE', text: '#2563EB', prompt: 'Make an analytics dashboard for an e-commerce store' },
  { slug: 'tool-app', label: 'Tool App', bg: '#D1FAE5', text: '#059669', prompt: 'Build a text case converter and formatter tool' },
  { slug: 'ai-agent-profile', label: 'AI Agent', bg: 'rgba(249,115,22,0.08)', text: '#F97316', prompt: 'Create a profile page for an AI assistant named Atlas' },
  { slug: 'ecommerce', label: 'Ecommerce', bg: '#FCE7F3', text: '#DB2777', prompt: 'Build an online store for handmade artisan jewelry' },
  { slug: 'blog', label: 'Blog', bg: '#ECFDF5', text: '#047857', prompt: 'Create a tech blog called DevPulse about web development' },
  { slug: 'game', label: 'Game', bg: '#FFF7ED', text: '#EA580C', prompt: 'Make a trivia quiz game about world geography' },
  { slug: 'form-builder', label: 'Form Builder', bg: '#F0F9FF', text: '#0369A1', prompt: 'Build a multi-step onboarding form for a SaaS startup' },
]

function InjectModal({ onSubmit, onClose }: { onSubmit: (p: string) => void; onClose: () => void }) {
  const [value, setValue] = useState('')
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    taRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = () => { if (value.trim()) { onSubmit(value.trim()); onClose() } }

  const pickTemplate = (t: typeof TEMPLATES_META[0]) => {
    setActiveSlug(t.slug)
    setValue(t.prompt)
    taRef.current?.focus()
  }

  return (
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
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: '36px 36px 28px',
          width: 580,
          maxWidth: '92vw',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          animation: 'slideUp 0.18s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {/* Title */}
        <div>
          <h2 style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700, fontSize: 24, color: OG,
            letterSpacing: '0.01em', textTransform: 'uppercase', marginBottom: 6,
          }}>
            INPUT PROMPT
          </h2>
          <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
            Pick a template or write a custom prompt — the agent will build and submit it.
          </p>
        </div>

        {/* Templates grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Templates
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {TEMPLATES_META.map(t => (
              <button
                key={t.slug}
                onClick={() => pickTemplate(t)}
                style={{
                  padding: '8px 10px',
                  background: activeSlug === t.slug ? t.bg : '#F9FAFB',
                  border: `1.5px solid ${activeSlug === t.slug ? t.text : '#E5E7EB'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 11, fontWeight: 600,
                  color: activeSlug === t.slug ? t.text : '#6B7280',
                  textAlign: 'left',
                  transition: 'all 0.12s',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
                onMouseEnter={e => { if (activeSlug !== t.slug) { e.currentTarget.style.background = t.bg; e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.text } }}
                onMouseLeave={e => { if (activeSlug !== t.slug) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' } }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Prompt
          </label>
          <textarea
            ref={taRef}
            value={value}
            onChange={e => { setValue(e.target.value); if (!e.target.value.trim()) setActiveSlug(null) }}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
            placeholder="e.g. Build a landing page for a meditation app..."
            rows={3}
            style={{
              width: '100%', padding: '11px 13px',
              fontSize: 13, fontFamily: 'Plus Jakarta Sans, sans-serif',
              color: '#111827', background: '#FAFAF9',
              border: `1.5px solid ${value.trim() ? OG_BD : '#E5E7EB'}`,
              borderRadius: 10, resize: 'vertical', outline: 'none',
              lineHeight: 1.6, transition: 'border-color 0.15s',
            }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={!value.trim()}
          style={{
            width: '100%', padding: '14px',
            background: value.trim() ? OG : '#F3F4F6',
            border: 'none', borderRadius: 999,
            fontSize: 12, fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
            color: value.trim() ? '#fff' : '#9CA3AF',
            cursor: value.trim() ? 'pointer' : 'not-allowed',
            letterSpacing: '0.05em', transition: 'opacity 0.15s, transform 0.1s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseEnter={e => { if (value.trim()) e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          onMouseDown={e => { if (value.trim()) e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <Syringe size={13} /> INPUT PROMPT
        </button>

        <span style={{ textAlign: 'center', fontSize: 10, color: '#D1D5DB', fontFamily: 'JetBrains Mono, monospace' }}>
          ⌘↵ to submit · esc to close
        </span>
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
  'landing-page': { bg: '#FEF3C7', text: '#D97706' },
  'portfolio': { bg: '#EDE9FE', text: '#7C3AED' },
  'dashboard': { bg: '#DBEAFE', text: '#2563EB' },
  'tool-app': { bg: '#D1FAE5', text: '#059669' },
  'ai-agent-profile': { bg: OG_BG, text: OG },
  'ecommerce': { bg: '#FCE7F3', text: '#DB2777' },
  'blog': { bg: '#ECFDF5', text: '#047857' },
  'game': { bg: '#FFF7ED', text: '#EA580C' },
  'form-builder': { bg: '#F0F9FF', text: '#0369A1' },
  'none': { bg: '#F3F0FF', text: '#6D28D9' },  // full LLM path
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
                  <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Trophy size={10} />{job.jobId ? `${job.jobId.slice(0, 12)}…` : 'manual'}
                  </span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {job.success && job.responseType !== 'TEXT' && (
                      <>
                        <span
                          onClick={() => window.open(`${ENGINE_URL}/preview`, '_blank')}
                          style={{
                            fontSize: 10, padding: '2px 9px', borderRadius: 3, cursor: 'pointer',
                            border: '1px solid #DBEAFE', color: '#2563EB', background: '#EFF6FF',
                            fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#DBEAFE')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#EFF6FF')}
                        >
                          <Eye size={10} /> Preview
                        </span>
                        <a
                          href={`${ENGINE_URL}/download`}
                          download
                          style={{
                            fontSize: 10, padding: '2px 9px', borderRadius: 3, cursor: 'pointer',
                            border: '1px solid #D1FAE5', color: '#059669', background: '#ECFDF5',
                            fontWeight: 600, textDecoration: 'none',
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#D1FAE5')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#ECFDF5')}
                        >
                          <Download size={10} /> ZIP
                        </a>
                      </>
                    )}
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
            <span onClick={onRefresh} style={{ color: '#9CA3AF', cursor: 'pointer', display: 'flex' }}><RotateCcw size={12} /></span>
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
  const [connected, setConnected] = useState(false)
  const [state, setState] = useState<EngineState | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [showInject, setShowInject] = useState(false)
  const [agentId, setAgentId] = useState<string | undefined>(undefined)
  const esRef = useRef<EventSource | null>(null)
  const counterRef = useRef(0)
  const promptRef = useRef<string | undefined>(undefined)

  const addLog = (l: LogEntry) => setLogs(p => [...p.slice(-499), l])
  const addJob = (j: Omit<Job, 'num'>) => {
    counterRef.current += 1
    setJobs(p => [...p, { ...j, num: counterRef.current }])
  }

  useEffect(() => {
    const connect = () => {
      const es = new EventSource(`${ENGINE_URL}/events`)
      esRef.current = es
      es.onopen = () => setConnected(true)
      es.onerror = () => { setConnected(false); es.close(); setTimeout(connect, 3000) }

      es.addEventListener('engine-log', e => { try { addLog(JSON.parse((e as MessageEvent).data) as LogEntry) } catch {/**/ } })
      es.addEventListener('engine-state', e => { try { setState(JSON.parse((e as MessageEvent).data) as EngineState) } catch {/**/ } })

      es.addEventListener('submitted', e => {
        try {
          const d = JSON.parse((e as MessageEvent).data) as { submissionId?: string; jobId?: string; responseType?: 'TEXT' | 'FILE'; jobType?: 'STANDARD' | 'SWARM' }
          addJob({ id: `${Date.now()}-${Math.random()}`, jobId: d.jobId, submissionId: d.submissionId, prompt: promptRef.current, timestamp: new Date().toISOString(), success: true, responseType: d.responseType, jobType: d.jobType })
          promptRef.current = undefined
        } catch {/**/ }
      })

      es.addEventListener('engine-error', () => {
        try { addJob({ id: `${Date.now()}-${Math.random()}`, timestamp: new Date().toISOString(), success: false }) } catch {/**/ }
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
          if (d.agentId) setAgentId(d.agentId)
        }
      } catch { setConnected(false) }
    }, 5000)

      ; (async () => {
        try {
          const [stateRes, jobsRes] = await Promise.all([
            fetch(`${ENGINE_URL}/state`),
            fetch(`${ENGINE_URL}/jobs`),
          ])
          if (stateRes.ok) {
            const d = await stateRes.json() as EngineState
            setState(d)
            setConnected(true)
            if (d.agentId) setAgentId(d.agentId)
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
        } catch {/**/ }
      })()

    return () => { esRef.current?.close(); clearInterval(iv) }
  }, [])

  const toggle = async () => {
    try { await fetch(`${ENGINE_URL}${state?.running ? '/control/stop' : '/control/start'}`, { method: 'POST' }) } catch {/**/ }
  }

  const inject = async (p: string) => {
    promptRef.current = p
    try { await fetch(`${ENGINE_URL}/control/prompt`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: p }) }) } catch {/**/ }
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
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {state?.running ? <><Square size={10} /> STOP ENGINE</> : <><Play size={10} /> START ENGINE</>}
        </button>

        <button onClick={() => setShowInject(true)} style={{
          background: OG, border: 'none',
          color: '#fff', fontSize: 10, fontWeight: 700,
          padding: '5px 14px', borderRadius: 999, cursor: 'pointer',
          letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6,
          transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Syringe size={12} /> INPUT PROMPT
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
          <StatCard label="Jobs Processed" value={state?.jobsProcessed ?? 0} accent />
          <StatCard label="Submitted" value={jobs.filter(j => j.success).length} accent />
          <StatCard label="Templates" value={9} />
          <StatCard label="Agent ID" value={agentId ? `${agentId.slice(0, 8)}…` : '—'} />
          <StatCard label="Stage" value={STAGE_LABEL[state?.stage ?? 'idle'] ?? 'Idle'} accent />
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
