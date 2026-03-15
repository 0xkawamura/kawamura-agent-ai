import { useEffect, useRef } from 'react'

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'success'
  source: string
  message: string
}

interface LiveLogProps {
  logs: LogEntry[]
}

const LEVEL_COLORS: Record<string, string> = {
  info: 'rgba(232,232,240,0.7)',
  success: '#D2FF55',
  warn: '#ffa500',
  error: '#ff6666',
}

const LEVEL_BG: Record<string, string> = {
  info: 'transparent',
  success: 'transparent',
  warn: 'transparent',
  error: 'rgba(255,68,68,0.04)',
}

export default function LiveLog({ logs }: LiveLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '16px',
        height: 220,
        overflowY: 'auto',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
      }}
    >
      {logs.length === 0 ? (
        <div style={{ color: 'rgba(232,232,240,0.3)', padding: '8px 0' }}>
          Waiting for engine events...
        </div>
      ) : (
        logs.map(log => (
          <div
            key={log.id}
            style={{
              display: 'flex',
              gap: 8,
              padding: '4px 0',
              background: LEVEL_BG[log.level],
              borderRadius: 4,
            }}
          >
            <span style={{ color: 'rgba(232,232,240,0.35)', flexShrink: 0 }}>
              {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span
              style={{
                color: LEVEL_COLORS[log.level] ?? '#e8e8f0',
                flexShrink: 0,
                width: 52,
                textTransform: 'uppercase',
                fontSize: 10,
                paddingTop: 1,
              }}
            >
              [{log.level}]
            </span>
            <span style={{ color: 'rgba(183,80,178,0.8)', flexShrink: 0, fontSize: 10, paddingTop: 1 }}>
              {log.source}
            </span>
            <span style={{ color: LEVEL_COLORS[log.level] ?? 'rgba(232,232,240,0.8)' }}>
              {log.message}
            </span>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  )
}
