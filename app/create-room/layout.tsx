import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create a Room',
  description: 'Create a private Quintet room. Set your name and player count, then share the link with friends.',
  alternates: { canonical: '/create-room' },
};

export default function CreateRoomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
