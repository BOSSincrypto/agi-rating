// AGI Rating - Main Application

var currentSort = { by: 'intelligence', dir: 'desc' };
var currentFilters = { provider: 'all', category: 'all', license: 'all', search: '' };
var currentTab = 'table';
var deps = null;
var chartJsLoaded = false;
var compareModels = [];
var COMPARE_MAX = 4;
var compareChart = null;

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
  initCompare(d);
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
        if (!chartJsLoaded) {
          var script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
          script.onload = function() {
            chartJsLoaded = true;
            setTimeout(function() { d.initCharts(); }, 100);
          };
          document.head.appendChild(script);
        } else {
          setTimeout(function() { d.initCharts(); }, 100);
        }
      } else if (target === 'compare') {
        renderCompare(d);
        if (chartJsLoaded && compareModels.length >= 2) {
          setTimeout(function() {
            var models = compareModels.map(function(id) {
              return d.M.find(function(m) { return m.id === id; });
            }).filter(Boolean);
            if (models.length >= 2) renderCompareRadar(models);
          }, 100);
        }
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
      '<td class="compare-checkbox-col"><input type="checkbox" class="table-checkbox" data-model-id="' + m.id + '"' + (compareModels.indexOf(m.id) !== -1 ? ' checked' : '') + '></td>' +
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
      '<td>' + (aa.speed ? d.formatSpeed(aa.speed) : (vellum.speed ? d.formatSpeed(vellum.speed) : '—')) + '</td>' +
      '<td>' + (avgPrice !== null ? d.formatPrice(avgPrice) : '—') + '</td>' +
      '<td>' + d.formatContext(m.contextWindow) + '</td>' +
      '<td><div class="tags">' + tags + '</div></td>';

    tr.style.cursor = 'pointer';
    var cb = tr.querySelector('.table-checkbox');
    (function(model) {
      cb.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCompare(model.id, d);
      });
    })(m);
    (function(model) {
      tr.addEventListener('click', function(e) {
        if (e.target.tagName === 'INPUT') return;
        openModal(model, d);
      });
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

  var compareBtn = document.createElement('button');
  compareBtn.className = 'modal-compare-btn';
  if (compareModels.indexOf(model.id) !== -1) {
    compareBtn.textContent = 'Remove from Comparison';
    compareBtn.classList.add('active');
  } else {
    compareBtn.textContent = 'Add to Comparison';
  }
  compareBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleCompare(model.id, d);
    if (compareModels.indexOf(model.id) !== -1) {
      compareBtn.textContent = 'Remove from Comparison';
      compareBtn.classList.add('active');
    } else {
      compareBtn.textContent = 'Add to Comparison';
      compareBtn.classList.remove('active');
    }
  });
  hlEl.appendChild(compareBtn);

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// === Compare Feature ===
function toggleCompare(modelId, d) {
  var idx = compareModels.indexOf(modelId);
  if (idx !== -1) {
    compareModels.splice(idx, 1);
  } else {
    if (compareModels.length >= COMPARE_MAX) {
      compareModels.shift();
    }
    compareModels.push(modelId);
  }
  renderCompareBar(d);
  renderCompare(d);
}

function renderCompareBar(d) {
  var bar = document.getElementById('compareBar');
  if (compareModels.length === 0) {
    bar.style.display = 'none';
    return;
  }
  bar.style.display = '';

  document.getElementById('compareCount').textContent = compareModels.length;

  var chipsEl = document.getElementById('compareBarModels');
  chipsEl.innerHTML = '';
  for (var i = 0; i < compareModels.length; i++) {
    var model = d.M.find(function(m) { return m.id === compareModels[i]; });
    if (!model) continue;
    var provider = d.P[model.provider];
    var chip = document.createElement('span');
    chip.className = 'compare-bar-chip';
    chip.innerHTML = '<span class="provider-badge" style="background:' + provider.color + ';width:20px;height:20px;border-radius:5px;display:inline-flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;color:white;margin-right:0.3rem">' + provider.logo + '</span>' +
      model.name +
      '<button class="chip-remove" data-model-id="' + model.id + '">&times;</button>';
    chipsEl.appendChild(chip);
  }

  var removeBtns = chipsEl.querySelectorAll('.chip-remove');
  for (var j = 0; j < removeBtns.length; j++) {
    removeBtns[j].addEventListener('click', function(e) {
      e.stopPropagation();
      toggleCompare(this.dataset.modelId, d);
    });
  }
}

