<p align="center">
  <img src="assets/favicon.svg" alt="AGI Rating" width="80" />
</p>

<h1 align="center">AGI Rating</h1>

<p align="center">
  <strong>Unified LLM Model Ratings &amp; Benchmarks</strong>
  <br />
  300+ models • 8 rating sources • One place to compare them all
</p>

<p align="center">
  <a href="https://agi-rating.bossincrypto.dev/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-6366f1?style=for-the-badge&logo=github&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/BOSSincrypto/agi-rating">
    <img src="https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" />
  </a>
  <a href="https://github.com/BOSSincrypto/agi-rating/actions">
    <img src="https://img.shields.io/badge/Auto%20Deploy-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
  </a>
</p>

<p align="center">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/BOSSincrypto/agi-rating?color=6366f1&style=flat-square">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/BOSSincrypto/agi-rating?color=6366f1&style=flat-square">
  <img alt="Site" src="https://img.shields.io/website?color=22c55e&down_color=ef4444&down_message=offline&style=flat-square&up_message=online&url=https%3A%2F%2Fagi-rating.bossincrypto.dev">
</p>

---

## 🚀 Overview

**AGI Rating** is a web application that aggregates LLM model ratings from multiple authoritative sources into one unified, filterable, and analytically rich interface. It provides a comprehensive view of the AI landscape, allowing you to compare models across different benchmarks, pricing tiers, and performance metrics.

### ✨ Features

- **🔍 Unified Rankings** — Sortable table with 30+ top LLMs from all major providers
- **📊 Multi-Source Data** — Aggregated from **8 authoritative rating platforms**
- **🏆 Category Leaders** — Top models by: Overall, Reasoning, Coding, Agentic, Speed, Price, Context, Open Source & more
- **📈 Analytics** — Interactive charts: Top 10 Intelligence, Price vs Performance, Provider Distribution, Context vs Speed
- **🎯 Smart Filters** — Filter by provider, category, license type, or search by name
- **🌓 Dark & Light Theme** — Auto-detects system preference, toggleable via keyboard (`T`)
- **⌨️ Keyboard Shortcuts** — Press `/` to search, `T` to toggle theme, `Esc` to close modals
- **📱 Fully Responsive** — Works perfectly on desktop, tablet, and mobile
- **⚡ Blazing Fast** — Zero framework overhead, static SPA, instant load

### 📊 Data Sources

| Source | Description |
|--------|-------------|
| [Artificial Analysis](https://artificialanalysis.ai/leaderboards/models) | Intelligence scores, speed & pricing for 250+ models |
| [LLM Stats](https://llm-stats.com/) | Composite scores, reasoning, coding, agent benchmarks (334 models) |
| [Vellum](https://www.vellum.ai/llm-leaderboard) | HLE, GPQA, SWE-Bench, AutoBench, OSWorld, BrowseComp |
| [Chatbot Arena (LMSYS)](https://openlm.ai/chatbot-arena/) | Elo ratings from 5M+ human preference battles |
| [LiveBench](https://livebench.ai/) | Contamination-free objective benchmarks (23 tasks) |
| [WhatLLM](https://whatllm.org/blog/best-models) | Category-based rankings (coding, open source, local, budget) |
| [HuggingFace](https://huggingface.co/spaces/ArtificialAnalysis/LLM-Performance-Leaderboard) | Open LLM performance leaderboard |
| [OpenCompass](https://github.com/open-compass/opencompass) | Comprehensive open-source LLM evaluation |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure |
| **CSS3** | Custom properties for theming, responsive grid, animations |
| **Vanilla JavaScript** | Core application logic, data layer, filtering & sorting |
| **Chart.js** | Interactive data visualizations (bar, scatter, doughnut) |
| **GitHub Pages** | Static hosting with custom domain |
| **GitHub Actions** | Automatic deployment on every push |

**Zero build tools, zero dependencies.** Maximal efficiency, minimal overhead.

---

## 🚦 Getting Started

```bash
# Clone the repository
git clone https://github.com/BOSSincrypto/agi-rating.git

# Navigate to the project
cd agi-rating

# Serve locally (using any static file server)
npx serve .

# Open http://localhost:3000 in your browser
```

---

## 🏗️ Project Structure

```
agi-rating/
├── index.html               # Main SPA entry point
├── CNAME                    # Custom domain config
├── css/
│   └── style.css            # All styles (theming, responsive, animations)
├── js/
│   ├── data.js              # Consolidated LLM data from 8 sources
│   ├── app.js               # Main application logic
│   ├── charts.js            # Chart configurations (Chart.js)
│   └── utils.js             # Helper functions
├── assets/
│   └── favicon.svg          # AGI Rating icon
└── .github/
    └── workflows/
        └── deploy.yml       # Auto-deploy to GitHub Pages
```

---

## 🤝 Contributing

Contributions are welcome! If you have updated benchmark data or want to add new features:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is for educational and informational purposes. Data sourced from publicly available benchmark platforms.

---

<p align="center">
  Made with ⚡ by <a href="https://github.com/BOSSincrypto">@BOSSincrypto</a>
  <br />
  <sub>Data current as of July 24, 2026 — updated weekly</sub>
</p>
