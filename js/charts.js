// AGI Rating - Chart Configurations

let charts = {};

function initCharts() {
  const { MODELS, PROVIDERS } = window.AGIRating;
  const { formatPrice } = window.AGIRatingUtils;

  // Chart.js global defaults
  if (window.Chart) {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = '#2d2d5a';
    Chart.defaults.font.family = "'JetBrains Mono', monospace";
    Chart.defaults.font.size = 11;
  }

  // 1. Top 10 by Intelligence
  const top10 = [...MODELS]
    .filter(m => m.scores.artificialAnalysis?.intelligence)
    .sort((a, b) => b.scores.artificialAnalysis.intelligence - a.scores.artificialAnalysis.intelligence)
    .slice(0, 10);

  charts.intelligence = new Chart(document.getElementById('chartIntelligence'), {
    type: 'bar',
    data: {
      labels: top10.map(m => m.name),
      datasets: [{
        label: 'Intelligence Score',
        data: top10.map(m => m.scores.artificialAnalysis.intelligence),
        backgroundColor: top10.map(m => PROVIDERS[m.provider].color + 'cc'),
        borderColor: top10.map(m => PROVIDERS[m.provider].color),
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#2d2d5a44' }, min: 40 },
        y: { grid: { display: false } }
      }
    }
  });

  // 2. Price vs Performance (scatter)
  const priced = MODELS.filter(m => m.pricing && m.scores.artificialAnalysis?.intelligence);
  charts.pricePerf = new Chart(document.getElementById('chartPricePerf'), {
    type: 'scatter',
    data: {
      datasets: Object.keys(PROVIDERS).map(pid => {
        const models = priced.filter(m => m.provider === pid);
        if (!models.length) return null;
        return {
          label: PROVIDERS[pid].name,
          data: models.map(m => ({
            x: (m.pricing.input + m.pricing.output) / 2,
            y: m.scores.artificialAnalysis.intelligence,
            name: m.name,
          })),
          backgroundColor: PROVIDERS[pid].color + 'cc',
          borderColor: PROVIDERS[pid].color,
          pointRadius: 6,
          pointHoverRadius: 9,
        };
      }).filter(Boolean)
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw.name}: Score ${ctx.raw.y}, $${ctx.raw.x.toFixed(2)}/M`
          }
        },
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8 } }
      },
      scales: {
        x: { title: { display: true, text: 'Avg Price ($/1M tokens)' }, grid: { color: '#2d2d5a44' } },
        y: { title: { display: true, text: 'Intelligence Score' }, grid: { color: '#2d2d5a44' }, min: 40 }
      }
    }
  });

  // 3. Provider Distribution (doughnut)
  const providerCounts = {};
  MODELS.forEach(m => {
    providerCounts[m.provider] = (providerCounts[m.provider] || 0) + 1;
  });
  const sortedProviders = Object.entries(providerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  charts.providers = new Chart(document.getElementById('chartProviders'), {
    type: 'doughnut',
    data: {
      labels: sortedProviders.map(([pid]) => PROVIDERS[pid].name),
      datasets: [{
        data: sortedProviders.map(([, count]) => count),
        backgroundColor: sortedProviders.map(([pid]) => PROVIDERS[pid].color + 'cc'),
        borderColor: sortedProviders.map(([pid]) => PROVIDERS[pid].color),
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { boxWidth: 12, padding: 8 } }
      }
    }
  });

  // 4. Context Window vs Speed (scatter)
  const withSpeed = MODELS.filter(m => m.contextWindow && m.scores.artificialAnalysis?.speed);
  charts.contextSpeed = new Chart(document.getElementById('chartContextSpeed'), {
    type: 'scatter',
    data: {
      datasets: Object.keys(PROVIDERS).map(pid => {
        const models = withSpeed.filter(m => m.provider === pid);
        if (!models.length) return null;
        return {
          label: PROVIDERS[pid].name,
          data: models.map(m => ({
            x: Math.log10(m.contextWindow),
            y: m.scores.artificialAnalysis.speed,
            name: m.name,
          })),
          backgroundColor: PROVIDERS[pid].color + 'cc',
          borderColor: PROVIDERS[pid].color,
          pointRadius: 6,
          pointHoverRadius: 9,
        };
      }).filter(Boolean)
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw.name}: ${ctx.raw.y} t/s, ${(10 ** ctx.raw.x / 1e6).toFixed(1)}M ctx`
          }
        },
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8 } }
      },
      scales: {
        x: {
          title: { display: true, text: 'Context Window (log scale)' },
          grid: { color: '#2d2d5a44' },
          ticks: {
            callback: v => {
              const tokens = 10 ** v;
              return tokens >= 1e6 ? (tokens / 1e6).toFixed(0) + 'M' : (tokens / 1e3).toFixed(0) + 'K';
            }
          }
        },
        y: { title: { display: true, text: 'Speed (tokens/sec)' }, grid: { color: '#2d2d5a44' } }
      }
    }
  });
}

function destroyCharts() {
  Object.values(charts).forEach(c => c?.destroy());
  charts = {};
}

window.AGIRatingCharts = { initCharts, destroyCharts };