function renderCompare(d) {
  var contentEl = document.getElementById('compareContent');
  var infoEl = document.getElementById('compareInfo');

  if (compareModels.length < 2) {
    contentEl.innerHTML = '<div class="compare-empty"><p>Select at least 2 models from the Rankings tab to compare them.</p></div>';
    infoEl.textContent = compareModels.length === 0 ? 'Select models from Rankings tab' : '1 model selected — need at least 2';
    return;
  }

  var models = compareModels.map(function(id) {
    return d.M.find(function(m) { return m.id === id; });
  }).filter(Boolean);

  infoEl.textContent = models.length + ' models selected';

  var metrics = [
    { label: 'Intelligence', get: function(m) { return m.scores.artificialAnalysis && m.scores.artificialAnalysis.intelligence; }, max: 65 },
    { label: 'Composite', get: function(m) { return m.scores.llmStats && m.scores.llmStats.composite; }, max: 65 },
    { label: 'Arena Elo', get: function(m) { return m.scores.chatbotArena && m.scores.chatbotArena.elo; }, max: 1600 },
    { label: 'Reasoning', get: function(m) { return (m.scores.llmStats && m.scores.llmStats.reasoning) || (m.scores.vellum && m.scores.vellum.gpqa); }, max: 100 },
    { label: 'Coding', get: function(m) { return (m.scores.llmStats && m.scores.llmStats.coding) || (m.scores.vellum && m.scores.vellum.swebench); }, max: 100 },
    { label: 'Agent', get: function(m) { return m.scores.llmStats && m.scores.llmStats.agent; }, max: 50 },
    { label: 'HLE', get: function(m) { return m.scores.vellum && m.scores.vellum.hle; }, max: 100 },
    { label: 'GPQA', get: function(m) { return m.scores.vellum && m.scores.vellum.gpqa; }, max: 100 },
    { label: 'SWE-Bench', get: function(m) { return m.scores.vellum && m.scores.vellum.swebench; }, max: 100 },
    { label: 'BrowseComp', get: function(m) { return m.scores.vellum && m.scores.vellum.browsecomp; }, max: 100 },
    { label: 'Terminal', get: function(m) { return m.scores.vellum && m.scores.vellum.terminal; }, max: 100 },
    { label: 'Speed', get: function(m) { return (m.scores.artificialAnalysis && m.scores.artificialAnalysis.speed) || (m.scores.vellum && m.scores.vellum.speed); }, suffix: ' t/s', max: 1000 },
    { label: 'Avg Price', get: function(m) { return m.pricing ? (m.pricing.input + m.pricing.output) / 2 : null; }, suffix: '/1M', invert: true },
    { label: 'Context', get: function(m) { return m.contextWindow; }, format: d.formatContext },
    { label: 'Max Output', get: function(m) { return m.maxOutput; }, format: d.formatContext },
    { label: 'License', get: function(m) { return m.license === 'open' ? 'Open Source' : 'Proprietary'; }, isText: true },
  ];

  // Find best values for highlighting
  for (var mi = 0; mi < metrics.length; mi++) {
    var metric = metrics[mi];
    if (metric.isText) continue;
    var vals = models.map(metric.get).filter(function(v) { return v != null; });
    if (vals.length > 0) {
      metric.bestVal = metric.invert ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
    }
  }

  // Build grid
  var cols = models.length + 1;
  var html = '<div class="compare-grid" style="grid-template-columns: 180px repeat(' + models.length + ', 1fr)">';

  // Header row
  html += '<div class="compare-header-cell" style="background:var(--bg-secondary)"></div>';
  for (var ci = 0; ci < models.length; ci++) {
    var cm = models[ci];
    var cp = d.P[cm.provider];
    html += '<div class="compare-header-cell"><span class="provider-badge" style="background:' + cp.color + '">' + cp.logo + '</span> ' + cm.name + '</div>';
  }

  // Metric rows
  for (var ri = 0; ri < metrics.length; ri++) {
    var rm = metrics[ri];
    html += '<div class="compare-metric-label">' + rm.label + '</div>';
    for (var cj = 0; cj < models.length; cj++) {
      var val = rm.get(models[cj]);
      var cellClass = 'compare-cell';
      if (!rm.isText && val != null && val === rm.bestVal) {
        cellClass += ' compare-best';
      }
      if (rm.isText) {
        html += '<div class="' + cellClass + '">' + (val || '—') + '</div>';
      } else if (val != null) {
        var display = rm.format ? rm.format(val) : (typeof val === 'number' ? val.toFixed(1) : val);
        if (rm.suffix) display += rm.suffix;
        html += '<div class="' + cellClass + '">' + display + '</div>';
      } else {
        html += '<div class="' + cellClass + '" style="color:var(--text-muted)">—</div>';
      }
    }
  }

  // Highlights row
  html += '<div class="compare-metric-label" style="font-weight:700">Highlights</div>';
  for (var ch = 0; ch < models.length; ch++) {
    var chModel = models[ch];
    var hl = (chModel.highlights || []).join(', ') || '—';
    html += '<div class="compare-cell" style="font-size:0.8rem;color:var(--text-secondary)">' + hl + '</div>';
  }

  html += '</div>';

  // Radar chart
  html += '<div class="compare-radar-wrap"><canvas id="compareRadarChart"></canvas></div>';

  contentEl.innerHTML = html;

  // Render radar chart
  if (chartJsLoaded && typeof Chart !== 'undefined') {
    renderCompareRadar(models);
  } else if (!chartJsLoaded) {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = function() {
      chartJsLoaded = true;
      setTimeout(function() { renderCompareRadar(models); }, 50);
    };
    document.head.appendChild(script);
  }
}

