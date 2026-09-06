# 🌐 YahiaRoute — Next-Gen Multi-Model AI Orchestrator & Gateway

<div align="center">

**Unify, route, and orchestrate 350+ AI providers. Run single models or make multiple frontier models collaborate together on the exact same task.**

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![Repository](https://img.shields.io/badge/GitHub-ypibsvanderdev%2Fyahiaroute-8B5CF6.svg)](https://github.com/ypibsvanderdev/yahiaroute)
[![Theme](https://img.shields.io/badge/Theme-Cyber--Obsidian%20Aurora-00F2FE.svg)](#theme)

</div>

---

## 🚀 Key Highlights of YahiaRoute

### 1. 🤝 Collaborative Multi-Model Intelligence Studio
YahiaRoute introduces the dedicated **Multi-Model Studio** (`/dashboard/multimodel`), allowing you to break beyond single-model limitations:
- **Solo Mode (1 Model)**: Direct, ultra-fast streaming execution with any selected provider or model (Claude 3.7, GPT-4o, Gemini 2.0 Pro, DeepSeek V3/R1, Groq, Ollama, etc.).
- **Consensus Synthesis (Work Together)**: Dispatch a task to multiple selected frontier models simultaneously. A master synthesizer model reconciles all outputs, resolves disagreements, and merges their unique insights into a definitive master solution.
- **Sequential Pipeline (Chain Handoff)**: Chain models in specialized stages:
  - **Stage 1 (Architect)**: System design and specification (e.g. Claude 3.7 Sonnet).
  - **Stage 2 (Implementer)**: Code and deep implementation (e.g. DeepSeek V3).
  - **Stage 3 (Auditor)**: Security, edge-cases, and polish (e.g. Qwen 2.5 Coder / GPT-4o).
- **AI Debate & Critique**: Models take turns proposing, challenging, and refining hypotheses across iterative rounds.
- **Side-by-Side Arena**: Run identical prompts across selected models concurrently to compare latency, tokens per second, and answer fidelity in real time.

### 2. 🎨 Cyber-Obsidian Aurora Visual Theme
- Redesigned visual identity featuring vibrant **Electric Cyan** (`#06B6D4`), **Aurora Violet** (`#8B5CF6`), and **Quantum Emerald** (`#10B981`).
- Deep obsidian dark mode (`#070A13`) with luminous frosted cards, subtle gradient borders, and responsive graph-paper grids.
- Custom SVG **YahiaRouteLogo** neural constellation icon.

### 3. ⚡ Universal Gateway & Fallback
- One OpenAI-compatible endpoint (`/v1/chat/completions`) connecting to 350+ providers.
- Works with Cursor, Claude Code, Cline, Codex, VS Code Copilot, and custom scripts.
- Quota-aware automatic fallbacks, token compression, and routing cascades.

---

## 🛠️ Quickstart

```bash
# 1. Clone your YahiaRoute repository
git clone https://github.com/ypibsvanderdev/yahiaroute.git
cd yahiaroute

# 2. Install dependencies
npm install

# 3. Launch YahiaRoute development server
npm run dev
```

Open [http://localhost:20128](http://localhost:20128) in your browser.
Navigate to **Multi-Model Studio** (`/dashboard/multimodel`) to start running collaborative multi-model workflows!

---

## 👥 Preset Model Teams

| Team Preset | Included Models | Best For |
|---|---|---|
| **The Titan Trinity** | Claude 3.7 Sonnet + GPT-4o + Gemini 2.0 Pro | Comprehensive multi-perspective synthesis |
| **Elite Code Architects** | Claude 3.7 + DeepSeek V3 + Qwen 2.5 Coder | Full-stack software architecture & auditing |
| **Deep Reasoning & Logic** | DeepSeek R1 + Claude 3.7 + GPT-4o | Mathematical proofs & hard reasoning |
| **Speed & Free Tier** | Gemini 2.0 Flash + Groq Llama 3.3 70B | High-throughput, zero-cost parallel processing |

---

## 📄 License
MIT © Yahia & Contributors
