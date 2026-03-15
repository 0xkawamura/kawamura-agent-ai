import { useEffect, useState } from 'react'

const DEADLINE = new Date('2026-03-15T14:00:00+07:00') // WIB (UTC+7)

function formatTime(ms: number): { h: string; m: string; s: string; expired: boolean } {
  if (ms <= 0) return { h: '00', m: '00', s: '00', expired: true }
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return {
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(s).padStart(2, '0'),
    expired: false,
  }
}

export default function CountdownClock() {
  const [remaining, setRemaining] = useState(() => DEADLINE.getTime() - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(DEADLINE.getTime() - Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const { h, m, s, expired } = formatTime(remaining)

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${expired ? 'rgba(255,68,68,0.3)' : 'rgba(210,255,85,0.15)'}`,
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(232,232,240,0.5)', marginBottom: 4 }}>
          Hackathon Deadline
        </div>
        <div style={{ fontSize: 11, color: 'rgba(232,232,240,0.35)' }}>Mar 15, 2026 — 14:00 WIB</div>
      </div>
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 22,
          fontWeight: 700,
          color: expired ? '#ff6666' : remaining < 3600000 ? '#ffa500' : '#D2FF55',
          letterSpacing: '0.05em',
        }}
      >
        {expired ? 'CLOSED' : `${h}:${m}:${s}`}
      </div>
    </div>
  )
}
