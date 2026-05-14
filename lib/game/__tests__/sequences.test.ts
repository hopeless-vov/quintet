import { describe, it, expect } from 'vitest';
import type { BoardCard, ChipState } from '@/types/game';
import { detectSequences } from '../sequences';

// ── helpers ────────────────────────────────────────────────────────────────

function makeBoard(): BoardCard[][] {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({ type: 'card' as const, rank: 'A' as const, suit: 'spades' as const })),
  );
}

function makeChips(): ChipState[][] {
  return Array.from({ length: 10 }, () => Array(10).fill(null));
}

function placeRow(chips: ChipState[][], row: number, cols: number[]): void {
  for (const c of cols) chips[row][c] = { color: 'red', owner: 0, locked: false };
}

function placeCol(chips: ChipState[][], col: number, rows: number[]): void {
  for (const r of rows) chips[r][col] = { color: 'red', owner: 0, locked: false };
}

// ── detectSequences ────────────────────────────────────────────────────────

describe('detectSequences', () => {
  it('returns empty when the board has no chips', () => {
    expect(detectSequences(makeBoard(), makeChips(), 'red', [])).toHaveLength(0);
  });

  it('returns empty for fewer than 5 chips in a line', () => {
    const chips = makeChips();
    placeRow(chips, 2, [0, 1, 2, 3]); // only 4
    expect(detectSequences(makeBoard(), chips, 'red', [])).toHaveLength(0);
  });

  it('detects a horizontal sequence of 5', () => {
    const chips = makeChips();
    placeRow(chips, 3, [0, 1, 2, 3, 4]);
    const seqs = detectSequences(makeBoard(), chips, 'red', []);
    expect(seqs).toHaveLength(1);
    expect(seqs[0]).toHaveLength(5);
  });

  it('detects a vertical sequence of 5', () => {
    const chips = makeChips();
    placeCol(chips, 5, [2, 3, 4, 5, 6]);
    const seqs = detectSequences(makeBoard(), chips, 'red', []);
    expect(seqs).toHaveLength(1);
    expect(seqs[0]).toHaveLength(5);
  });

  it('detects a diagonal sequence (top-left → bottom-right)', () => {
    const chips = makeChips();
    for (let i = 0; i < 5; i++) chips[i][i] = { color: 'red', owner: 0, locked: false };
    const seqs = detectSequences(makeBoard(), chips, 'red', []);
    expect(seqs.length).toBeGreaterThanOrEqual(1);
  });

  it('detects a diagonal sequence (top-right → bottom-left)', () => {
    const chips = makeChips();
    for (let i = 0; i < 5; i++) chips[i][9 - i] = { color: 'red', owner: 0, locked: false };
    const seqs = detectSequences(makeBoard(), chips, 'red', []);
    expect(seqs.length).toBeGreaterThanOrEqual(1);
  });

  it('ignores chips of a different color', () => {
    const chips = makeChips();
    placeRow(chips, 4, [0, 1, 2, 3, 4]);
    // override to blue
    for (let c = 0; c < 5; c++) chips[4][c] = { color: 'blue', owner: 1, locked: false };
    expect(detectSequences(makeBoard(), chips, 'red', [])).toHaveLength(0);
  });

  it('treats free (corner) cells as owned by any player', () => {
    const board = makeBoard();
    board[0][0] = { type: 'free' };
    const chips = makeChips();
    // 4 red chips + free corner at (0,0) form a horizontal sequence
    placeRow(chips, 0, [1, 2, 3, 4]);
    const seqs = detectSequences(board, chips, 'red', []);
    expect(seqs).toHaveLength(1);
  });

  it('does not re-detect an already-registered sequence', () => {
    const chips = makeChips();
    placeRow(chips, 3, [0, 1, 2, 3, 4]);
    // mark those cells as locked (already in a sequence)
    for (let c = 0; c < 5; c++) chips[3][c]!.locked = true;
    const existing = [{ color: 'red' as const, owner: 0, cells: [0,1,2,3,4].map(c => ({ r: 3, c })) }];
    const seqs = detectSequences(makeBoard(), chips, 'red', existing);
    // a new sequence sharing all 5 locked cells would need >1 shared → not found
    expect(seqs).toHaveLength(0);
  });
});
