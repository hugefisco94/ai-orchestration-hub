<p align="center">
  <img src="https://img.shields.io/badge/AI_Models-93-06b6d4?style=for-the-badge&logo=openai&logoColor=white" alt="93 AI Models"/>
  <img src="https://img.shields.io/badge/Agent_Frameworks-15-10b981?style=for-the-badge&logo=robot-framework&logoColor=white" alt="15 Agent Frameworks"/>
  <img src="https://img.shields.io/badge/Repositories-60+-8b5cf6?style=for-the-badge&logo=github&logoColor=white" alt="60+ Repositories"/>
  <img src="https://img.shields.io/badge/GPU-A100_80GB-f59e0b?style=for-the-badge&logo=nvidia&logoColor=white" alt="A100 80GB GPU"/>
</p>

<h1 align="center">
  <br/>
  <sub>&#x1F300;</sub>&nbsp; AI Orchestration Hub
  <br/>
  <sup><sub>93-Model Swarm Command Center</sub></sup>
</h1>

<p align="center">
  <em>Enterprise-grade AI orchestration platform coordinating 93 language models<br/>across 15 agent frameworks with real-time swarm routing and GPU cloud integration.</em>
</p>

<p align="center">
  <a href="https://swn94.github.io/ai-orchestration-hub"><img src="https://img.shields.io/badge/Live_Dashboard-Visit-06b6d4?style=flat-square&logo=github-pages&logoColor=white" alt="Live Dashboard"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-10b981?style=flat-square" alt="MIT License"/></a>
  <a href="https://github.com/Swn94/ai-orchestration-hub/actions"><img src="https://img.shields.io/github/actions/workflow/status/Swn94/ai-orchestration-hub/static.yml?style=flat-square&label=Deploy&logo=github-actions&logoColor=white" alt="Deploy Status"/></a>
  <img src="https://img.shields.io/badge/HTML5-Static_Site-e34f26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
</p>

<p align="center">
  <a href="#architecture">Architecture</a> &bull;
  <a href="#model-swarm-tiers">Model Tiers</a> &bull;
  <a href="#agent-framework-catalog">Agents</a> &bull;
  <a href="#project-sentinel">Sentinel</a> &bull;
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#deployment">Deployment</a>
</p>

---

## Overview

The **AI Orchestration Hub** serves as a unified command center for managing and coordinating a large-scale multi-model AI infrastructure. It provides real-time visibility into model routing, agent orchestration, security monitoring, and GPU cloud operations through an elegant single-page dashboard deployed via GitHub Pages.

### Key Capabilities

| Capability | Description |
|:---|:---|
| **SwarmRouter** | Intelligent prompt classification and dispatch across three performance tiers |
| **LiteLLM Proxy** | Unified API gateway normalizing access to 93 models from multiple providers |
| **OpenRouter Wildcard** | Dynamic model resolution via `openrouter/*` namespace with automatic failover |
| **Agent Orchestration** | 15 specialized frameworks for autonomous task execution and multi-agent coordination |
| **Project Sentinel** | OSINT-powered threat intelligence and continuous security monitoring |
| **Elice GPU Cloud** | NVIDIA A100 80GB cluster running vLLM, AutoML, OCR, and research workloads |

---

## Architecture

The system employs a layered architecture with intelligent routing at its core. Incoming requests are classified by complexity and dispatched to the optimal execution tier, while a parallel knowledge and memory pipeline enriches agent capabilities.

