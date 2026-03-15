import { useState } from 'react'

const ENGINE_URL = 'http://127.0.0.1:8787'

interface KillSwitchProps {
  running: boolean
  onStateChange?: () => void
}

export default function KillSwitch({ running, onStateChange }: KillSwitchProps) {
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    try {
      const endpoint = running ? '/control/stop' : '/control/start'
      await fetch(`${ENGINE_URL}${endpoint}`, { method: 'POST' })
      onStateChange?.()
    } catch {
      // Engine may not be running locally
    } finally {
      setLoading(false)
    }
  }

  const injectPrompt = async () => {
    const prompt = window.prompt('Enter test prompt:')
    if (!prompt) return
    try {
      await fetch(`${ENGINE_URL}/control/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
    } catch {
      // ignore
    }
  }

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
        Controls
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={toggle}
          disabled={loading}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer',
            transition: 'all 0.2s',
            background: running ? 'rgba(255,68,68,0.15)' : '#D2FF55',
            color: running ? '#ff6666' : '#050508',
            border: running ? '1px solid rgba(255,68,68,0.3)' : 'none',
            boxShadow: running ? 'none' : '0 0 20px rgba(210,255,85,0.3)',
            opacity: loading ? 0.6 : 1,
          } as React.CSSProperties}
        >
          {loading ? '...' : running ? '■ Stop Engine' : '▶ Start Engine'}
        </button>

        <button
          onClick={injectPrompt}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(232,232,240,0.7)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => ((e.target as HTMLButtonElement).style.borderColor = 'rgba(210,255,85,0.3)')}
          onMouseLeave={e => ((e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)')}
        >
          💉 Inject Prompt
        </button>
      </div>
    </div>
  )
}
