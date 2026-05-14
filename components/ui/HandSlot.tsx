import type { CardValue } from '@/types/game';
import { PlayingCard } from './PlayingCard';

type Props = {
  card: CardValue;
  index: number;
  selected: boolean;
  dead: boolean;
  isMyTurn: boolean;
  onSelect: (i: number) => void;
};

export function HandSlot({ card, index, selected, dead, isMyTurn, onSelect }: Props) {
  return (
    <div className="hand-slot">
      <PlayingCard
        card={card}
        size="md"
        selected={selected}
        dead={dead && isMyTurn}
        onClick={isMyTurn ? () => onSelect(index) : undefined}
      />
      {dead && isMyTurn && <div className="dead-flag">Dead</div>}
    </div>
  );
}
