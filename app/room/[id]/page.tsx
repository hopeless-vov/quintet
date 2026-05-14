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
import { legalMoves, isJack } from '@/lib/game/moves';
import { isDeadCard } from '@/lib/game/engine';
import type { RoomRecord, LegalMove } from '@/types/game';
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

const CONNECT_TIMEOUT_MS = 8000;
const CONNECT_RETRY_MS = 1500;

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = use(params);
  const router = useRouter();
  const myName = getMyName();

  const [room, setRoom] = useState<RoomRecord | null>(() => {
    if (typeof window === 'undefined') return null;
    const r = loadRoom(roomId);
    if (!r) return null;
    if (!r.players.some(p => p.name === myName)) {
      r.players.push({ name: myName, host: false });
      saveRoom(r);
    }
    return r;
  });
  const [connecting, setConnecting] = useState(() => {
    if (typeof window === 'undefined') return false;
    return loadRoom(roomId) === null;
  });
  const [showRules, setShowRules] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const { copied, copy } = useCopyToClipboard();

  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const publishRef = useRef<((event: string, data: unknown) => void) | null>(null);

  // When connecting (no local room), request room info from host via Ably
  useEffect(() => {
    if (!connecting) return;

    function requestInfo() {
      publishRef.current?.('room:request', {});
    }

    // First attempt after Ably has had a moment to connect
    const firstAttempt = setTimeout(requestInfo, 600);
    retryIntervalRef.current = setInterval(requestInfo, CONNECT_RETRY_MS);
    connectTimerRef.current = setTimeout(() => {
      clearInterval(retryIntervalRef.current!);
      setConnecting(false); // give up → show "not found"
    }, CONNECT_TIMEOUT_MS);

    return () => {
      clearTimeout(firstAttempt);
      clearInterval(retryIntervalRef.current!);
      clearTimeout(connectTimerRef.current!);
    };
  }, [connecting]);

  const isHost = room?.players[0]?.name === myName;

  const { gameState, startGame, makeMove, makeDiscard, myPlayerIdx, publish } = useGameState({
    roomId,
    isHost,
    myName,
    onWin: () => setShowWin(true),
  });

  // Keep publishRef in sync so the connecting effect can call publish
  useEffect(() => { publishRef.current = publish; });

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
    // Sync room status to 'playing' when game starts (guest side)
    onGameStarted: () => {
      setRoom(prev => {
        if (!prev || prev.status === 'playing') return prev;
        const next = { ...prev, status: 'playing' as const };
        saveRoom(next);
        return next;
      });
    },
    // Host responds to room:request by publishing room:info
    onRoomRequest: () => {
      if (!isHost) return;
      setRoom(current => {
        if (current) publish('room:info', current);
        return current;
      });
    },
    // Guest receives room:info and builds local room record
    onRoomInfo: (infoRoom) => {
      setRoom(current => {
        if (current) return current; // already resolved
        if (!infoRoom.players.some(p => p.name === myName)) {
          infoRoom.players.push({ name: myName, host: false });
        }
        saveRoom(infoRoom);
        clearInterval(retryIntervalRef.current!);
        clearTimeout(connectTimerRef.current!);
        setConnecting(false);
        return infoRoom;
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

  // Highlight only for Jacks — regular cards get no board hints
  const legalForBoard: LegalMove[] = useMemo(() => {
    if (!gameState || !isMyTurn || selectedIdx === null) return [];
    const me = gameState.players[myPlayerIdx];
    if (!me || !me.hand[selectedIdx]) return [];
    return isJack(me.hand[selectedIdx]) ? legal : [];
  }, [gameState, isMyTurn, selectedIdx, myPlayerIdx, legal]);

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
          {connecting ? (
            <>
              <div className="connecting-spinner" />
              <h2>Connecting…</h2>
              <p>Looking for the room host. This may take a moment.</p>
            </>
          ) : (
            <>
              <h2>Room not found</h2>
              <p>This room doesn&apos;t exist, has expired, or the host is offline.</p>
              <Link href="/play" className="btn btn-primary">Back to Play</Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const isPlaying = !!gameState;

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
            legal={legalForBoard}
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
