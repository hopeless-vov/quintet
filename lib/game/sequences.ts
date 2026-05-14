import type { BoardCard, ChipState, ChipColor, SequenceRecord, CellPos } from '@/types/game';
import { BOARD_SIZE } from './constants';

const DIRECTIONS: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];
const SEQ_LENGTH = 5;

export function detectSequences(
  board: BoardCard[][],
  chips: ChipState[][],
  color: ChipColor,
  existingSeqs: SequenceRecord[],
): CellPos[][] {
  const inSeq: number[][] = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  for (const seq of existingSeqs) {
    for (const cell of seq.cells) inSeq[cell.r][cell.c]++;
  }

  const isOwned = (r: number, c: number): boolean => {
    if (board[r][c].type === 'free') return true;
    const chip = chips[r][c];
    return chip !== null && chip.color === color;
  };

  const found: CellPos[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      for (const [dr, dc] of DIRECTIONS) {
        const cells: CellPos[] = [];
        for (let k = 0; k < SEQ_LENGTH; k++) {
          const rr = r + dr * k;
          const cc = c + dc * k;
          if (rr < 0 || rr >= BOARD_SIZE || cc < 0 || cc >= BOARD_SIZE) break;
          if (!isOwned(rr, cc)) break;
          cells.push({ r: rr, c: cc });
        }
        if (cells.length === SEQ_LENGTH) {
          const sharedLocked = cells.filter(x => inSeq[x.r][x.c] > 0).length;
          if (sharedLocked <= 1) found.push(cells);
        }
      }
    }
  }
  return found;
}