### Request Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ORCHESTRATION LAYER                                │
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌────────────┐  │
│   │ Application  │───▶│ SwarmRouter │───▶│  LiteLLM    │───▶│ Providers  │  │
│   │ Claude Code  │    │ T1/T2/T3    │    │  Proxy      │    │ OpenRouter │  │
│   │ REST API     │    │ Classifier  │    │  93 Models  │    │ Direct API │  │
│   └─────────────┘    └─────────────┘    └─────────────┘    └─────┬──────┘  │
│                                                                   │         │
│                                                          ┌────────▼───────┐ │
│                                                          │ Model Execution│ │
│                                                          │ GPU / Cloud    │ │
│                                                          └────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       KNOWLEDGE & AGENT LAYER                               │
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌────────────┐  │
│   │ Knowledge   │───▶│    RAG      │───▶│   Memory    │───▶│   Agent    │  │
│   │ Graph       │    │  Pipeline   │    │   Layer     │    │   Teams    │  │
│   │ kg-gen      │    │ RAG-Anything│    │ MemoryOS    │    │ 15 Frmwks  │  │
│   │ cognee      │    │             │    │ ReMe        │    │            │  │
│   └─────────────┘    └─────────────┘    └─────────────┘    └────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Model Swarm Tiers

The SwarmRouter classifies incoming prompts by complexity and routes them to the appropriate performance tier, optimizing the latency-quality tradeoff automatically.

| Tier | Latency | Strategy | Representative Models |
|:-----|:--------|:---------|:----------------------|
| **T1 — Fast** | < 5 s | Low-latency routing for classification and lightweight generation | Gemini Flash, Qwen 3 Coder, Claude 4.5 Haiku, Mistral Small |
| **T2 — Power** | 5–15 s | Balanced execution for complex reasoning and code generation | DeepSeek-V3, GPT-4o, Claude Sonnet 4.6, Gemini 3 Pro |
| **T3 — Deep** | > 15 s | Maximum capability for research synthesis and architectural decisions | Claude Opus 4.6, GPT-5, DeepSeek-R1, Grok 4 |

---

## Agent Framework Catalog

Fifteen specialized agent frameworks, each addressing a distinct domain of autonomous AI operation.

| Framework | Domain | Description |
|:----------|:-------|:------------|
| **claude-flow** | Orchestration | Enterprise multi-agent orchestration with workflow definition and inter-agent communication |
| **agent-lightning** | Optimization | Microsoft agent optimization framework for response quality and token efficiency |
| **gru** | Autonomous | Persistent long-term memory agent with self-directed task execution |
| **strix** | Framework | Lightweight AI agent framework with tool server integration and CLI wrapper |
| **allama** | LLM Agent | LLM agent framework with FastAPI backend, MCP bridge, and 9-tool integration |
| **CrewAI** | Multi-Agent | Collaborative task execution with role-based agent teams |
| **MemoryOS** | Memory | Operating system for agent memory with ChromaDB, MCP server, and playground |
| **ReMe** | Memory | Task, personal, and tool memory MCP server by Alibaba |
| **guardian-cli** | Security | LangGraph-powered security agent for automated vulnerability assessment |
| **kg-gen** | Knowledge | Automated knowledge graph generation with NetworkX and JSON-LD output |
| **storm** | Research | Stanford knowledge synthesis engine for research-grade content generation |
| **cognee** | Knowledge | Cognitive knowledge management with graph-based reasoning and retrieval |
| **RAG-Anything** | RAG | Universal RAG framework supporting any document type with hybrid retrieval |
| **supermemory** | Memory | Advanced memory management for persistent agent context and recall |
| **Auto-Claude** | Automation | Automated Claude agent orchestration with self-improving task pipelines |

---

## Project Sentinel

**Project Sentinel** is an OSINT-powered security monitoring and threat intelligence platform integrated with `guardian-cli`. It provides six operational modules:

| Module | Function |
|:-------|:---------|
| OSINT Intelligence | Real-time open-source intelligence gathering with automated threat feed aggregation |
| Vulnerability Scanner | Continuous security assessment with automated CVE tracking and patch monitoring |
| Network Monitor | Passive network reconnaissance and anomaly detection via worldmonitor |
| Threat Analytics | ML-powered threat scoring, pattern recognition, and predictive risk analysis |
| Incident Response | Automated incident triage with GHunt, Scrapling, and firecrawl integration |
| Compliance Audit | Automated checking against OWASP Top 10 and CIS benchmarks |

---

## Elice GPU Cloud

