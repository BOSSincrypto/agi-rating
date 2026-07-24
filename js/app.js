// AGI Rating - Main Application

var currentSort = { by: 'intelligence', dir: 'desc' };
var currentFilters = { provider: 'all', category: 'all', license: 'all', search: '' };
var currentTab = 'table';
var deps = null;

function getDeps() {
  if (deps) return deps;
  deps = {
    M: window.AGIRating.MODELS,
    P: window.AGIRating.PROVIDERS,
    C: window.AGIRating.CATEGORIES,
    S: window.AGIRating.SOURCES,
    getProviders: window.AGIRating.getProviders,
    getTopScore: window.AGIRating.getTopScore,
    getCategoryLeaders: window.AGIRating.getCategoryLeaders,
    formatPrice: window.AGIRatingUtils.formatPrice,
    formatContext: window.AGIRatingUtils.formatContext,
    formatSpeed: window.AGIRatingUtils.formatSpeed,
    getScoreClass: window.AGIRatingUtils.getScoreClass,
    scoreVal: window.AGIRatingUtils.scoreVal,
    debounce: window.AGIRatingUtils.debounce,
    sortModels: window.AGIRatingUtils.sortModels,
    filterModels: window.AGIRatingUtils.filterModels,
    initCharts: window.AGIRatingCharts.initCharts,
    destroyCharts: window.AGIRatingCharts.destroyCharts,
  };
  return deps;
}

function init() {
  var d = getDeps();
  initStats(d);
  initFilters(d);
  initTabs(d);
  initTable(d);
  initLeaders(d);
  initSources(d);
  initTheme(d);
  initKeyboard();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function initStats(d) {
  document.getElementById('statModels').textContent = d.M.length;
  document.getElementById('statProviders').textContent = d.getProviders().length;
}

function initFilters(d) {
  var providers = d.getProviders().sort(function(a, b) { return a.name.localeCompare(b.name); });
  var providerSel = document.getElementById('filterProvider');
  providers.forEach(function(p) {
    providerSel.appendChild(new Option(p.name, p.id));
  });

  var catSel = document.getElementById('filterCategory');
  var cats = Object.entries(d.C);
  for (var i = 0; i < cats.length; i++) {
    catSel.appendChild(new Option(cats[i][1], cats[i][0]));
  }

  providerSel.addEventListener('change', function(e) { currentFilters.provider = e.target.value; renderTable(d); });
  catSel.addEventListener('change', function(e) { currentFilters.category = e.target.value; renderTable(d); });
  document.getElementById('filterLicense').addEventListener('change', function(e) { currentFilters.license = e.target.value; renderTable(d); });
  document.getElementById('searchInput').addEventListener('input', d.debounce(function(e) {
    currentFilters.search = e.target.value;
    renderTable(d);
  }, 200));
}

function initTabs(d) {
  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function() {
      var target = this.dataset.tab;
      if (target === currentTab) return;

      var allTabs = document.querySelectorAll('.tab');
      for (var j = 0; j < allTabs.length; j++) allTabs[j].classList.remove('active');
      this.classList.add('active');

      var allContents = document.querySelectorAll('.tab-content');
      for (var k = 0; k < allContents.length; k++) allContents[k].style.display = 'none';
      document.getElementById('tab-' + target).style.display = '';

      currentTab = target;

      if (target === 'charts') {
        setTimeout(function() { d.initCharts(); }, 100);
      } else {
        d.destroyCharts();
      }
    });
  }
}

function initTable(d) {
  var headers = document.querySelectorAll('th[data-sort]');
  for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener('click', function() {
      var by = this.dataset.sort;
      if (currentSort.by === by) {
        currentSort.dir = currentSort.dir === 'desc' ? 'asc' : 'desc';
      } else {
        currentSort = { by: by, dir: 'desc' };
      }
      renderTable(d);
    });
  }
  renderTable(d);
}

