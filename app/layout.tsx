import type { Metadata } from 'next';
import '../styles/globals.css';
import { PageTransition } from '@/components/PageTransition';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://quintet-game.com';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Quintet — Five Chips in a Row',
    template: '%s — Quintet',
  },
  description: 'Play Quintet online — the strategic card-and-chip board game. Free, browser-based, real-time multiplayer for 2–4 players. No download required.',
  keywords: ['quintet', 'sequence game', 'card game', 'board game', 'multiplayer', 'online', 'free', 'strategy'],
  authors: [{ name: 'Volodymyr Bondarenko', url: 'https://www.linkedin.com/in/vov-bndrnk/' }],
  creator: 'Volodymyr Bondarenko',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Quintet',
    title: 'Quintet — Five Chips in a Row',
    description: 'Play Quintet online — the strategic card-and-chip board game. Free, browser-based, real-time multiplayer for 2–4 players.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Quintet — five chips in a row' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quintet — Five Chips in a Row',
    description: 'Play Quintet online — the strategic card-and-chip board game. Free, browser-based, real-time multiplayer for 2–4 players.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0c2a1c" />
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