| Specification | Value |
|:--------------|:------|
| **GPU** | NVIDIA A100 80GB PCIe |
| **CUDA** | 12.2 |
| **MIG Slice** | 20GB Partition |
| **Disk** | 128GB SSD |
| **OS** | Ubuntu Linux |
| **Python** | 3.10.12 |

**Active Services:** vLLM v0.15.1 (Qwen2.5-3B-Instruct), LiteLLM Proxy (93 Models), surya-ocr v0.17.1, pix2text v1.1.6, AutoGluon v1.5.0, RD-Agent, UltraRAG, DeepEval

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Swn94/ai-orchestration-hub.git
cd ai-orchestration-hub

# Serve locally with Python
python3 -m http.server 8080

# Alternatively, serve with Node.js
npx serve .
```

Open `http://localhost:8080` in your browser to view the dashboard.

> **Note:** A local HTTP server is required because the dashboard loads JSON data files via `fetch()`. Opening `index.html` directly from the filesystem will fail due to CORS restrictions.

---

## Project Structure

```
ai-orchestration-hub/
├── index.html                  # Main dashboard — single-page application
├── css/
│   └── style.css               # Design system — cyberpunk dark theme
├── js/
│   ├── app.js                  # Data loading & initialization controller
│   ├── components.js           # Safe DOM rendering (XSS-free, no innerHTML)
│   └── particles.js            # Canvas particle network animation
├── data/
│   ├── agents.json             # 15 agent framework definitions
│   ├── colors.json             # Theme color palette
│   ├── repos.json              # 60+ repository catalog with categories
│   ├── sections.json           # Section text content
│   ├── taglines.json           # Rotating hero taglines
│   └── tiers.json              # Model tier definitions (T1 / T2 / T3)
├── .github/
│   └── workflows/
│       └── static.yml          # CI: JSON validation + GitHub Pages deploy
├── .gitignore
├── LICENSE                     # MIT License
└── README.md
```

---

## Features

- **Responsive Design** — Fluid layouts optimized for mobile, tablet, and desktop
- **Accessibility** — Full ARIA labeling, skip navigation, keyboard traversal, `prefers-reduced-motion` support
- **Real-Time Search** — Instant filtering across agent frameworks and repositories
- **Category Filtering** — One-click repository filtering by domain category
- **Animated Counters** — Scroll-triggered numerical animations via IntersectionObserver
- **Particle Network** — GPU-optimized canvas animation with spatial grid partitioning
- **Section Transitions** — Smooth scroll-triggered entrance animations
- **Active Navigation** — Fixed header with scroll-aware section highlighting

---

## Deployment

The dashboard is deployed automatically to GitHub Pages via the CI workflow defined in `.github/workflows/static.yml`.

**Pipeline stages:**

1. **Validate** — All JSON data files are parsed and verified for structural integrity
2. **Deploy** — Static assets are uploaded and published to GitHub Pages

To trigger a deployment, push to the `master` branch or run the workflow manually from the Actions tab.

**Live URL:** [https://swn94.github.io/ai-orchestration-hub](https://swn94.github.io/ai-orchestration-hub)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

All contributions are welcome. Please ensure that JSON data files remain valid and that the dashboard renders without console errors.

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for the full text.

---

<p align="center">
  <sub>Built with precision by <a href="https://github.com/Swn94">@Swn94</a></sub><br/>
  <sub>Powered by SwarmRouter &bull; LiteLLM &bull; OpenRouter &bull; Elice A100 GPU Cloud</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/SwarmRouter-Routing-06b6d4?style=flat-square" alt="SwarmRouter"/>
  <img src="https://img.shields.io/badge/LiteLLM-Proxy-10b981?style=flat-square" alt="LiteLLM"/>
  <img src="https://img.shields.io/badge/OpenRouter-Wildcard-8b5cf6?style=flat-square" alt="OpenRouter"/>
  <img src="https://img.shields.io/badge/Elice-A100_GPU-f59e0b?style=flat-square" alt="Elice GPU"/>
</p>
