import type { BuildArtifactFile } from '../../types.js';
import { BASE_CSS, STARFIELD_HTML, STARFIELD_JS } from '../designSystem.js';

export interface ToolAppSlots {
  appTitle: string;
  appSubtitle: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  buttonText: string;
  feature1: string;
  feature2: string;
  feature3: string;
}

export function generateToolApp(slots: ToolAppSlots): BuildArtifactFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${slots.appTitle}</title>
  <style>
    ${BASE_CSS}
    .container { max-width: 800px; margin: 0 auto; padding: 40px 24px; position: relative; z-index: 1; }
    header { text-align: center; padding: 60px 0 48px; }
    header h1 { font-size: clamp(28px, 5vw, 52px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 12px; }
    header h1 span { color: var(--lime); }
    header p { color: var(--text-muted); font-size: 16px; max-width: 500px; margin: 0 auto; line-height: 1.6; }
    .features-bar {
      display: flex; justify-content: center; flex-wrap: wrap; gap: 12px;
      margin: 24px 0 48px;
    }
    .feature-chip {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 999px;
      background: var(--glass); border: 1px solid var(--glass-border);
      font-size: 13px; color: var(--text-muted);
    }
    .feature-chip::before { content: '✓'; color: var(--lime); font-weight: 700; }
    .tool-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 16px; padding: 32px; margin-bottom: 24px;
    }
    .field-label {
      display: block; font-size: 13px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--text-muted); margin-bottom: 10px;
    }
    .input-wrap { position: relative; margin-bottom: 20px; }
    textarea, input[type="text"] {
      width: 100%; padding: 14px 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      border-radius: 10px; color: var(--text);
      font-family: var(--mono); font-size: 14px;
      outline: none; resize: vertical; min-height: 100px;
      transition: border-color 0.2s;
    }
    textarea:focus, input[type="text"]:focus { border-color: var(--lime); }
    .action-row { display: flex; gap: 12px; align-items: center; margin-bottom: 24px; }
    .btn-clear {
      padding: 12px 24px; border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: var(--glass); color: var(--text-muted);
      font-family: var(--sans); font-size: 15px;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-clear:hover { color: var(--text); border-color: rgba(255,255,255,0.25); }
    .output-wrap {
      background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border);
      border-radius: 10px; padding: 16px;
      min-height: 120px; font-family: var(--mono); font-size: 14px;
      line-height: 1.7; color: var(--lime);
      white-space: pre-wrap; word-break: break-word;
    }
    .output-wrap.empty { color: var(--text-muted); font-style: italic; }
    .processing {
      display: none; align-items: center; gap: 10px;
      color: var(--text-muted); font-size: 14px;
    }
    .processing.active { display: flex; }
    .spinner {
      width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid rgba(210,255,85,0.2);
      border-top-color: var(--lime);
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  ${STARFIELD_HTML}
  <div class="container">
    <header>
      <h1>${slots.appTitle.split(' ').map((w, i) => i === 0 ? `<span>${w}</span>` : w).join(' ')}</h1>
      <p>${slots.appSubtitle}</p>
      <div class="features-bar">
        <span class="feature-chip">${slots.feature1}</span>
        <span class="feature-chip">${slots.feature2}</span>
        <span class="feature-chip">${slots.feature3}</span>
      </div>
    </header>

    <div class="tool-card">
      <label class="field-label">${slots.inputLabel}</label>
      <div class="input-wrap">
        <textarea id="inputArea" placeholder="${slots.inputPlaceholder}"></textarea>
      </div>
      <div class="action-row">
        <button class="btn-lime" onclick="processInput()">${slots.buttonText}</button>
        <button class="btn-clear" onclick="clearAll()">Clear</button>
        <div class="processing" id="processing">
          <div class="spinner"></div>
          Processing...
        </div>
      </div>
    </div>

    <div class="tool-card">
      <label class="field-label">${slots.outputLabel}</label>
      <div class="output-wrap empty" id="outputArea">Output will appear here...</div>
    </div>
  </div>

  <script>
    ${STARFIELD_JS}

    function processInput() {
      const input = document.getElementById('inputArea').value.trim();
      const output = document.getElementById('outputArea');
      const processing = document.getElementById('processing');

      if (!input) {
        output.textContent = 'Please provide some input first.';
        output.className = 'output-wrap empty';
        return;
      }

      processing.classList.add('active');
      output.className = 'output-wrap empty';
      output.textContent = '';

      setTimeout(() => {
        processing.classList.remove('active');
        const result = transformInput(input);
        output.textContent = result;
        output.className = 'output-wrap';
      }, 800);
    }

    function transformInput(input) {
      const lines = input.split('\\n').filter(l => l.trim());
      const stats = {
        chars: input.length,
        words: input.split(/\\s+/).filter(Boolean).length,
        lines: lines.length,
        sentences: (input.match(/[.!?]+/g) || []).length,
      };
      return [
        '=== Analysis Result ===',
        '',
        'Input Statistics:',
        \`  Characters : \${stats.chars}\`,
        \`  Words      : \${stats.words}\`,
        \`  Lines      : \${stats.lines}\`,
        \`  Sentences  : \${stats.sentences}\`,
        '',
        'Processed Output:',
        ...lines.map((l, i) => \`  [\${String(i+1).padStart(2,'0')}] \${l.trim()}\`),
        '',
        '=== Done ===',
      ].join('\\n');
    }

    function clearAll() {
      document.getElementById('inputArea').value = '';
      const out = document.getElementById('outputArea');
      out.textContent = 'Output will appear here...';
      out.className = 'output-wrap empty';
    }
  </script>
</body>
</html>`;

  return [
    { path: 'index.html', content: html },
    { path: 'README.md', content: `# ${slots.appTitle}\n\n${slots.appSubtitle}\n\nGenerated by Kawamura Agent.` },
  ];
}
