# KAWAMURA AGENT

An autonomous AI agent built for the **Seedstr Blind Hackathon**. It watches for mystery prompts, classifies them, generates a complete front-end project, packages it as a `.zip`, and submits — all without human intervention.

---

## How It Works

```
Watcher → Classifier → Brain → Builder → Packer → Submit
```

1. **Watcher** polls the Seedstr API every few seconds for a new job
2. **Classifier** matches the prompt against 9 templates using keyword scoring + LLM fallback
3. **Brain** either uses the template fast-path (~200ms) or full LLM generation
4. **Builder** writes the output files to `engine/runs/current/`
5. **Packer** zips the files with fflate (level 9)
6. **Submitter** uploads and responds to the job via Seedstr API v2

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript + Vite |
| Engine | Node.js + TypeScript (ESM) |
| LLM | OpenRouter → Claude Sonnet 4.5 (primary), GPT-4o (fallback) |
| Compression | fflate |
| Hackathon API | Seedstr API v2 |

---

## Templates (9)

| Slug | Triggers on |
|------|-------------|
| `landing-page` | landing, saas, startup, product, website |
| `portfolio` | portfolio, resume, cv, personal, developer |
| `dashboard` | dashboard, analytics, metrics, charts, kpi |
| `tool-app` | tool, calculator, converter, generator, utility |
| `ai-agent-profile` | agent, ai, bot, assistant, llm, chatbot |
| `ecommerce` | shop, store, buy, sell, marketplace, catalog |
| `blog` | blog, article, news, magazine, journal |
| `game` | game, quiz, trivia, challenge, puzzle |
| `form-builder` | form, registration, signup, survey, onboarding |

If no template matches (confidence < 0.5), the Brain falls back to full LLM generation.

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
WALLET_ADDRESS=0x...
WALLET_TYPE=ETH
```

### 3. Run

```bash
# Terminal 1 — start the engine (port 8787)
cd engine && npm start

# Terminal 2 — start the frontend (port 5173)
npm run dev
```

Open `http://localhost:5173` to see the Command Center dashboard.

---

## Command Center (UI)

Single-viewport 100vh dashboard showing:

- **Live Feed** — real-time SSE log stream from the engine
- **Recent Jobs** — every processed job with template badge, prompt preview, and submission status
- **Pipeline** — current stage highlighted across the 7-stage pipeline
- **Engine Stats** — model, jobs processed, last submission time
- **Inject** — manually send a test prompt via the modal (bypasses Seedstr watcher)

---

## Judging Criteria

| Criterion | How kawamura addresses it |
|-----------|--------------------------|
| **Functionality** (>5/10 gate) | 9 templates + full LLM fallback, validator with retry |
| **Design** | Design system with glassmorphism, animations, responsive CSS |
| **Speed** | Template fast-path ~200ms, 100ms first poll, fflate level 9 |