function renderCompareRadar(models) {
  if (compareChart) {
    compareChart.destroy();
    compareChart = null;
  }

  var canvas = document.getElementById('compareRadarChart');
  if (!canvas) return;

  var labels = ['Intelligence', 'Reasoning', 'Coding', 'Speed', 'HLE', 'GPQA', 'SWE-Bench'];
  var colors = ['#6366f1', '#ef4444', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6', '#06b6d4'];

  var datasets = models.map(function(m, idx) {
    var data = [
      ((m.scores.artificialAnalysis && m.scores.artificialAnalysis.intelligence) || 0) / 65 * 100,
      ((m.scores.llmStats && m.scores.llmStats.reasoning) || (m.scores.vellum && m.scores.vellum.gpqa) || 0),
      ((m.scores.llmStats && m.scores.llmStats.coding) || (m.scores.vellum && m.scores.vellum.swebench) || 0),
      Math.min(((m.scores.artificialAnalysis && m.scores.artificialAnalysis.speed) || 0) / 10, 100),
      (m.scores.vellum && m.scores.vellum.hle) || 0,
      (m.scores.vellum && m.scores.vellum.gpqa) || 0,
      (m.scores.vellum && m.scores.vellum.swebench) || 0,
    ];
    var color = colors[idx % colors.length];
    return {
      label: m.name,
      data: data,
      borderColor: color,
      backgroundColor: color + '22',
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  compareChart = new Chart(canvas, {
    type: 'radar',
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } } },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          grid: { color: document.documentElement.dataset.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
          angleLines: { color: document.documentElement.dataset.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
          pointLabels: { font: { size: 11 } },
        }
      }
    }
  });
}

function initCompare(d) {
  document.getElementById('compareBtn').addEventListener('click', function() {
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].dataset.tab === 'compare') {
        tabs[i].click();
        break;
      }
    }
  });
  document.getElementById('compareClear').addEventListener('click', function() {
    compareModels = [];
    renderCompareBar(d);
    renderCompare(d);
    renderTable(d);
  });
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
