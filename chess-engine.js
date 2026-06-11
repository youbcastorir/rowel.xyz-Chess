/* ============================================================
   ROWEL CHESS OS — chess-engine.js
   A lightweight, dependency-free chess engine.
   Handles board state, legal move generation, and move history.
   Not a full FIDE-rules engine (no en-passant/castling validation
   edge cases for check-through-castling), but solid for learning UI.
   ============================================================ */

const PIECE_SYMBOLS = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙', // white
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'  // black
};

class ChessEngine {
  constructor() {
    this.reset();
  }

  reset() {
    // 8x8 board, row 0 = rank 8 (black home), row 7 = rank 1 (white home)
    this.board = [
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R']
    ];
    this.turn = 'w'; // 'w' or 'b'
    this.history = []; // { from, to, piece, captured, promotion }
    this.moveLabels = []; // human-readable concept labels
    this.castling = { K: true, Q: true, k: true, q: true };
    this.enPassant = null; // {row, col} target square
    this.gameOver = false;
    this.result = null; // 'checkmate' | 'stalemate' | null
  }

  isWhite(piece) { return piece && piece === piece.toUpperCase(); }
  isBlack(piece) { return piece && piece === piece.toLowerCase(); }
  isOwnPiece(piece, color) {
    if (!piece) return false;
    return color === 'w' ? this.isWhite(piece) : this.isBlack(piece);
  }
  inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

  clone() {
    const copy = new ChessEngine();
    copy.board = this.board.map(row => row.slice());
    copy.turn = this.turn;
    copy.castling = { ...this.castling };
    copy.enPassant = this.enPassant ? { ...this.enPassant } : null;
    return copy;
  }