function renderTable(d) {
  var filtered = d.filterModels(d.M, currentFilters);
  var sorted = d.sortModels(filtered, currentSort.by, currentSort.dir);

  document.getElementById('tableCount').textContent = sorted.length + ' model' + (sorted.length !== 1 ? 's' : '');

  var headers = document.querySelectorAll('th[data-sort]');
  for (var h = 0; h < headers.length; h++) {
    var th = headers[h];
    th.classList.remove('sorted');
    th.removeAttribute('data-sort-dir');
    if (th.dataset.sort === currentSort.by) {
      th.classList.add('sorted');
      th.setAttribute('data-sort-dir', currentSort.dir === 'desc' ? '↓' : '↑');
    }
  }

  var tbody = document.getElementById('modelTableBody');
  tbody.innerHTML = '';

  for (var i = 0; i < sorted.length; i++) {
    var m = sorted[i];
    var tr = document.createElement('tr');
    tr.style.animationDelay = (i * 20) + 'ms';
    tr.classList.add('fade-in');

    var provider = d.P[m.provider];
    var aa = m.scores.artificialAnalysis || {};
    var ls = m.scores.llmStats || {};
    var arena = m.scores.chatbotArena || {};
    var vellum = m.scores.vellum || {};

    var avgPrice = m.pricing ? (m.pricing.input + m.pricing.output) / 2 : null;

    var tags = '';
    if (m.license === 'open') tags += '<span class="tag">Open</span>';
    for (var ci = 0; ci < Math.min(m.categories.length, 2); ci++) {
      tags += '<span class="tag">' + (d.C[m.categories[ci]] || m.categories[ci]) + '</span>';
    }

    tr.innerHTML =
      '<td><div class="model-cell">' +
        '<div class="provider-badge" style="background:' + provider.color + '">' + provider.logo + '</div>' +
        '<div class="model-info">' +
          '<span class="model-name">' + m.name + '</span>' +
          '<span class="model-provider">' + provider.name + '</span>' +
        '</div></div></td>' +
      '<td><span class="score ' + d.getScoreClass(aa.intelligence, 65) + '">' + d.scoreVal(aa.intelligence) + '</span></td>' +
      '<td><span class="score ' + d.getScoreClass(ls.composite, 65) + '">' + d.scoreVal(ls.composite) + '</span></td>' +
      '<td><span class="score ' + d.getScoreClass(arena.elo, 1600) + '">' + (arena.elo ? arena.elo : '—') + '</span></td>' +
      '<td><span class="score ' + d.getScoreClass(ls.reasoning || vellum.gpqa) + '">' + d.scoreVal(ls.reasoning || vellum.gpqa) + '</span></td>' +
      '<td><span class="score ' + d.getScoreClass(ls.coding || vellum.swebench) + '">' + d.scoreVal(ls.coding || vellum.swebench) + '</span></td>' +
      '<td>' + (aa.speed ? d.formatSpeed(aa.speed) : '—') + '</td>' +
      '<td>' + (avgPrice !== null ? d.formatPrice(avgPrice) : '—') + '</td>' +
      '<td>' + d.formatContext(m.contextWindow) + '</td>' +
      '<td><div class="tags">' + tags + '</div></td>';

    tr.style.cursor = 'pointer';
    (function(model) {
      tr.addEventListener('click', function() { openModal(model, d); });
    })(m);
    tbody.appendChild(tr);
  }
}

function initLeaders(d) {
  var grid = document.getElementById('leadersGrid');
  var leaders = d.getCategoryLeaders();
  var entries = Object.entries(leaders);

  for (var i = 0; i < entries.length; i++) {
    var info = entries[i][1];
    var card = document.createElement('div');
    card.className = 'leader-card';

    var list = '';
    for (var j = 0; j < info.models.length; j++) {
      var m = info.models[j];
      var score = d.getTopScore(m);
      list += '<li class="leader-item">' +
        '<span class="leader-rank rank-' + (j + 1) + '">' + (j + 1) + '</span>' +
        '<span class="leader-model">' + m.name + '</span>' +
        '<span class="leader-score">' + score.toFixed(1) + '</span>' +
      '</li>';
    }

    card.innerHTML = '<h3>' + info.label + '</h3><ul class="leader-list">' + list + '</ul>';
    grid.appendChild(card);
  }
}

function initSources(d) {
  var grid = document.getElementById('sourcesGrid');
  var entries = Object.entries(d.S);
  for (var i = 0; i < entries.length; i++) {
    var source = entries[i][1];
    var card = document.createElement('a');
    card.className = 'source-card';
    card.href = source.url;
    card.target = '_blank';
    card.rel = 'noopener';
    card.innerHTML =
      '<span class="source-icon">' + source.icon + '</span>' +
      '<div class="source-info"><h4>' + source.name + '</h4><p>View source →</p></div>';
    grid.appendChild(card);
  }
}

