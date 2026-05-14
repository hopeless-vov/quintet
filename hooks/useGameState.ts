'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, AblyMovePayload, AblyDiscardPayload } from '@/types/game';
import { applyMove, discardDead } from '@/lib/game/engine';
import { useAblyRoom } from './useAblyRoom';

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

type UseGameStateOptions = {
  roomId: string;
  isHost: boolean;
  myName: string;
};

export function useGameState({ roomId, isHost, myName }: UseGameStateOptions) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const gameStateRef = useRef<GameState | null>(null);

  const { publish } = useAblyRoom(roomId, {
    onGameStarted: (state) => {
      gameStateRef.current = state;
      setGameState(state);
    },
    onGameState: (state) => {
      gameStateRef.current = state;
      setGameState(state);
    },
    onMove: isHost ? (payload: AblyMovePayload) => {
      const current = gameStateRef.current;
      if (!current) return;
      const next = deepClone(current);
      const result = applyMove(next, payload.playerIdx, payload.cardIdx, payload.r, payload.c);
      if (result.ok) {
        gameStateRef.current = next;
        setGameState(next);
        publish('game:state', next);
      }
    } : undefined,
    onDiscard: isHost ? (payload: AblyDiscardPayload) => {
      const current = gameStateRef.current;
      if (!current) return;
      const next = deepClone(current);
      const result = discardDead(next, payload.playerIdx, payload.cardIdx);
      if (result.ok) {
        gameStateRef.current = next;
        setGameState(next);
        publish('game:state', next);
      }
    } : undefined,
  });

  const startGame = useCallback((initialState: GameState) => {
    gameStateRef.current = initialState;
    setGameState(initialState);
    publish('game:started', initialState);
  }, [publish]);

  const makeMove = useCallback((playerIdx: number, cardIdx: number, r: number, c: number) => {
    if (isHost) {
      const current = gameStateRef.current;
      if (!current) return;
      const next = deepClone(current);
      const result = applyMove(next, playerIdx, cardIdx, r, c);
      if (result.ok) {
        gameStateRef.current = next;
        setGameState(next);
        publish('game:state', next);
      }
    } else {
      publish('game:move', { playerIdx, cardIdx, r, c } satisfies AblyMovePayload);
    }
  }, [isHost, publish]);

  const makeDiscard = useCallback((playerIdx: number, cardIdx: number) => {
    if (isHost) {
      const current = gameStateRef.current;
      if (!current) return;
      const next = deepClone(current);
      const result = discardDead(next, playerIdx, cardIdx);
      if (result.ok) {
        gameStateRef.current = next;
        setGameState(next);
        publish('game:state', next);
      }
    } else {
      publish('game:discard', { playerIdx, cardIdx } satisfies AblyDiscardPayload);
    }
  }, [isHost, publish]);

  const myPlayerIdx = gameState?.players.findIndex(p => p.name === myName) ?? -1;

  return { gameState, startGame, makeMove, makeDiscard, myPlayerIdx, publish };
}
