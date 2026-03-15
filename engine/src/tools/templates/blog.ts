import type { BuildArtifactFile } from '../../types.js';
import { BASE_CSS, STARFIELD_HTML, STARFIELD_JS, SCROLL_REVEAL_JS } from '../designSystem.js';

export interface BlogSlots {
  blogName: string;
  blogTagline: string;
  featured1Title: string;
  featured1Excerpt: string;
  featured1Author: string;
  featured2Title: string;
  featured2Excerpt: string;
  featured2Author: string;
  featured3Title: string;
  featured3Excerpt: string;
  featured3Author: string;
  category1: string;
  category2: string;
  category3: string;
}

export function generateBlog(slots: BlogSlots): BuildArtifactFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${slots.blogTagline} — ${slots.blogName}" />
  <title>${slots.blogName}</title>
  <style>
    ${BASE_CSS}
    .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 50;
      padding: 16px 24px; background: rgba(5,5,8,0.9);
      backdrop-filter: blur(20px); border-bottom: 1px solid var(--glass-border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo { font-weight: 700; font-size: 20px; color: var(--lime); letter-spacing: -0.02em; }
    .nav-links { display: flex; gap: 28px; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; transition: color 0.2s; }
    .nav-links a:hover { color: var(--text); }
    .toggle-wrap { display: flex; align-items: center; gap: 8px; }
    .theme-toggle {
      width: 44px; height: 24px; border-radius: 999px;
      background: var(--glass); border: 1px solid var(--glass-border);
      cursor: pointer; position: relative; transition: background 0.3s;
    }
    .theme-toggle::after {
      content: ''; position: absolute; top: 3px; left: 3px;
      width: 16px; height: 16px; border-radius: 50%;
      background: var(--lime); transition: transform 0.3s;
    }
    .theme-toggle.light::after { transform: translateX(20px); }
    .hero {
      position: relative; z-index: 1;
      padding: 140px 0 80px; text-align: center;
    }
    h1 {
      font-size: clamp(36px, 6vw, 64px); font-weight: 700;
      letter-spacing: -0.03em; margin-bottom: 16px; line-height: 1.1;
    }
    h1 em { font-style: normal; color: var(--lime); }
    .hero-sub { font-size: 18px; color: var(--text-muted); margin-bottom: 40px; }
    .search-box {
      max-width: 500px; margin: 0 auto; position: relative;
    }
    .search-box input {
      width: 100%; padding: 14px 48px 14px 20px;
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 12px; color: var(--text); font-family: var(--sans);
      font-size: 15px; outline: none; transition: border-color 0.2s;
    }
    .search-box input:focus { border-color: var(--lime); }
    .search-box input::placeholder { color: var(--text-muted); }
    .search-icon {
      position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
      color: var(--text-muted); font-size: 16px;
    }
    .tags { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 40px 0; position: relative; z-index: 1; }
    .tag {
      padding: 6px 16px; border-radius: 999px;
      background: var(--glass); border: 1px solid var(--glass-border);
      color: var(--text-muted); font-size: 13px; cursor: pointer;
      font-family: var(--sans); transition: all 0.2s;
    }
    .tag:hover, .tag.active { border-color: var(--lime); color: var(--lime); background: rgba(210,255,85,0.06); }
    .featured {
      position: relative; z-index: 1;
      margin-bottom: 48px;
    }
    .featured-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 16px; padding: 40px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
      align-items: center; transition: border-color 0.3s;
    }
    .featured-card:hover { border-color: rgba(210,255,85,0.3); }
    .featured-img {
      height: 280px; border-radius: 12px;
      background: linear-gradient(135deg, rgba(210,255,85,0.1), rgba(183,80,178,0.1));
      display: flex; align-items: center; justify-content: center;
      font-size: 64px;
    }
    .featured-label {
      font-size: 12px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--lime); margin-bottom: 12px;
    }
    .featured-title { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 12px; line-height: 1.2; }
    .featured-excerpt { color: var(--text-muted); font-size: 16px; line-height: 1.7; margin-bottom: 20px; }
    .featured-meta { display: flex; align-items: center; gap: 16px; }
    .featured-author { font-size: 14px; font-weight: 500; }
    .featured-date { font-size: 13px; color: var(--text-muted); font-family: var(--mono); }
    .reading-time { font-size: 12px; padding: 4px 10px; border-radius: 4px; background: rgba(183,80,178,0.12); color: var(--purple); }
    .articles { position: relative; z-index: 1; padding: 0 0 80px; }
    .section-label { text-align: center; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--lime); margin-bottom: 12px; }
    .section-title { text-align: center; font-size: clamp(24px, 4vw, 36px); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 40px; }
    .article-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .article-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 14px; overflow: hidden;
      transition: transform 0.3s, border-color 0.3s;
      cursor: pointer;
    }
    .article-card:hover { transform: translateY(-4px); border-color: rgba(210,255,85,0.3); }
    .article-thumb {
      height: 160px; background: linear-gradient(135deg, rgba(210,255,85,0.06), rgba(183,80,178,0.06));
      display: flex; align-items: center; justify-content: center;
      font-size: 36px; border-bottom: 1px solid var(--glass-border);
    }
    .article-body { padding: 20px; }
    .article-cat { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--purple); margin-bottom: 8px; }
    .article-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; line-height: 1.3; }
    .article-excerpt { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }
    .article-meta { display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: var(--text-muted); }
    footer { position: relative; z-index: 1; text-align: center; padding: 40px 24px; border-top: 1px solid var(--glass-border); color: var(--text-muted); font-size: 14px; }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .featured-card { grid-template-columns: 1fr; }
      .featured-img { height: 180px; }
    }
  </style>
