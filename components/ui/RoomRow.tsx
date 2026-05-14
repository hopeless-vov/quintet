import type { AblyRoomPing } from '@/types/game';

type Props = {
  room: AblyRoomPing;
  selected: boolean;
  onSelect: () => void;
};

export function RoomRow({ room, selected, onSelect }: Props) {
  return (
    <div className={`room-row ${selected ? 'selected' : ''}`}>
      <div>
        <div className="room-id">Room: {room.roomId.slice(0, 8)}…</div>
        <div className="room-players">
          Players: {room.playerNames.join(', ')} · {room.playerNames.length}/{room.maxPlayers}
        </div>
      </div>
      <button type="button" className="btn btn-dark" onClick={onSelect}>Select</button>
    </div>
  );
}
