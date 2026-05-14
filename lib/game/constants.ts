import type { Suit, Rank, ChipColor } from '@/types/game';

export const BOARD_SIZE = 10;
export const HAND_SIZE_DEFAULT = 7;
export const HAND_SIZE_FOUR_PLAYER = 6;
export const SEQUENCES_TO_WIN: Record<number, number> = { 2: 2, 3: 1, 4: 2 };

export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Q', 'K'];

export const SUIT_GLYPH: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

export const SUIT_COLOR: Record<Suit, 'red' | 'black'> = {
  spades: 'black',
  clubs: 'black',
  hearts: 'red',
  diamonds: 'red',
};

export const CHIP_COLORS: ChipColor[] = ['red', 'blue', 'gold', 'purple'];

export const CHIP_GRADIENT: Record<ChipColor, string> = {
  red:    'radial-gradient(circle at 35% 30%, #d23a3a, #6f1818)',
  blue:   'radial-gradient(circle at 35% 30%, #2f6fd9, #14306a)',
  gold:   'radial-gradient(circle at 35% 30%, #e7b13a, #7a5d10)',
  purple: 'radial-gradient(circle at 35% 30%, #8a5cc8, #3a2466)',
};

export const BOARD_SEED = 4242;
