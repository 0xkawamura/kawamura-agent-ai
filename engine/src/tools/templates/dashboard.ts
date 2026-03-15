import type { BuildArtifactFile } from '../../types.js';
import { BASE_CSS, STARFIELD_HTML, STARFIELD_JS } from '../designSystem.js';

export interface DashboardSlots {
  dashboardTitle: string;
  metric1Label: string;
  metric1Value: string;
  metric2Label: string;
  metric2Value: string;
  metric3Label: string;
  metric3Value: string;
  metric4Label: string;
  metric4Value: string;
  chartTitle: string;
  tableTitle: string;
}

export function generateDashboard(slots: DashboardSlots): BuildArtifactFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${slots.dashboardTitle}</title>
  <style>
    ${BASE_CSS}
    body { display: flex; min-height: 100vh; }
    .sidebar {
      width: 220px; flex-shrink: 0;
      background: rgba(5,5,8,0.95);
      border-right: 1px solid var(--glass-border);
      padding: 24px 16px;
      position: fixed; height: 100vh; overflow-y: auto;
      z-index: 10;
    }
    .sidebar-logo {
      font-size: 15px; font-weight: 700; color: var(--lime);
      padding: 8px 12px; margin-bottom: 24px;
      letter-spacing: -0.01em;
    }
    .sidebar-section { font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--text-muted); padding: 8px 12px; margin-top: 16px; }
    .sidebar-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 8px;
      color: var(--text-muted); font-size: 14px;
      cursor: pointer; transition: all 0.2s;
      text-decoration: none;
    }
    .sidebar-item:hover, .sidebar-item.active {
      background: var(--glass); color: var(--text); border: 1px solid var(--glass-border);
    }
    .sidebar-item.active { color: var(--lime); border-color: rgba(210,255,85,0.2); }
    .main {
      margin-left: 220px; flex: 1;
      padding: 32px;
      position: relative; z-index: 1;
    }
    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 32px;
    }
    .topbar h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
    .badge-live {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 999px;
      background: rgba(210,255,85,0.1); border: 1px solid rgba(210,255,85,0.3);
      color: var(--lime); font-size: 12px; font-weight: 600;
      font-family: var(--mono);
    }
    .badge-live::before {
      content: '';
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--lime);
      box-shadow: 0 0 6px var(--lime);
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .metrics-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px; margin-bottom: 24px;
    }
    .metric-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 12px; padding: 20px;
      transition: border-color 0.3s;
    }
    .metric-card:hover { border-color: rgba(210,255,85,0.3); }
    .metric-label { font-size: 12px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 8px; }
    .metric-value {
      font-size: 32px; font-weight: 700; letter-spacing: -0.02em;
      font-family: var(--mono); color: var(--lime);
    }
    .charts-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 24px; }
    .chart-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 12px; padding: 24px;
    }
    .chart-card h3 { font-size: 15px; font-weight: 600; margin-bottom: 20px; }
    .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 100px; }
    .bar {
      flex: 1; border-radius: 4px 4px 0 0;
      background: linear-gradient(180deg, var(--lime), rgba(210,255,85,0.3));
      transition: opacity 0.2s;
    }
    .bar:hover { opacity: 0.8; }
    .donut-wrap { display: flex; justify-content: center; align-items: center; height: 100px; }
    .donut {
      width: 90px; height: 90px; border-radius: 50%;
      background: conic-gradient(var(--lime) 0% 65%, var(--purple) 65% 85%, rgba(255,255,255,0.1) 85% 100%);
    }
    .table-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 12px; padding: 24px;
    }
    .table-card h3 { font-size: 15px; font-weight: 600; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--text-muted);
      padding: 8px 12px; border-bottom: 1px solid var(--glass-border); }
    td { padding: 12px 12px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); }
    tr:last-child td { border-bottom: none; }
    .status-dot {
      display: inline-block; width: 6px; height: 6px; border-radius: 50%;
      background: var(--lime); box-shadow: 0 0 6px var(--lime); margin-right: 6px;
    }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; padding: 20px; }
      .charts-row { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  ${STARFIELD_HTML}
  <aside class="sidebar">
    <div class="sidebar-logo">${slots.dashboardTitle}</div>
    <div class="sidebar-section">Main</div>
    <a class="sidebar-item active" href="#">📊 Overview</a>
    <a class="sidebar-item" href="#">📈 Analytics</a>
    <a class="sidebar-item" href="#">🔔 Alerts</a>
    <div class="sidebar-section">Settings</div>
    <a class="sidebar-item" href="#">⚙️ Config</a>
    <a class="sidebar-item" href="#">👤 Profile</a>
  </aside>

  <main class="main">
    <div class="topbar">
      <h1>${slots.dashboardTitle}</h1>
      <span class="badge-live">Live</span>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">${slots.metric1Label}</div>
        <div class="metric-value">${slots.metric1Value}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">${slots.metric2Label}</div>
        <div class="metric-value">${slots.metric2Value}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">${slots.metric3Label}</div>
        <div class="metric-value">${slots.metric3Value}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">${slots.metric4Label}</div>
        <div class="metric-value">${slots.metric4Value}</div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <h3>${slots.chartTitle}</h3>
        <div class="bar-chart" id="barChart"></div>
      </div>
      <div class="chart-card">
        <h3>Distribution</h3>
        <div class="donut-wrap"><div class="donut"></div></div>
      </div>
    </div>

    <div class="table-card">
      <h3>${slots.tableTitle}</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Value</th><th>Status</th><th>Updated</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    </div>
  </main>

  <script>
    ${STARFIELD_JS}

    // Generate bar chart
    const bars = document.getElementById('barChart');
    const heights = [40,70,55,90,65,80,45,75,60,85,50,95];
    bars.innerHTML = heights.map(h =>
      \`<div class="bar" style="height:\${h}%"></div>\`
    ).join('');

    // Generate table rows
    const tbody = document.getElementById('tableBody');
    const rows = [
      ['#001','Alpha Stream','2,847','Active'],
      ['#002','Beta Flow','1,293','Active'],
      ['#003','Gamma Run','4,561','Processing'],
      ['#004','Delta Node','892','Paused'],
      ['#005','Epsilon Core','3,104','Active'],
    ];
    const now = new Date();
    tbody.innerHTML = rows.map(([id,name,val,status]) =>
      \`<tr>
        <td style="font-family:var(--mono);color:var(--text-muted)">\${id}</td>
        <td>\${name}</td>
        <td style="font-family:var(--mono);color:var(--lime)">\${val}</td>
        <td><span class="status-dot"></span>\${status}</td>
        <td style="color:var(--text-muted)">\${now.toLocaleTimeString()}</td>
      </tr>\`
    ).join('');
  </script>
</body>
</html>`;

  return [
    { path: 'index.html', content: html },
    { path: 'README.md', content: `# ${slots.dashboardTitle}\n\nLive analytics dashboard.\n\nGenerated by Kawamura Agent.` },
  ];
}
