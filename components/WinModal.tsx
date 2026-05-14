'use client';

import type { GameState } from '@/types/game';
import { CHIP_GRADIENT } from '@/lib/game/constants';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

type Props = {
  state: GameState;
  onRestart: () => void;
  onExit: () => void;
  onClose: () => void;
};

export function WinModal({ state, onRestart, onExit, onClose }: Props) {
  if (state.winner === null) return null;
  const winner = state.players[state.winner];

  return (
    <Modal onClose={onClose} className="win-modal">
      <div
        className="win-banner"
        style={{ background: CHIP_GRADIENT[winner.color] }}
      >
        Sequence!
      </div>
      <h2>{winner.name} wins</h2>
      <p>{winner.sequences} sequence{winner.sequences > 1 ? 's' : ''} formed.</p>
      <div className="win-scores">
        {state.players.map((p, i) => (
          <div key={i} className={`win-score ${i === state.winner ? 'winner' : ''}`}>
            <span className="player-chip" style={{ background: CHIP_GRADIENT[p.color], width: 18, height: 18, borderRadius: '50%', display: 'inline-block' }} />
            <span>{p.name}</span>
            <span className="seq-count">{p.sequences} seq</span>
          </div>
        ))}
      </div>
      <div className="win-actions">
        <Button variant="primary" block onClick={onRestart}>Play again</Button>
        <Button variant="ghost" block onClick={onExit}>Back to home</Button>
      </div>
    </Modal>
  );
}
