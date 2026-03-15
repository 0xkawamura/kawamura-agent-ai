import type { BuildArtifactFile } from '../../types.js';
import { BASE_CSS, STARFIELD_HTML, STARFIELD_JS, TOAST_JS } from '../designSystem.js';

export interface FormBuilderSlots {
  formTitle: string;
  formDescription: string;
  step1Label: string;
  field1Label: string;
  field1Placeholder: string;
  field2Label: string;
  field2Placeholder: string;
  step2Label: string;
  field3Label: string;
  field3Placeholder: string;
  field4Label: string;
  field4Options: string;
  step3Label: string;
  field5Label: string;
  submitText: string;
}

export function generateFormBuilder(slots: FormBuilderSlots): BuildArtifactFile[] {
  const options = slots.field4Options.split(',').map(o => o.trim()).filter(Boolean);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${slots.formDescription}" />
  <title>${slots.formTitle}</title>
  <style>
    ${BASE_CSS}
    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; position: relative; z-index: 1; }
    header { text-align: center; padding: 60px 0 32px; }
    header h1 { font-size: clamp(28px, 5vw, 44px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 12px; }
    header h1 span { color: var(--lime); }
    header p { color: var(--text-muted); font-size: 16px; max-width: 460px; margin: 0 auto; line-height: 1.6; }

    /* Progress Steps */
    .steps { display: flex; justify-content: center; gap: 0; margin: 32px 0; position: relative; }
    .step {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 16px; position: relative;
    }
    .step-num {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--glass); border: 2px solid var(--glass-border);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--mono); font-size: 13px; font-weight: 600;
      transition: all 0.3s; color: var(--text-muted);
    }
    .step.active .step-num { border-color: var(--lime); background: rgba(210,255,85,0.15); color: var(--lime); box-shadow: 0 0 12px rgba(210,255,85,0.3); }
    .step.completed .step-num { border-color: var(--lime); background: var(--lime); color: #050508; }
    .step-label { font-size: 13px; color: var(--text-muted); transition: color 0.3s; }
    .step.active .step-label { color: var(--text); }
    .step.completed .step-label { color: var(--lime); }
    .step-line {
      width: 40px; height: 2px; background: var(--glass-border);
      align-self: center; transition: background 0.3s;
    }
    .step-line.done { background: var(--lime); }

    /* Form Card */
    .form-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 16px; padding: 32px;
    }
    .form-step { display: none; animation: fadeIn 0.4s ease; }
    .form-step.active { display: block; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

    .field { margin-bottom: 20px; }
    .field label {
      display: block; font-size: 13px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--text-muted); margin-bottom: 8px;
    }
    .field input, .field select, .field textarea {
      width: 100%; padding: 14px 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      border-radius: 10px; color: var(--text);
      font-family: var(--sans); font-size: 15px;
      outline: none; transition: border-color 0.2s;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      border-color: var(--lime);
    }
    .field input::placeholder, .field textarea::placeholder { color: rgba(232,232,240,0.3); }
    .field textarea { resize: vertical; min-height: 100px; }
    .field select { cursor: pointer; }
    .field select option { background: var(--bg); color: var(--text); }
    .field-error { font-size: 12px; color: #ff4444; margin-top: 6px; display: none; }
    .field.error input, .field.error select, .field.error textarea {
      border-color: #ff4444;
    }
    .field.error .field-error { display: block; }

    /* Toggle switch */
    .toggle-field { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; }
    .toggle-field label { margin-bottom: 0; text-transform: none; font-size: 15px; color: var(--text); }
    .toggle {
      width: 48px; height: 26px; border-radius: 999px;
      background: var(--glass); border: 1px solid var(--glass-border);
      cursor: pointer; position: relative; transition: all 0.3s;
    }
    .toggle::after {
      content: ''; position: absolute; top: 3px; left: 3px;
      width: 18px; height: 18px; border-radius: 50%;
      background: var(--text-muted); transition: all 0.3s;
    }
    .toggle.checked { background: rgba(210,255,85,0.2); border-color: var(--lime); }
    .toggle.checked::after { transform: translateX(22px); background: var(--lime); }

    .btn-row { display: flex; gap: 12px; margin-top: 24px; }
    .btn-row button { flex: 1; }
    .btn-back {
      padding: 14px; border-radius: 10px;
      border: 1px solid var(--glass-border);
      background: var(--glass); color: var(--text);
      font-family: var(--sans); font-size: 15px; font-weight: 500;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-back:hover { border-color: rgba(255,255,255,0.3); }
    .btn-next {
      padding: 14px; border-radius: 10px;
      background: var(--lime); color: #050508;
      border: none; font-family: var(--sans);
      font-size: 15px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 0 16px rgba(210,255,85,0.3);
    }
    .btn-next:hover { box-shadow: 0 0 28px rgba(210,255,85,0.5); transform: translateY(-1px); }

    /* Success */
    .success-card {
      text-align: center; padding: 60px 32px;
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 16px; display: none; animation: fadeIn 0.5s ease;
    }
    .success-card.show { display: block; }
    .success-icon {
      width: 80px; height: 80px; border-radius: 50%;
      background: rgba(210,255,85,0.15); border: 2px solid var(--lime);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px; font-size: 36px;
      box-shadow: 0 0 40px rgba(210,255,85,0.2);
    }
    .success-title { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
    .success-desc { color: var(--text-muted); font-size: 16px; margin-bottom: 32px; }

    /* Confetti */
    .confetti { position: fixed; top: -10px; z-index: 200; pointer-events: none; }
    .confetti-piece {
      position: absolute; width: 8px; height: 8px;
      border-radius: 2px; opacity: 0;
      animation: confettiFall 2.5s ease forwards;
    }
    @keyframes confettiFall {
      0% { opacity: 1; transform: translateY(0) rotate(0deg); }
      100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
    }
  </style>
</head>
<body>
  ${STARFIELD_HTML}
  <div class="container">
    <header>
      <h1>${slots.formTitle.split(' ').map(function(w, i) { return i === 0 ? '<span>' + w + '</span>' : w; }).join(' ')}</h1>
      <p>${slots.formDescription}</p>
    </header>

    <div class="steps" id="steps">
      <div class="step active" data-step="0">
        <div class="step-num">1</div>
        <span class="step-label">${slots.step1Label}</span>
      </div>
      <div class="step-line"></div>
      <div class="step" data-step="1">
        <div class="step-num">2</div>
        <span class="step-label">${slots.step2Label}</span>
      </div>
      <div class="step-line"></div>
      <div class="step" data-step="2">
        <div class="step-num">3</div>
        <span class="step-label">${slots.step3Label}</span>
      </div>
    </div>

    <div class="form-card" id="formCard">
      <!-- Step 1 -->
      <div class="form-step active" data-step="0">
        <div class="field" id="f1">
          <label>${slots.field1Label}</label>
          <input type="text" id="field1" placeholder="${slots.field1Placeholder}" />
          <div class="field-error">This field is required</div>
        </div>
        <div class="field" id="f2">
          <label>${slots.field2Label}</label>
          <input type="text" id="field2" placeholder="${slots.field2Placeholder}" />
          <div class="field-error">This field is required</div>
        </div>
        <div class="btn-row">
          <button class="btn-next" onclick="nextStep()">Continue →</button>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="form-step" data-step="1">
        <div class="field" id="f3">
          <label>${slots.field3Label}</label>
          <input type="text" id="field3" placeholder="${slots.field3Placeholder}" />
          <div class="field-error">This field is required</div>
        </div>
        <div class="field" id="f4">
          <label>${slots.field4Label}</label>
          <select id="field4">
            <option value="">Select an option...</option>
            ${options.map(o => `<option value="${o}">${o}</option>`).join('\n            ')}
          </select>
          <div class="field-error">Please select an option</div>
        </div>
        <div class="btn-row">
          <button class="btn-back" onclick="prevStep()">← Back</button>
          <button class="btn-next" onclick="nextStep()">Continue →</button>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="form-step" data-step="2">
        <div class="field">
          <label>${slots.field5Label}</label>
          <textarea id="field5" placeholder="Tell us more..."></textarea>
        </div>
        <div class="toggle-field">
          <label>I agree to the terms</label>
          <div class="toggle" id="agreeToggle" onclick="this.classList.toggle('checked')"></div>
        </div>
        <div class="btn-row">
          <button class="btn-back" onclick="prevStep()">← Back</button>
          <button class="btn-next" onclick="submitForm()">${slots.submitText}</button>
        </div>
      </div>
    </div>

    <div class="success-card" id="successCard">
      <div class="success-icon">✓</div>
      <div class="success-title">Success!</div>
      <div class="success-desc">Your submission has been received. We'll be in touch soon.</div>
      <button class="btn-lime" onclick="resetForm()">Submit Another</button>
    </div>
  </div>

  <script>
    ${STARFIELD_JS}
    ${TOAST_JS}

    var currentStep = 0;

    function updateSteps() {
      var steps = document.querySelectorAll('.step');
      var lines = document.querySelectorAll('.step-line');
      steps.forEach(function(s, i) {
        s.classList.remove('active', 'completed');
        if (i < currentStep) s.classList.add('completed');
        if (i === currentStep) s.classList.add('active');
      });
      lines.forEach(function(l, i) {
        l.classList.toggle('done', i < currentStep);
      });
      document.querySelectorAll('.form-step').forEach(function(fs) {
        fs.classList.toggle('active', parseInt(fs.getAttribute('data-step')) === currentStep);
      });
    }

    function validateStep(step) {
      var valid = true;
      if (step === 0) {
        ['f1', 'f2'].forEach(function(id) {
          var field = document.getElementById(id);
          var input = field.querySelector('input');
          if (!input.value.trim()) { field.classList.add('error'); valid = false; }
          else { field.classList.remove('error'); }
        });
      }
      if (step === 1) {
        var f3 = document.getElementById('f3');
        var input3 = document.getElementById('field3');
        if (!input3.value.trim()) { f3.classList.add('error'); valid = false; }
        else { f3.classList.remove('error'); }
        var f4 = document.getElementById('f4');
        var select4 = document.getElementById('field4');
        if (!select4.value) { f4.classList.add('error'); valid = false; }
        else { f4.classList.remove('error'); }
      }
      if (!valid) showToast('Please fill in all required fields');
      return valid;
    }

    function nextStep() {
      if (!validateStep(currentStep)) return;
      currentStep++;
      updateSteps();
    }

    function prevStep() {
      currentStep--;
      updateSteps();
    }

    function submitForm() {
      var toggle = document.getElementById('agreeToggle');
      if (!toggle.classList.contains('checked')) {
        showToast('Please agree to the terms');
        return;
      }
      document.getElementById('formCard').style.display = 'none';
      document.getElementById('steps').style.display = 'none';
      var card = document.getElementById('successCard');
      card.classList.add('show');
      spawnConfetti();
      showToast('Submitted successfully!');
    }

    function resetForm() {
      var fields = document.querySelectorAll('input, select, textarea');
      fields.forEach(function(f) { f.value = ''; });
      document.querySelectorAll('.field').forEach(function(f) { f.classList.remove('error'); });
      document.getElementById('agreeToggle').classList.remove('checked');
      currentStep = 0;
      document.getElementById('formCard').style.display = '';
      document.getElementById('steps').style.display = '';
      document.getElementById('successCard').classList.remove('show');
      updateSteps();
    }

    function spawnConfetti() {
      var colors = ['#D2FF55', '#B750B2', '#e8e8f0', '#86baff', '#ff6b6b'];
      for (var i = 0; i < 40; i++) {
        var piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 0.8 + 's';
        piece.style.animationDuration = (2 + Math.random()) + 's';
        var wrap = document.createElement('div');
        wrap.className = 'confetti';
        wrap.appendChild(piece);
        document.body.appendChild(wrap);
        setTimeout(function(w) { w.remove(); }.bind(null, wrap), 3500);
      }
    }
  </script>
</body>
</html>`;

  return [
    { path: 'index.html', content: html },
    { path: 'README.md', content: `# ${slots.formTitle}\\n\\n${slots.formDescription}\\n\\n## Features\\n\\n- Multi-step form with progress indicator\\n- Real-time field validation\\n- Toggle switch, select dropdowns\\n- Success screen with confetti animation\\n\\n## How to Use\\n\\nOpen index.html in any browser.\\n\\nGenerated by Kawamura Agent.` },
  ];
}
