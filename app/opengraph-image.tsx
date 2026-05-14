import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Quintet — Five Chips in a Row';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0c2a1c 0%, #114a30 60%, #1a6442 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          padding: '80px',
        }}
      >
        {/* Gold dot */}
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: '#e2b340',
          boxShadow: '0 0 24px rgba(226,179,64,0.6)',
          marginBottom: 24,
        }} />

        {/* Title */}
        <div style={{
          fontSize: 108,
          fontWeight: 700,
          color: '#f4f1e7',
          letterSpacing: '-2px',
          lineHeight: 1,
          marginBottom: 28,
        }}>
          Quintet
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 34,
          color: 'rgba(244,241,231,0.65)',
          textAlign: 'center',
          letterSpacing: '0.01em',
          marginBottom: 48,
        }}>
          Five chips in a row. Two sequences to win.
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['Free forever', '2–4 players', 'Real-time multiplayer', 'No download'].map((label) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 100,
              padding: '10px 22px',
              fontSize: 22,
              color: 'rgba(244,241,231,0.7)',
            }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
