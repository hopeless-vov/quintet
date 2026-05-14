import { describe, it, expect } from 'vitest';
import { newGameState, isDeadCard, applyMove, discardDead } from '../engine';
import { legalMoves, isJack } from '../moves';

// ── helpers ────────────────────────────────────────────────────────────────

function findValidMove(state: ReturnType<typeof newGameState>, playerIdx: number) {
  const player = state.players[playerIdx];
  for (let cardIdx = 0; cardIdx < player.hand.length; cardIdx++) {
    const card = player.hand[cardIdx];
    if (isJack(card)) continue;
    const moves = legalMoves(state.board, card, state.chips, player.color);
    if (moves.length > 0) return { cardIdx, r: moves[0].r, c: moves[0].c };
  }
  return null;
}

// ── newGameState ───────────────────────────────────────────────────────────

describe('newGameState', () => {
  it('creates the right number of players', () => {
    expect(newGameState(['Alice', 'Bob']).players).toHaveLength(2);
    expect(newGameState(['A', 'B', 'C']).players).toHaveLength(3);
    expect(newGameState(['A', 'B', 'C', 'D']).players).toHaveLength(4);
  });

  it('deals 7 cards per player in 2–3 player games', () => {
    for (const names of [['Alice', 'Bob'], ['A', 'B', 'C']]) {
      const state = newGameState(names);
      state.players.forEach(p => expect(p.hand).toHaveLength(7));
    }
  });

  it('deals 6 cards per player in a 4-player game', () => {
    const state = newGameState(['A', 'B', 'C', 'D']);
    state.players.forEach(p => expect(p.hand).toHaveLength(6));
  });

  it('starts with an empty chips grid', () => {
    const state = newGameState(['Alice', 'Bob']);
    state.chips.forEach(row => row.forEach(cell => expect(cell).toBeNull()));
  });

  it('starts with no winner and currentPlayer = 0', () => {
    const state = newGameState(['Alice', 'Bob']);
    expect(state.winner).toBeNull();
    expect(state.currentPlayer).toBe(0);
  });

  it('has a non-empty deck after dealing', () => {
    const state = newGameState(['Alice', 'Bob']);
    expect(state.deck.length).toBeGreaterThan(0);
  });

  it('assigns unique colors to each player', () => {
    const state = newGameState(['A', 'B', 'C', 'D']);
    const colors = state.players.map(p => p.color);
    expect(new Set(colors).size).toBe(4);
  });
});

// ── isDeadCard ─────────────────────────────────────────────────────────────

describe('isDeadCard', () => {
  it('Jacks are never dead', () => {
    const state = newGameState(['Alice', 'Bob']);
    expect(isDeadCard(state, { rank: 'J', suit: 'hearts' })).toBe(false);
    expect(isDeadCard(state, { rank: 'J', suit: 'diamonds' })).toBe(false);
  });

  it('a card with at least one empty matching cell is not dead', () => {
    const state = newGameState(['Alice', 'Bob']);
    const boardCard = state.board.flat().find(c => c.type === 'card');
    if (!boardCard || boardCard.type !== 'card') return;
    expect(isDeadCard(state, { rank: boardCard.rank, suit: boardCard.suit })).toBe(false);
  });

  it('a card is dead when all its matching cells are occupied', () => {
    const state = newGameState(['Alice', 'Bob']);
    // Find a card on the board and occupy all its positions
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const cell = state.board[r][c];
        if (cell.type === 'card' && cell.rank === '2' && cell.suit === 'spades') {
          state.chips[r][c] = { color: 'blue', owner: 1, locked: false };
        }
      }
    }
    expect(isDeadCard(state, { rank: '2', suit: 'spades' })).toBe(true);
  });
});

// ── applyMove ──────────────────────────────────────────────────────────────

describe('applyMove', () => {
  it('returns ok:true and places a chip for a valid regular move', () => {
    const state = newGameState(['Alice', 'Bob']);
    const move = findValidMove(state, 0);
    expect(move).not.toBeNull();
    const result = applyMove(state, 0, move!.cardIdx, move!.r, move!.c);
    expect(result.ok).toBe(true);
    expect(state.chips[move!.r][move!.c]?.color).toBe(state.players[0].color);
  });

  it('advances currentPlayer after a successful move', () => {
    const state = newGameState(['Alice', 'Bob']);
    const move = findValidMove(state, 0);
    applyMove(state, 0, move!.cardIdx, move!.r, move!.c);
    expect(state.currentPlayer).toBe(1);
  });

  it('player draws a new card after playing', () => {
    const state = newGameState(['Alice', 'Bob']);
    const before = state.players[0].hand.length;
    const move = findValidMove(state, 0);
    applyMove(state, 0, move!.cardIdx, move!.r, move!.c);
    expect(state.players[0].hand.length).toBe(before);
  });

  it('returns error "corner" when targeting a free cell', () => {
    const state = newGameState(['Alice', 'Bob']);
    let fr = -1, fc = -1;
    outer: for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (state.board[r][c].type === 'free') { fr = r; fc = c; break outer; }
      }
    }
    const result = applyMove(state, 0, 0, fr, fc);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('corner');
  });

  it('returns error "occupied" when cell already has a chip', () => {
    const state = newGameState(['Alice', 'Bob']);
    const move = findValidMove(state, 0);
    expect(move).not.toBeNull();
    state.chips[move!.r][move!.c] = { color: 'blue', owner: 1, locked: false };
    const result = applyMove(state, 0, move!.cardIdx, move!.r, move!.c);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('occupied');
  });

  it('returns error "mismatch" when card does not match cell', () => {
    const state = newGameState(['Alice', 'Bob']);
    // Find a non-jack card and a cell it definitely doesn't match
    const player = state.players[0];
    const cardIdx = player.hand.findIndex(c => !isJack(c));
    // Place it on a cell with different content
    const card = player.hand[cardIdx];
    let tr = -1, tc = -1;
    outer2: for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const cell = state.board[r][c];
        if (cell.type === 'card' && (cell.rank !== card.rank || cell.suit !== card.suit) && !state.chips[r][c]) {
          tr = r; tc = c; break outer2;
        }
      }
    }
    const result = applyMove(state, 0, cardIdx, tr, tc);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('mismatch');
  });
});

// ── discardDead ────────────────────────────────────────────────────────────

describe('discardDead', () => {
  it('returns error when the card is not dead', () => {
    const state = newGameState(['Alice', 'Bob']);
    const result = discardDead(state, 0, 0);
    expect(result.ok).toBe(false);
  });

  it('successfully discards a dead card and draws a replacement', () => {
    const state = newGameState(['Alice', 'Bob']);
    const before = state.players[0].hand.length;
    // Make the first non-jack card dead by occupying all its board positions
    const player = state.players[0];
    const cardIdx = player.hand.findIndex(c => !isJack(c));
    const deadCard = player.hand[cardIdx];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const cell = state.board[r][c];
        if (cell.type === 'card' && cell.rank === deadCard.rank && cell.suit === deadCard.suit) {
          state.chips[r][c] = { color: 'blue', owner: 1, locked: false };
        }
      }
    }
    const result = discardDead(state, 0, cardIdx);
    expect(result.ok).toBe(true);
    expect(state.players[0].hand.length).toBe(before);
  });
});
