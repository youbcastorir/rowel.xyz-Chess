/* ============================================================
   ROWEL CHESS OS — analytics.js
   Chess Analytics Dashboard: performance tracking, weakness
   analysis, win/loss trends, and progress charts.
   ============================================================ */

/** Mock analytics dataset (would be computed from real game history) */
const ANALYTICS_DATA = {
  rating: 1842,
  ratingChange: +34,
  gamesPlayed: 312,
  winRate: 58,
  winRateChange: +3,
  accuracy: 84,
  accuracyChange: +2,
  blunderRate: 0.8,
  blunderRateChange: -0.3,
  ratingHistory: [1690, 1705, 1720, 1698, 1740, 1755, 1780, 1765, 1800, 1812, 1828, 1842],
  weaknesses: [
    { tag: 'Endgame Technique', score: 38 },
    { tag: 'Pawn Structure', score: 52 },
    { tag: 'Time Management', score: 61 },
    { tag: 'Tactical Vision', score: 63 }
  ]
};

/** Translation strings for analytics labels */
const ANALYTICS_TRANSLATIONS = {
  en: {
    'analytics.rating': 'Current Rating',
    'analytics.games': 'Games Played',
    'analytics.winrate': 'Win Rate',
    'analytics.accuracy': 'Avg. Accuracy',
    'analytics.blunders': 'Blunder Rate',
    'analytics.history': 'Rating Progress (Last 12 Sessions)',
    'analytics.weaknesses': 'Top Weakness Areas',
    'analytics.perGame': 'per game'
  },
  ar: {
    'analytics.rating': 'التصنيف الحالي',
    'analytics.games': 'المباريات الملعوبة',
    'analytics.winrate': 'نسبة الفوز',
    'analytics.accuracy': 'متوسط الدقة',
    'analytics.blunders': 'معدل الأخطاء الفادحة',
    'analytics.history': 'تطور التصنيف (آخر 12 جلسة)',
    'analytics.weaknesses': 'أهم مجالات الضعف',
    'analytics.perGame': 'لكل مباراة'
  },
  fr: {
    'analytics.rating': 'Classement actuel',
    'analytics.games': 'Parties jouées',
    'analytics.winrate': 'Taux de victoire',
    'analytics.accuracy': 'Précision moyenne',
    'analytics.blunders': 'Taux de gaffes',
    'analytics.history': 'Évolution du classement (12 dernières sessions)',
    'analytics.weaknesses': 'Principales faiblesses',
    'analytics.perGame': 'par partie'
  },
  es: {
    'analytics.rating': 'Clasificación actual',
    'analytics.games': 'Partidas jugadas',
    'analytics.winrate': 'Tasa de victorias',
    'analytics.accuracy': 'Precisión media',
    'analytics.blunders': 'Tasa de errores graves',
    'analytics.history': 'Progreso de clasificación (últimas 12 sesiones)',
    'analytics.weaknesses': 'Principales áreas débiles',
    'analytics.perGame': 'por partida'
  }
};

(function mergeAnalyticsTranslations() {
  if (typeof TRANSLATIONS === 'undefined') return;
  Object.keys(ANALYTICS_TRANSLATIONS).forEach(lang => {
    Object.assign(TRANSLATIONS[lang], ANALYTICS_TRANSLATIONS[lang]);
  });
})();

/**
 * Build a mini bar chart's HTML from a numeric array.
 * @param {number[]} data
 * @returns {string}
 */
function buildMiniChart(data) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return data.map(v => {
    const heightPct = 15 + ((v - min) / range) * 85; // min 15% height
    return `<div class="mini-bar" style="height:${heightPct}%"></div>`;
  }).join('');
}

/**
 * Render the full analytics dashboard into #analyticsGrid.
 */
