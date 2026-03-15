import type { BuildArtifactFile } from '../../types.js';
import { BASE_CSS, STARFIELD_HTML, STARFIELD_JS, TOAST_JS } from '../designSystem.js';

export interface GameSlots {
  gameTitle: string;
  gameDescription: string;
  question1: string;
  answer1a: string;
  answer1b: string;
  answer1c: string;
  answer1correct: string;
  question2: string;
  answer2a: string;
  answer2b: string;
  answer2c: string;
  answer2correct: string;
  question3: string;
  answer3a: string;
  answer3b: string;
  answer3c: string;
  answer3correct: string;
}

export function generateGame(slots: GameSlots): BuildArtifactFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${slots.gameDescription}" />
  <title>${slots.gameTitle}</title>
  <style>
    ${BASE_CSS}
    .container { max-width: 700px; margin: 0 auto; padding: 40px 24px; position: relative; z-index: 1; }
    header { text-align: center; padding: 60px 0 40px; }
    header h1 { font-size: clamp(28px, 5vw, 48px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 12px; }
    header h1 span { color: var(--lime); }
    header p { color: var(--text-muted); font-size: 16px; max-width: 500px; margin: 0 auto; line-height: 1.6; }
    .game-info {
      display: flex; justify-content: center; gap: 24px; margin: 24px 0 40px;
    }
    .info-chip {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 999px;
      background: var(--glass); border: 1px solid var(--glass-border);
      font-size: 13px; color: var(--text-muted);
      font-family: var(--mono);
    }
    .info-chip .val { color: var(--lime); font-weight: 600; }
    .progress-bar {
      height: 4px; background: rgba(255,255,255,0.06);
      border-radius: 999px; margin-bottom: 32px; overflow: hidden;
    }
    .progress-fill {
      height: 100%; background: linear-gradient(90deg, var(--lime), var(--purple));
      border-radius: 999px; transition: width 0.5s ease;
    }
    .question-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 16px; padding: 32px; margin-bottom: 24px;
      animation: fadeIn 0.5s ease;
    }
    .question-num {
      font-family: var(--mono); font-size: 12px;
      color: var(--purple); margin-bottom: 12px; font-weight: 600;
    }
    .question-text {
      font-size: 20px; font-weight: 600; line-height: 1.4;
      margin-bottom: 24px;
    }
    .answers { display: grid; gap: 12px; }
    .answer-btn {
      width: 100%; text-align: left;
      padding: 16px 20px; border-radius: 12px;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      color: var(--text); font-family: var(--sans);
      font-size: 15px; cursor: pointer;
      transition: all 0.2s; display: flex; align-items: center; gap: 12px;
    }
    .answer-btn:hover:not(.selected):not(.correct):not(.wrong) {
      border-color: rgba(210,255,85,0.4); background: rgba(210,255,85,0.05);
    }
    .answer-btn .letter {
      width: 28px; height: 28px; border-radius: 8px;
      background: var(--glass); border: 1px solid var(--glass-border);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 600; flex-shrink: 0;
    }
    .answer-btn.correct {
      border-color: var(--lime); background: rgba(210,255,85,0.1);
    }
    .answer-btn.correct .letter { background: var(--lime); color: #050508; }
    .answer-btn.wrong {
      border-color: #ff4444; background: rgba(255,68,68,0.1);
    }
    .answer-btn.wrong .letter { background: #ff4444; color: white; }
    .result-card {
      text-align: center; padding: 48px 32px;
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 16px; animation: fadeIn 0.5s ease;
    }
    .result-emoji { font-size: 64px; margin-bottom: 20px; }
    .result-score {
      font-family: var(--mono); font-size: 48px; font-weight: 700;
      color: var(--lime); margin-bottom: 12px;
    }
    .result-label { font-size: 18px; color: var(--text-muted); margin-bottom: 32px; }
    .result-bars { max-width: 300px; margin: 0 auto 32px; }
    .result-bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .result-bar-label { font-size: 13px; color: var(--text-muted); width: 60px; }
    .result-bar-track { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; }
    .result-bar-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
    .result-bar-fill.green { background: var(--lime); }
    .result-bar-fill.red { background: #ff4444; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  </style>
</head>
<body>
  ${STARFIELD_HTML}
  <div class="container">
    <header>
      <h1>${slots.gameTitle.split(' ').map(function(w, i) { return i === 0 ? '<span>' + w + '</span>' : w; }).join(' ')}</h1>
      <p>${slots.gameDescription}</p>
      <div class="game-info">
        <div class="info-chip">⏱ <span class="val" id="timer">00:00</span></div>
        <div class="info-chip">🎯 Score: <span class="val" id="scoreDisplay">0</span>/3</div>
        <div class="info-chip">📋 Q: <span class="val" id="qNum">1</span>/3</div>
      </div>
    </header>
    <div class="progress-bar"><div class="progress-fill" id="progressBar" style="width:33%"></div></div>
    <div id="gameArea"></div>
  </div>

  <script>
    ${STARFIELD_JS}
    ${TOAST_JS}

    var questions = [
      { q: "${slots.question1.replace(/"/g, '\\"')}", answers: ["${slots.answer1a.replace(/"/g, '\\"')}", "${slots.answer1b.replace(/"/g, '\\"')}", "${slots.answer1c.replace(/"/g, '\\"')}"], correct: "${slots.answer1correct.replace(/"/g, '\\"')}" },
      { q: "${slots.question2.replace(/"/g, '\\"')}", answers: ["${slots.answer2a.replace(/"/g, '\\"')}", "${slots.answer2b.replace(/"/g, '\\"')}", "${slots.answer2c.replace(/"/g, '\\"')}"], correct: "${slots.answer2correct.replace(/"/g, '\\"')}" },
      { q: "${slots.question3.replace(/"/g, '\\"')}", answers: ["${slots.answer3a.replace(/"/g, '\\"')}", "${slots.answer3b.replace(/"/g, '\\"')}", "${slots.answer3c.replace(/"/g, '\\"')}"], correct: "${slots.answer3correct.replace(/"/g, '\\"')}" }
    ];

    var currentQ = 0;
    var score = 0;
    var answered = false;
    var seconds = 0;
    var timerInterval;

    function startTimer() {
      timerInterval = setInterval(function() {
        seconds++;
        var m = String(Math.floor(seconds / 60)).padStart(2, '0');
        var s = String(seconds % 60).padStart(2, '0');
        document.getElementById('timer').textContent = m + ':' + s;
      }, 1000);
    }

    function renderQuestion() {
      answered = false;
      var q = questions[currentQ];
      var letters = ['A', 'B', 'C'];
      document.getElementById('qNum').textContent = (currentQ + 1);
      document.getElementById('progressBar').style.width = ((currentQ + 1) / 3 * 100) + '%';

      var html = '<div class="question-card">' +
        '<div class="question-num">QUESTION ' + (currentQ + 1) + ' OF 3</div>' +
        '<div class="question-text">' + q.q + '</div>' +
        '<div class="answers">';
      q.answers.forEach(function(a, i) {
        html += '<button class="answer-btn" onclick="checkAnswer(this,\\'' + a.replace(/'/g, "\\\\'") + '\\')" data-answer="' + a + '">' +
          '<span class="letter">' + letters[i] + '</span>' + a + '</button>';
      });
      html += '</div></div>';
      document.getElementById('gameArea').innerHTML = html;
    }

    function checkAnswer(btn, selected) {
      if (answered) return;
      answered = true;
      var q = questions[currentQ];
      var buttons = document.querySelectorAll('.answer-btn');

      buttons.forEach(function(b) {
        if (b.getAttribute('data-answer') === q.correct) {
          b.classList.add('correct');
        } else if (b === btn && selected !== q.correct) {
          b.classList.add('wrong');
        }
      });

      if (selected === q.correct) {
        score++;
        document.getElementById('scoreDisplay').textContent = score;
        showToast('✅ Correct!');
      } else {
        showToast('❌ Wrong! Answer: ' + q.correct);
      }

      setTimeout(function() {
        currentQ++;
        if (currentQ < 3) {
          renderQuestion();
        } else {
          showResult();
        }
      }, 1500);
    }

    function showResult() {
      clearInterval(timerInterval);
      var pct = Math.round(score / 3 * 100);
      var emoji = score === 3 ? '🏆' : score >= 2 ? '🎉' : score >= 1 ? '👍' : '😢';
      var label = score === 3 ? 'Perfect Score!' : score >= 2 ? 'Great Job!' : score >= 1 ? 'Nice Try!' : 'Better Luck Next Time!';

      document.getElementById('gameArea').innerHTML =
        '<div class="result-card">' +
        '<div class="result-emoji">' + emoji + '</div>' +
        '<div class="result-score">' + score + '/3</div>' +
        '<div class="result-label">' + label + '</div>' +
        '<div class="result-bars">' +
        '<div class="result-bar-row"><span class="result-bar-label">Correct</span><div class="result-bar-track"><div class="result-bar-fill green" style="width:' + pct + '%"></div></div></div>' +
        '<div class="result-bar-row"><span class="result-bar-label">Wrong</span><div class="result-bar-track"><div class="result-bar-fill red" style="width:' + (100 - pct) + '%"></div></div></div>' +
        '</div>' +
        '<button class="btn-lime" onclick="restart()">Play Again</button>' +
        '</div>';
    }

    function restart() {
      currentQ = 0; score = 0; seconds = 0; answered = false;
      document.getElementById('scoreDisplay').textContent = '0';
      document.getElementById('timer').textContent = '00:00';
      startTimer();
      renderQuestion();
    }

    startTimer();
    renderQuestion();
  </script>
</body>
</html>`;

  return [
    { path: 'index.html', content: html },
    { path: 'README.md', content: `# ${slots.gameTitle}\\n\\n${slots.gameDescription}\\n\\n## Features\\n\\n- Interactive quiz with 3 questions\\n- Score tracking & timer\\n- Animated results screen\\n- Play again functionality\\n\\n## How to Use\\n\\nOpen index.html in any browser.\\n\\nGenerated by Kawamura Agent.` },
  ];
}
