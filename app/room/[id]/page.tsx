'use client';

import { useState, useEffect, useMemo, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { RoomTopbar } from '@/components/RoomTopbar';
import { WaitingLobby } from '@/components/WaitingLobby';
import { GameBoard } from '@/components/GameBoard';
import { PlayersSidebar } from '@/components/PlayersSidebar';
import { RulesModal } from '@/components/RulesModal';
import { WinModal } from '@/components/WinModal';
import { useAblyRoom, publishLobbyPing } from '@/hooks/useAblyRoom';
import { useGameState } from '@/hooks/useGameState';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { newGameState } from '@/lib/game/engine';
import { legalMoves } from '@/lib/game/moves';
import { isDeadCard } from '@/lib/game/engine';
import type { RoomRecord, GameState, LegalMove } from '@/types/game';
import Link from 'next/link';

function loadRoom(id: string): RoomRecord | null {
  try { return JSON.parse(localStorage.getItem(`seq:room:${id}`) ?? 'null'); } catch { return null; }
}

function saveRoom(room: RoomRecord): void {
  localStorage.setItem(`seq:room:${room.id}`, JSON.stringify(room));
}

function getMyName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('seq:name') ?? '';
}

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = use(params);
  const router = useRouter();
  const myName = getMyName();

  const [room, setRoom] = useState<RoomRecord | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const { copied, copy } = useCopyToClipboard();

  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const r = loadRoom(roomId);
    if (r && !r.players.some(p => p.name === myName)) {
      r.players.push({ name: myName, host: false });
      saveRoom(r);
    }
    setRoom(r);
  }, [roomId, myName]);

  const isHost = room?.players[0]?.name === myName;

  const { gameState, startGame, makeMove, makeDiscard, myPlayerIdx, publish } = useGameState({
    roomId,
    isHost,
    myName,
  });

  useAblyRoom(roomId, {
    onPlayerJoined: (name) => {
      setRoom(prev => {
        if (!prev || prev.players.some(p => p.name === name)) return prev;
        const next = { ...prev, players: [...prev.players, { name, host: false }] };
        saveRoom(next);
        return next;
      });
    },
    onPlayerLeft: (name) => {
      setRoom(prev => {
        if (!prev) return prev;
        const next = { ...prev, players: prev.players.filter(p => p.name !== name) };
        saveRoom(next);
        return next;
      });
    },
  });

  useEffect(() => {
    if (!room) return;
    publish('player:joined', { name: myName });
    return () => { publish('player:left', { name: myName }); };
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isHost || !room) return;
    function ping() {
      if (!room) return;
      publishLobbyPing({
        roomId: room.id,
        hostName: room.hostName,
        playerNames: room.players.map(p => p.name),
        maxPlayers: room.maxPlayers,
        status: room.status,
      });
    }
    ping();
    pingIntervalRef.current = setInterval(ping, 30_000);
    return () => { if (pingIntervalRef.current) clearInterval(pingIntervalRef.current); };
  }, [isHost, room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (gameState?.winner !== null && gameState?.winner !== undefined) {
      setShowWin(true);
    }
  }, [gameState?.winner]);

  function handleStart() {
    if (!room) return;
    const initial = newGameState(room.players.map(p => p.name));
    const updated: RoomRecord = { ...room, status: 'playing' };
    saveRoom(updated);
    setRoom(updated);
    startGame(initial);
  }

  function handleExit() {
    if (gameState && gameState.winner === null) {
      if (!confirm('Leave this game? Your progress will be lost.')) return;
    }
    router.push('/');
  }

  function handleRestart() {
    if (!gameState) return;
    const initial = newGameState(gameState.players.map(p => p.name));
    startGame(initial);
    setShowWin(false);
    setSelectedIdx(null);
  }

  const currentPlayerIdx = gameState?.currentPlayer ?? -1;
  const isMyTurn = !!gameState && !gameState.winner && currentPlayerIdx === myPlayerIdx;

  const legal: LegalMove[] = useMemo(() => {
    if (!gameState || !isMyTurn || selectedIdx === null) return [];
    const me = gameState.players[myPlayerIdx];
    if (!me || !me.hand[selectedIdx]) return [];
    return legalMoves(gameState.board, me.hand[selectedIdx], gameState.chips, me.color);
  }, [gameState, isMyTurn, selectedIdx, myPlayerIdx]);

  function handleCellClick(r: number, c: number) {
    if (!isMyTurn || selectedIdx === null) return;
    const move = legal.find(m => m.r === r && m.c === c);
    if (!move) return;
    makeMove(myPlayerIdx, selectedIdx, r, c);
    setSelectedIdx(null);
  }

  function handleDiscardDead() {
    if (!isMyTurn || selectedIdx === null || !gameState) return;
    const me = gameState.players[myPlayerIdx];
    if (!me || !isDeadCard(gameState, me.hand[selectedIdx])) return;
    makeDiscard(myPlayerIdx, selectedIdx);
    setSelectedIdx(null);
  }

  if (!room) {
    return (
      <div className="room-wrap">
        <header className="room-top">
          <Link href="/" className="brand">Quintet</Link>
        </header>
        <div className="room-empty">
          <h2>Room not found</h2>
          <p>This room doesn&apos;t exist or has expired.</p>
          <Link href="/play" className="btn btn-primary">Back to Play</Link>
        </div>
      </div>
    );
  }

  const isPlaying = room.status === 'playing' && !!gameState;

  return (
    <div className="room-wrap">
      <RoomTopbar
        onRules={() => setShowRules(true)}
        onExit={handleExit}
        onShare={!isPlaying ? () => copy(room.id) : undefined}
        shareCopied={copied}
      />

      {!isPlaying ? (
        <WaitingLobby
          room={room}
          myName={myName}
          copied={copied}
          onStart={handleStart}
          onCopy={() => copy(room.id)}
        />
      ) : (
        <div className="game">
          <GameBoard
            state={gameState}
            legal={legal}
            onCellClick={handleCellClick}
          />
          <PlayersSidebar
            state={gameState}
            myIdx={myPlayerIdx >= 0 ? myPlayerIdx : 0}
            selectedIdx={selectedIdx}
            onSelectCard={setSelectedIdx}
            onDiscardDead={handleDiscardDead}
          />
        </div>
      )}

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showWin && gameState && (
        <WinModal
          state={gameState}
          onRestart={handleRestart}
          onExit={() => router.push('/')}
          onClose={() => setShowWin(false)}
        />
      )}
    </div>
  );
}
