import type { BuildArtifactFile } from '../../types.js';
import { BASE_CSS, STARFIELD_HTML, STARFIELD_JS } from '../designSystem.js';

export interface AiAgentProfileSlots {
  agentName: string;
  agentVersion: string;
  agentDescription: string;
  capability1: string;
  capability2: string;
  capability3: string;
  capability4: string;
  status: string;
  model: string;
  uptime: string;
}

export function generateAiAgentProfile(slots: AiAgentProfileSlots): BuildArtifactFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${slots.agentName} — Agent Profile</title>
  <style>
    ${BASE_CSS}
    .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
    .hero {
      position: relative; z-index: 1;
      padding: 80px 0 60px; text-align: center;
    }
    .agent-ring {
      width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 24px;
      background: radial-gradient(circle at 30% 30%, rgba(210,255,85,0.3), rgba(183,80,178,0.2), transparent);
      border: 2px solid rgba(210,255,85,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 40px; position: relative;
      box-shadow: 0 0 60px rgba(210,255,85,0.15), inset 0 0 40px rgba(210,255,85,0.05);
      animation: orbit-glow 3s ease-in-out infinite;
    }
    @keyframes orbit-glow {
      0%,100% { box-shadow: 0 0 60px rgba(210,255,85,0.15), inset 0 0 40px rgba(210,255,85,0.05); }
      50% { box-shadow: 0 0 100px rgba(210,255,85,0.3), inset 0 0 60px rgba(210,255,85,0.1); }
    }
    .agent-ring::after {
      content: ''; position: absolute; inset: -8px; border-radius: 50%;
      border: 1px solid rgba(210,255,85,0.15);
      animation: spin 8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .status-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 14px; border-radius: 999px;
      background: rgba(210,255,85,0.1); border: 1px solid rgba(210,255,85,0.3);
      color: var(--lime); font-size: 12px; font-weight: 600;
      font-family: var(--mono); margin-bottom: 16px;
    }
    .status-badge::before {
      content: '';width: 6px;height: 6px;border-radius:50%;
      background:var(--lime);box-shadow:0 0 6px var(--lime);
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
    h1 { font-size: clamp(32px, 5vw, 60px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 8px; }
    h1 span { color: var(--lime); }
    .version { font-family: var(--mono); color: var(--text-muted); font-size: 14px; margin-bottom: 20px; }
    .desc { max-width: 600px; margin: 0 auto; color: var(--text-muted); font-size: 16px; line-height: 1.7; }
    .stats-row {
      position: relative; z-index: 1;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 48px 0;
    }
    .stat-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 12px; padding: 20px; text-align: center;
    }
    .stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 6px; }
    .stat-value { font-family: var(--mono); font-size: 22px; font-weight: 700; color: var(--lime); }
    .capabilities {
      position: relative; z-index: 1; padding: 60px 0;
    }
    .cap-header { text-align: center; margin-bottom: 40px; }
    .cap-header h2 { font-size: 28px; font-weight: 700; }
    .cap-header h2 span { color: var(--purple); }
    .cap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
    .cap-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 12px; padding: 24px;
      transition: border-color 0.3s, transform 0.3s;
    }
    .cap-card:hover { border-color: rgba(183,80,178,0.4); transform: translateY(-4px); }
    .cap-num {
      font-family: var(--mono); font-size: 12px;
      color: var(--purple); margin-bottom: 10px;
    }
    .cap-card h3 { font-size: 16px; font-weight: 600; line-height: 1.4; }
    .model-banner {
      position: relative; z-index: 1;
      background: var(--glass); border: 1px solid rgba(183,80,178,0.3);
      border-radius: 12px; padding: 24px 32px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 16px; margin-bottom: 60px;
    }
    .model-info h3 { font-size: 14px; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; }
    .model-info p { font-family: var(--mono); font-size: 16px; color: var(--purple); font-weight: 500; }
    .log-stream {
      background: rgba(0,0,0,0.4); border: 1px solid var(--glass-border);
      border-radius: 10px; padding: 16px; height: 120px; overflow-y: auto;
      font-family: var(--mono); font-size: 12px;
    }
    .log-line { padding: 2px 0; }
    .log-line .ts { color: var(--text-muted); margin-right: 8px; }
    .log-line .msg-info { color: var(--text); }
    .log-line .msg-ok { color: var(--lime); }
    .log-line .msg-warn { color: #ffa500; }
  </style>
</head>
<body>
  ${STARFIELD_HTML}
  <div class="container">
    <section class="hero">
      <div class="agent-ring">🤖</div>
      <div class="status-badge">${slots.status}</div>
      <h1><span>${slots.agentName.split(' ')[0]}</span> ${slots.agentName.split(' ').slice(1).join(' ')}</h1>
      <div class="version">v${slots.agentVersion}</div>
      <p class="desc">${slots.agentDescription}</p>
    </section>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Model</div>
        <div class="stat-value" style="font-size:14px;color:var(--purple)">${slots.model}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Uptime</div>
        <div class="stat-value" id="uptime">${slots.uptime}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Jobs Processed</div>
        <div class="stat-value" id="jobCount">0</div>
      </div>
    </div>

    <section class="capabilities">
      <div class="cap-header">
        <h2>Core <span>Capabilities</span></h2>
      </div>
      <div class="cap-grid">
        <div class="cap-card">
          <div class="cap-num">CAP.01</div>
          <h3>${slots.capability1}</h3>
        </div>
        <div class="cap-card">
          <div class="cap-num">CAP.02</div>
          <h3>${slots.capability2}</h3>
        </div>
        <div class="cap-card">
          <div class="cap-num">CAP.03</div>
          <h3>${slots.capability3}</h3>
        </div>
        <div class="cap-card">
          <div class="cap-num">CAP.04</div>
          <h3>${slots.capability4}</h3>
        </div>
      </div>
    </section>

    <div class="model-banner">
      <div class="model-info">
        <h3>Powered by</h3>
        <p>${slots.model}</p>
      </div>
      <div class="model-info" style="text-align:right">
        <h3>Status</h3>
        <p style="color:var(--lime)">${slots.status}</p>
      </div>
    </div>

    <div style="margin-bottom:60px">
      <div class="stat-label" style="margin-bottom:10px">Live Activity Log</div>
      <div class="log-stream" id="logStream"></div>
    </div>
  </div>

  <script>
    ${STARFIELD_JS}

    let jobCount = 0;
    const log = document.getElementById('logStream');
    const msgs = [
      ['ok', 'Agent initialized. Polling Seedstr API.'],
      ['info', 'Watcher tick. Next poll in 7.3s.'],
      ['ok', 'Connected to OpenRouter endpoint.'],
      ['info', 'Checking available jobs...'],
      ['ok', 'Classification engine ready.'],
      ['info', 'Template library loaded (5 templates).'],
      ['ok', 'SSE bridge active on port 8787.'],
      ['warn', 'Budget filter active: min $0.00.'],
      ['ok', 'All systems operational.'],
    ];

    function addLog(level, msg) {
      const now = new Date().toLocaleTimeString('en-US', {hour12:false});
      const div = document.createElement('div');
      div.className = 'log-line';
      div.innerHTML = \`<span class="ts">[\${now}]</span><span class="msg-\${level}">\${msg}</span>\`;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
    }

    msgs.forEach((m, i) => setTimeout(() => addLog(m[0], m[1]), i * 600));
    setInterval(() => {
      jobCount++;
      document.getElementById('jobCount').textContent = jobCount;
      addLog('ok', \`Job processed successfully. Total: \${jobCount}\`);
    }, 8000);
  </script>
</body>
</html>`;

  return [
    { path: 'index.html', content: html },
    { path: 'README.md', content: `# ${slots.agentName}\n\n${slots.agentDescription}\n\nGenerated by Kawamura Agent.` },
  ];
}
