/**
 * Factory 1 Dashboard — Rendering & Refresh Logic
 */

const chartDefaults = {
  color: '#8b8fa3',
  borderColor: '#2a2e3a',
  font: { family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
};

Chart.defaults.color = chartDefaults.color;
Chart.defaults.borderColor = chartDefaults.borderColor;
Chart.defaults.font.family = chartDefaults.font.family;

let charts = {};

// ── Formatters ───────────────────────────────────────────────────

function fmt$(n) {
  if (n == null) return '\u2014';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtDelta(n) {
  if (n == null) return '\u2014';
  const sign = n >= 0 ? '+' : '';
  return sign + n.toFixed(1) + '%';
}

function deltaClass(n) {
  if (n == null) return 'neutral';
  return n >= 0 ? 'positive' : 'negative';
}

// ── KPI Cards ────────────────────────────────────────────────────

async function renderKPIs() {
  const rev = await DataSource.getRevenue();
  const roas = await DataSource.getROAS();
  const margin = await DataSource.getMargin();
  const cashFlow = await DataSource.getCashFlow();

  setText('kpi-revenue-today', fmt$(rev.today));
  setDelta('kpi-revenue-today-delta', rev.todayDelta);

  setText('kpi-revenue-week', fmt$(rev.week));
  setDelta('kpi-revenue-week-delta', rev.weekDelta);

  setText('kpi-revenue-month', fmt$(rev.month));
  setDelta('kpi-revenue-month-delta', rev.monthDelta);

  setText('kpi-roas', roas.blended.toFixed(1) + 'x');
  setDelta('kpi-roas-delta', roas.blendedDelta != null ? roas.blendedDelta * 10 : null);

  setText('kpi-margin', margin.grossMargin.toFixed(1) + '%');
  setDelta('kpi-margin-delta', margin.grossMarginDelta);

  setText('kpi-seed', fmt$(CONFIG.seedCapital));
  setText('kpi-seed-balance', 'Balance: ' + fmt$(cashFlow.balance));
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setDelta(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = fmtDelta(val);
  el.className = 'kpi-delta ' + deltaClass(val);
}

// ── Revenue Chart ────────────────────────────────────────────────

async function renderRevenueChart() {
  const data = await DataSource.getRevenueHistory();
  const labels = data.map(d => d.date.slice(5));
  const values = data.map(d => d.revenue);
  const hasRevenue = values.some(v => v > 0);

  toggleEmpty('revenue-empty', !hasRevenue);

  if (charts.revenue) {
    charts.revenue.data.labels = labels;
    charts.revenue.data.datasets[0].data = values;
    charts.revenue.update();
    return;
  }

  charts.revenue = new Chart(document.getElementById('revenue-chart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Daily Revenue',
        data: values,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => fmt$(ctx.parsed.y),
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => '$' + v },
          grid: { color: 'rgba(42, 46, 58, 0.5)' },
        },
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 10 },
        },
      },
    },
  });
}

// ── Top Products Table ───────────────────────────────────────────

