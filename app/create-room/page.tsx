'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Navbar } from '@/components/Navbar';
import { FormField } from '@/components/ui/FormField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { NumberBar } from '@/components/ui/NumberBar';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button, LinkButton } from '@/components/ui/Button';
import { usePlayerName } from '@/hooks/usePlayerName';
import type { RoomRecord } from '@/types/game';

function saveRoom(room: RoomRecord): void {
  localStorage.setItem(`seq:room:${room.id}`, JSON.stringify(room));
  const list: string[] = JSON.parse(localStorage.getItem('seq:rooms') || '[]');
  if (!list.includes(room.id)) {
    list.push(room.id);
    localStorage.setItem('seq:rooms', JSON.stringify(list));
  }
}

const GAME_MODE_OPTIONS = [
  { value: 'individual' as const, label: 'Individual play' },
  { value: 'team' as const, label: 'Team play', disabled: true },
];

export default function CreateRoomPage() {
  const router = useRouter();
  const { name, setName } = usePlayerName();
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [error, setError] = useState('');

  function handleCreate() {
    if (!name.trim()) { setError('Please enter your name'); return; }
    const id = uuidv4();
    const room: RoomRecord = {
      id,
      hostName: name.trim(),
      mode: 'individual',
      maxPlayers,
      created: Date.now(),
      players: [{ name: name.trim(), host: true }],
      status: 'waiting',
    };
    saveRoom(room);
    router.push(`/room/${id}`);
  }

  const seqNote: Record<number, string> = {
    2: '2-player games need 2 sequences to win.',
    3: '3-player games need 1 sequence to win.',
    4: '4-player games need 2 sequences to win.',
  };

  return (
    <div className="shell">
      <Navbar />
      <main>
        <section className="form-page">
          <div className="form-card">
            <h1>Create game room</h1>
            <p className="muted">Set up a new Quintet room.</p>

            <FormField
              label="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={24}
            />

            <label className="field">
              <span>Game mode</span>
              <SegmentedControl
                options={GAME_MODE_OPTIONS}
                value="individual"
                onChange={() => {}}
              />
              <small className="hint">Play individually against 1–3 other players. Every player for themselves.</small>
            </label>

            <label className="field">
              <span>Players ({maxPlayers})</span>
              <NumberBar options={[2, 3, 4]} value={maxPlayers} onChange={setMaxPlayers} />
              <small className="hint">{seqNote[maxPlayers]}</small>
            </label>

            {error && <ErrorMessage message={error} />}

            <div className="form-actions">
              <Button variant="primary" block onClick={handleCreate}>Create Room</Button>
              <LinkButton href="/play" variant="ghost" block>Back</LinkButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
