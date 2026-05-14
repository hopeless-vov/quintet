import type { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://quintet-game.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: APP_URL,                       lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${APP_URL}/play`,             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${APP_URL}/how-to-play`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${APP_URL}/rules`,            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/create-room`,      lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${APP_URL}/join-room`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
