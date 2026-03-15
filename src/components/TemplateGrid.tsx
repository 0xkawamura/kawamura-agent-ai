const TEMPLATES = [
  { slug: 'landing-page', label: 'Landing Page', icon: '🚀', desc: 'Hero, features, CTA' },
  { slug: 'portfolio', label: 'Portfolio', icon: '💼', desc: 'Skills, projects, contact' },
  { slug: 'dashboard', label: 'Dashboard', icon: '📊', desc: 'Metrics, charts, tables' },
  { slug: 'tool-app', label: 'Tool App', icon: '⚙️', desc: 'Input/output utility' },
  { slug: 'ai-agent-profile', label: 'AI Agent', icon: '🤖', desc: 'Agent profile & stats' },
]

interface TemplateGridProps {
  lastUsed?: string
}

export default function TemplateGrid({ lastUsed }: TemplateGridProps) {
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
        Templates
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        {TEMPLATES.map(t => {
          const isActive = lastUsed === t.slug
          return (
            <div
              key={t.slug}
              style={{
                padding: '14px',
                borderRadius: 10,
                background: isActive ? 'rgba(210,255,85,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? 'rgba(210,255,85,0.3)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.2s',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{t.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#D2FF55' : '#e8e8f0', marginBottom: 2 }}>
                {t.label}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(232,232,240,0.4)' }}>
                {t.desc}
              </div>
              {isActive && (
                <div style={{ marginTop: 6, fontSize: 10, color: '#D2FF55', fontFamily: 'JetBrains Mono, monospace' }}>
                  ◉ Last used
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
