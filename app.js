/* ============================================================
   ROWEL CHESS OS — app.js
   Main application: initialization, board rendering, event
   wiring, theme/language toggles, animations, and toasts.
   ============================================================ */

/* ===== STATE ===== */
let selectedSquare = null;   // {row, col} of currently selected piece
let legalMovesForSelected = []; // legal moves for selected piece
let boardFlipped = false;
let coachConversation = []; // {role, content} history for AI coach

/* ===== TOAST NOTIFICATIONS ===== */

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} [type]
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ===== THEME TOGGLE ===== */

function initTheme() {
  const saved = localStorage.getItem('rowel_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('rowel_theme', next);
      updateThemeIcon(next);
      // Redraw mind map for new color scheme
      if (typeof drawMindMap === 'function') drawMindMap();
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

/* ===== LANGUAGE SWITCHER ===== */

function initLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    if (btn.dataset.lang === CURRENT_LANG) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

/* ===== MOBILE NAV ===== */

function initMobileNav() {
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ===== HERO BOARD BACKGROUND ===== */

function initHeroBoard() {
  const board = document.getElementById('heroBoard');
  if (!board) return;

  for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    const row = Math.floor(i / 8);
    const col = i % 8;
    cell.className = 'cell' + ((row + col) % 2 === 0 ? ' light' : '');
    board.appendChild(cell);
  }

  // Ambient pulse animation: randomly highlight cells
  const cells = board.querySelectorAll('.cell');
  setInterval(() => {
    cells.forEach(c => c.classList.remove('pulse'));
    const numPulse = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numPulse; i++) {
      const idx = Math.floor(Math.random() * cells.length);
      cells[idx].classList.add('pulse');
    }
  }, 1800);
}

/* ===== HERO STATS COUNTER ANIMATION ===== */

function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(target * eased);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

/* ===== SCROLL REVEAL ANIMATIONS ===== */

function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.feature-card, .mission-item, .pricing-card, .analytics-card, .section-header'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
}

/* ===== CHESS BOARD RENDERING ===== */

/**
 * Render the chess board into #chessBoard based on gameEngine state.
 */
function renderBoard() {
  const boardEl = document.getElementById('chessBoard');
  if (!boardEl) return;

  boardEl.innerHTML = '';

  for (let displayRow = 0; displayRow < 8; displayRow++) {
    for (let displayCol = 0; displayCol < 8; displayCol++) {
      // Account for board flip
      const row = boardFlipped ? 7 - displayRow : displayRow;
      const col = boardFlipped ? 7 - displayCol : displayCol;

      const cell = document.createElement('div');
      const isLight = (row + col) % 2 === 0;
      cell.className = `chess-cell ${isLight ? 'light-sq' : 'dark-sq'}`;
      cell.dataset.row = row;
      cell.dataset.col = col;

      const piece = gameEngine.board[row][col];
      if (piece) {
        const span = document.createElement('span');
        span.className = 'piece';
        span.textContent = PIECE_SYMBOLS[piece];
        cell.appendChild(span);
      }

      // Highlight selected square
      if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
        cell.classList.add('selected');
      }

      // Highlight legal moves
      const legalMove = legalMovesForSelected.find(m => m.row === row && m.col === col);
      if (legalMove) {
        cell.classList.add(legalMove.capture ? 'possible-capture' : 'possible-move');
      }

      cell.addEventListener('click', () => handleCellClick(row, col));
      boardEl.appendChild(cell);
    }
  }
}

/**
 * Handle a click on a board cell: select piece, show legal moves, or make a move.
 * @param {number} row
 * @param {number} col
 */
function handleCellClick(row, col) {
  const piece = gameEngine.board[row][col];

  // If a square is already selected and this is a legal move target
  if (selectedSquare) {
    const move = legalMovesForSelected.find(m => m.row === row && m.col === col);
    if (move) {
      makeMove(selectedSquare.row, selectedSquare.col, row, col, move);
      selectedSquare = null;
      legalMovesForSelected = [];
      renderBoard();
      return;
    }
  }

  // Select a new piece if it belongs to the side to move
  if (piece && gameEngine.isOwnPiece(piece, gameEngine.turn)) {
    selectedSquare = { row, col };
    legalMovesForSelected = gameEngine.getLegalMoves(row, col);
  } else {
    selectedSquare = null;
    legalMovesForSelected = [];
  }

  renderBoard();
}

/**
 * Apply a move to the engine, generate a learning lesson, and update the coach.
 */
function makeMove(fromRow, fromCol, toRow, toCol, move) {
  const engineBefore = gameEngine.clone();
  const movingPiece = gameEngine.board[fromRow][fromCol];

  gameEngine.applyMove(fromRow, fromCol, toRow, toCol, move);

  // Classify the move for learning labels
  const tags = gameEngine.classifyMove(fromRow, fromCol, toRow, toCol, move);

  // Check for blunder
  const blunder = AICoach.detectBlunder(engineBefore, gameEngine, { from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } });
  if (blunder) tags.unshift('hanging-pieces');

  // Show lesson(s) in coach panel
  const lessons = getLessonsForTags(tags);
  lessons.forEach(lesson => addCoachMessage(`${lesson.icon} ${lesson.title}: ${lesson.text}`, 'coach'));

  // Game-over toasts
  if (gameEngine.gameOver) {
    if (gameEngine.result === 'checkmate') {
      showToast(t('toast.checkmate'), 'success');
    }
  } else if (gameEngine.isInCheck(gameEngine.turn)) {
    showToast(t('toast.check'), 'info');
  }

  updateCoachStatus();
}

