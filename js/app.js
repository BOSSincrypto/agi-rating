// AGI Rating - Main Application

const { MODELS, PROVIDERS, CATEGORIES, SOURCES, getProviders, getTopScore, getCategoryLeaders } = window.AGIRating;
const { formatPrice, formatContext, formatSpeed, getScoreClass, scoreVal, debounce, sortModels, filterModels } = window.AGIRatingUtils;
const { initCharts, destroyCharts } = window.AGIRatingCharts;

let currentSort = { by: 'intelligence', dir: 'desc' };
let currentFilters = { provider: 'all', category: 'all', license: 'all', search: '' };
let currentTab = 'table';

// Init
document.addEventListener('DOMContentLoaded', () => {
  initStats();
  initFilters();
  initTabs();
  initTable();
  initLeaders();
  initSources();
  initTheme();
  initKeyboard();
});

function initStats() {
  document.getElementById('statModels').textContent = MODELS.length;
  document.getElementById('statProviders').textContent = getProviders().length;
}

function initFilters() {
  const providers = getProviders().sort((a, b) => a.name.localeCompare(b.name));
  const providerSel = document.getElementById('filterProvider');
  providers.forEach(p => {
    providerSel.appendChild(new Option(p.name, p.id));
  });

  const catSel = document.getElementById('filterCategory');
  for (const [key, label] of Object.entries(CATEGORIES)) {
    catSel.appendChild(new Option(label, key));
  }

  providerSel.addEventListener('change', e => { currentFilters.provider = e.target.value; renderTable(); });
  catSel.addEventListener('change', e => { currentFilters.category = e.target.value; renderTable(); });
  document.getElementById('filterLicense').addEventListener('change', e => { currentFilters.license = e.target.value; renderTable(); });
  document.getElementById('searchInput').addEventListener('input', debounce(e => {
    currentFilters.search = e.target.value;
    renderTable();
  }, 200));
}

function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (target === currentTab) return;

      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      document.getElementById(`tab-${target}`).style.display = '';

      currentTab = target;

      if (target === 'charts') {
        setTimeout(() => initCharts(), 100);
      } else {
        destroyCharts();
      }
    });
  });
}

function initTable() {
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const by = th.dataset.sort;
      if (currentSort.by === by) {
        currentSort.dir = currentSort.dir === 'desc' ? 'asc' : 'desc';
      } else {
        currentSort = { by, dir: 'desc' };
      }
      renderTable();
    });
  });
  renderTable();
}

function renderTable() {
  const filtered = filterModels(MODELS, currentFilters);
  const sorted = sortModels(filtered, currentSort.by, currentSort.dir);

  document.getElementById('tableCount').textContent = `${sorted.length} model${sorted.length !== 1 ? 's' : ''}`;

  // Update sort indicators
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.classList.remove('sorted');
    th.removeAttribute('data-sort-dir');
    if (th.dataset.sort === currentSort.by) {
      th.classList.add('sorted');
      th.setAttribute('data-sort-dir', currentSort.dir === 'desc' ? '↓' : '↑');
    }
  });

  const tbody = document.getElementById('modelTableBody');
  tbody.innerHTML = '';

  sorted.forEach((m, i) => {
    const tr = document.createElement('tr');
    tr.style.animationDelay = `${i * 20}ms`;
    tr.classList.add('fade-in');

    const provider = PROVIDERS[m.provider];
    const aa = m.scores.artificialAnalysis || {};
    const ls = m.scores.llmStats || {};
    const arena = m.scores.chatbotArena || {};
    const vellum = m.scores.vellum || {};

    const avgPrice = m.pricing ? (m.pricing.input + m.pricing.output) / 2 : null;
    const topScore = getTopScore(m);

    tr.innerHTML = `
      <td>
        <div class="model-cell">
          <div class="provider-badge" style="background:${provider.color}">${provider.logo}</div>
          <div class="model-info">
            <span class="model-name">${m.name}</span>
            <span class="model-provider">${provider.name}</span>
          </div>
        </div>
      </td>
      <td><span class="score ${getScoreClass(aa.intelligence, 65)}">${scoreVal(aa.intelligence)}</span></td>
      <td><span class="score ${getScoreClass(ls.composite, 65)}">${scoreVal(ls.composite)}</span></td>
      <td><span class="score ${getScoreClass(arena.elo, 1600)}">${arena.elo ? arena.elo : '—'}</span></td>
      <td><span class="score ${getScoreClass(ls.reasoning || vellum.gpqa)}">${scoreVal(ls.reasoning || vellum.gpqa)}</span></td>
      <td><span class="score ${getScoreClass(ls.coding || vellum.swebench)}">${scoreVal(ls.coding || vellum.swebench)}</span></td>
      <td>${aa.speed ? formatSpeed(aa.speed) : '—'}</td>
      <td>${avgPrice !== null ? formatPrice(avgPrice) : '—'}</td>
      <td>${formatContext(m.contextWindow)}</td>
      <td>
        <div class="tags">
          ${m.license === 'open' ? '<span class="tag">Open</span>' : ''}
          ${m.categories.slice(0, 2).map(c => `<span class="tag">${CATEGORIES[c] || c}</span>`).join('')}
        </div>
      </td>
    `;

    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => openModal(m));
    tbody.appendChild(tr);
  });
}

