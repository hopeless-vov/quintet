import type { GameState, Player, CardValue, ChipColor } from '@/types/game';
import { CHIP_COLORS, HAND_SIZE_DEFAULT, HAND_SIZE_FOUR_PLAYER, SEQUENCES_TO_WIN, SUIT_GLYPH } from './constants';
import { buildBoardLayout } from './board';
import { buildDrawDeck, shuffleDeck } from './deck';
import { isJack, isTwoEyedJack, isOneEyedJack, cardsMatch } from './moves';
import { detectSequences } from './sequences';

export type ApplyMoveError = 'invalid' | 'corner' | 'occupied' | 'empty' | 'own' | 'locked' | 'mismatch' | 'not-your-turn';
export type ApplyMoveResult = { ok: true } | { ok: false; error: ApplyMoveError };

export function newGameState(playerNames: string[]): GameState {
  const handSize = playerNames.length <= 3 ? HAND_SIZE_DEFAULT : HAND_SIZE_FOUR_PLAYER;
  const deck = buildDrawDeck();
  const players: Player[] = playerNames.map((name, i) => ({
    id: i,
    name,
    color: CHIP_COLORS[i],
    hand: deck.splice(0, handSize),
    sequences: 0,
  }));
  return {
    board: buildBoardLayout(),
    chips: Array.from({ length: 10 }, () => Array(10).fill(null)),
    sequences: [],
    deck,
    discardPile: [],
    players,
    currentPlayer: 0,
    handSize,
    winner: null,
    log: [{ type: 'start', text: `Game started with ${players.length} players.` }],
    lastMove: null,
  };
}

export function isDeadCard(state: GameState, card: CardValue): boolean {
  if (!card || isJack(card)) return false;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cell = state.board[r][c];
      if (cardsMatch(card, cell) && !state.chips[r][c]) return false;
    }
  }
  return true;
}

export function applyMove(
  state: GameState,
  playerIdx: number,
  cardIdx: number,
  r: number,
  c: number,
): ApplyMoveResult {
  const player = state.players[playerIdx];
  const card = player.hand[cardIdx];
  const targetCell = state.board[r][c];
  if (!card || !targetCell) return { ok: false, error: 'invalid' };
  if (targetCell.type === 'free') return { ok: false, error: 'corner' };
  const existingChip = state.chips[r][c];

  let kind: 'place' | 'remove';
  if (isTwoEyedJack(card)) {
    if (existingChip) return { ok: false, error: 'occupied' };
    kind = 'place';
  } else if (isOneEyedJack(card)) {
    if (!existingChip) return { ok: false, error: 'empty' };
    if (existingChip.color === player.color) return { ok: false, error: 'own' };
    if (existingChip.locked) return { ok: false, error: 'locked' };
    kind = 'remove';
  } else {
    if (existingChip) return { ok: false, error: 'occupied' };
    if (!cardsMatch(card, targetCell)) return { ok: false, error: 'mismatch' };
    kind = 'place';
  }

  if (kind === 'place') {
    state.chips[r][c] = { color: player.color, owner: playerIdx, locked: false };
  } else {
    state.chips[r][c] = null;
  }
  state.discardPile.push(card);
  player.hand.splice(cardIdx, 1);
  state.lastMove = { r, c, color: player.color, kind };

  if (kind === 'place') {
    const colorSeqs = state.sequences.filter(s => s.color === player.color);
    const existingKeys = new Set(colorSeqs.map(s => s.cells.map(x => `${x.r},${x.c}`).join('|')));
    const allSeqs = detectSequences(state.board, state.chips, player.color, colorSeqs);
    for (const seq of allSeqs) {
      const key = seq.map(x => `${x.r},${x.c}`).join('|');
      if (!existingKeys.has(key)) {
        state.sequences.push({ color: player.color, cells: seq, owner: playerIdx });
        player.sequences++;
        for (const cell of seq) {
          if (state.chips[cell.r][cell.c]) state.chips[cell.r][cell.c]!.locked = true;
        }
        state.log.push({ type: 'seq', text: `${player.name} formed a sequence!` });
        break;
      }
    }
  }

  const needed = SEQUENCES_TO_WIN[state.players.length] ?? 2;
  if (player.sequences >= needed) {
    state.winner = playerIdx;
    state.log.push({ type: 'win', text: `${player.name} wins!` });
  }

  if (state.deck.length === 0 && state.discardPile.length > 0) {
    state.deck = shuffleDeck(state.discardPile);
    state.discardPile = [];
  }
  if (state.deck.length > 0) player.hand.push(state.deck.shift()!);

  const suitGlyph = SUIT_GLYPH[card.suit];
  state.log.push({ type: 'move', text: `${player.name} played ${card.rank}${suitGlyph}${kind === 'remove' ? ' (removed chip)' : ''}` });

  if (!state.winner) {
    state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
  }
  return { ok: true };
}

export function discardDead(state: GameState, playerIdx: number, cardIdx: number): ApplyMoveResult {
  const player = state.players[playerIdx];
  const card = player.hand[cardIdx];
  if (!isDeadCard(state, card)) return { ok: false, error: 'invalid' };
  state.discardPile.push(card);
  player.hand.splice(cardIdx, 1);
  if (state.deck.length > 0) player.hand.push(state.deck.shift()!);
  state.log.push({ type: 'discard', text: `${player.name} discarded dead ${card.rank}${SUIT_GLYPH[card.suit]}` });
  return { ok: true };
}

export function getPlayerColor(color: ChipColor): string {
  const map: Record<ChipColor, string> = {
    red: '#d23a3a', blue: '#2f6fd9', gold: '#e7b13a', purple: '#8a5cc8',
  };
  return map[color];
}