/* ===== AI COACH PANEL ===== */

/**
 * Add a message bubble to the coach chat.
 * @param {string} text
 * @param {'coach'|'user'} sender
 */
function addCoachMessage(text, sender = 'coach') {
  const messages = document.getElementById('coachMessages');
  if (!messages) return;

  const msg = document.createElement('div');
  msg.className = `coach-msg ${sender === 'user' ? 'user-msg' : ''}`;

  if (sender === 'coach') {
    const icon = document.createElement('span');
    icon.className = 'msg-icon';
    icon.textContent = '🧠';
    msg.appendChild(icon);
  }

  const p = document.createElement('p');
  p.textContent = text;
  msg.appendChild(p);

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;

  // Track conversation history for the AI API (max last 10 turns)
  coachConversation.push({ role: sender === 'user' ? 'user' : 'assistant', content: text });
  if (coachConversation.length > 10) coachConversation = coachConversation.slice(-10);
}

function updateCoachStatus() {
  const status = document.getElementById('coachStatus');
  if (!status) return;
  if (gameEngine.gameOver) {
    status.textContent = gameEngine.result === 'checkmate' ? 'Game over — checkmate!' : 'Game over — stalemate.';
  } else {
    status.textContent = gameEngine.turn === 'w' ? 'White to move' : 'Black to move';
  }
}

/**
 * Send the coach input field's text to the AI coach.
 */
async function sendCoachMessage() {
  const input = document.getElementById('coachInput');
  const loading = document.getElementById('coachLoading');
  if (!input || !input.value.trim()) return;

  const userText = input.value.trim();
  addCoachMessage(userText, 'user');
  input.value = '';

  if (loading) loading.style.display = 'flex';

  const history = coachConversation.slice(0, -1); // exclude the message just added
  const response = await AICoach.ask(userText, history);

  if (loading) loading.style.display = 'none';
  addCoachMessage(response, 'coach');
}

/**
 * Trigger a full game analysis from the AI coach.
 */
async function analyzeWithAI() {
  const loading = document.getElementById('coachLoading');
  if (loading) loading.style.display = 'flex';
  showToast(t('toast.analyzing'), 'info');

  const analysis = await AICoach.analyzeGame(gameEngine);

  if (loading) loading.style.display = 'none';
  addCoachMessage(`📊 ${analysis}`, 'coach');
}

/* ===== BOARD CONTROLS ===== */

function initBoardControls() {
  const newGameBtn = document.getElementById('newGameBtn');
  const flipBoardBtn = document.getElementById('flipBoardBtn');
  const undoMoveBtn = document.getElementById('undoMoveBtn');
  const analyzeBtn = document.getElementById('analyzeBtn');

  if (newGameBtn) newGameBtn.addEventListener('click', () => {
    gameEngine.reset();
    selectedSquare = null;
    legalMovesForSelected = [];
    renderBoard();
    updateCoachStatus();
    showToast(t('toast.gameStarted'), 'success');
  });

  if (flipBoardBtn) flipBoardBtn.addEventListener('click', () => {
    boardFlipped = !boardFlipped;
    renderBoard();
    showToast(t('toast.boardFlipped'), 'info');
  });

  if (undoMoveBtn) undoMoveBtn.addEventListener('click', () => {
    if (gameEngine.history.length === 0) return;
    gameEngine.undo();
    selectedSquare = null;
    legalMovesForSelected = [];
    renderBoard();
    updateCoachStatus();
    showToast(t('toast.moveUndone'), 'info');
  });

  if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeWithAI);
}

function initCoachInput() {
  const input = document.getElementById('coachInput');
  const sendBtn = document.getElementById('coachSendBtn');

  if (sendBtn) sendBtn.addEventListener('click', sendCoachMessage);
  if (input) input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendCoachMessage();
  });
}

/* ===== CONTACT FORM ===== */

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast(t('toast.formSent'), 'success');
    form.reset();
  });
}

/* ===== NAVBAR SCROLL EFFECT ===== */

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
    else navbar.style.boxShadow = 'none';
    lastScroll = current;
  });
}

/* ===== APP INITIALIZATION ===== */

document.addEventListener('DOMContentLoaded', () => {
  // Core systems
  initTheme();
  initLanguageSwitcher();
  initMobileNav();
  applyTranslations();

  // Hero
  initHeroBoard();
  initStatsCounter();

  // Chess board & coach
  renderBoard();
  initBoardControls();
  initCoachInput();
  updateCoachStatus();

  // Daily missions
  initMissions();

  // Chess feed
  initFeed();

  // Mind map
  drawMindMap();

  // Analytics dashboard
  renderAnalytics();

  // Social network tabs
  initSocialTabs();

  // Contact form
  initContactForm();

  // Misc
  initNavbarScroll();
  initScrollReveal();
});