async function renderTopProducts() {
  const products = await DataSource.getTopProducts();
  const hasSales = products.some(p => p.sales > 0);
  toggleEmpty('products-empty', !hasSales);

  const tbody = document.querySelector('#top-products-table tbody');
  tbody.innerHTML = products.slice(0, 8).map(p => `
    <tr>
      <td>${escHtml(p.name)}</td>
      <td>${p.sales}</td>
      <td>${fmt$(p.revenue)}</td>
    </tr>
  `).join('');
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ── Revenue by Category ─────────────────────────────────────────

async function renderCategoryBreakdown() {
  const categories = await DataSource.getRevenueByCategory();
  const tbody = document.querySelector('#category-table tbody');
  tbody.innerHTML = categories.map(c => `
    <tr>
      <td>${escHtml(c.category)}</td>
      <td>${c.products}</td>
      <td>${fmt$(c.revenue)}</td>
    </tr>
  `).join('');
}

// ── ROAS Chart ───────────────────────────────────────────────────

async function renderROASChart() {
  const data = await DataSource.getROAS();
  const platforms = data.platforms.filter(p => p.spend > 0);

  toggleEmpty('roas-empty', platforms.length === 0);

  if (platforms.length === 0) {
    if (charts.roas) {
      charts.roas.destroy();
      charts.roas = null;
    }
    return;
  }

  const labels = platforms.map(p => p.name);
  const roasValues = platforms.map(p => p.roas);
  const spendValues = platforms.map(p => p.spend);

  if (charts.roas) {
    charts.roas.data.labels = labels;
    charts.roas.data.datasets[0].data = roasValues;
    charts.roas.data.datasets[1].data = spendValues;
    charts.roas.update();
    return;
  }

  charts.roas = new Chart(document.getElementById('roas-chart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'ROAS',
          data: roasValues,
          backgroundColor: '#6366f1',
          borderRadius: 4,
          yAxisID: 'y',
        },
        {
          label: 'Spend',
          data: spendValues,
          backgroundColor: 'rgba(99, 102, 241, 0.25)',
          borderRadius: 4,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } },
        tooltip: {
          callbacks: {
            label: ctx => {
              if (ctx.dataset.label === 'ROAS') return ctx.parsed.y.toFixed(1) + 'x';
              return fmt$(ctx.parsed.y);
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          position: 'left',
          ticks: { callback: v => v + 'x' },
          grid: { color: 'rgba(42, 46, 58, 0.5)' },
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          ticks: { callback: v => '$' + v },
          grid: { display: false },
        },
        x: { grid: { display: false } },
      },
    },
  });
}

// ── Cash Flow Chart ──────────────────────────────────────────────

async function renderCashFlowChart() {
  const data = await DataSource.getCashFlow();
  const labels = data.history.map(h => h.date.slice(5));
  const balances = data.history.map(h => h.balance);
  const inflows = data.history.map(h => h.inflow);
  const outflows = data.history.map(h => -h.outflow);

  if (charts.cashflow) {
    charts.cashflow.data.labels = labels;
    charts.cashflow.data.datasets[0].data = balances;
    charts.cashflow.data.datasets[1].data = inflows;
    charts.cashflow.data.datasets[2].data = outflows;
    charts.cashflow.update();
    return;
  }

  charts.cashflow = new Chart(document.getElementById('cashflow-chart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'line',
          label: 'Balance',
          data: balances,
          borderColor: '#6366f1',
          backgroundColor: 'transparent',
          tension: 0.3,
          pointRadius: 0,
          yAxisID: 'y1',
          order: 0,
        },
        {
          label: 'Inflows',
          data: inflows,
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderRadius: 2,
          yAxisID: 'y',
        },
        {
          label: 'Outflows',
          data: outflows,
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderRadius: 2,
          yAxisID: 'y',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const v = ctx.parsed.y;
              return ctx.dataset.label + ': ' + fmt$(Math.abs(v));
            },
          },
        },
      },
      scales: {
        y: {
          stacked: true,
          ticks: { callback: v => '$' + Math.abs(v) },
          grid: { color: 'rgba(42, 46, 58, 0.5)' },
        },
        y1: {
          position: 'right',
          ticks: { callback: v => '$' + v.toLocaleString() },
          grid: { display: false },
        },
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { maxTicksLimit: 10 },
        },
      },
    },
  });
}

// ── Milestone Ring ───────────────────────────────────────────────

