import type { BoardCard, ChipState } from '@/types/game';
import { PlayingCard } from './PlayingCard';
import { Chip } from './Chip';
import { FreeDisk } from './FreeDisk';

type Props = {
  cell: BoardCard;
  chip: ChipState;
  isLegal: boolean;
  isLastMove: boolean;
  inSequence: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function BoardCell({ cell, chip, isLegal, isLastMove, inSequence, onClick, onMouseEnter, onMouseLeave }: Props) {
  if (cell.type === 'free') {
    return (
      <div className="bcell free">
        <FreeDisk />
      </div>
    );
  }

  const classes = [
    'bcell',
    isLegal ? 'legal' : '',
    isLastMove ? 'last' : '',
    inSequence ? 'in-seq' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <PlayingCard card={cell} size="sm" />
      {chip && (
        <div className="chip-layer">
          <Chip color={chip.color} locked={chip.locked} lastPlaced={isLastMove} />
        </div>
      )}
      {isLegal && !chip && <div className="legal-dot" />}
      {isLegal && chip && <div className="legal-x" />}
    </div>
  );
}
