// AGI Rating - Consolidated LLM Data from Multiple Sources
// Data current as of: 2026-07-24
// Sources: Artificial Analysis, LLM Stats, Vellum, Chatbot Arena, LiveBench, WhatLLM, HuggingFace, OpenCompass

const PROVIDERS = {
  anthropic: { name: 'Anthropic', color: '#d97706', logo: 'A' },
  openai: { name: 'OpenAI', color: '#10a37f', logo: 'O' },
  google: { name: 'Google', color: '#4285f4', logo: 'G' },
  meta: { name: 'Meta', color: '#0668e1', logo: 'M' },
  xai: { name: 'xAI', color: '#1d9bf0', logo: 'X' },
  deepseek: { name: 'DeepSeek', color: '#0066ff', logo: 'D' },
  alibaba: { name: 'Alibaba/Qwen', color: '#ff6a00', logo: 'Q' },
  moonshot: { name: 'Moonshot AI', color: '#8b5cf6', logo: 'K' },
  zhipu: { name: 'Zhipu AI', color: '#ef4444', logo: 'Z' },
  bytedance: { name: 'ByteDance', color: '#000000', logo: 'B' },
  mistral: { name: 'Mistral AI', color: '#f97316', logo: 'Mi' },
  nvidia: { name: 'NVIDIA', color: '#76b900', logo: 'N' },
  amazon: { name: 'Amazon', color: '#ff9900', logo: 'Am' },
  apple: { name: 'Apple', color: '#555555', logo: 'Ap' },
  minimax: { name: 'MiniMax', color: '#6366f1', logo: 'MM' },
  stepfun: { name: 'StepFun', color: '#14b8a6', logo: 'SF' },
  inflection: { name: 'Inflection', color: '#ec4899', logo: 'I' },
  cohere: { name: 'Cohere', color: '#39d353', logo: 'C' },
};

const CATEGORIES = {
  overall: 'Overall Best',
  reasoning: 'Reasoning',
  coding: 'Coding',
  math: 'Math',
  agentic: 'Agentic',
  vision: 'Vision & Multimodal',
  speed: 'Speed',
  price: 'Budget-Friendly',
  context: 'Long Context',
  openSource: 'Open Source',
  local: 'Local / Self-Hosted',
  safety: 'Safety & Alignment',
};

const SOURCES = {
  artificialAnalysis: { name: 'Artificial Analysis', url: 'https://artificialanalysis.ai/leaderboards/models', icon: '📊' },
  llmStats: { name: 'LLM Stats', url: 'https://llm-stats.com/', icon: '📈' },
  vellum: { name: 'Vellum', url: 'https://www.vellum.ai/llm-leaderboard', icon: '🔬' },
  chatbotArena: { name: 'Chatbot Arena (LMSYS)', url: 'https://openlm.ai/chatbot-arena/', icon: '⚔️' },
  livebench: { name: 'LiveBench', url: 'https://livebench.ai/', icon: '🧪' },
  whatllm: { name: 'WhatLLM', url: 'https://whatllm.org/blog/best-models', icon: '🎯' },
  huggingface: { name: 'HuggingFace', url: 'https://huggingface.co/spaces/ArtificialAnalysis/LLM-Performance-Leaderboard', icon: '🤗' },
  opencompass: { name: 'OpenCompass', url: 'https://github.com/open-compass/opencompass', icon: '🧭' },
};

