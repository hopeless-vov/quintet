import type { ChipColor } from '@/types/game';
import { CHIP_GRADIENT } from '@/lib/game/constants';

type Props = {
  color: ChipColor;
  locked?: boolean;
  lastPlaced?: boolean;
};

export function Chip({ color, locked, lastPlaced }: Props) {
  const classes = [
    'chip',
    lastPlaced ? 'last-placed' : '',
    locked ? 'locked' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{ background: CHIP_GRADIENT[color] }}
    />
  );
}
