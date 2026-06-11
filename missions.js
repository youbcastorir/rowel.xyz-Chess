/* ============================================================
   ROWEL CHESS OS — missions.js
   Duolingo-style daily missions: tactical puzzles, streaks,
   XP, leveling, and progressive difficulty.
   ============================================================ */

/** Mission definitions (icons + i18n keys + base XP) */
const MISSION_DEFS = [
  { id: 'm1', icon: '🧩', xp: 20, completed: true,  titleKey: 'mission.puzzle1.title',  descKey: 'mission.puzzle1.desc' },
  { id: 'm2', icon: '🎯', xp: 25, completed: true,  titleKey: 'mission.fork.title',     descKey: 'mission.fork.desc' },
  { id: 'm3', icon: '🛡️', xp: 30, completed: false, titleKey: 'mission.defense.title',  descKey: 'mission.defense.desc' },
  { id: 'm4', icon: '♟️', xp: 15, completed: false, titleKey: 'mission.opening.title',  descKey: 'mission.opening.desc' },
  { id: 'm5', icon: '👑', xp: 40, completed: false, titleKey: 'mission.endgame.title',  descKey: 'mission.endgame.desc', locked: true }
];

/** Extra translation strings specific to missions (merged at runtime) */
const MISSION_TRANSLATIONS = {
  en: {
    'mission.puzzle1.title': 'Daily Tactical Puzzle',
    'mission.puzzle1.desc': 'Solve a 2-move tactic rated for your level.',
    'mission.fork.title': 'Spot the Fork',
    'mission.fork.desc': 'Find the move that forks two enemy pieces.',
    'mission.defense.title': 'Defensive Drill',
    'mission.defense.desc': 'Find the best defensive resource in 3 positions.',
    'mission.opening.title': 'Opening Principles',
    'mission.opening.desc': 'Play 5 moves following sound opening principles.',
    'mission.endgame.title': 'King & Pawn Endgame',
    'mission.endgame.desc': 'Unlock at Level 8 — master a basic king and pawn endgame.'
  },
  ar: {
    'mission.puzzle1.title': 'لغز تكتيكي يومي',
    'mission.puzzle1.desc': 'حل تكتيكًا من نقلتين مناسبًا لمستواك.',
    'mission.fork.title': 'اكتشف الشوكة',
    'mission.fork.desc': 'ابحث عن النقلة التي تشكّل شوكة بين قطعتين للخصم.',
    'mission.defense.title': 'تمرين دفاعي',
    'mission.defense.desc': 'ابحث عن أفضل وسيلة دفاع في 3 أوضاع.',
    'mission.opening.title': 'مبادئ الافتتاح',
    'mission.opening.desc': 'العب 5 نقلات وفق مبادئ افتتاح سليمة.',
    'mission.endgame.title': 'نهاية ملك وبيدق',
    'mission.endgame.desc': 'يُفتح في المستوى 8 — أتقن نهاية أساسية بملك وبيدق.'
  },
  fr: {
    'mission.puzzle1.title': 'Puzzle tactique du jour',
    'mission.puzzle1.desc': 'Résolvez une tactique en 2 coups adaptée à votre niveau.',
    'mission.fork.title': 'Repérez la fourchette',
    'mission.fork.desc': 'Trouvez le coup qui fourchette deux pièces adverses.',
    'mission.defense.title': 'Exercice défensif',
    'mission.defense.desc': 'Trouvez la meilleure ressource défensive dans 3 positions.',
    'mission.opening.title': 'Principes d\'ouverture',
    'mission.opening.desc': 'Jouez 5 coups en suivant de bons principes d\'ouverture.',
    'mission.endgame.title': 'Finale roi et pion',
    'mission.endgame.desc': 'Débloqué au niveau 8 — maîtrisez une finale roi et pion de base.'
  },
  es: {
    'mission.puzzle1.title': 'Puzzle táctico diario',
    'mission.puzzle1.desc': 'Resuelve una táctica de 2 movimientos para tu nivel.',
    'mission.fork.title': 'Detecta la horquilla',
    'mission.fork.desc': 'Encuentra el movimiento que crea una horquilla entre dos piezas enemigas.',
    'mission.defense.title': 'Ejercicio defensivo',
    'mission.defense.desc': 'Encuentra el mejor recurso defensivo en 3 posiciones.',
    'mission.opening.title': 'Principios de apertura',
    'mission.opening.desc': 'Juega 5 movimientos siguiendo buenos principios de apertura.',
    'mission.endgame.title': 'Final de rey y peón',
    'mission.endgame.desc': 'Se desbloquea en el nivel 8 — domina un final básico de rey y peón.'
  }
};

