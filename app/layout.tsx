import type { Metadata } from 'next';
import '../styles/globals.css';
import { PageTransition } from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Quintet — five chips in a row',
  description: 'Play Quintet online — the strategic card-and-chip game. Free, browser-based, 2–4 players.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body><PageTransition>{children}</PageTransition></body>
    </html>
  );
}