const MODELS = [
  // === ANTHROPIC ===
  {
    id: 'claude-fable-5',
    name: 'Claude Fable 5',
    provider: 'anthropic',
    version: '5',
    releaseDate: '2026-06-01',
    contextWindow: 1000000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 10, output: 50 },
    scores: {
      artificialAnalysis: { intelligence: 60, speed: 91 },
      llmStats: { composite: 56.7, reasoning: 54.3, coding: 47.2, agent: 43.6 },
      vellum: { hle: 57.9, gpqa: null, swebench: 95, autobench: 17.4, osworld: 85, browsecomp: 88, terminal: 84.3 },
      chatbotArena: { elo: 1570 },
    },
    categories: ['overall', 'reasoning', 'coding', 'agentic', 'vision'],
    highlights: ['Best Computer Use (OSWorld 85%)', 'Top-3 Overall'],
  },
  {
    id: 'claude-opus-4-8',
    name: 'Claude Opus 4.8',
    provider: 'anthropic',
    version: '4.8',
    releaseDate: '2026-05-15',
    contextWindow: 1000000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 5, output: 25 },
    scores: {
      artificialAnalysis: { intelligence: 56, speed: 79 },
      llmStats: { composite: 52.5, reasoning: 52, coding: 43.4, agent: 37.8 },
      vellum: { hle: 57.9, gpqa: 94.2, swebench: 88.6, autobench: 15.5, osworld: 83.4, browsecomp: null, terminal: null },
      chatbotArena: { elo: 1580 },
    },
    categories: ['overall', 'reasoning', 'coding', 'agentic'],
    highlights: ['#1 Chatbot Arena', 'Best Overall (HLE)'],
  },
  {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'anthropic',
    version: '5',
    releaseDate: '2026-06-01',
    contextWindow: 1000000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 3, output: 15 },
    scores: {
      artificialAnalysis: { intelligence: 53, speed: 160 },
      llmStats: { composite: 50.9, reasoning: 50.3, coding: 39.5, agent: 35.2 },
      vellum: { hle: 57.4, gpqa: 96.2, swebench: null, autobench: 13.5, osworld: 81.2, browsecomp: null, terminal: null },
      chatbotArena: { elo: 1555 },
    },
    categories: ['reasoning', 'coding', 'price'],
    highlights: ['#1 GPQA Diamond (96.2%)', 'Best Reasoning'],
  },
  {
    id: 'claude-mythos-5',
    name: 'Claude Mythos 5',
    provider: 'anthropic',
    version: '5',
    releaseDate: '2026-07-01',
    contextWindow: 1000000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 10, output: 50 },
    scores: {
      llmStats: { composite: 56.4, reasoning: 56.9, coding: 46.6, agent: 38.6 },
      vellum: { hle: 64.5, gpqa: null, swebench: 95.5, autobench: null, osworld: null, browsecomp: null, terminal: 88 },
      chatbotArena: { elo: 1575 },
    },
    categories: ['overall', 'reasoning', 'coding'],
    highlights: ['#1 HLE (64.5%)', 'Best Overall Reasoning'],
  },
  {
    id: 'claude-opus-4-6',
    name: 'Claude Opus 4.6',
    provider: 'anthropic',
    version: '4.6',
    releaseDate: '2026-03-01',
    contextWindow: 1000000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 5, output: 25 },
    scores: {
      llmStats: { composite: 46.5, reasoning: 46.8, coding: 35.1, agent: 31.2 },
      vellum: { hle: 40, gpqa: null, swebench: null, autobench: null, osworld: 78.5, browsecomp: null, terminal: null },
      chatbotArena: { elo: 1545 },
    },
    categories: ['reasoning', 'coding'],
    highlights: ['Former #1 Arena'],
  },

  // === OPENAI ===
  {
    id: 'gpt-5-6-sol',
    name: 'GPT-5.6 Sol',
    provider: 'openai',
    version: '5.6',
    releaseDate: '2026-07-10',
    contextWindow: 1050000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 5, output: 30 },
    scores: {
      artificialAnalysis: { intelligence: 59, speed: 209 },
      llmStats: { composite: 58, reasoning: 58.6, coding: 49.5, agent: 44.9 },
      vellum: { hle: 47.2, gpqa: 94.6, swebench: 96.2, autobench: 18.1, osworld: null, browsecomp: 92.2, terminal: 88.8 },
      chatbotArena: { elo: 1578 },
    },
    categories: ['overall', 'reasoning', 'coding', 'agentic'],
    highlights: ['#1 SWE-Bench (96.2%)', '#1 Coding', '#1 Browsing'],
  },
  {
    id: 'gpt-5-6-terra',
    name: 'GPT-5.6 Terra',
    provider: 'openai',
    version: '5.6',
    releaseDate: '2026-07-10',
    contextWindow: 1050000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 2.5, output: 15 },
    scores: {
      artificialAnalysis: { intelligence: 55, speed: 309 },
      llmStats: { composite: 53.2, reasoning: 52.4, coding: 45.7, agent: 41.1 },
    },
    categories: ['reasoning', 'coding', 'price'],
    highlights: ['Best Price/Performance'],
  },
  {
    id: 'gpt-5-6-luna',
    name: 'GPT-5.6 Luna',
    provider: 'openai',
    version: '5.6',
    releaseDate: '2026-07-10',
    contextWindow: 1050000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 1, output: 6 },
    scores: {
      artificialAnalysis: { intelligence: 51, speed: 415 },
      llmStats: { composite: 46.4, reasoning: 46.7, coding: 38.1, agent: 32.9 },
      vellum: { swebench: 93, terminal: 84.3 },
    },
    categories: ['coding', 'speed', 'price'],
    highlights: ['Fastest OpenAI Model', 'Budget-Friendly'],
  },
  {
    id: 'gpt-5-5',
    name: 'GPT-5.5',
    provider: 'openai',
    version: '5.5',
    releaseDate: '2026-04-01',
    contextWindow: 1100000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 5, output: 30 },
    scores: {
      artificialAnalysis: { intelligence: 48, speed: 164 },
      llmStats: { composite: 48.7, reasoning: 48.1, coding: 39.5, agent: 33.2 },
      vellum: { hle: 41.4, gpqa: null, swebench: null, autobench: 12.9, osworld: 78.7, browsecomp: null, terminal: null },
      chatbotArena: { elo: 1550 },
    },
    categories: ['reasoning', 'coding'],
    highlights: ['Strong All-Rounder'],
  },
  {
    id: 'gpt-5-5-pro',
    name: 'GPT-5.5 Pro',
    provider: 'openai',
    version: '5.5',
    releaseDate: '2026-04-15',
    contextWindow: 1100000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 7.5, output: 45 },
    scores: {
      vellum: { hle: 43.1 },
      chatbotArena: { elo: 1560 },
    },
    categories: ['reasoning'],
    highlights: ['Enhanced Reasoning'],
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'openai',
    version: '5',
    releaseDate: '2025-12-01',
    contextWindow: 1100000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 5, output: 30 },
    scores: {
      vellum: { hle: 35.2 },
      chatbotArena: { elo: 1530 },
    },
    categories: ['reasoning'],
    highlights: ['Foundation Model'],
  },
  {
    id: 'gpt-4-1-nano',
    name: 'GPT-4.1 nano',
    provider: 'openai',
    version: '4.1',
    releaseDate: '2026-02-01',
    contextWindow: 1000000,
    maxOutput: 32000,
    license: 'proprietary',
    pricing: { input: 0.1, output: 0.4 },
    scores: {
      vellum: { speed: 896 },
    },
    categories: ['speed', 'price'],
    highlights: ['Fastest Model (896 t/s)', 'Ultra Budget'],
  },

  // === GOOGLE ===
  {
    id: 'gemini-3-5-flash',
    name: 'Gemini 3.5 Flash',
    provider: 'google',
    version: '3.5',
    releaseDate: '2026-06-15',
    contextWindow: 1000000,
    maxOutput: 65536,
    license: 'proprietary',
    pricing: { input: 1.5, output: 9 },
    scores: {
      artificialAnalysis: { intelligence: 50, speed: 175 },
      vellum: { hle: 40.2, gpqa: 76.7 },
    },
    categories: ['speed', 'price', 'reasoning'],
    highlights: ['Fast & Capable'],
  },
  {
    id: 'gemini-3-6-flash',
    name: 'Gemini 3.6 Flash',
    provider: 'google',
    version: '3.6',
    releaseDate: '2026-07-15',
    contextWindow: 1000000,
    maxOutput: 65536,
    license: 'proprietary',
    pricing: { input: 1.5, output: 9 },
    scores: {
      artificialAnalysis: { intelligence: 50, speed: 180 },
    },
    categories: ['speed', 'price'],
    highlights: ['Latest Flash Model'],
  },
  {
    id: 'gemini-3-1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'google',
    version: '3.1',
    releaseDate: '2026-05-01',
    contextWindow: 1000000,
    maxOutput: 65536,
    license: 'proprietary',
    pricing: { input: 2, output: 12 },
    scores: {
      artificialAnalysis: { intelligence: 46, speed: 136 },
      vellum: { hle: 44.4, gpqa: 94.3, browsecomp: 85.9 },
      chatbotArena: { elo: 1545 },
    },
    categories: ['reasoning', 'vision'],
    highlights: ['Strong Vision', 'Top GPQA'],
  },
  {
    id: 'gemini-3-pro',
    name: 'Gemini 3 Pro',
    provider: 'google',
    version: '3',
    releaseDate: '2026-02-01',
    contextWindow: 2000000,
    maxOutput: 65536,
    license: 'proprietary',
    pricing: { input: 2, output: 12 },
    scores: {
      vellum: { hle: 45.8 },
      whatllm: { vision: 1 },
    },
    categories: ['vision', 'context'],
    highlights: ['#1 Vision (WhatLLM)', '2M Context'],
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'google',
    version: '2.5',
    releaseDate: '2025-10-01',
    contextWindow: 1000000,
    maxOutput: 65536,
    license: 'proprietary',
    pricing: { input: 1.25, output: 10 },
    scores: {
      vellum: { hle: 21.6 },
      chatbotArena: { elo: 1510 },
    },
    categories: ['price'],
    highlights: ['Budget Pro Option'],
  },

  // === META ===
  {
    id: 'muse-spark-1-1',
    name: 'Muse Spark 1.1',
    provider: 'meta',
    version: '1.1',
    releaseDate: '2026-07-01',
    contextWindow: 1050000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 1.58, output: 6.32 },
    scores: {
      artificialAnalysis: { intelligence: 51, speed: 241 },
      llmStats: { composite: 53, reasoning: 52.5, coding: 39.4, agent: 38.7 },
    },
    categories: ['overall', 'reasoning', 'price'],
    highlights: ['Best Newcomer', 'High Value'],
  },

  // === XAI ===
  {
    id: 'grok-4-5',
    name: 'Grok 4.5',
    provider: 'xai',
    version: '4.5',
    releaseDate: '2026-06-01',
    contextWindow: 500000,
    maxOutput: 64000,
    license: 'proprietary',
    pricing: { input: 2, output: 10 },
    scores: {
      artificialAnalysis: { intelligence: 54, speed: 202 },
      llmStats: { composite: 49.4, reasoning: 47.9, coding: 39.8, agent: 35.4 },
      vellum: { hle: 25.4 },
    },
    categories: ['reasoning', 'price'],
    highlights: ['Top-10 Intelligence', 'Cheapest Top-10'],
  },

  // === DEEPSEEK ===
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    provider: 'deepseek',
    version: 'V4',
    releaseDate: '2026-05-01',
    contextWindow: 1000000,
    maxOutput: 384000,
    license: 'open',
    pricing: { input: 0.14, output: 0.28 },
    scores: {
      vellum: { hle: 51.6, browsecomp: 85.9 },
    },
    categories: ['openSource', 'price', 'reasoning'],
    highlights: ['Best Open Source Value', 'HLE 51.6%'],
  },
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek V4 Pro',
    provider: 'deepseek',
    version: 'V4',
    releaseDate: '2026-05-01',
    contextWindow: 1000000,
    maxOutput: 384000,
    license: 'open',
    pricing: { input: 0.435, output: 0.87 },
    scores: {
      vellum: { hle: 48.2 },
    },
    categories: ['openSource', 'price'],
    highlights: ['Pro Tier Open Source'],
  },
  {
    id: 'deepseek-v3-2',
    name: 'DeepSeek V3.2',
    provider: 'deepseek',
    version: 'V3.2',
    releaseDate: '2026-01-01',
    contextWindow: 128000,
    maxOutput: 64000,
    license: 'open',
    pricing: { input: 0.27, output: 1.1 },
    scores: {
      whatllm: { openSource: 3, budget: 1 },
    },
    categories: ['openSource', 'price', 'local'],
    highlights: ['#1 Budget (WhatLLM)', '#3 Open Source'],
  },

  // === ALIBABA / QWEN ===
  {
    id: 'qwen3-7-max',
    name: 'Qwen3.7 Max',
    provider: 'alibaba',
    version: '3.7',
    releaseDate: '2026-07-01',
    contextWindow: 1000000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 1.53, output: 6.12 },
    scores: {
      llmStats: { composite: 46.8, reasoning: 47.4, coding: 39, agent: 31.3 },
    },
    categories: ['reasoning', 'price'],
    highlights: ['Best Chinese Model (API)'],
  },
  {
    id: 'qwen3-235b',
    name: 'Qwen3-235B',
    provider: 'alibaba',
    version: '3',
    releaseDate: '2026-01-01',
    contextWindow: 131072,
    maxOutput: 32000,
    license: 'open',
    pricing: { input: 0.5, output: 2 },
    scores: {
      whatllm: { budget: 3 },
    },
    categories: ['openSource', 'price', 'local'],
    highlights: ['#3 Budget (WhatLLM)'],
  },

  // === MOONSHOT ===
  {
    id: 'kimi-k3',
    name: 'Kimi K3',
    provider: 'moonshot',
    version: 'K3',
    releaseDate: '2026-07-01',
    contextWindow: 1048576,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 3, output: 15 },
    scores: {
      artificialAnalysis: { intelligence: 57, speed: 67 },
      llmStats: { composite: 55.6, reasoning: 55, coding: 44.6, agent: 42.4 },
      vellum: { browsecomp: 91.2, terminal: 88.3 },
    },
    categories: ['overall', 'reasoning', 'coding', 'agentic'],
    highlights: ['#4 Intelligence', '#2 Browsing', '#2 Terminal'],
  },
  {
    id: 'kimi-k2-6',
    name: 'Kimi K2.6',
    provider: 'moonshot',
    version: 'K2.6',
    releaseDate: '2026-04-01',
    contextWindow: 256000,
    maxOutput: 64000,
    license: 'open',
    pricing: { input: 0.95, output: 4 },
    scores: {
      vellum: { speed: 342.6 },
    },
    categories: ['openSource', 'speed', 'price'],
    highlights: ['Fast Open Source', '#2 Speed'],
  },
  {
    id: 'kimi-k2-5',
    name: 'Kimi K2.5',
    provider: 'moonshot',
    version: 'K2.5',
    releaseDate: '2026-02-01',
    contextWindow: 128000,
    maxOutput: 32000,
    license: 'open',
    pricing: { input: 0.5, output: 2 },
    scores: {
      vellum: { hle: 30.1, speed: 337.7 },
      whatllm: { openSource: 2 },
    },
    categories: ['openSource', 'price'],
    highlights: ['#2 Open Source (WhatLLM)'],
  },

  // === ZHIPU ===
  {
    id: 'glm-5-2',
    name: 'GLM-5.2',
    provider: 'zhipu',
    version: '5.2',
    releaseDate: '2026-06-01',
    contextWindow: 1000000,
    maxOutput: 128000,
    license: 'open',
    pricing: { input: 0.95, output: 3 },
    scores: {
      artificialAnalysis: { intelligence: 51, speed: 259 },
      llmStats: { composite: 47.6, reasoning: 46.8, coding: 39.8, agent: 33.6 },
      vellum: { hle: 54.7, gpqa: 91.2 },
    },
    categories: ['openSource', 'reasoning', 'coding', 'price'],
    highlights: ['#1 Open Source', 'HLE 54.7%', 'GPQA 91.2%'],
  },

  // === BYTEDANCE ===
  {
    id: 'seed-2-1-pro',
    name: 'Seed 2.1 Pro',
    provider: 'bytedance',
    version: '2.1',
    releaseDate: '2026-05-01',
    contextWindow: 128000,
    maxOutput: 64000,
    license: 'proprietary',
    pricing: { input: 1, output: 4 },
    scores: {
      llmStats: { composite: 47.4, reasoning: 48.4, coding: 36.6, agent: 32.9 },
    },
    categories: ['reasoning', 'price'],
    highlights: ['Strong Reasoning Value'],
  },

  // === MISTRAL ===
  {
    id: 'mistral-large-3',
    name: 'Mistral Large 3',
    provider: 'mistral',
    version: '3',
    releaseDate: '2026-03-01',
    contextWindow: 128000,
    maxOutput: 32000,
    license: 'open',
    pricing: { input: 2, output: 6 },
    scores: {
      chatbotArena: { elo: 1510 },
    },
    categories: ['openSource', 'coding'],
    highlights: ['Leading European AI'],
  },

  // === NVIDIA ===
  {
    id: 'llama-4-scout',
    name: 'Llama 4 Scout',
    provider: 'nvidia',
    version: '4',
    releaseDate: '2026-04-01',
    contextWindow: 10000000,
    maxOutput: 64000,
    license: 'open',
    pricing: { input: 0.11, output: 0.34 },
    scores: {
      vellum: { speed: 2600, context: 10000000 },
    },
    categories: ['openSource', 'speed', 'context', 'price', 'local'],
    highlights: ['#1 Speed (2600 t/s)', '#1 Context (10M)', 'Ultra Budget'],
  },

  // === AMAZON ===
  {
    id: 'nova-micro',
    name: 'Nova Micro',
    provider: 'amazon',
    version: '1',
    releaseDate: '2026-01-01',
    contextWindow: 128000,
    maxOutput: 32000,
    license: 'proprietary',
    pricing: { input: 0.04, output: 0.14 },
    scores: {},
    categories: ['price', 'speed'],
    highlights: ['Cheapest Model'],
  },

  // === MINIMAX ===
  {
    id: 'minimax-m3',
    name: 'MiniMax M3',
    provider: 'minimax',
    version: 'M3',
    releaseDate: '2026-05-01',
    contextWindow: 1048576,
    maxOutput: 512000,
    license: 'open',
    pricing: { input: 0.6, output: 2.4 },
    scores: {
      vellum: { speed: 98.6 },
    },
    categories: ['openSource', 'context', 'price'],
    highlights: ['#1 Open Weight (benchlm.ai)', '512K Output'],
  },

  // === ADDITIONAL MODELS FROM SOURCES ===
  {
    id: 'gpt-5-6-sol-max',
    name: 'GPT-5.6 Sol (max effort)',
    provider: 'openai',
    version: '5.6',
    releaseDate: '2026-07-10',
    contextWindow: 1050000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 7.78, output: 31.12 },
    scores: {
      artificialAnalysis: { intelligence: 59 },
    },
    categories: ['overall'],
    highlights: ['Highest Intelligence Score'],
  },
  {
    id: 'gpt-5-6-sol-xhigh',
    name: 'GPT-5.6 Sol (xhigh)',
    provider: 'openai',
    version: '5.6',
    releaseDate: '2026-07-10',
    contextWindow: 1050000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 7.78, output: 31.12 },
    scores: {
      artificialAnalysis: { intelligence: 58 },
    },
    categories: ['reasoning'],
    highlights: ['High Reasoning Tier'],
  },
  {
    id: 'claude-opus-4-8-max',
    name: 'Claude Opus 4.8 (max)',
    provider: 'anthropic',
    version: '4.8',
    releaseDate: '2026-05-15',
    contextWindow: 1000000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 5, output: 25 },
    scores: {
      artificialAnalysis: { intelligence: 56 },
    },
    categories: ['reasoning'],
    highlights: ['Max Reasoning Tier'],
  },
  {
    id: 'grok-4-5-high',
    name: 'Grok 4.5 (high)',
    provider: 'xai',
    version: '4.5',
    releaseDate: '2026-06-01',
    contextWindow: 500000,
    maxOutput: 64000,
    license: 'proprietary',
    pricing: { input: 2, output: 10 },
    scores: {
      artificialAnalysis: { intelligence: 54 },
    },
    categories: ['reasoning'],
    highlights: ['High Reasoning Tier'],
  },
  {
    id: 'claude-sonnet-5-max',
    name: 'Claude Sonnet 5 (max)',
    provider: 'anthropic',
    version: '5',
    releaseDate: '2026-06-01',
    contextWindow: 1000000,
    maxOutput: 128000,
    license: 'proprietary',
    pricing: { input: 3, output: 15 },
    scores: {
      artificialAnalysis: { intelligence: 53 },
    },
    categories: ['reasoning'],
    highlights: ['Best Value Flagship'],
  },
  {
    id: 'gemini-3-1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    provider: 'google',
    version: '3.1',
    releaseDate: '2026-06-01',
    contextWindow: 1000000,
    maxOutput: 65536,
    license: 'proprietary',
    pricing: { input: 2, output: 12 },
    scores: {
      artificialAnalysis: { intelligence: 46 },
      vellum: { gpqa: 79.6 },
    },
    categories: ['reasoning'],
    highlights: ['Preview of Next-Gen'],
  },
];

