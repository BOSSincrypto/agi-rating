// AGI Rating - Utility Functions

// Format price
function formatPrice(price) {
  if (price === null || price === undefined) return '—';
  if (price < 0.01) return '<$0.01';
  if (price < 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(2)}`;
}

// Format context window
function formatContext(tokens) {
  if (!tokens) return '—';
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
  return tokens.toString();
}

// Format speed (tokens/sec)
function formatSpeed(speed) {
  if (!speed) return '—';
  return `${speed} t/s`;
}

// Format score with color class
function getScoreClass(score, max) {
  max = max || 100;
  if (score === null || score === undefined) return 'score-na';
  var pct = (score / max) * 100;
  if (pct >= 90) return 'score-excellent';
  if (pct >= 75) return 'score-good';
  if (pct >= 50) return 'score-average';
  return 'score-below';
}

// Get score value or dash
function scoreVal(val) {
  if (val === null || val === undefined) return '—';
  return typeof val === 'number' ? val.toFixed(1) : val;
}

// Debounce function
function debounce(fn, ms) {
  ms = ms || 300;
  var timer;
  return function() {
    var ctx = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() { fn.apply(ctx, args); }, ms);
  };
}

// Sort models by multiple criteria
function sortModels(models, sortBy, sortDir) {
  sortDir = sortDir || 'desc';
  return models.slice().sort(function(a, b) {
    var aVal, bVal;

    switch (sortBy) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);

      case 'provider':
        aVal = PROVIDERS[a.provider].name.toLowerCase();
        bVal = PROVIDERS[b.provider].name.toLowerCase();
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);

      case 'intelligence':
        aVal = a.scores.artificialAnalysis && a.scores.artificialAnalysis.intelligence || 0;
        bVal = b.scores.artificialAnalysis && b.scores.artificialAnalysis.intelligence || 0;
        break;

      case 'composite':
        aVal = a.scores.llmStats && a.scores.llmStats.composite || 0;
        bVal = b.scores.llmStats && b.scores.llmStats.composite || 0;
        break;

      case 'elo':
        aVal = a.scores.chatbotArena && a.scores.chatbotArena.elo || 0;
        bVal = b.scores.chatbotArena && b.scores.chatbotArena.elo || 0;
        break;

      case 'reasoning':
        aVal = (a.scores.llmStats && a.scores.llmStats.reasoning) || (a.scores.vellum && a.scores.vellum.gpqa) || 0;
        bVal = (b.scores.llmStats && b.scores.llmStats.reasoning) || (b.scores.vellum && b.scores.vellum.gpqa) || 0;
        break;

      case 'coding':
        aVal = (a.scores.llmStats && a.scores.llmStats.coding) || (a.scores.vellum && a.scores.vellum.swebench) || 0;
        bVal = (b.scores.llmStats && b.scores.llmStats.coding) || (b.scores.vellum && b.scores.vellum.swebench) || 0;
        break;

      case 'speed':
        aVal = (a.scores.artificialAnalysis && a.scores.artificialAnalysis.speed) || (a.scores.vellum && a.scores.vellum.speed) || 0;
        bVal = (b.scores.artificialAnalysis && b.scores.artificialAnalysis.speed) || (b.scores.vellum && b.scores.vellum.speed) || 0;
        break;

      case 'price':
        aVal = a.pricing ? (a.pricing.input + a.pricing.output) / 2 : 999;
        bVal = b.pricing ? (b.pricing.input + b.pricing.output) / 2 : 999;
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;

      case 'context':
        aVal = a.contextWindow || 0;
        bVal = b.contextWindow || 0;
        break;

      default:
        aVal = getTopScore(a);
        bVal = getTopScore(b);
    }

    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
  });
}

// Filter models
function filterModels(models, filters) {
  return models.filter(function(m) {
    if (filters.provider && filters.provider !== 'all' && m.provider !== filters.provider) return false;
    if (filters.license && filters.license !== 'all' && m.license !== filters.license) return false;
    if (filters.category && filters.category !== 'all' && m.categories.indexOf(filters.category) === -1) return false;
    if (filters.search) {
      var q = filters.search.toLowerCase();
      if (m.name.toLowerCase().indexOf(q) === -1 && PROVIDERS[m.provider].name.toLowerCase().indexOf(q) === -1) return false;
    }
    return true;
  });
}

// Export
window.AGIRatingUtils = {
  formatPrice: formatPrice,
  formatContext: formatContext,
  formatSpeed: formatSpeed,
  getScoreClass: getScoreClass,
  scoreVal: scoreVal,
  debounce: debounce,
  sortModels: sortModels,
  filterModels: filterModels,
};
