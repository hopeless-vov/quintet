import { describe, it, expect } from 'vitest';
import type { BoardCard, ChipState } from '@/types/game';
import { isJack, isTwoEyedJack, isOneEyedJack, cardsMatch, legalMoves } from '../moves';

// ── helpers ────────────────────────────────────────────────────────────────

function makeBoard(): BoardCard[][] {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({ type: 'card' as const, rank: '2' as const, suit: 'spades' as const })),
  );
}

function makeChips(): ChipState[][] {
  return Array.from({ length: 10 }, () => Array(10).fill(null));
}

// ── isJack ─────────────────────────────────────────────────────────────────

describe('isJack', () => {
  it('returns true for any Jack', () => {
    expect(isJack({ rank: 'J', suit: 'hearts' })).toBe(true);
    expect(isJack({ rank: 'J', suit: 'spades' })).toBe(true);
    expect(isJack({ rank: 'J', suit: 'diamonds' })).toBe(true);
    expect(isJack({ rank: 'J', suit: 'clubs' })).toBe(true);
  });

  it('returns false for non-Jack ranks', () => {
    expect(isJack({ rank: 'A', suit: 'hearts' })).toBe(false);
    expect(isJack({ rank: 'Q', suit: 'clubs' })).toBe(false);
    expect(isJack({ rank: 'K', suit: 'spades' })).toBe(false);
    expect(isJack({ rank: '10', suit: 'diamonds' })).toBe(false);
  });
});

// ── isTwoEyedJack ──────────────────────────────────────────────────────────

describe('isTwoEyedJack', () => {
  it('J♦ and J♣ are two-eyed (wild)', () => {
    expect(isTwoEyedJack({ rank: 'J', suit: 'diamonds' })).toBe(true);
    expect(isTwoEyedJack({ rank: 'J', suit: 'clubs' })).toBe(true);
  });

  it('J♥ and J♠ are not two-eyed', () => {
    expect(isTwoEyedJack({ rank: 'J', suit: 'hearts' })).toBe(false);
    expect(isTwoEyedJack({ rank: 'J', suit: 'spades' })).toBe(false);
  });

  it('non-Jack cards are not two-eyed', () => {
    expect(isTwoEyedJack({ rank: 'Q', suit: 'diamonds' })).toBe(false);
  });
});

// ── isOneEyedJack ──────────────────────────────────────────────────────────

describe('isOneEyedJack', () => {
  it('J♥ and J♠ are one-eyed (anti-wild)', () => {
    expect(isOneEyedJack({ rank: 'J', suit: 'hearts' })).toBe(true);
    expect(isOneEyedJack({ rank: 'J', suit: 'spades' })).toBe(true);
  });

  it('J♦ and J♣ are not one-eyed', () => {
    expect(isOneEyedJack({ rank: 'J', suit: 'diamonds' })).toBe(false);
    expect(isOneEyedJack({ rank: 'J', suit: 'clubs' })).toBe(false);
  });
});

// ── cardsMatch ─────────────────────────────────────────────────────────────

describe('cardsMatch', () => {
  it('matches when rank and suit are identical', () => {
    expect(cardsMatch(
      { rank: 'A', suit: 'spades' },
      { type: 'card', rank: 'A', suit: 'spades' },
    )).toBe(true);
  });

  it('does not match a free cell', () => {
    expect(cardsMatch({ rank: 'A', suit: 'spades' }, { type: 'free' })).toBe(false);
  });

  it('does not match different rank', () => {
    expect(cardsMatch(
      { rank: 'A', suit: 'spades' },
      { type: 'card', rank: 'K', suit: 'spades' },
    )).toBe(false);
  });

  it('does not match different suit', () => {
    expect(cardsMatch(
      { rank: 'A', suit: 'spades' },
      { type: 'card', rank: 'A', suit: 'hearts' },
    )).toBe(false);
  });
});

// ── legalMoves ─────────────────────────────────────────────────────────────

describe('legalMoves — regular card', () => {
  it('finds cells that match the card and are empty', () => {
    const board = makeBoard();
    board[3][4] = { type: 'card', rank: 'A', suit: 'hearts' };
    board[7][2] = { type: 'card', rank: 'A', suit: 'hearts' };
    const moves = legalMoves(board, { rank: 'A', suit: 'hearts' }, makeChips(), 'red');
    expect(moves).toHaveLength(2);
    expect(moves).toContainEqual({ r: 3, c: 4, kind: 'place' });
    expect(moves).toContainEqual({ r: 7, c: 2, kind: 'place' });
  });

  it('excludes cells that are already occupied', () => {
    const board = makeBoard();
    board[3][4] = { type: 'card', rank: 'A', suit: 'hearts' };
    const chips = makeChips();
    chips[3][4] = { color: 'blue', owner: 1, locked: false };
    const moves = legalMoves(board, { rank: 'A', suit: 'hearts' }, chips, 'red');
    expect(moves).toHaveLength(0);
  });

  it('returns no moves when card has no matching cell on the board', () => {
    const moves = legalMoves(makeBoard(), { rank: 'A', suit: 'hearts' }, makeChips(), 'red');
    expect(moves).toHaveLength(0);
  });
});

describe('legalMoves — two-eyed Jack (wild)', () => {
  it('can place on any empty non-free cell', () => {
    const board = makeBoard();
    board[0][0] = { type: 'free' };
    const chips = makeChips();
    chips[1][1] = { color: 'blue', owner: 1, locked: false };
    // 100 cells − 1 free − 1 occupied = 98
    const moves = legalMoves(board, { rank: 'J', suit: 'diamonds' }, chips, 'red');
    expect(moves).toHaveLength(98);
    expect(moves.every(m => m.kind === 'place')).toBe(true);
  });
});

describe('legalMoves — one-eyed Jack (anti-wild)', () => {
  it('targets only unlocked opponent chips', () => {
    const board = makeBoard();
    const chips = makeChips();
    chips[2][3] = { color: 'blue', owner: 1, locked: false }; // valid
    chips[4][5] = { color: 'red',  owner: 0, locked: false }; // own chip
    chips[6][7] = { color: 'blue', owner: 1, locked: true  }; // locked
    const moves = legalMoves(board, { rank: 'J', suit: 'hearts' }, chips, 'red');
    expect(moves).toHaveLength(1);
    expect(moves[0]).toEqual({ r: 2, c: 3, kind: 'remove' });
  });

  it('returns no moves when there are no opponent chips', () => {
    const moves = legalMoves(makeBoard(), { rank: 'J', suit: 'spades' }, makeChips(), 'red');
    expect(moves).toHaveLength(0);
  });
});
