import type { BoardCard, CardValue } from '@/types/game';
import { SUITS, RANKS, BOARD_SIZE, BOARD_SEED } from './constants';

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = arr.slice();
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildBoardLayout(): BoardCard[][] {
  const cards: CardValue[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ rank, suit });
      cards.push({ rank, suit });
    }
  }
  const shuffled = seededShuffle(cards, BOARD_SEED);
  let idx = 0;
  const board: BoardCard[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: BoardCard[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      const isCorner = (r === 0 || r === 9) && (c === 0 || c === 9);
      if (isCorner) {
        row.push({ type: 'free' });
      } else {
        const card = shuffled[idx++];
        row.push({ type: 'card', rank: card.rank as never, suit: card.suit });
      }
    }
    board.push(row);
  }
  return board;
}
