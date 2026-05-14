import type { ChipColor } from '@/types/game';
import { CHIP_GRADIENT } from '@/lib/game/constants';

type Props = {
  name: string;
  color: ChipColor;
  sequences: number;
  isActive: boolean;
  isMe: boolean;
};

export function PlayerBadge({ name, color, sequences, isActive, isMe }: Props) {
  return (
    <li className={`player-row ${isActive ? 'active' : ''}`}>
      <span
        className="player-chip"
        style={{ background: CHIP_GRADIENT[color] }}
      />
      <div className="player-info">
        <div className="player-name">{name}{isMe ? ' (You)' : ''}</div>
        <div className="player-meta">Sequences: {sequences}</div>
      </div>
      {isActive && <span className="turn-dot" />}
    </li>
  );
}
