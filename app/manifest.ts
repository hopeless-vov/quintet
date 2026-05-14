import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quintet',
    short_name: 'Quintet',
    description: 'Five chips in a row. Two sequences to win. Free multiplayer card-and-chip strategy game.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c2a1c',
    theme_color: '#0c2a1c',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    categories: ['games', 'entertainment'],
  };
}
