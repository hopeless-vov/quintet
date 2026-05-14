export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Q' | 'K';
export type ChipColor = 'red' | 'blue' | 'gold' | 'purple';

export type CardValue = { rank: Rank | 'J'; suit: Suit };
export type BoardCard = { type: 'card'; rank: Rank; suit: Suit } | { type: 'free' };
export type ChipState = { color: ChipColor; owner: number; locked: boolean } | null;

export type CellPos = { r: number; c: number };
export type MoveKind = 'place' | 'remove';
export type LegalMove = CellPos & { kind: MoveKind };

export type SequenceRecord = { color: ChipColor; cells: CellPos[]; owner: number };

export type LogEntryType = 'start' | 'move' | 'seq' | 'win' | 'discard';
export type LogEntry = { type: LogEntryType; text: string };

export type Player = {
  id: number;
  name: string;
  color: ChipColor;
  hand: CardValue[];
  sequences: number;
};

export type GameState = {
  board: BoardCard[][];
  chips: ChipState[][];
  sequences: SequenceRecord[];
  deck: CardValue[];
  discardPile: CardValue[];
  players: Player[];
  currentPlayer: number;
  handSize: number;
  winner: number | null;
  log: LogEntry[];
  lastMove: { r: number; c: number; color: ChipColor; kind: MoveKind } | null;
};

export type RoomPlayer = { name: string; host: boolean };

export type RoomRecord = {
  id: string;
  hostName: string;
  mode: 'individual';
  maxPlayers: number;
  created: number;
  players: RoomPlayer[];
  status: 'waiting' | 'playing' | 'ended';
};

export type AblyMovePayload = { playerIdx: number; cardIdx: number; r: number; c: number };
export type AblyDiscardPayload = { playerIdx: number; cardIdx: number };
export type AblyRoomPing = { roomId: string; hostName: string; playerNames: string[]; maxPlayers: number; status: RoomRecord['status'] };
