const STAGES = [
  { key: 'watching', label: 'Watching', icon: '👁' },
  { key: 'classifying', label: 'Classifying', icon: '🧠' },
  { key: 'generating', label: 'Generating', icon: '✨' },
  { key: 'building', label: 'Building', icon: '🔨' },
  { key: 'packing', label: 'Packing', icon: '📦' },
  { key: 'submitting', label: 'Submitting', icon: '🚀' },
  { key: 'completed', label: 'Completed', icon: '✅' },
]

const STAGE_ORDER = STAGES.map(s => s.key)

interface PipelineViewProps {
  currentStage: string
}

export default function PipelineView({ currentStage }: PipelineViewProps) {
  const currentIdx = STAGE_ORDER.indexOf(currentStage)

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '20px',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(232,232,240,0.5)', marginBottom: 16 }}>
        Pipeline
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {STAGES.map((stage, idx) => {
          const isActive = stage.key === currentStage
          const isPast = currentIdx > idx && currentStage !== 'idle' && currentStage !== 'error'
          const isError = currentStage === 'error' && idx === currentIdx - 1

          return (
            <div
              key={stage.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                background: isActive
                  ? 'rgba(210,255,85,0.08)'
                  : isError
                  ? 'rgba(255,68,68,0.06)'
                  : 'transparent',
                border: `1px solid ${isActive ? 'rgba(210,255,85,0.25)' : 'transparent'}`,
                transition: 'all 0.3s',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: isActive
                    ? '#D2FF55'
                    : isPast
                    ? 'rgba(210,255,85,0.4)'
                    : isError
                    ? '#ff4444'
                    : 'rgba(255,255,255,0.15)',
                  boxShadow: isActive ? '0 0 8px #D2FF55' : 'none',
                  animation: isActive ? 'pulse 1.5s infinite' : 'none',
                }}
              />
              <span style={{ fontSize: 13 }}>{stage.icon}</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? '#D2FF55'
                    : isPast
                    ? 'rgba(210,255,85,0.6)'
                    : 'rgba(232,232,240,0.45)',
                }}
              >
                {stage.label}
              </span>
              {isActive && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#D2FF55',
                    opacity: 0.7,
                  }}
                >
                  ACTIVE
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
