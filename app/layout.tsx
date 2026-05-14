import type { Metadata } from 'next';
import '../styles/globals.css';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { PageTransition } from '@/components/PageTransition';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

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
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0c2a1c" />
      </head>
      <body><PageTransition>{children}</PageTransition></body>
    </html>
  );
}