function initLeaders() {
  const grid = document.getElementById('leadersGrid');
  const leaders = getCategoryLeaders();

  for (const [key, { label, models }] of Object.entries(leaders)) {
    const card = document.createElement('div');
    card.className = 'leader-card';

    const list = models.map((m, i) => {
      const score = getTopScore(m);
      return `
        <li class="leader-item">
          <span class="leader-rank rank-${i + 1}">${i + 1}</span>
          <span class="leader-model">${m.name}</span>
          <span class="leader-score">${score.toFixed(1)}</span>
        </li>
      `;
    }).join('');

    card.innerHTML = `
      <h3>${label}</h3>
      <ul class="leader-list">${list}</ul>
    `;
    grid.appendChild(card);
  }
}

function initSources() {
  const grid = document.getElementById('sourcesGrid');
  for (const [key, source] of Object.entries(SOURCES)) {
    const card = document.createElement('a');
    card.className = 'source-card';
    card.href = source.url;
    card.target = '_blank';
    card.rel = 'noopener';
    card.innerHTML = `
      <span class="source-icon">${source.icon}</span>
      <div class="source-info">
        <h4>${source.name}</h4>
        <p>View source →</p>
      </div>
    `;
    grid.appendChild(card);
  }
}

function openModal(model) {
  const overlay = document.getElementById('modalOverlay');
  const provider = PROVIDERS[model.provider];

  document.getElementById('modalName').textContent = model.name;
  document.getElementById('modalProvider').textContent = provider.name;

  // Scores
  const scoresEl = document.getElementById('modalScores');
  scoresEl.innerHTML = '';
  const scores = [
    { label: 'Intelligence', val: model.scores.artificialAnalysis?.intelligence },
    { label: 'Composite', val: model.scores.llmStats?.composite },
    { label: 'Arena Elo', val: model.scores.chatbotArena?.elo },
    { label: 'Reasoning', val: model.scores.llmStats?.reasoning || model.scores.vellum?.gpqa },
    { label: 'Coding', val: model.scores.llmStats?.coding || model.scores.vellum?.swebench },
    { label: 'Agent', val: model.scores.llmStats?.agent },
    { label: 'HLE', val: model.scores.vellum?.hle },
    { label: 'Speed', val: model.scores.artificialAnalysis?.speed, suffix: ' t/s' },
  ];

  scores.filter(s => s.val != null).forEach(s => {
    const div = document.createElement('div');
    div.className = 'modal-score-item';
    div.innerHTML = `
      <div class="modal-score-value">${typeof s.val === 'number' ? s.val.toFixed(1) : s.val}${s.suffix || ''}</div>
      <div class="modal-score-label">${s.label}</div>
    `;
    scoresEl.appendChild(div);
  });

  // Details
  const detailsEl = document.getElementById('modalDetails');
  detailsEl.innerHTML = `
    <div class="modal-detail-item">
      <span class="modal-detail-label">Context Window</span>
      <span class="modal-detail-value">${formatContext(model.contextWindow)}</span>
    </div>
    <div class="modal-detail-item">
      <span class="modal-detail-label">Max Output</span>
      <span class="modal-detail-value">${formatContext(model.maxOutput)}</span>
    </div>
    <div class="modal-detail-item">
      <span class="modal-detail-label">License</span>
      <span class="modal-detail-value">${model.license === 'open' ? 'Open Source' : 'Proprietary'}</span>
    </div>
    <div class="modal-detail-item">
      <span class="modal-detail-label">Pricing (I/O per 1M)</span>
      <span class="modal-detail-value">${model.pricing ? `$${model.pricing.input} / $${model.pricing.output}` : '—'}</span>
    </div>
    <div class="modal-detail-item">
      <span class="modal-detail-label">Release Date</span>
      <span class="modal-detail-value">${model.releaseDate || '—'}</span>
    </div>
    <div class="modal-detail-item">
      <span class="modal-detail-label">Categories</span>
      <span class="modal-detail-value">${model.categories.map(c => CATEGORIES[c]).join(', ')}</span>
    </div>
  `;

  // Highlights
  const hlEl = document.getElementById('modalHighlights');
  if (model.highlights && model.highlights.length) {
    hlEl.innerHTML = `
      <h4>Highlights</h4>
      <ul>${model.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
    `;
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
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('agi-theme');
  if (saved) {
    document.documentElement.dataset.theme = saved;
    toggle.textContent = saved === 'dark' ? '🌙' : '☀️';
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.dataset.theme = 'light';
    toggle.textContent = '☀️';
  }

  toggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('agi-theme', next);
    toggle.textContent = next === 'dark' ? '🌙' : '☀️';

    if (currentTab === 'charts') {
      destroyCharts();
      setTimeout(() => initCharts(), 100);
    }
  });
}

function initKeyboard() {
  document.addEventListener('keydown', e => {
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