</head>
<body>
  ${STARFIELD_HTML}
  <nav>
    <div class="logo">${slots.blogName}</div>
    <div class="nav-links">
      <a href="#articles">Articles</a>
      <a href="#">About</a>
    </div>
    <div class="toggle-wrap">
      <span style="font-size:13px;color:var(--text-muted)">☀</span>
      <div class="theme-toggle" id="themeToggle" onclick="toggleTheme()"></div>
      <span style="font-size:13px;color:var(--text-muted)">🌙</span>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <h1>${slots.blogName.split(' ').map(function(w, i) { return i === 0 ? '<em>' + w + '</em>' : w; }).join(' ')}</h1>
      <p class="hero-sub">${slots.blogTagline}</p>
      <div class="search-box">
        <input type="text" placeholder="Search articles..." id="searchInput" oninput="searchArticles(this.value)" />
        <span class="search-icon">🔍</span>
      </div>
    </div>
  </section>

  <div class="tags">
    <button class="tag active" onclick="filterTag(this,'all')">All</button>
    <button class="tag" onclick="filterTag(this,'${slots.category1}')">${slots.category1}</button>
    <button class="tag" onclick="filterTag(this,'${slots.category2}')">${slots.category2}</button>
    <button class="tag" onclick="filterTag(this,'${slots.category3}')">${slots.category3}</button>
  </div>

  <section class="featured">
    <div class="container">
      <div class="featured-card reveal">
        <div class="featured-img">📰</div>
        <div>
          <div class="featured-label">Featured Post</div>
          <div class="featured-title">${slots.featured1Title}</div>
          <div class="featured-excerpt">${slots.featured1Excerpt}</div>
          <div class="featured-meta">
            <span class="featured-author">${slots.featured1Author}</span>
            <span class="featured-date">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span class="reading-time">5 min read</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="articles" id="articles">
    <div class="container">
      <div class="section-label">Latest Posts</div>
      <div class="section-title">Recent Articles</div>
      <div class="article-grid" id="articleGrid">
        <div class="article-card reveal" data-tag="${slots.category1}" data-title="${slots.featured1Title.toLowerCase()}">
          <div class="article-thumb">📝</div>
          <div class="article-body">
            <div class="article-cat">${slots.category1}</div>
            <div class="article-title">${slots.featured1Title}</div>
            <div class="article-excerpt">${slots.featured1Excerpt}</div>
            <div class="article-meta">
              <span>${slots.featured1Author}</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>
        <div class="article-card reveal" data-tag="${slots.category2}" data-title="${slots.featured2Title.toLowerCase()}">
          <div class="article-thumb">💡</div>
          <div class="article-body">
            <div class="article-cat">${slots.category2}</div>
            <div class="article-title">${slots.featured2Title}</div>
            <div class="article-excerpt">${slots.featured2Excerpt}</div>
            <div class="article-meta">
              <span>${slots.featured2Author}</span>
              <span>4 min read</span>
            </div>
          </div>
        </div>
        <div class="article-card reveal" data-tag="${slots.category3}" data-title="${slots.featured3Title.toLowerCase()}">
          <div class="article-thumb">🔬</div>
          <div class="article-body">
            <div class="article-cat">${slots.category3}</div>
            <div class="article-title">${slots.featured3Title}</div>
            <div class="article-excerpt">${slots.featured3Excerpt}</div>
            <div class="article-meta">
              <span>${slots.featured3Author}</span>
              <span>6 min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <p>© ${new Date().getFullYear()} ${slots.blogName}. Built with Kawamura Agent.</p>
  </footer>

  <script>
    ${STARFIELD_JS}
    ${SCROLL_REVEAL_JS}

    function toggleTheme() {
      document.getElementById('themeToggle').classList.toggle('light');
    }

    function filterTag(btn, tag) {
      document.querySelectorAll('.tag').forEach(function(t) { t.classList.remove('active'); });
      btn.classList.add('active');
      document.querySelectorAll('.article-card').forEach(function(card) {
        if (tag === 'all' || card.getAttribute('data-tag') === tag) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function searchArticles(query) {
      var q = query.toLowerCase();
      document.querySelectorAll('.article-card').forEach(function(card) {
        var title = card.getAttribute('data-title') || '';
        card.style.display = title.includes(q) ? '' : 'none';
      });
    }
  </script>
</body>
</html>`;

  return [
    { path: 'index.html', content: html },
    { path: 'README.md', content: `# ${slots.blogName}\\n\\n${slots.blogTagline}\\n\\n## Features\\n\\n- Featured article hero section\\n- Article grid with category filtering\\n- Live search\\n- Dark/light mode toggle\\n- Responsive design\\n\\n## How to Use\\n\\nOpen index.html in any browser.\\n\\nGenerated by Kawamura Agent.` },
  ];
}
