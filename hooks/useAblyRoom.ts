'use client';

import { useEffect, useRef, useCallback } from 'react';
import type Ably from 'ably';
import { getAblyClient, roomChannelName, LOBBY_CHANNEL } from '@/lib/ably';
import type { GameState, AblyMovePayload, AblyDiscardPayload, AblyRoomPing, RoomRecord } from '@/types/game';

type RoomEventHandlers = {
  onPlayerJoined?: (name: string) => void;
  onPlayerLeft?: (name: string) => void;
  onGameStarted?: (state: GameState) => void;
  onGameState?: (state: GameState) => void;
  onMove?: (payload: AblyMovePayload) => void;
  onDiscard?: (payload: AblyDiscardPayload) => void;
  onRoomRequest?: () => void;
  onRoomInfo?: (room: RoomRecord) => void;
};

export function useAblyRoom(roomId: string, handlers: RoomEventHandlers) {
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const client = getAblyClient();
    const channel = client.channels.get(roomChannelName(roomId));
    channelRef.current = channel;

    channel.subscribe('player:joined', (msg) => handlersRef.current.onPlayerJoined?.(msg.data.name));
    channel.subscribe('player:left', (msg) => handlersRef.current.onPlayerLeft?.(msg.data.name));
    channel.subscribe('game:started', (msg) => handlersRef.current.onGameStarted?.(msg.data));
    channel.subscribe('game:state', (msg) => handlersRef.current.onGameState?.(msg.data));
    channel.subscribe('game:move', (msg) => handlersRef.current.onMove?.(msg.data));
    channel.subscribe('game:discard', (msg) => handlersRef.current.onDiscard?.(msg.data));
    channel.subscribe('room:request', () => handlersRef.current.onRoomRequest?.());
    channel.subscribe('room:info', (msg) => handlersRef.current.onRoomInfo?.(msg.data));

    return () => {
      channel.unsubscribe();
    };
  }, [roomId]);

  const publish = useCallback((event: string, data: unknown) => {
    channelRef.current?.publish(event, data);
  }, []);

  return { publish };
}

export function useAblyLobby(onPing: (ping: AblyRoomPing) => void) {
  const onPingRef = useRef(onPing);
  onPingRef.current = onPing;

  useEffect(() => {
    const client = getAblyClient();
    const channel = client.channels.get(LOBBY_CHANNEL);
    channel.subscribe('room:ping', (msg) => onPingRef.current(msg.data));
    return () => { channel.unsubscribe(); };
  }, []);
}

export function publishLobbyPing(ping: AblyRoomPing): void {
  const client = getAblyClient();
  client.channels.get(LOBBY_CHANNEL).publish('room:ping', ping);
}