  /** Get raw moves for a piece without checking if they leave king in check */
  getRawMoves(row, col) {
    const piece = this.board[row][col];
    if (!piece) return [];
    const color = this.isWhite(piece) ? 'w' : 'b';
    const type = piece.toLowerCase();
    const moves = [];

    const addMove = (r, c) => {
      if (!this.inBounds(r, c)) return false;
      const target = this.board[r][c];
      if (!target) {
        moves.push({ row: r, col: c, capture: false });
        return true; // can continue sliding
      } else if (!this.isOwnPiece(target, color)) {
        moves.push({ row: r, col: c, capture: true });
        return false; // blocked after capture
      }
      return false; // blocked by own piece
    };

    switch (type) {
      case 'p': {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;
        // forward move
        if (this.inBounds(row + dir, col) && !this.board[row + dir][col]) {
          moves.push({ row: row + dir, col, capture: false });
          if (row === startRow && !this.board[row + 2 * dir][col]) {
            moves.push({ row: row + 2 * dir, col, capture: false, doubleStep: true });
          }
        }
        // captures
        for (const dc of [-1, 1]) {
          const r = row + dir, c = col + dc;
          if (!this.inBounds(r, c)) continue;
          const target = this.board[r][c];
          if (target && !this.isOwnPiece(target, color)) {
            moves.push({ row: r, col: c, capture: true });
          } else if (!target && this.enPassant && this.enPassant.row === r && this.enPassant.col === c) {
            moves.push({ row: r, col: c, capture: true, enPassant: true });
          }
        }
        break;
      }
      case 'n': {
        const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        for (const [dr, dc] of deltas) addMove(row + dr, col + dc);
        break;
      }
      case 'b': {
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
          let r = row + dr, c = col + dc;
          while (this.inBounds(r, c) && addMove(r, c)) { r += dr; c += dc; }
        }
        break;
      }
      case 'r': {
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          let r = row + dr, c = col + dc;
          while (this.inBounds(r, c) && addMove(r, c)) { r += dr; c += dc; }
        }
        break;
      }
      case 'q': {
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) {
          let r = row + dr, c = col + dc;
          while (this.inBounds(r, c) && addMove(r, c)) { r += dr; c += dc; }
        }
        break;
      }
      case 'k': {
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[1,-1],[1,0],[1,1],[0,-1],[0,1]]) {
          addMove(row + dr, col + dc);
        }
        // castling
        const rights = this.castling;
        const homeRow = color === 'w' ? 7 : 0;
        if (row === homeRow && col === 4 && !this.isInCheck(color)) {
          const kingside = color === 'w' ? rights.K : rights.k;
          const queenside = color === 'w' ? rights.Q : rights.q;
          if (kingside && !this.board[homeRow][5] && !this.board[homeRow][6] &&
              this.board[homeRow][7] === (color === 'w' ? 'R' : 'r')) {
            if (!this.squareAttacked(homeRow, 5, color) && !this.squareAttacked(homeRow, 6, color)) {
              moves.push({ row: homeRow, col: 6, capture: false, castle: 'kingside' });
            }
          }
          if (queenside && !this.board[homeRow][1] && !this.board[homeRow][2] && !this.board[homeRow][3] &&
              this.board[homeRow][0] === (color === 'w' ? 'R' : 'r')) {
            if (!this.squareAttacked(homeRow, 3, color) && !this.squareAttacked(homeRow, 2, color)) {
              moves.push({ row: homeRow, col: 2, capture: false, castle: 'queenside' });
            }
          }
        }
        break;
      }
    }
    return moves;
  }

  /** Find king position for a color */
  findKing(color) {
    const target = color === 'w' ? 'K' : 'k';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.board[r][c] === target) return { row: r, col: c };
      }
    }
    return null;
  }

  /** Is a square attacked by the opponent of `color`? */
  squareAttacked(row, col, color) {
    const opponent = color === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (!piece) continue;
        if (this.isOwnPiece(piece, opponent)) {
          const moves = this.getRawMoves(r, c).filter(m => !m.castle);
          if (moves.some(m => m.row === row && m.col === col)) return true;
        }
      }
    }
    return false;
  }

  isInCheck(color) {
    const king = this.findKing(color);
    if (!king) return false;
    return this.squareAttacked(king.row, king.col, color);
  }

  /** Get legal moves (filters out moves that leave own king in check) */
  getLegalMoves(row, col) {
    const piece = this.board[row][col];
    if (!piece) return [];
    const color = this.isWhite(piece) ? 'w' : 'b';
    if (color !== this.turn) return [];

    const raw = this.getRawMoves(row, col);
    const legal = [];

    for (const move of raw) {
      const test = this.clone();
      test.applyMove(row, col, move.row, move.col, { ...move, simulate: true });
      if (!test.isInCheck(color)) legal.push(move);
    }
    return legal;
  }

  /** Get all legal moves for the side to move */
  getAllLegalMoves(color) {
    const all = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece && this.isOwnPiece(piece, color)) {
          const moves = this.getLegalMoves(r, c);
          moves.forEach(m => all.push({ from: { row: r, col: c }, to: { row: m.row, col: m.col }, ...m }));
        }
      }
    }
    return all;
  }

  /** Apply a move to the board (mutates state) */
  applyMove(fromRow, fromCol, toRow, toCol, opts = {}) {
    const piece = this.board[fromRow][fromCol];
    const captured = this.board[toRow][toCol];
    const color = this.isWhite(piece) ? 'w' : 'b';
    const type = piece.toLowerCase();

    let actualCaptured = captured;

    // En passant capture
    if (opts.enPassant) {
      const capRow = color === 'w' ? toRow + 1 : toRow - 1;
      actualCaptured = this.board[capRow][toCol];
      this.board[capRow][toCol] = null;
    }

    // Move piece
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Promotion (auto-queen for simplicity)
    if (type === 'p' && (toRow === 0 || toRow === 7)) {
      this.board[toRow][toCol] = color === 'w' ? 'Q' : 'q';
    }

    // Castling: move rook too
    if (opts.castle === 'kingside') {
      const homeRow = color === 'w' ? 7 : 0;
      this.board[homeRow][5] = this.board[homeRow][7];
      this.board[homeRow][7] = null;
    } else if (opts.castle === 'queenside') {
      const homeRow = color === 'w' ? 7 : 0;
      this.board[homeRow][3] = this.board[homeRow][0];
      this.board[homeRow][0] = null;
    }

    // Update castling rights
    if (type === 'k') {
      if (color === 'w') { this.castling.K = false; this.castling.Q = false; }
      else { this.castling.k = false; this.castling.q = false; }
    }
    if (type === 'r') {
      if (fromRow === 7 && fromCol === 0) this.castling.Q = false;
      if (fromRow === 7 && fromCol === 7) this.castling.K = false;
      if (fromRow === 0 && fromCol === 0) this.castling.q = false;
      if (fromRow === 0 && fromCol === 7) this.castling.k = false;
    }

    // Update en passant target
    if (type === 'p' && opts.doubleStep) {
      this.enPassant = { row: (fromRow + toRow) / 2, col: fromCol };
    } else {
      this.enPassant = null;
    }

    if (!opts.simulate) {
      this.history.push({
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        piece, captured: actualCaptured,
        castle: opts.castle || null,
        promotion: (type === 'p' && (toRow === 0 || toRow === 7))
      });
      this.turn = this.turn === 'w' ? 'b' : 'w';
      this.checkGameOver();
    }

    return actualCaptured;
  }

  checkGameOver() {
    const moves = this.getAllLegalMoves(this.turn);
    if (moves.length === 0) {
      this.gameOver = true;
      this.result = this.isInCheck(this.turn) ? 'checkmate' : 'stalemate';
    } else {
      this.gameOver = false;
      this.result = null;
    }
  }

  undo() {
    // Simple undo: replay history minus last move from a fresh board
    if (this.history.length === 0) return;
    const newHistory = this.history.slice(0, -1);
    this.reset();
    for (const move of newHistory) {
      this.applyMove(move.from.row, move.from.col, move.to.row, move.to.col, { castle: move.castle });
    }
  }

  /** Convert board coords to algebraic notation, e.g. (6,4) -> e2 */
  toAlgebraic(row, col) {
    const files = 'abcdefgh';
    return files[col] + (8 - row);
  }

  /**
   * Classify a move into a learning concept label.
   * Used by the AI coach / learning system for "post-match lesson generation".
   */
  classifyMove(fromRow, fromCol, toRow, toCol, move) {
    const piece = this.board[toRow][toCol]; // already moved
    const labels = [];

    if (move.castle) labels.push('castling');
    if (move.enPassant) labels.push('en-passant');
    if (move.capture) labels.push('capture');
    if (move.promotion) labels.push('promotion');

    // Check for check / checkmate after move
    const opponent = this.turn; // turn already flipped after applyMove
    if (this.isInCheck(opponent)) {
      labels.push(this.gameOver && this.result === 'checkmate' ? 'checkmate' : 'check');
    }

    // Detect forks: does the moved piece attack 2+ enemy pieces (incl. king)?
    const newMoves = this.getRawMoves(toRow, toCol);
    const attackedValuable = newMoves.filter(m => {
      const target = this.board[m.row][m.col];
      return target && !this.isOwnPiece(target, this.isWhite(piece) ? 'w' : 'b');
    });
    if (attackedValuable.length >= 2) labels.push('fork');

    // Detect pins: simplistic — a sliding piece now aligned with enemy king through a piece
    if (['b','r','q'].includes(piece.toLowerCase())) {
      const enemyColor = this.isWhite(piece) ? 'b' : 'w';
      const king = this.findKing(enemyColor);
      if (king && this.isAlignedPin(toRow, toCol, king.row, king.col)) {
        labels.push('pin');
      }
    }

    if (labels.length === 0) labels.push('development');
    return labels;
  }

  /** Helper: check if piece at (r,c) and king at (kr,kc) share a line with exactly one piece between */
  isAlignedPin(r, c, kr, kc) {
    const dr = Math.sign(kr - r), dc = Math.sign(kc - c);
    if (dr === 0 && dc === 0) return false;
    if (dr !== 0 && dc !== 0 && Math.abs(kr - r) !== Math.abs(kc - c)) return false; // not diagonal
    if (dr === 0 && dc === 0) return false;

    let pieces = 0;
    let cr = r + dr, cc = c + dc;
    while (cr !== kr || cc !== kc) {
      if (!this.inBounds(cr, cc)) return false;
      if (this.board[cr][cc]) pieces++;
      cr += dr; cc += dc;
    }
    return pieces === 1;
  }

  /** Material count for evaluation/analytics */
  getMaterial() {
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let white = 0, black = 0;
    for (const row of this.board) {
      for (const piece of row) {
        if (!piece) continue;
        const val = values[piece.toLowerCase()];
        if (this.isWhite(piece)) white += val; else black += val;
      }
    }
    return { white, black, diff: white - black };
  }
}

// Export a singleton instance for the demo board
const gameEngine = new ChessEngine();
