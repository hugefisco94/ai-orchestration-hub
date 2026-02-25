# AI Orchestration Hub

**93-Model Swarm Command Center** — Military-grade AI orchestration dashboard coordinating 93 models across 15 agent frameworks with real-time swarm routing, multi-tier consensus, and GPU cloud integration.

## Overview

A single-page static dashboard that serves as the central command interface for a multi-model AI orchestration system. Features include:

- **93 AI Models** routed through OpenRouter wildcard via LiteLLM proxy
- **15 Agent Frameworks** for autonomous task execution and multi-agent coordination
- **3-Tier SwarmRouter** (Fast / Power / Deep) for latency-quality optimization
- **Project Sentinel** — OSINT-powered security monitoring and threat intelligence
- **Elice A100 GPU Cloud** running vLLM, AutoML, OCR, and research workloads

## Architecture

```
Application  →  SwarmRouter  →  LiteLLM Proxy  →  Providers  →  Model Exec
                (T1/T2/T3)      (93 Models)      (OpenRouter)   (GPU/Cloud)

Knowledge Graph  →  RAG Pipeline  →  Memory Layer  →  Agent Teams
(kg-gen/cognee)    (RAG-Anything)   (MemoryOS/ReMe)  (15 Frameworks)
```

### Model Tiers

| Tier | Latency | Use Case | Example Models |
|------|---------|----------|----------------|
| T1 — Fast | < 5s | Quick lookups, classification | Gemini Flash, Claude Haiku, Mistral Small |
| T2 — Power | 5-15s | Complex reasoning, code generation | GPT-4o, Claude Sonnet, DeepSeek-V3 |
| T3 — Deep | > 15s | Deep reasoning, research synthesis | Claude Opus, GPT-5, DeepSeek-R1 |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Swn94/ai-orchestration-hub.git
cd ai-orchestration-hub

# Serve locally (Python)
python3 -m http.server 8080

# Or with Node.js
npx serve .
```

Then open `http://localhost:8080` in your browser.

## Project Structure

```
ai-orchestration-hub/
├── index.html              # Main dashboard (HTML structure)
├── css/
│   └── style.css           # All styles (cyberpunk dark theme)
├── js/
│   ├── app.js              # Data loading & initialization
│   ├── components.js       # Safe DOM rendering (XSS-free)
│   └── particles.js        # Canvas particle animation
├── data/
│   ├── agents.json         # 15 agent framework definitions
│   ├── colors.json         # Theme color variables
│   ├── repos.json          # 60+ repository catalog
│   ├── sections.json       # Section text content
│   ├── taglines.json       # Rotating hero taglines
│   └── tiers.json          # Model tier definitions (T1/T2/T3)
├── .github/workflows/
│   └── static.yml          # GitHub Pages deployment
├── .gitignore
├── LICENSE                  # MIT License
└── README.md
```

## Data Files

| File | Description |
|------|-------------|
| `data/agents.json` | 15 agent frameworks with name, description, tag, color, and GitHub URL |
| `data/tiers.json` | 3-tier model classification with latency benchmarks |
| `data/repos.json` | 60+ repositories with language type and category |
| `data/sections.json` | Section titles and descriptions |
| `data/taglines.json` | Rotating hero subtitle taglines |
| `data/colors.json` | CSS custom property color definitions |

## Features

- **Responsive Design** — Mobile, tablet, and desktop breakpoints
- **Accessibility** — ARIA labels, skip links, keyboard navigation, `prefers-reduced-motion`
- **Search & Filter** — Real-time search for agents and repositories with category filtering
- **Animated Stats** — Counter animations on scroll using IntersectionObserver
- **Particle Background** — Optimized canvas animation with spatial grid partitioning
- **Section Animations** — Scroll-triggered entrance animations
- **Back to Top** — Floating button appears on scroll
- **Navigation** — Fixed header with smooth-scroll section links

## Deployment

The site is deployed via GitHub Pages using the workflow in `.github/workflows/static.yml`.

To deploy manually, push to the `master` branch and GitHub Actions will handle the rest.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'feat: add my feature'`)
4. Push to your branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built by [@Swn94](https://github.com/Swn94) with SwarmRouter + LiteLLM + OpenRouter
