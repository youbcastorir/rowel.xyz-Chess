/* ============================================================
   ROWEL CHESS OS — matchmaking.js
   Smart matchmaking (behavioral similarity) + Social Network
   tabs: Leaderboard, Nations, Clubs, Tournaments.
   ============================================================ */

/** Mock leaderboard data (would come from a backend in production) */
const LEADERBOARD_DATA = [
  { rank: 1, name: 'MagnusFan_22', country: '🇳🇴', rating: 2487, winrate: 68, trend: [4,6,5,7,8,9,9] },
  { rank: 2, name: 'TacticalRose', country: '🇪🇸', rating: 2401, winrate: 64, trend: [5,5,6,6,7,7,8] },
  { rank: 3, name: 'KnightRider99', country: '🇲🇦', rating: 2356, winrate: 61, trend: [3,4,4,5,6,6,7] },
  { rank: 4, name: 'PawnStormX', country: '🇫🇷', rating: 2298, winrate: 59, trend: [6,5,6,5,6,7,6] },
  { rank: 5, name: 'QueenGambit_Yo', country: '🇺🇸', rating: 2245, winrate: 57, trend: [4,4,5,5,5,6,6] },
  { rank: 6, name: 'Sahara_Bishop', country: '🇲🇦', rating: 2190, winrate: 55, trend: [3,4,4,4,5,5,5] },
  { rank: 7, name: 'EndgameWizard', country: '🇩🇪', rating: 2134, winrate: 53, trend: [5,4,4,5,4,5,5] },
  { rank: 8, name: 'RookSacAddict', country: '🇲🇽', rating: 2087, winrate: 51, trend: [3,3,4,4,4,4,5] }
];

const NATIONS_DATA = [
  { rank: 1, country: '🇮🇳 India', players: 184320, avgRating: 1842, trend: [6,7,7,8,8,9,9] },
  { rank: 2, country: '🇺🇸 United States', players: 162110, avgRating: 1798, trend: [5,6,6,7,7,7,8] },
  { rank: 3, country: '🇲🇦 Morocco', players: 98230, avgRating: 1765, trend: [4,5,6,6,7,8,8] },
  { rank: 4, country: '🇪🇸 Spain', players: 87650, avgRating: 1750, trend: [4,4,5,5,6,6,7] },
  { rank: 5, country: '🇫🇷 France', players: 81200, avgRating: 1742, trend: [5,5,5,6,6,6,6] },
  { rank: 6, country: '🇧🇷 Brazil', players: 76430, avgRating: 1720, trend: [3,4,4,5,5,5,6] }
];

const CLUBS_DATA = [
  { rank: 1, name: 'Casablanca Knights', members: 4210, country: '🇲🇦', winrate: 62, trend: [5,6,6,7,8,8,9] },
  { rank: 2, name: 'Madrid Bishops Club', members: 3980, country: '🇪🇸', winrate: 60, trend: [5,5,6,6,7,7,8] },
  { rank: 3, name: 'NYC Tactical Society', members: 3750, country: '🇺🇸', winrate: 58, trend: [4,5,5,6,6,7,7] },
  { rank: 4, name: 'Lyon Rook Masters', members: 3102, country: '🇫🇷', winrate: 55, trend: [4,4,5,5,6,6,6] },
  { rank: 5, name: 'Cairo Pawn Pushers', members: 2890, country: '🇪🇬', winrate: 53, trend: [3,4,4,5,5,5,6] }
];

const TOURNAMENTS_DATA = [
  { rank: 1, name: 'World Youth Rapid Open', members: 12400, country: '🌍', winrate: 0, trend: [3,5,7,8,9,9,10], status: 'live' },
  { rank: 2, name: 'Rowel Spring Championship', members: 8900, country: '🌍', winrate: 0, trend: [2,4,5,6,7,8,8], status: 'upcoming' },
  { rank: 3, name: 'Maghreb Schools Cup', members: 5400, country: '🇲🇦', winrate: 0, trend: [4,4,5,5,6,6,7], status: 'upcoming' },
  { rank: 4, name: 'European Club Battle', members: 7200, country: '🇪🇺', winrate: 0, trend: [3,3,4,5,5,6,6], status: 'live' }
];

/** Avatar background colors keyed by rank tier */
function getAvatarColor(rank) {
  const colors = ['#F0B429', '#A78BFA', '#2DD4BF', '#34D399', '#F87171', '#60A5FA', '#FB923C', '#E879F9'];
  return colors[(rank - 1) % colors.length];
}

function rankClass(rank) {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return '';
}

function renderTrendBars(trend) {
  const max = Math.max(...trend);
  return trend.map(v => `<div class="trend-bar" style="height:${Math.round((v / max) * 100)}%"></div>`).join('');
}

/**
 * Render the Leaderboard table (players).
 */
