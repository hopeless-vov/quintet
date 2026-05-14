import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join a Room',
  description: 'Join an existing Quintet game. Enter a room code or pick an open room from the list.',
  alternates: { canonical: '/join-room' },
};

export default function JoinRoomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
