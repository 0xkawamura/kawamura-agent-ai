interface EngineState {
  running: boolean
  stage: string
  processing: boolean
  lastTickAt?: string
  lastJobId?: string
  lastTemplateSlug?: string
  lastSubmissionAt?: string
  lastError?: string
  jobsProcessed: number
}

interface AgentStatusProps {
  state: EngineState | null
  connected: boolean
}

const STAGE_LABELS: Record<string, string> = {
  idle: 'Idle',
  watching: 'Watching',
  prompt_received: 'Prompt Received',
  classifying: 'Classifying',
  generating: 'Generating',
  building: 'Building',
  packing: 'Packing',
  submitting: 'Submitting',
  completed: 'Completed',
  error: 'Error',
}

export default function AgentStatus({ state, connected }: AgentStatusProps) {
  const stage = state?.stage ?? 'idle'
  const isOnline = connected && state?.running

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(232,232,240,0.5)' }}>
          Agent Status
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'JetBrains Mono, monospace',
            background: isOnline ? 'rgba(210,255,85,0.1)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${isOnline ? 'rgba(210,255,85,0.3)' : 'rgba(255,255,255,0.1)'}`,
            color: isOnline ? '#D2FF55' : 'rgba(232,232,240,0.5)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: isOnline ? '#D2FF55' : 'rgba(255,255,255,0.3)',
              boxShadow: isOnline ? '0 0 6px #D2FF55' : 'none',
              animation: isOnline ? 'pulse 2s infinite' : 'none',
            }}
          />
          {isOnline ? 'Online' : connected ? 'Stopped' : 'Offline'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <StatItem label="Stage" value={STAGE_LABELS[stage] ?? stage} accent={stage === 'error' ? '#ff4444' : '#D2FF55'} />
        <StatItem label="Jobs" value={String(state?.jobsProcessed ?? 0)} />
        <StatItem label="Template" value={state?.lastTemplateSlug ?? '—'} />
        <StatItem label="Last Tick" value={state?.lastTickAt ? new Date(state.lastTickAt).toLocaleTimeString() : '—'} />
      </div>

      {state?.lastError && (
        <div
          style={{
            marginTop: 12,
            padding: '10px 12px',
            borderRadius: 8,
            background: 'rgba(255,68,68,0.08)',
            border: '1px solid rgba(255,68,68,0.2)',
            fontSize: 12,
            color: '#ff6666',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {state.lastError}
        </div>
      )}
    </div>
  )
}

function StatItem({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(232,232,240,0.4)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', color: accent ?? '#e8e8f0' }}>
        {value}
      </div>
    </div>
  )
}
