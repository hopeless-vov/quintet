'use client';

import type { RoomRecord } from '@/types/game';
import { DotIndicator } from './ui/DotIndicator';
import { Button } from './ui/Button';

type Props = {
  room: RoomRecord;
  myName: string;
  copied: boolean;
  onStart: () => void;
  onCopy: () => void;
};

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function WaitingLobby({ room, myName, copied, onStart, onCopy }: Props) {
  const isHost = room.players[0]?.name === myName;
  const canStart = isHost && room.players.length >= 2;

  return (
    <div className="lobby">
      <div className="lobby-card">
        <h2>Waiting for players</h2>
        <div className="lobby-mode">Game mode: <b>Individual play</b></div>

        <div className="lobby-share">
          <div className="lobby-share-label">Share this room ID:</div>
          <div className="lobby-share-row">
            <input readOnly value={room.id} />
            <button type="button" onClick={onCopy} className="copy-btn" title="Copy room ID">
              {copied ? '✓' : <CopyIcon />}
            </button>
          </div>
        </div>

        <div className="lobby-players">
          <div className="lobby-players-head">
            Players ({room.players.length}/{room.maxPlayers}):
          </div>
          <ul>
            {room.players.map((p, i) => (
              <li key={i}>
                <DotIndicator status="online" />
                <span>{p.name}{p.host ? ' (Host)' : ''}</span>
              </li>
            ))}
          </ul>
        </div>

        {isHost ? (
          <Button
            variant="primary"
            block
            disabled={!canStart}
            className={!canStart ? 'disabled' : ''}
            onClick={onStart}
          >
            Start game
          </Button>
        ) : (
          <div className="lobby-wait">Waiting for the host to start the game…</div>
        )}
      </div>
    </div>
  );
}
