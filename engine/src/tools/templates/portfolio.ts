import type { BuildArtifactFile } from '../../types.js';
import { BASE_CSS, STARFIELD_HTML, STARFIELD_JS } from '../designSystem.js';

export interface PortfolioSlots {
  name: string;
  title: string;
  bio: string;
  skill1: string;
  skill2: string;
  skill3: string;
  skill4: string;
  project1Title: string;
  project1Desc: string;
  project2Title: string;
  project2Desc: string;
  project3Title: string;
  project3Desc: string;
  email: string;
}

export function generatePortfolio(slots: PortfolioSlots): BuildArtifactFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${slots.name} — Portfolio</title>
  <style>
    ${BASE_CSS}
    .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
    .hero {
      position: relative; z-index: 1;
      min-height: 100vh; display: flex; align-items: center;
      padding: 80px 0 60px;
    }
    .hero-flex { display: flex; align-items: center; gap: 60px; flex-wrap: wrap; }
    .avatar {
      width: 120px; height: 120px; border-radius: 50%;
      background: linear-gradient(135deg, var(--lime), var(--purple));
      display: flex; align-items: center; justify-content: center;
      font-size: 48px; font-weight: 700; color: #050508;
      flex-shrink: 0;
      box-shadow: 0 0 40px rgba(210,255,85,0.3);
    }
    .hero-text h1 { font-size: clamp(32px, 5vw, 56px); font-weight: 700; letter-spacing: -0.02em; }
    .hero-text h2 { font-size: 18px; color: var(--lime); font-weight: 500; margin: 8px 0 16px; }
    .hero-text p { color: var(--text-muted); font-size: 16px; line-height: 1.7; max-width: 480px; }
    section { position: relative; z-index: 1; padding: 80px 0; }
    .section-header { margin-bottom: 40px; }
    .section-header h2 { font-size: 28px; font-weight: 700; }
    .section-header h2 span { color: var(--lime); }
    .skills-grid {
      display: flex; flex-wrap: wrap; gap: 12px;
    }
    .skill-tag {
      padding: 8px 20px; border-radius: 999px;
      background: var(--glass); border: 1px solid var(--glass-border);
      font-size: 14px; font-weight: 500;
      transition: border-color 0.2s, color 0.2s;
    }
    .skill-tag:hover { border-color: var(--lime); color: var(--lime); }
    .projects-grid { display: grid; gap: 24px; }
    .project-card {
      padding: 28px;
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 16px; transition: border-color 0.3s, transform 0.3s;
    }
    .project-card:hover { border-color: rgba(183,80,178,0.4); transform: translateX(4px); }
    .project-card h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
    .project-card p { color: var(--text-muted); font-size: 15px; line-height: 1.65; }
    .project-tag {
      display: inline-block; margin-top: 12px;
      padding: 4px 12px; border-radius: 4px;
      background: rgba(183,80,178,0.12); border: 1px solid rgba(183,80,178,0.25);
      color: var(--purple); font-size: 12px; font-weight: 500;
    }
    .contact { text-align: center; padding: 80px 0; }
    .contact h2 { font-size: 36px; font-weight: 700; margin-bottom: 16px; }
    .contact p { color: var(--text-muted); margin-bottom: 32px; }
    .contact a {
      color: var(--lime); text-decoration: none;
      font-size: 18px; font-weight: 500;
      border-bottom: 1px solid rgba(210,255,85,0.3);
      padding-bottom: 2px; transition: border-color 0.2s;
    }
    .contact a:hover { border-color: var(--lime); }
  </style>
</head>
<body>
  ${STARFIELD_HTML}
  <div class="container">
    <section class="hero">
      <div class="hero-flex">
        <div class="avatar">${slots.name.charAt(0).toUpperCase()}</div>
        <div class="hero-text">
          <h1>${slots.name}</h1>
          <h2>${slots.title}</h2>
          <p>${slots.bio}</p>
        </div>
      </div>
    </section>

    <section>
      <div class="section-header"><h2>Skills <span>&amp;</span> Expertise</h2></div>
      <div class="skills-grid">
        <span class="skill-tag">${slots.skill1}</span>
        <span class="skill-tag">${slots.skill2}</span>
        <span class="skill-tag">${slots.skill3}</span>
        <span class="skill-tag">${slots.skill4}</span>
      </div>
    </section>

    <section>
      <div class="section-header"><h2>Featured <span>Projects</span></h2></div>
      <div class="projects-grid">
        <div class="project-card">
          <h3>${slots.project1Title}</h3>
          <p>${slots.project1Desc}</p>
          <span class="project-tag">Project</span>
        </div>
        <div class="project-card">
          <h3>${slots.project2Title}</h3>
          <p>${slots.project2Desc}</p>
          <span class="project-tag">Project</span>
        </div>
        <div class="project-card">
          <h3>${slots.project3Title}</h3>
          <p>${slots.project3Desc}</p>
          <span class="project-tag">Project</span>
        </div>
      </div>
    </section>

    <section class="contact" id="contact">
      <h2>Let's <em style="font-style:normal;color:var(--lime)">Connect</em></h2>
      <p>Open to opportunities and collaborations.</p>
      <a href="mailto:${slots.email}">${slots.email}</a>
    </section>
  </div>

  <script>${STARFIELD_JS}</script>
</body>
</html>`;

  return [
    { path: 'index.html', content: html },
    { path: 'README.md', content: `# ${slots.name} — Portfolio\n\n${slots.bio}\n\nGenerated by Kawamura Agent.` },
  ];
}