function renderLeaderboard() {
  const rows = LEADERBOARD_DATA.map(p => `
    <div class="leaderboard-row">
      <div class="rank ${rankClass(p.rank)}">#${p.rank}</div>
      <div class="player-cell">
        <div class="player-avatar" style="background:${getAvatarColor(p.rank)}22; color:${getAvatarColor(p.rank)}">${p.name[0]}</div>
        <div>
          <div class="player-name">${p.name}</div>
          <div class="player-country">${p.country}</div>
        </div>
      </div>
      <div class="rating-cell">${p.rating}</div>
      <div class="winrate-cell">${p.winrate}%</div>
      <div class="trend-cell">${renderTrendBars(p.trend)}</div>
    </div>
  `).join('');

  return `
    <div class="leaderboard-table">
      <div class="leaderboard-row header">
        <div>#</div><div>Player</div><div>Rating</div><div>Win %</div><div>Trend</div>
      </div>
      ${rows}
    </div>
  `;
}

/**
 * Render the Nations ranking table.
 */
function renderNations() {
  const rows = NATIONS_DATA.map(n => `
    <div class="leaderboard-row">
      <div class="rank ${rankClass(n.rank)}">#${n.rank}</div>
      <div class="player-cell">
        <div>
          <div class="player-name">${n.country}</div>
          <div class="player-country">${n.players.toLocaleString()} players</div>
        </div>
      </div>
      <div class="rating-cell">${n.avgRating}</div>
      <div class="winrate-cell">avg</div>
      <div class="trend-cell">${renderTrendBars(n.trend)}</div>
    </div>
  `).join('');

  return `
    <div class="leaderboard-table">
      <div class="leaderboard-row header">
        <div>#</div><div>Nation</div><div>Avg Rating</div><div></div><div>Trend</div>
      </div>
      ${rows}
    </div>
  `;
}

/**
 * Render the Clubs ranking table.
 */
function renderClubs() {
  const rows = CLUBS_DATA.map(c => `
    <div class="leaderboard-row">
      <div class="rank ${rankClass(c.rank)}">#${c.rank}</div>
      <div class="player-cell">
        <div class="player-avatar" style="background:${getAvatarColor(c.rank)}22; color:${getAvatarColor(c.rank)}">${c.country}</div>
        <div>
          <div class="player-name">${c.name}</div>
          <div class="player-country">${c.members.toLocaleString()} members</div>
        </div>
      </div>
      <div class="rating-cell">${c.winrate}%</div>
      <div class="winrate-cell">win</div>
      <div class="trend-cell">${renderTrendBars(c.trend)}</div>
    </div>
  `).join('');

  return `
    <div class="leaderboard-table">
      <div class="leaderboard-row header">
        <div>#</div><div>Club</div><div>Win Rate</div><div></div><div>Trend</div>
      </div>
      ${rows}
    </div>
  `;
}

/**
 * Render the Tournaments list.
 */
function renderTournaments() {
  const rows = TOURNAMENTS_DATA.map(tour => {
    const statusLabel = tour.status === 'live' ? '🔴 LIVE' : '🗓️ Soon';
    return `
    <div class="leaderboard-row">
      <div class="rank ${rankClass(tour.rank)}">#${tour.rank}</div>
      <div class="player-cell">
        <div class="player-avatar" style="background:${getAvatarColor(tour.rank)}22; color:${getAvatarColor(tour.rank)}">${tour.country}</div>
        <div>
          <div class="player-name">${tour.name}</div>
          <div class="player-country">${tour.members.toLocaleString()} registered</div>
        </div>
      </div>
      <div class="rating-cell">${statusLabel}</div>
      <div class="winrate-cell"></div>
      <div class="trend-cell">${renderTrendBars(tour.trend)}</div>
    </div>
  `;
  }).join('');

  return `
    <div class="leaderboard-table">
      <div class="leaderboard-row header">
        <div>#</div><div>Tournament</div><div>Status</div><div></div><div>Interest</div>
      </div>
      ${rows}
    </div>
  `;
}

const SOCIAL_RENDERERS = {
  leaderboard: renderLeaderboard,
  nations: renderNations,
  clubs: renderClubs,
  tournaments: renderTournaments
};

/**
 * Render the active social tab content into #socialContent.
 */
function renderSocialContent() {
  const content = document.getElementById('socialContent');
  if (!content) return;
  const activeTab = document.querySelector('.social-tab.active');
  const tab = activeTab ? activeTab.dataset.tab : 'leaderboard';
  const renderer = SOCIAL_RENDERERS[tab] || renderLeaderboard;
  content.innerHTML = renderer();
}

/**
 * Smart matchmaking: find the most behaviorally similar opponent
 * based on a simple style vector (attack, defense, tactical, endgame, opening).
 * @param {Object} playerStyle - {attack, defense, tactical, endgame, opening} (0-100)
 * @param {Array} pool - array of candidate style vectors with .name
 * @returns {Object} best match
 */
function findBestMatch(playerStyle, pool) {
  function distance(a, b) {
    const keys = ['attack', 'defense', 'tactical', 'endgame', 'opening'];
    return Math.sqrt(keys.reduce((sum, k) => sum + Math.pow((a[k] || 0) - (b[k] || 0), 2), 0));
  }
  let best = null;
  let bestDist = Infinity;
  for (const candidate of pool) {
    const d = distance(playerStyle, candidate);
    if (d < bestDist) { bestDist = d; best = candidate; }
  }
  return best;
}

/** Initialize social tabs */
function initSocialTabs() {
  const tabs = document.querySelectorAll('.social-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSocialContent();
    });
  });
  renderSocialContent();
}