// Merge mission translations into the global TRANSLATIONS object
(function mergeMissionTranslations() {
  if (typeof TRANSLATIONS === 'undefined') return;
  Object.keys(MISSION_TRANSLATIONS).forEach(lang => {
    Object.assign(TRANSLATIONS[lang], MISSION_TRANSLATIONS[lang]);
  });
})();

/**
 * Render the daily missions list into #missionsBoard.
 */
function renderMissions() {
  const board = document.getElementById('missionsBoard');
  if (!board) return;

  board.innerHTML = MISSION_DEFS.map(m => {
    const stateClass = m.locked ? 'locked' : (m.completed ? 'completed' : '');
    const checkClass = m.completed ? 'done' : 'pending';
    const checkContent = m.completed ? '✓' : '';
    return `
      <div class="mission-item ${stateClass}" data-mission="${m.id}">
        <div class="mission-icon">${m.icon}</div>
        <div class="mission-content">
          <div class="mission-title">${t(m.titleKey)}</div>
          <div class="mission-desc">${t(m.descKey)}</div>
        </div>
        <div class="mission-xp">+${m.xp} XP</div>
        <div class="mission-check ${checkClass}">${checkContent}</div>
      </div>
    `;
  }).join('');

  // Bind click handlers
  board.querySelectorAll('.mission-item').forEach(item => {
    item.addEventListener('click', () => handleMissionClick(item.dataset.mission));
  });
}

/** Player progress state */
const PROGRESS_KEY = 'rowel_progress';

function getProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : { level: 7, xp: 650, maxXp: 1000, streak: 12 };
  } catch (e) {
    return { level: 7, xp: 650, maxXp: 1000, streak: 12 };
  }
}

function saveProgress(progress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
}

/**
 * Handle a mission click: mark complete, award XP, update UI.
 * @param {string} missionId
 */
function handleMissionClick(missionId) {
  const mission = MISSION_DEFS.find(m => m.id === missionId);
  if (!mission || mission.locked || mission.completed) return;

  mission.completed = true;
  const progress = getProgress();
  progress.xp += mission.xp;

  // Level up if XP exceeds max
  while (progress.xp >= progress.maxXp) {
    progress.xp -= progress.maxXp;
    progress.level += 1;
    progress.maxXp = Math.round(progress.maxXp * 1.15);
  }

  saveProgress(progress);
  renderMissions();
  updateProgressUI(progress);
  showToast(t('toast.missionComplete', { xp: mission.xp }), 'success');
}

/**
 * Update the XP bar, level number, and streak display.
 * @param {Object} progress
 */
function updateProgressUI(progress) {
  const levelEl = document.getElementById('playerLevel');
  const fillEl = document.getElementById('xpFill');
  const currentEl = document.getElementById('currentXP');
  const maxEl = document.getElementById('maxXP');
  const streakEl = document.getElementById('streakCount');

  if (levelEl) levelEl.textContent = progress.level;
  if (fillEl) fillEl.style.width = `${Math.min(100, (progress.xp / progress.maxXp) * 100)}%`;
  if (currentEl) currentEl.textContent = progress.xp;
  if (maxEl) maxEl.textContent = progress.maxXp;
  if (streakEl) streakEl.textContent = progress.streak;
}

/** Initialize missions UI on page load */
function initMissions() {
  renderMissions();
  updateProgressUI(getProgress());
}
