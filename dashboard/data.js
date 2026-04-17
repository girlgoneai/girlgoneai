/**
 * Factory 1 Dashboard — Data Layer
 *
 * All data access goes through DataSource. Currently returns seed/placeholder data.
 * To connect real APIs, replace the implementations with fetch() calls.
 *
 * Data file: dashboard-data.json (loaded at runtime, can be updated manually or via webhook)
 */

const CONFIG = {
  seedCapital: 25000,
  roiTarget: 0.25, // 25%
  ownerPayoutRate: 0.15,
  reinvestmentRate: 0.85,
  refreshIntervalMs: 60000,
  productsInCatalog: 140,
  // Set to a real base URL when APIs are available
  apiBaseUrl: null,
  // Path to JSON data file (for manual updates or webhook integration)
  dataFileUrl: null,
};

const DataSource = {
  async getRevenue() {
    if (CONFIG.apiBaseUrl) {
      // TODO: fetch from Gumroad/Lemon Squeezy API
    }
    return SeedData.revenue();
  },

  async getTopProducts() {
    if (CONFIG.apiBaseUrl) {
      // TODO: fetch from storefront API
    }
    return SeedData.topProducts();
  },

  async getRevenueByCategory() {
    if (CONFIG.apiBaseUrl) {
      // TODO: fetch from storefront API
    }
    return SeedData.revenueByCategory();
  },

  async getROAS() {
    if (CONFIG.apiBaseUrl) {
      // TODO: fetch from Meta/Google Ads APIs
    }
    return SeedData.roas();
  },

  async getCashFlow() {
    if (CONFIG.apiBaseUrl) {
      // TODO: fetch from banking/accounting API
    }
    return SeedData.cashFlow();
  },

  async getMilestone() {
    if (CONFIG.apiBaseUrl) {
      // TODO: compute from real financial data
    }
    return SeedData.milestone();
  },

  async getPayouts() {
    if (CONFIG.apiBaseUrl) {
      // TODO: fetch from Banker Agent
    }
    return SeedData.payouts();
  },

  async getReinvestment() {
    if (CONFIG.apiBaseUrl) {
      // TODO: fetch from Investment Agent
    }
    return SeedData.reinvestment();
  },

  async getMargin() {
    if (CONFIG.apiBaseUrl) {
      // TODO: compute from real revenue/COGS
    }
    return SeedData.margin();
  },

  async getRevenueHistory() {
    if (CONFIG.apiBaseUrl) {
      // TODO: fetch daily revenue series
    }
    return SeedData.revenueHistory();
  },

  async getJaciTasks() {
    if (CONFIG.apiBaseUrl) {
      // TODO: fetch from Paperclip API
    }
    return SeedData.jaciTasks();
  },
};

// ── Seed Data (pre-launch reality) ──────────────────────────────

const SeedData = {
  revenue() {
    return {
      today: 0,
      week: 0,
      month: 0,
      todayDelta: null,
      weekDelta: null,
      monthDelta: null,
    };
  },

  topProducts() {
    // No sales yet — show top catalog items ready to sell
    return [
      { name: 'ADHD Daily Planner', sales: 0, revenue: 0 },
      { name: 'Freelance Invoice Template', sales: 0, revenue: 0 },
      { name: 'Content Creator Notion Kit', sales: 0, revenue: 0 },
      { name: 'AI Prompt Pack — Coding', sales: 0, revenue: 0 },
      { name: 'Goal-Setting System', sales: 0, revenue: 0 },
    ];
  },

  revenueByCategory() {
    return [
      { category: 'Notion Templates', revenue: 0, products: 42 },
      { category: 'Digital Planners', revenue: 0, products: 35 },
      { category: 'AI Prompt Packs', revenue: 0, products: 28 },
      { category: 'Spreadsheet Tools', revenue: 0, products: 20 },
      { category: 'Workflow Kits', revenue: 0, products: 15 },
    ];
  },

  roas() {
    return {
      blended: 0,
      blendedDelta: null,
      platforms: [
        { name: 'Meta', roas: 0, spend: 0, revenue: 0 },
        { name: 'Google', roas: 0, spend: 0, revenue: 0 },
        { name: 'TikTok', roas: 0, spend: 0, revenue: 0 },
        { name: 'Organic', roas: null, spend: 0, revenue: 0 },
      ],
    };
  },

  cashFlow() {
    const today = new Date();
    const history = [];
    let balance = 25000;
    // Show seed capital with agent spend as only outflow so far
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const agentCost = i === 0 ? 251 : Math.round(251 / 7); // spread $251 MTD
      const outflow = agentCost;
      balance = balance - outflow;
      history.push({
        date: d.toISOString().slice(0, 10),
        inflow: 0,
        outflow,
        balance,
      });
    }
    return {
      balance: history[history.length - 1].balance,
      inflows: 0,
      outflows: 251,
      history,
    };
  },

  milestone() {
    const deployed = 25000;
    const profit = 0;
    const target = deployed * 0.25;
    return {
      deployedCapital: deployed,
      cumulativeNetProfit: profit,
      targetProfit: target,
      pct: 0,
    };
  },

  payouts() {
    return {
      totalPaid: 0,
      months: [
        { month: 'Apr 2026', netProfit: 0, payout: 0 },
      ],
    };
  },

  reinvestment() {
    return {
      totalReinvested: 251,
      allocation: [
        { category: 'Agent Spend', amount: 251 },
        { category: 'Ad Spend', amount: 0 },
        { category: 'Product Creation', amount: 0 },
        { category: 'Tools & Infra', amount: 0 },
      ],
    };
  },

  margin() {
    return {
      grossMargin: 0,
      grossMarginDelta: null,
    };
  },

  revenueHistory() {
    // No revenue yet — flat zero line
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      data.push({
        date: d.toISOString().slice(0, 10),
        revenue: 0,
      });
    }
    return data;
  },

  jaciTasks() {
    return {
      completedCount: 0,
      totalAssigned: 0,
      tasks: [
        // Will be populated when Jaci starts daily tasks
        // { date: '2026-04-13', task: 'Instagram Reel: Top 5 planners', status: 'completed', hours: 1.5 },
      ],
    };
  },
};
