'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { FormField } from '@/components/ui/FormField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { RoomRow } from '@/components/ui/RoomRow';
import { Button, LinkButton } from '@/components/ui/Button';
import { usePlayerName } from '@/hooks/usePlayerName';
import { useAblyLobby } from '@/hooks/useAblyRoom';
import type { AblyRoomPing, RoomRecord } from '@/types/game';

function loadRoom(id: string): RoomRecord | null {
  try { return JSON.parse(localStorage.getItem(`seq:room:${id}`) ?? 'null'); } catch { return null; }
}

function saveRoom(room: RoomRecord): void {
  localStorage.setItem(`seq:room:${room.id}`, JSON.stringify(room));
}

export default function JoinRoomPage() {
  const router = useRouter();
  const { name, setName } = usePlayerName();
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState<AblyRoomPing[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useAblyLobby((ping) => {
    if (ping.status === 'waiting') {
      setRooms(prev => {
        const existing = prev.findIndex(r => r.roomId === ping.roomId);
        if (existing >= 0) {
          const next = [...prev];
          next[existing] = ping;
          return next;
        }
        return [...prev, ping];
      });
    }
  });

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }

  function handleJoin() {
    if (!name.trim()) { setError('Please enter your name'); return; }
    const target = (roomId || selectedId || '').trim();
    if (!target) { setError('Enter a room ID or pick one below'); return; }
    const room = loadRoom(target);
    if (!room) { setError('Room not found'); return; }
    if (room.players.length >= room.maxPlayers) { setError('Room is full'); return; }
    if (!room.players.some(p => p.name === name.trim())) {
      room.players.push({ name: name.trim(), host: false });
      saveRoom(room);
    }
    router.push(`/room/${target}`);
  }

  return (
    <div className="shell">
      <Navbar />
      <main>
        <section className="form-page">
          <div className="form-card">
            <h1>Join game room</h1>
            <p className="muted">Join an existing Quintet room.</p>

            <FormField
              label="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={24}
            />

            <FormField
              label="Room ID"
              value={roomId}
              onChange={e => { setRoomId(e.target.value); setSelectedId(null); }}
              placeholder="Enter room ID"
            />

            <div className="field">
              <div className="field-head">
                <span>Available rooms</span>
                <button type="button" className="link-btn" onClick={handleRefresh}>
                  {refreshing ? 'Refreshing…' : 'Refresh'}
                </button>
              </div>
              <div className="room-list">
                {rooms.length === 0 ? (
                  <div className="empty">No open rooms right now. Create one!</div>
                ) : rooms.map(r => (
                  <RoomRow
                    key={r.roomId}
                    room={r}
                    selected={selectedId === r.roomId}
                    onSelect={() => { setSelectedId(r.roomId); setRoomId(r.roomId); }}
                  />
                ))}
              </div>
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="form-actions">
              <Button variant="primary" block onClick={handleJoin}>Join Room</Button>
              <LinkButton href="/play" variant="ghost" block>Back</LinkButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
