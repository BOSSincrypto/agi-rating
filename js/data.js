// AGI Rating - Consolidated LLM Data from Multiple Sources
// Data current as of: 2026-08-31
// Sources: Artificial Analysis, LLM Stats, Vellum, Chatbot Arena, LiveBench, WhatLLM, HuggingFace, OpenCompass
// Auto-updated by scripts/update-data.js

const PROVIDERS = {
};

const CATEGORIES = {
};

const SOURCES = {
};

const MODELS = [
];


function getProviders() {
  return Object.entries(PROVIDERS).map(([id, p]) => ({ id, ...p }));
}

function getModelsByCategory(category) {
  return MODELS.filter(m => m.categories && m.categories.includes(category));
}

function getTopScore(model) {
  var scores = [];
  if (model.scores.artificialAnalysis && model.scores.artificialAnalysis.intelligence) scores.push(model.scores.artificialAnalysis.intelligence);
  if (model.scores.llmStats && model.scores.llmStats.composite) scores.push(model.scores.llmStats.composite);
  if (model.scores.chatbotArena && model.scores.chatbotArena.elo) scores.push(model.scores.chatbotArena.elo / 30);
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function getCategoryLeaders() {
  var leaders = {};
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
