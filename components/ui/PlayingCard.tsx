import type { CardValue } from '@/types/game';
import { SUIT_GLYPH, SUIT_COLOR } from '@/lib/game/constants';

type Size = 'sm' | 'md' | 'lg';

const SIZE_STYLES: Record<Size, { width: number; height: number; fontRank: number; fontSuit: number }> = {
  sm: { width: 40,  height: 56,  fontRank: 14, fontSuit: 16 },
  md: { width: 60,  height: 84,  fontRank: 22, fontSuit: 22 },
  lg: { width: 76,  height: 106, fontRank: 28, fontSuit: 28 },
};

type Props = {
  card: CardValue;
  size?: Size;
  selected?: boolean;
  dead?: boolean;
  dim?: boolean;
  onClick?: () => void;
};

export function PlayingCard({ card, size = 'md', selected, dead, dim, onClick }: Props) {
  const s = SIZE_STYLES[size];
  const color = SUIT_COLOR[card.suit] === 'red' ? '#c8102e' : '#0b0b0b';
  const classes = [
    'pcard',
    onClick ? 'clickable' : '',
    selected ? 'selected' : '',
    dead ? 'dead' : '',
    dim ? 'dim' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      style={{ width: s.width, height: s.height, color }}
    >
      <div className="pcard-rank" style={{ fontSize: s.fontRank }}>{card.rank}</div>
      <div className="pcard-suit" style={{ fontSize: s.fontSuit }}>{SUIT_GLYPH[card.suit]}</div>
    </div>
  );
}