// Helper: Get all unique providers from models
function getProviders() {
  const ids = new Set(MODELS.map(m => m.provider));
  return [...ids].map(id => ({ id, ...PROVIDERS[id] }));
}

// Helper: Get models by category
function getModelsByCategory(category) {
  return MODELS.filter(m => m.categories.includes(category))
    .sort((a, b) => {
      const aScore = getTopScore(a);
      const bScore = getTopScore(b);
      return bScore - aScore;
    });
}

// Helper: Get top score for a model (from any source)
function getTopScore(model) {
  const scores = model.scores;
  let top = 0;
  for (const source in scores) {
    const s = scores[source];
    if (s.intelligence > top) top = s.intelligence;
    if (s.composite > top) top = s.composite;
    if (s.elo > top) top = s.elo / 30; // Normalize Elo to ~50 scale
    if (s.hle > top) top = s.hle;
    if (s.gpqa > top) top = s.gpqa;
    if (s.swebench > top) top = s.swebench;
  }
  return top;
}

// Helper: Get category leaders
function getCategoryLeaders() {
  const leaders = {};
  for (const [key, label] of Object.entries(CATEGORIES)) {
    const models = getModelsByCategory(key).slice(0, 5);
    if (models.length > 0) {
      leaders[key] = { label, models };
    }
  }
  return leaders;
}

// Export for use in other files
window.AGIRating = {
  MODELS,
  PROVIDERS,
  CATEGORIES,
  SOURCES,
  getProviders,
  getModelsByCategory,
  getTopScore,
  getCategoryLeaders,
};