function openModal(model, d) {
  var overlay = document.getElementById('modalOverlay');
  var provider = d.P[model.provider];

  document.getElementById('modalName').textContent = model.name;
  document.getElementById('modalProvider').textContent = provider.name;

  var scoresEl = document.getElementById('modalScores');
  scoresEl.innerHTML = '';
  var scores = [
    { label: 'Intelligence', val: model.scores.artificialAnalysis && model.scores.artificialAnalysis.intelligence },
    { label: 'Composite', val: model.scores.llmStats && model.scores.llmStats.composite },
    { label: 'Arena Elo', val: model.scores.chatbotArena && model.scores.chatbotArena.elo },
    { label: 'Reasoning', val: (model.scores.llmStats && model.scores.llmStats.reasoning) || (model.scores.vellum && model.scores.vellum.gpqa) },
    { label: 'Coding', val: (model.scores.llmStats && model.scores.llmStats.coding) || (model.scores.vellum && model.scores.vellum.swebench) },
    { label: 'Agent', val: model.scores.llmStats && model.scores.llmStats.agent },
    { label: 'HLE', val: model.scores.vellum && model.scores.vellum.hle },
    { label: 'Speed', val: model.scores.artificialAnalysis && model.scores.artificialAnalysis.speed, suffix: ' t/s' },
  ];

  for (var i = 0; i < scores.length; i++) {
    var s = scores[i];
    if (s.val == null) continue;
    var div = document.createElement('div');
    div.className = 'modal-score-item';
    div.innerHTML =
      '<div class="modal-score-value">' + (typeof s.val === 'number' ? s.val.toFixed(1) : s.val) + (s.suffix || '') + '</div>' +
      '<div class="modal-score-label">' + s.label + '</div>';
    scoresEl.appendChild(div);
  }

  document.getElementById('modalDetails').innerHTML =
    '<div class="modal-detail-item"><span class="modal-detail-label">Context Window</span><span class="modal-detail-value">' + d.formatContext(model.contextWindow) + '</span></div>' +
    '<div class="modal-detail-item"><span class="modal-detail-label">Max Output</span><span class="modal-detail-value">' + d.formatContext(model.maxOutput) + '</span></div>' +
    '<div class="modal-detail-item"><span class="modal-detail-label">License</span><span class="modal-detail-value">' + (model.license === 'open' ? 'Open Source' : 'Proprietary') + '</span></div>' +
    '<div class="modal-detail-item"><span class="modal-detail-label">Pricing (I/O per 1M)</span><span class="modal-detail-value">' + (model.pricing ? '$' + model.pricing.input + ' / $' + model.pricing.output : '—') + '</span></div>' +
    '<div class="modal-detail-item"><span class="modal-detail-label">Release Date</span><span class="modal-detail-value">' + (model.releaseDate || '—') + '</span></div>' +
    '<div class="modal-detail-item"><span class="modal-detail-label">Categories</span><span class="modal-detail-value">' + model.categories.map(function(c) { return d.C[c]; }).join(', ') + '</span></div>';

  var hlEl = document.getElementById('modalHighlights');
  if (model.highlights && model.highlights.length) {
    hlEl.innerHTML = '<h4>Highlights</h4><ul>' + model.highlights.map(function(h) { return '<li>' + h + '</li>'; }).join('') + '</ul>';
    hlEl.style.display = '';
  } else {
    hlEl.style.display = 'none';
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === e.currentTarget) closeModal();
});

function initTheme(d) {
  var toggle = document.getElementById('themeToggle');
  var saved = localStorage.getItem('agi-theme');
  if (saved) {
    document.documentElement.dataset.theme = saved;
    toggle.textContent = saved === 'dark' ? '🌙' : '☀️';
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.dataset.theme = 'light';
    toggle.textContent = '☀️';
  }

  toggle.addEventListener('click', function() {
    var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('agi-theme', next);
    toggle.textContent = next === 'dark' ? '🌙' : '☀️';

    if (currentTab === 'charts') {
      d.destroyCharts();
      setTimeout(function() { d.initCharts(); }, 100);
    }
  });
}

function initKeyboard() {
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    if (e.key === '/') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
    if (e.key === 't' || e.key === 'T') {
      document.getElementById('themeToggle').click();
    }
    if (e.key === 'Escape') {
      closeModal();
      document.getElementById('searchInput').blur();
    }
  });
}
