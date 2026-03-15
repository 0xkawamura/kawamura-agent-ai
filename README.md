# Kawamura Agent

An autonomous AI agent built for the **Seedstr Blind Hackathon**. It watches for mystery prompts, classifies them, generates a complete web project, and submits — all automatically.

**Agent**: @0xkawamura · `cmmqt3dob0000omy299qak51j` · Base (ERC-8004) · Verified ✓

---

## How It Works

```
Watch → Classify → Generate → Build → Pack → Submit
```

1. **Watch** — Polls Seedstr API every few seconds for new mystery prompts
2. **Classify** — Matches the prompt against 9 templates using keyword scoring + LLM fallback
3. **Generate** — Template fast-path (~200ms) or full LLM generation (~10s)
4. **Build** — Writes self-contained HTML/CSS/JS files to disk
5. **Pack** — Compresses output into a ZIP using fflate (level 9)
6. **Submit** — Uploads and responds to the job via Seedstr API v2

---

## Templates (9)

| Template | Triggers on |
|----------|-------------|
| `landing-page` | landing, saas, startup, product, website, marketing |
| `portfolio` | portfolio, resume, cv, personal, developer, designer |
| `dashboard` | dashboard, analytics, metrics, charts, kpi, admin |
| `tool-app` | tool, calculator, converter, generator, utility |
| `ai-agent-profile` | agent, ai, bot, assistant, llm, chatbot |
| `ecommerce` | shop, store, buy, sell, marketplace, catalog |
| `blog` | blog, article, news, magazine, journal |
| `game` | game, quiz, trivia, challenge, puzzle |
| `form-builder` | form, registration, signup, survey, onboarding |

If no template matches (confidence < 0.5), the Brain falls back to full LLM generation.

Color-aware: mention a color in the prompt (e.g. "using blue") and the output applies it automatically.

---

## Performance

| Path | Time |
|------|------|
| Template fast-path | ~200ms |
| Full AI generation | ~10s |

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript + Vite |
| Engine | Node.js + TypeScript (ESM) |
| LLM | Claude Sonnet 4.5 (primary) · GPT-4o (fallback) via OpenRouter |
| Compression | fflate level 9 |
| Hackathon API | Seedstr API v2 |

---

## Setup

### 1. Install dependencies

```bash
# Frontend
npm install

# Engine
cd engine && npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your keys:

```env
OPENROUTER_API_KEY=sk-or-v1-...
SEEDSTR_API_KEY=mj_...
AGENT_ID=your-agent-id
WALLET_ADDRESS=0x...
WALLET_TYPE=ETH
```

### 3. Run

```bash
# Terminal 1 — engine (port 8787)
cd engine && npm start

# Terminal 2 — frontend (port 5173)
npm run dev
```

Open `http://localhost:5173` to see the Command Center dashboard.

---

## Command Center (UI)

Real-time dashboard built with React 19 + SSE:

- **Live Feed** — real-time log stream from the engine
- **Pipeline** — 8-stage progress tracker (watching → completed)
- **Recent Jobs** — every processed job with template badge, prompt preview, preview and download
- **Engine Stats** — model, jobs processed, last submission time
- **Input Prompt** — manually inject a test prompt with 9 template chips

---

## Judging Criteria

| Criterion | How Kawamura addresses it |
|-----------|--------------------------|
| **Functionality** | 9 templates + full LLM fallback, validator with auto-retry |
| **Design** | Glassmorphism design system, animations, fully responsive |
| **Speed** | Template fast-path ~200ms, fflate level 9 compression |
