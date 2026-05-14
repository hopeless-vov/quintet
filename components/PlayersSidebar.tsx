'use client';

import type { GameState } from '@/types/game';
import { isDeadCard } from '@/lib/game/engine';
import { isJack, isTwoEyedJack, isOneEyedJack } from '@/lib/game/moves';
import { PlayerBadge } from './ui/PlayerBadge';
import { HandSlot } from './ui/HandSlot';
import { LogRow } from './ui/LogRow';

type Props = {
  state: GameState;
  myIdx: number;
  selectedIdx: number | null;
  onSelectCard: (i: number | null) => void;
  onDiscardDead: () => void;
};

export function PlayersSidebar({ state, myIdx, selectedIdx, onSelectCard, onDiscardDead }: Props) {
  const me = state.players[myIdx];
  const current = state.players[state.currentPlayer];
  const isMyTurn = !state.winner && state.currentPlayer === myIdx;

  const selectedCard = selectedIdx !== null ? me.hand[selectedIdx] : null;
  const myDeadSelected = selectedCard ? isDeadCard(state, selectedCard) : false;

  function getActionHint(): string | null {
    if (!isMyTurn || selectedIdx == null) return null;
    if (myDeadSelected) return null;
    if (!selectedCard) return null;
    if (isJack(selectedCard)) {
      return isTwoEyedJack(selectedCard)
        ? 'Wild — pick any empty space.'
        : isOneEyedJack(selectedCard)
        ? "Anti-wild — pick an opponent's chip to remove."
        : null;
    }
    return 'Click on a matching space on the board.';
  }

  const actionHint = getActionHint();

  return (
    <aside className="sidebar">
      <div className="panel-side">
        <h3>Players</h3>
        <ul className="player-list">
          {state.players.map((p, i) => (
            <PlayerBadge
              key={i}
              name={p.name}
              color={p.color}
              sequences={p.sequences}
              isActive={i === state.currentPlayer}
              isMe={i === myIdx}
            />
          ))}
        </ul>
      </div>

      <div className="panel-side hand-panel">
        <h3>{isMyTurn ? 'Your turn' : `${current.name}'s turn`}</h3>
        {!isMyTurn && <div className="muted small">Waiting for their move…</div>}

        <div className="hand-grid">
          {me.hand.map((card, i) => (
            <HandSlot
              key={i}
              card={card}
              index={i}
              selected={selectedIdx === i}
              dead={isDeadCard(state, card)}
              isMyTurn={isMyTurn}
              onSelect={(idx) => onSelectCard(idx === selectedIdx ? null : idx)}
            />
          ))}
        </div>

        {isMyTurn && selectedIdx != null && (
          <div className="hand-actions">
            {myDeadSelected ? (
              <button type="button" className="btn btn-secondary btn-block" onClick={onDiscardDead}>
                Discard dead card &amp; draw
              </button>
            ) : actionHint ? (
              <div className="action-hint">{actionHint}</div>
            ) : null}
          </div>
        )}
      </div>

      <div className="panel-side log-panel">
        <h3>Game log <span className="log-live-dot" /></h3>
        <div className="log">
          {state.log.slice(-8).reverse().map((entry, i) => (
            <LogRow key={i} entry={entry} />
          ))}
        </div>
        <div className="deck-info">
          <span>Deck: {state.deck.length}</span>
          <span>Discard: {state.discardPile.length}</span>
        </div>
      </div>
    </aside>
  );
}