async function renderMilestone() {
  const data = await DataSource.getMilestone();
  const pct = data.pct / 100;
  const canvas = document.getElementById('milestone-ring');
  const ctx = canvas.getContext('2d');
  const size = 180;
  const lineWidth = 14;
  const radius = (size - lineWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Background ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#2a2e3a';
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Progress arc
  if (pct > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.strokeStyle = pct >= 1 ? '#22c55e' : '#6366f1';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  setText('milestone-pct', data.pct + '%');
  setText('milestone-deployed', fmt$(data.deployedCapital));
  setText('milestone-profit', fmt$(data.cumulativeNetProfit));
  setText('milestone-target', fmt$(data.targetProfit));
}

// ── Payouts Table ────────────────────────────────────────────────

async function renderPayouts() {
  const data = await DataSource.getPayouts();
  setText('payout-total', fmt$(data.totalPaid));

  const tbody = document.querySelector('#payout-table tbody');
  tbody.innerHTML = data.months.map(m => `
    <tr>
      <td>${escHtml(m.month)}</td>
      <td>${fmt$(m.netProfit)}</td>
      <td>${fmt$(m.payout)}</td>
    </tr>
  `).join('');
}

// ── Reinvestment Chart ───────────────────────────────────────────

async function renderReinvestment() {
  const data = await DataSource.getReinvestment();
  setText('reinvest-total', fmt$(data.totalReinvested));

  const nonZero = data.allocation.filter(a => a.amount > 0);
  const labels = nonZero.map(a => a.category);
  const values = nonZero.map(a => a.amount);
  const colors = ['#6366f1', '#22c55e', '#eab308', '#3b82f6', '#f97316'];

  if (values.length === 0) return;

  if (charts.reinvest) {
    charts.reinvest.data.labels = labels;
    charts.reinvest.data.datasets[0].data = values;
    charts.reinvest.update();
    return;
  }

  charts.reinvest = new Chart(document.getElementById('reinvest-chart'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, values.length),
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, padding: 12 },
        },
        tooltip: {
          callbacks: {
            label: ctx => ctx.label + ': ' + fmt$(ctx.parsed),
          },
        },
      },
    },
  });
}

// ── Jaci Task Log ────────────────────────────────────────────────

async function renderJaciTasks() {
  const data = await DataSource.getJaciTasks();
  setText('jaci-completed', String(data.completedCount));
  setText('jaci-total', String(data.totalAssigned));

  toggleEmpty('jaci-empty', data.tasks.length === 0);

  const tbody = document.querySelector('#jaci-table tbody');
  if (data.tasks.length === 0) {
    tbody.innerHTML = '';
    return;
  }

  tbody.innerHTML = data.tasks.map(t => {
    const statusClass = t.status === 'completed' ? 'status-done' :
                        t.status === 'in_progress' ? 'status-active' : 'status-pending';
    return `
    <tr>
      <td>${escHtml(t.date)}</td>
      <td>${escHtml(t.task)}</td>
      <td><span class="task-status ${statusClass}">${escHtml(t.status)}</span></td>
      <td>${t.hours != null ? t.hours + 'h' : '\u2014'}</td>
    </tr>`;
  }).join('');
}

// ── Helpers ──────────────────────────────────────────────────────

function toggleEmpty(id, show) {
  const el = document.getElementById(id);
  if (el) el.style.display = show ? 'block' : 'none';
}

// ── Refresh All ──────────────────────────────────────────────────

async function refreshDashboard() {
  try {
    await Promise.all([
      renderKPIs(),
      renderRevenueChart(),
      renderTopProducts(),
      renderCategoryBreakdown(),
      renderROASChart(),
      renderCashFlowChart(),
      renderMilestone(),
      renderPayouts(),
      renderReinvestment(),
      renderJaciTasks(),
    ]);

    const now = new Date().toLocaleTimeString();
    setText('last-updated', 'Updated ' + now);

    if (CONFIG.apiBaseUrl) {
      const badge = document.getElementById('data-status');
      badge.textContent = 'LIVE';
      badge.classList.add('live');
      document.getElementById('connection-status').textContent = 'Connected to ' + CONFIG.apiBaseUrl;
    }
  } catch (err) {
    console.error('Dashboard refresh failed:', err);
    const el = document.getElementById('connection-status');
    if (el) el.textContent = 'Error: ' + err.message;
  }
}

// ── Init ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  refreshDashboard();
  setInterval(refreshDashboard, CONFIG.refreshIntervalMs);
});
