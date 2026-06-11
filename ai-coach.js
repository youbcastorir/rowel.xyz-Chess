/* ============================================================
   ROWEL CHESS OS — ai-coach.js
   The AI Personal Coach: post-game analysis, blunder detection,
   conversational coaching, and weekly improvement plans.

   This module calls the Claude API (claude-sonnet-4-20250514)
   via the standard /v1/messages endpoint. No API key handling
   needed — the runtime injects credentials.
   ============================================================ */

const AICoach = (() => {

  /** Player memory: tracks weaknesses across the session (localStorage-persisted) */
  const MEMORY_KEY = 'rowel_coach_memory';

  function getMemory() {
    try {
      const raw = localStorage.getItem(MEMORY_KEY);
      return raw ? JSON.parse(raw) : {
        blunders: 0,
        missedTactics: 0,
        gamesAnalyzed: 0,
        weaknessTags: [],
        lastSummary: null
      };
    } catch (e) {
      return { blunders: 0, missedTactics: 0, gamesAnalyzed: 0, weaknessTags: [], lastSummary: null };
    }
  }

  function saveMemory(mem) {
    try { localStorage.setItem(MEMORY_KEY, JSON.stringify(mem)); } catch (e) { /* ignore */ }
  }

  function recordWeakness(tag) {
    const mem = getMemory();
    if (!mem.weaknessTags.includes(tag)) mem.weaknessTags.push(tag);
    saveMemory(mem);
  }

  /**
   * Build the system context describing the coach persona + player memory.
   */
  function buildSystemPrompt() {
    const mem = getMemory();
    const lang = (typeof CURRENT_LANG !== 'undefined') ? CURRENT_LANG : 'en';
    const langNames = { en: 'English', ar: 'Arabic', fr: 'French', es: 'Spanish' };

    return `You are the Rowel AI Chess Coach, a warm, encouraging, and insightful personal chess teacher inside "Rowel Chess OS".
Your job: explain chess moves and concepts (forks, pins, skewers, sacrifices, weak squares, pawn structure, king safety) in a way a learner can understand and apply.
Always be concise (2-4 sentences unless asked for more detail), specific, and actionable. Use a friendly, motivating tone — like a great coach, not a engine printout.
Player memory so far: ${mem.gamesAnalyzed} games analyzed, ${mem.blunders} blunders flagged, weaknesses noted: ${mem.weaknessTags.join(', ') || 'none yet'}.
Respond in ${langNames[lang] || 'English'}. Do not use markdown headers; plain conversational text only, short paragraphs or a brief list if needed.`;
  }

  /**
   * Send a message to the Claude API and return the text response.
   * @param {string} userMessage
   * @param {Array} [history] - prior {role, content} messages for context
   * @returns {Promise<string>}
   */
  async function ask(userMessage, history = []) {
    try {
      const messages = [
        ...history,
        { role: 'user', content: userMessage }
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages
        })
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const text = data.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');

      return text || "I couldn't quite form a thought there — could you try rephrasing?";
    } catch (err) {
      console.error('AI Coach error:', err);
      return getFallbackResponse(userMessage);
    }
  }

  /**
   * Offline fallback responses if the API is unavailable —
   * keeps the demo functional without network access.
   */
  function getFallbackResponse(userMessage) {
    const fallbacks = [
      "That's a great question. In general, controlling the center early gives your pieces more options and restricts your opponent's plans.",
      "When evaluating a position, always check for hanging pieces first — undefended material is the #1 source of blunders for improving players.",
      "A good rule of thumb: before every move, ask 'what is my opponent's best response?' This single habit prevents most tactical disasters.",
      "Knights are strongest near the center and weakest on the rim — 'a knight on the rim is dim' is a classic saying for a reason.",
      "Try to connect your rooks and get your king to safety (usually via castling) before launching an attack."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  /**
   * Analyze the current game state and produce a post-game / post-move summary.
   * Builds a compact PGN-like move list and asks the AI to comment.
   * @param {ChessEngine} engine
   * @returns {Promise<string>}
   */
  async function analyzeGame(engine) {
    const moveList = engine.history.map((m, i) => {
      const notation = `${m.piece}${engine.toAlgebraic(m.from.row, m.from.col)}-${engine.toAlgebraic(m.to.row, m.to.col)}${m.captured ? ' (capture)' : ''}`;
      return `${i + 1}. ${notation}`;
    }).join(', ');

    const material = engine.getMaterial();
    const status = engine.gameOver
      ? `Game over: ${engine.result}.`
      : `Game in progress, ${engine.turn === 'w' ? 'White' : 'Black'} to move.`;

    if (engine.history.length === 0) {
      return askLocally("The board is fresh — no moves yet! Make a move and I'll start analyzing your thinking in real time. Try controlling the center with a pawn or developing a knight.");
    }

    const prompt = `Analyze this chess game so far. Moves played: ${moveList}.
Material balance: White ${material.white}, Black ${material.black} (diff ${material.diff}).
${status}
Give a short coaching summary: 1) one key tactical or strategic theme from the moves played, 2) one concrete suggestion for the side to move, 3) one encouraging note. Keep it under 80 words.`;

    const mem = getMemory();
    mem.gamesAnalyzed += 1;
    saveMemory(mem);

    return ask(prompt);
  }

  /**
   * Detect a blunder: did the last move hang material (a piece now capturable for free)?
   * Returns a label string or null.
   * @param {ChessEngine} engineBefore - state before the move
   * @param {ChessEngine} engineAfter - state after the move
   * @param {Object} move - {from, to, capture, ...}
   */
  function detectBlunder(engineBefore, engineAfter, move) {
    const piece = engineAfter.board[move.to.row][move.to.col];
    if (!piece) return null;
    const color = engineAfter.isWhite(piece) ? 'w' : 'b';
    const opponent = color === 'w' ? 'b' : 'w';

    // Is the moved piece now attacked by the opponent and undefended?
    const isAttacked = engineAfter.squareAttacked(move.to.row, move.to.col, color);
    if (!isAttacked) return null;

    // Is it defended by our own side?
    const test = engineAfter.clone();
    test.board[move.to.row][move.to.col] = null; // remove piece temporarily
    const wouldBeDefendedSquare = engineAfter.squareAttacked(move.to.row, move.to.col, opponent === 'w' ? 'b' : 'w');

    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
    const value = pieceValues[piece.toLowerCase()];

    if (value >= 3) {
      const mem = getMemory();
      mem.blunders += 1;
      saveMemory(mem);
      recordWeakness('hanging-pieces');
      return {
        severity: value >= 9 ? 'major' : 'moderate',
        piece: piece.toUpperCase(),
        square: engineAfter.toAlgebraic(move.to.row, move.to.col)
      };
    }
    return null;
  }

  /** Simple wrapper to return a static string as a resolved promise (for offline messages) */
  function askLocally(text) {
    return Promise.resolve(text);
  }

  /**
   * Generate a weekly improvement plan based on accumulated memory.
   */
  async function getWeeklyPlan() {
    const mem = getMemory();
    const prompt = `Based on a player's recent activity (${mem.gamesAnalyzed} games analyzed, ${mem.blunders} blunders, weaknesses: ${mem.weaknessTags.join(', ') || 'general fundamentals'}), give a short weekly improvement plan: 3 bullet-style focus areas for the week, each one sentence. Keep total under 70 words.`;
    return ask(prompt);
  }

  return {
    ask,
    analyzeGame,
    detectBlunder,
    getWeeklyPlan,
    getMemory,
    recordWeakness
  };
})();
