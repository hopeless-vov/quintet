import Ably from 'ably';

let client: Ably.Realtime | null = null;

export function getAblyClient(): Ably.Realtime {
  if (!client) {
    client = new Ably.Realtime({
      authUrl: '/api/ably-token',
      authMethod: 'GET',
    });
  }
  return client;
}

export function roomChannelName(roomId: string): string {
  return `room:${roomId}`;
}

export const LOBBY_CHANNEL = 'rooms:lobby';
