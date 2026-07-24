// AGI Rating - Utility Functions

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

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
function getScoreClass(score, max = 100) {
  if (score === null || score === undefined) return 'score-na';
  const pct = (score / max) * 100;
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
function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// Create element with attributes
function el(tag, attrs = {}, children = []) {
  const elem = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') elem.className = val;
    else if (key === 'innerHTML') elem.innerHTML = val;
    else if (key === 'textContent') elem.textContent = val;
    else if (key.startsWith('on')) elem.addEventListener(key.slice(2).toLowerCase(), val);
    else elem.setAttribute(key, val);
  }
  for (const child of children) {
    if (typeof child === 'string') elem.appendChild(document.createTextNode(child));
    else if (child) elem.appendChild(child);
  }
  return elem;
}

// Sort models by multiple criteria
function sortModels(models, sortBy, sortDir = 'desc') {
  return [...models].sort((a, b) => {
    let aVal, bVal;

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
        aVal = a.scores.artificialAnalysis?.intelligence || 0;
        bVal = b.scores.artificialAnalysis?.intelligence || 0;
        break;

      case 'composite':
        aVal = a.scores.llmStats?.composite || 0;
        bVal = b.scores.llmStats?.composite || 0;
        break;

      case 'elo':
        aVal = a.scores.chatbotArena?.elo || 0;
        bVal = b.scores.chatbotArena?.elo || 0;
        break;

      case 'reasoning':
        aVal = a.scores.llmStats?.reasoning || a.scores.vellum?.gpqa || 0;
        bVal = b.scores.llmStats?.reasoning || b.scores.vellum?.gpqa || 0;
        break;

      case 'coding':
        aVal = a.scores.llmStats?.coding || a.scores.vellum?.swebench || 0;
        bVal = b.scores.llmStats?.coding || b.scores.vellum?.swebench || 0;
        break;

      case 'speed':
        aVal = a.scores.artificialAnalysis?.speed || 0;
        bVal = b.scores.artificialAnalysis?.speed || 0;
        break;

      case 'price':
        aVal = a.pricing ? (a.pricing.input + a.pricing.output) / 2 : 999;
        bVal = b.pricing ? (b.pricing.input + b.pricing.output) / 2 : 999;
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;

      case 'context':
        aVal = a.contextWindow || 0;
        bVal = b.contextWindow || 0;
        break;

      case 'hle':
        aVal = a.scores.vellum?.hle || 0;
        bVal = b.scores.vellum?.hle || 0;
        break;

      case 'gpqa':
        aVal = a.scores.vellum?.gpqa || 0;
        bVal = b.scores.vellum?.gpqa || 0;
        break;

      case 'swebench':
        aVal = a.scores.vellum?.swebench || 0;
        bVal = b.scores.vellum?.swebench || 0;
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
  return models.filter(m => {
    if (filters.provider && filters.provider !== 'all' && m.provider !== filters.provider) return false;
    if (filters.license && filters.license !== 'all' && m.license !== filters.license) return false;
    if (filters.category && filters.category !== 'all' && !m.categories.includes(filters.category)) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !PROVIDERS[m.provider].name.toLowerCase().includes(q)) return false;
    }
    if (filters.maxPrice) {
      const avgPrice = m.pricing ? (m.pricing.input + m.pricing.output) / 2 : 0;
      if (avgPrice > filters.maxPrice) return false;
    }
    return true;
  });
}

// Generate radar chart data for a model
function getRadarData(model) {
  const labels = ['Intelligence', 'Reasoning', 'Coding', 'Agent', 'Speed', 'Value'];
  const data = [
    model.scores.artificialAnalysis?.intelligence || model.scores.llmStats?.composite || 0,
    model.scores.llmStats?.reasoning || model.scores.vellum?.gpqa || 0,
    model.scores.llmStats?.coding || model.scores.vellum?.swebench || 0,
    model.scores.llmStats?.agent || 0,
    Math.min((model.scores.artificialAnalysis?.speed || 0) / 10, 100),
    model.pricing ? Math.max(0, 100 - (model.pricing.input + model.pricing.output) * 2) : 50,
  ];
  return { labels, data };
}

// Export
window.AGIRatingUtils = {
  formatNumber,
  formatPrice,
  formatContext,
  formatSpeed,
  getScoreClass,
  scoreVal,
  debounce,
  el,
  sortModels,
  filterModels,
  getRadarData,
};
