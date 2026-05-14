import type { CardValue, BoardCard, ChipState, ChipColor, LegalMove } from '@/types/game';
import { BOARD_SIZE } from './constants';

export function isJack(card: CardValue): boolean {
  return card.rank === 'J';
}

export function isTwoEyedJack(card: CardValue): boolean {
  return isJack(card) && (card.suit === 'diamonds' || card.suit === 'clubs');
}

export function isOneEyedJack(card: CardValue): boolean {
  return isJack(card) && (card.suit === 'hearts' || card.suit === 'spades');
}

export function cardsMatch(a: CardValue, b: BoardCard): boolean {
  return b.type === 'card' && a.rank === b.rank && a.suit === b.suit;
}

export function legalMoves(
  board: BoardCard[][],
  card: CardValue,
  chips: ChipState[][],
  myColor: ChipColor,
): LegalMove[] {
  const moves: LegalMove[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = board[r][c];
      if (cell.type === 'free') continue;
      const chip = chips[r][c];
      if (isTwoEyedJack(card)) {
        if (!chip) moves.push({ r, c, kind: 'place' });
      } else if (isOneEyedJack(card)) {
        if (chip && chip.color !== myColor && !chip.locked) moves.push({ r, c, kind: 'remove' });
      } else {
        if (!chip && cardsMatch(card, cell)) moves.push({ r, c, kind: 'place' });
      }
    }
  }
  return moves;
}
