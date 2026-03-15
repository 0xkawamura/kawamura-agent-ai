export const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050508;
    --bg2: #0a0a0f;
    --lime: #D2FF55;
    --purple: #B750B2;
    --glass: rgba(255,255,255,0.05);
    --glass-border: rgba(255,255,255,0.1);
    --text: #e8e8f0;
    --text-muted: rgba(232,232,240,0.5);
    --mono: 'JetBrains Mono', monospace;
    --sans: 'Plus Jakarta Sans', sans-serif;
    --radius: 12px;
    --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  html { scroll-behavior: smooth; }
  body { min-height: 100vh; background: var(--bg); color: var(--text); font-family: var(--sans); line-height: 1.6; overflow-x: hidden; }

  .glass {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: var(--radius);
  }

  .glass-strong {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border-radius: 16px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
  }

  .neon-lime { color: var(--lime); text-shadow: 0 0 12px rgba(210,255,85,0.6); }
  .neon-purple { color: var(--purple); text-shadow: 0 0 12px rgba(183,80,178,0.6); }

  .gradient-text {
    background: linear-gradient(135deg, var(--lime), var(--purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .btn-lime {
    background: var(--lime);
    color: #050508;
    border: none;
    padding: 12px 28px;
    border-radius: 8px;
    font-family: var(--sans);
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all var(--transition);
    box-shadow: 0 0 20px rgba(210,255,85,0.3);
    position: relative;
    overflow: hidden;
  }
  .btn-lime:hover { box-shadow: 0 0 32px rgba(210,255,85,0.5); transform: translateY(-2px); }
  .btn-lime:active { transform: translateY(0); }

  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--glass-border);
    padding: 12px 28px;
    border-radius: 8px;
    font-family: var(--sans);
    font-weight: 500;
    font-size: 15px;
    cursor: pointer;
    transition: all var(--transition);
    backdrop-filter: blur(8px);
  }
  .btn-outline:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }

  .card-hover {
    transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
  }
  .card-hover:hover {
    transform: translateY(-4px);
    border-color: rgba(210,255,85,0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(210,255,85,0.1);
  }

  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .scanlines {
    position: fixed; inset: 0; pointer-events: none; z-index: 100;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
  }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(210,255,85,0.2)} 50%{box-shadow:0 0 40px rgba(210,255,85,0.4)} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideInLeft { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes countUp { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }

  .float { animation: float 3s ease-in-out infinite; }

  /* Toast notification */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 1000;
    padding: 14px 24px; border-radius: 10px;
    background: rgba(210,255,85,0.12); border: 1px solid rgba(210,255,85,0.3);
    color: var(--lime); font-size: 14px; font-weight: 500;
    backdrop-filter: blur(16px);
    transform: translateY(100px); opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .toast.show { transform: translateY(0); opacity: 1; }

  /* Responsive utilities */
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
  }
  @media (min-width: 769px) {
    .hide-desktop { display: none !important; }
  }
`;

export const STARFIELD_JS = `
  (function() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, stars = [];

    function init() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      stars = Array.from({ length: 160 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        o: Math.random() * 0.6 + 0.1,
        s: Math.random() * 0.3 + 0.05,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = \`rgba(210,255,85,\${s.o})\`;
        ctx.fill();
        s.y += s.s;
        if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', init);
    init();
    draw();
  })();
`;

export const SCROLL_REVEAL_JS = `
  (function() {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
  })();
`;

export const ANIMATED_COUNTER_JS = `
  (function() {
    function animateCounters() {
      document.querySelectorAll('[data-count]').forEach(function(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1500;
        var start = 0;
        var startTime = null;
        function step(currentTime) {
          if (!startTime) startTime = currentTime;
          var progress = Math.min((currentTime - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    var counters = document.querySelector('[data-count]');
    if (counters) observer.observe(counters);
  })();
`;

export const TOAST_JS = `
  function showToast(msg, duration) {
    duration = duration || 3000;
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function() {
      toast.classList.add('show');
    });
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() { toast.remove(); }, 400);
    }, duration);
  }
`;

export const STARFIELD_HTML = `
  <canvas id="starfield" style="position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.6;"></canvas>
  <div class="scanlines"></div>
`;
