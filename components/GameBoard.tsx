'use client';

import { useState, useMemo } from 'react';
import type { GameState, LegalMove, CellPos } from '@/types/game';
import { BoardCell } from './ui/BoardCell';

type Props = {
  state: GameState;
  legal: LegalMove[];
  onCellClick: (r: number, c: number) => void;
};

export function GameBoard({ state, legal, onCellClick }: Props) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const legalSet = useMemo(
    () => new Set(legal.map(m => `${m.r},${m.c}`)),
    [legal],
  );

  const seqCellSet = useMemo(
    () => new Set(state.sequences.flatMap(s => s.cells.map((c: CellPos) => `${c.r},${c.c}`))),
    [state.sequences],
  );

  const lastMove = state.lastMove;

  return (
    <div className="board-wrap">
      <div className="board">
        {state.board.map((row, r) => (
          <div key={r} className="brow">
            {row.map((cell, c) => {
              const key = `${r},${c}`;
              return (
                <BoardCell
                  key={c}
                  cell={cell}
                  chip={state.chips[r][c]}
                  isLegal={legalSet.has(key)}
                  isLastMove={!!(lastMove && lastMove.r === r && lastMove.c === c)}
                  inSequence={seqCellSet.has(key)}
                  onClick={() => onCellClick(r, c)}
                  onMouseEnter={() => setHoveredCell(key)}
                  onMouseLeave={() => hoveredCell === key && setHoveredCell(null)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
