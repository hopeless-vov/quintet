'use client';

import { useRef } from 'react';

export function HeroBoard() {
  const boardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = boardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = ((e.clientX - rect.left) / rect.width) * 2 - 1;   // -1 .. 1
    const dy = ((e.clientY - rect.top) / rect.height) * 2 - 1;   // -1 .. 1
    el.style.setProperty('--tilt-y', `${dx * 18}deg`);
    el.style.setProperty('--tilt-x', `${dy * 12}deg`);
  }

  function handleMouseLeave() {
    const el = boardRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-y', '-9deg');
    el.style.setProperty('--tilt-x', '5deg');
  }

  return (
    <div className="hero-art" aria-hidden="true" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div ref={boardRef} className="hero-board">
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 5 }).map((_, c) => {
            const corner = (r === 0 || r === 4) && (c === 0 || c === 4);
            const filled = r === 2 && (c === 1 || c === 2 || c === 3);
            return (
              <div key={`${r}-${c}`} className={`hero-cell ${corner ? 'corner' : ''} ${filled ? 'filled' : ''}`}>
                {corner && <span>FREE</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
