interface Job {
  id: string
  jobId?: string
  submissionId?: string
  template?: string
  timestamp: string
  success: boolean
}

interface JobHistoryProps {
  jobs: Job[]
}

export default function JobHistory({ jobs }: JobHistoryProps) {
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
        Job History
      </div>

      {jobs.length === 0 ? (
        <div style={{ color: 'rgba(232,232,240,0.3)', fontSize: 13 }}>No jobs processed yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {jobs.slice(-10).reverse().map(job => (
            <div
              key={job.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ fontSize: 14 }}>{job.success ? '✓' : '✗'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: job.success ? '#D2FF55' : '#ff6666', marginBottom: 2 }}>
                  {job.jobId ? job.jobId.slice(0, 12) + '…' : 'manual'}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(232,232,240,0.4)' }}>
                  {job.template ?? 'full-gen'}
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(232,232,240,0.35)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                {new Date(job.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
