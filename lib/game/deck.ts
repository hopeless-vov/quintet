import type { CardValue } from '@/types/game';
import { SUITS, RANKS } from './constants';

function fisherYates<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildDrawDeck(): CardValue[] {
  const cards: CardValue[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ rank, suit });
      cards.push({ rank, suit });
    }
  }
  for (const suit of SUITS) {
    cards.push({ rank: 'J', suit });
    cards.push({ rank: 'J', suit });
  }
  return fisherYates(cards);
}

export function shuffleDeck(cards: CardValue[]): CardValue[] {
  return fisherYates(cards);
}
