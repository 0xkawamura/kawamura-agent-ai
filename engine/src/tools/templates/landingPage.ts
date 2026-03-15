import type { BuildArtifactFile } from '../../types.js';
import { BASE_CSS, STARFIELD_HTML, STARFIELD_JS } from '../designSystem.js';

export interface LandingPageSlots {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  ctaText: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  companyName: string;
}

export function generateLandingPage(slots: LandingPageSlots): BuildArtifactFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${slots.heroTitle} — ${slots.companyName}</title>
  <style>
    ${BASE_CSS}
    body { overflow-x: hidden; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 50;
      padding: 16px 24px;
      background: rgba(5,5,8,0.85);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--glass-border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo { font-weight: 700; font-size: 18px; color: var(--lime); letter-spacing: -0.02em; }
    .nav-links { display: flex; gap: 32px; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; transition: color 0.2s; }
    .nav-links a:hover { color: var(--text); }
    .hero {
      position: relative; z-index: 1;
      min-height: 100vh;
      display: flex; align-items: center;
      padding-top: 80px;
    }
    .hero-inner { text-align: center; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 16px; border-radius: 999px;
      border: 1px solid rgba(210,255,85,0.3);
      background: rgba(210,255,85,0.08);
      color: var(--lime); font-size: 13px; font-weight: 500;
      margin-bottom: 32px;
    }
    .hero-badge::before { content: '◉'; font-size: 8px; }
    h1 {
      font-size: clamp(40px, 6vw, 80px);
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin-bottom: 20px;
    }
    h1 em { font-style: normal; color: var(--lime); }
    .hero-sub {
      font-size: clamp(18px, 2.5vw, 22px);
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    .hero-desc {
      max-width: 600px; margin: 0 auto 40px;
      font-size: 16px; color: var(--text-muted); line-height: 1.7;
    }
    .cta-group { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .btn-secondary {
      padding: 12px 28px; border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: var(--glass); color: var(--text);
      font-size: 15px; font-weight: 500; cursor: pointer;
      font-family: var(--sans); transition: all 0.2s;
      backdrop-filter: blur(8px);
    }
    .btn-secondary:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); }
    .features {
      position: relative; z-index: 1;
      padding: 120px 0;
    }
    .section-label {
      text-align: center; font-size: 12px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.15em;
      color: var(--lime); margin-bottom: 16px;
    }
    .section-title {
      text-align: center;
      font-size: clamp(28px, 4vw, 48px);
      font-weight: 700; letter-spacing: -0.02em;
      margin-bottom: 64px;
    }
    .feature-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    .feature-card {
      padding: 32px;
      background: var(--glass);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      transition: border-color 0.3s, transform 0.3s;
    }
    .feature-card:hover { border-color: rgba(210,255,85,0.3); transform: translateY(-4px); }
    .feature-icon {
      width: 44px; height: 44px; border-radius: 10px;
      background: rgba(210,255,85,0.1);
      border: 1px solid rgba(210,255,85,0.2);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px; font-size: 20px;
    }
    .feature-card h3 { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
    .feature-card p { color: var(--text-muted); font-size: 15px; line-height: 1.65; }
    footer {
      position: relative; z-index: 1;
      text-align: center; padding: 48px 24px;
      border-top: 1px solid var(--glass-border);
      color: var(--text-muted); font-size: 14px;
    }
  </style>
</head>
<body>
  ${STARFIELD_HTML}
  <nav>
    <div class="logo">${slots.companyName}</div>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </div>
    <button class="btn-lime" style="padding:8px 20px;font-size:14px;">${slots.ctaText}</button>
  </nav>

  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-badge">${slots.companyName}</div>
      <h1>${slots.heroTitle.replace(/(\w+\s*$)/, '<em>$1</em>')}</h1>
      <p class="hero-sub">${slots.heroSubtitle}</p>
      <p class="hero-desc">${slots.heroDescription}</p>
      <div class="cta-group">
        <button class="btn-lime">${slots.ctaText}</button>
        <button class="btn-secondary">Learn more →</button>
      </div>
    </div>
  </section>

  <section class="features" id="features">
    <div class="container">
      <div class="section-label">Why choose us</div>
      <h2 class="section-title">Everything you need</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>${slots.feature1Title}</h3>
          <p>${slots.feature1Desc}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔮</div>
          <h3>${slots.feature2Title}</h3>
          <p>${slots.feature2Desc}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🛡</div>
          <h3>${slots.feature3Title}</h3>
          <p>${slots.feature3Desc}</p>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <p>© ${new Date().getFullYear()} ${slots.companyName}. Built with Kawamura Agent.</p>
  </footer>

  <script>${STARFIELD_JS}</script>
</body>
</html>`;

  return [
    { path: 'index.html', content: html },
    { path: 'README.md', content: `# ${slots.companyName}\n\n${slots.heroDescription}\n\nGenerated by Kawamura Agent.` },
  ];
}