function renderAnalytics() {
  const grid = document.getElementById('analyticsGrid');
  if (!grid) return;
  const d = ANALYTICS_DATA;

  const changeClass = (val) => val >= 0 ? '' : 'down';
  const changeSign = (val) => val >= 0 ? '+' : '';

  grid.innerHTML = `
    <div class="analytics-card">
      <div class="analytics-label">${t('analytics.rating')}</div>
      <div class="analytics-value">${d.rating}</div>
      <div class="analytics-change ${changeClass(d.ratingChange)}">${changeSign(d.ratingChange)}${d.ratingChange} this month</div>
    </div>

    <div class="analytics-card">
      <div class="analytics-label">${t('analytics.winrate')}</div>
      <div class="analytics-value">${d.winRate}%</div>
      <div class="analytics-change ${changeClass(d.winRateChange)}">${changeSign(d.winRateChange)}${d.winRateChange}% this month</div>
    </div>

    <div class="analytics-card">
      <div class="analytics-label">${t('analytics.accuracy')}</div>
      <div class="analytics-value">${d.accuracy}%</div>
      <div class="analytics-change ${changeClass(d.accuracyChange)}">${changeSign(d.accuracyChange)}${d.accuracyChange}% this month</div>
    </div>

    <div class="analytics-card">
      <div class="analytics-label">${t('analytics.blunders')}</div>
      <div class="analytics-value">${d.blunderRate}</div>
      <div class="analytics-change ${changeClass(-d.blunderRateChange)}">${changeSign(d.blunderRateChange)}${d.blunderRateChange} ${t('analytics.perGame')}</div>
    </div>

    <div class="analytics-card analytics-card--wide">
      <div class="analytics-label">${t('analytics.history')}</div>
      <div class="analytics-value" style="font-size:1.4rem">${d.gamesPlayed} ${t('analytics.games')}</div>
      <div class="mini-chart">${buildMiniChart(d.ratingHistory)}</div>
    </div>

    <div class="analytics-card analytics-card--wide">
      <div class="analytics-label">${t('analytics.weaknesses')}</div>
      <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
        ${d.weaknesses.map(w => `
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="flex:1; font-size:0.85rem; color:var(--text-2);">${w.tag}</div>
            <div style="flex:2; height:6px; background:var(--bg-2); border-radius:100px; overflow:hidden;">
              <div style="width:${w.score}%; height:100%; background:linear-gradient(90deg, var(--red), var(--gold));"></div>
            </div>
            <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-2); width:36px; text-align:right;">${w.score}%</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Draw the Mind Map radar chart on #mindMapCanvas.
 * Visualizes: attack, defense, tactical, endgame, opening (5-axis radar).
 */
function drawMindMap() {
  const canvas = document.getElementById('mindMapCanvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2;
  const radius = Math.min(w, h) / 2 - 50;

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)';
  const labelColor = isLight ? '#555566' : '#9999AA';

  const axes = [
    { key: 'attack', label: t('mindmap.attack'), value: 72, color: '#F0B429' },
    { key: 'defense', label: t('mindmap.defense'), value: 45, color: '#2DD4BF' },
    { key: 'tactical', label: t('mindmap.tactical'), value: 63, color: '#A78BFA' },
    { key: 'endgame', label: t('mindmap.endgame'), value: 38, color: '#F87171' },
    { key: 'opening', label: t('mindmap.opening'), value: 81, color: '#34D399' }
  ];

  const n = axes.length;
  const angleStep = (Math.PI * 2) / n;

  ctx.clearRect(0, 0, w, h);

  // Draw concentric grid rings
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath();
    const r = (radius / 4) * ring;
    for (let i = 0; i <= n; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw axis lines and labels
  axes.forEach((axis, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = gridColor;
    ctx.stroke();

    // Label
    const labelX = cx + (radius + 30) * Math.cos(angle);
    const labelY = cy + (radius + 30) * Math.sin(angle);
    ctx.fillStyle = labelColor;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // wrap long labels
    const words = axis.label.split(' ');
    if (words.length > 1) {
      ctx.fillText(words[0], labelX, labelY - 7);
      ctx.fillText(words.slice(1).join(' '), labelX, labelY + 7);
    } else {
      ctx.fillText(axis.label, labelX, labelY);
    }
  });

  // Draw data polygon
  ctx.beginPath();
  axes.forEach((axis, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const r = (axis.value / 100) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(240,180,41,0.15)';
  ctx.fill();
  ctx.strokeStyle = '#F0B429';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw data points
  axes.forEach((axis, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const r = (axis.value / 100) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = axis.color;
    ctx.fill();
  });

  // Update legend values
  const legendMap = {
    attack: 'attackVal', defense: 'defenseVal', tactical: 'tacticalVal',
    endgame: 'endgameVal', opening: 'openingVal'
  };
  axes.forEach(axis => {
    const el = document.getElementById(legendMap[axis.key]);
    if (el) el.textContent = `${axis.value}%`;
  });
}
