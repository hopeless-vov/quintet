import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="foot-cols">
        <div>
          <h4>Quintet</h4>
          <p>An original take on the classic five-in-a-row card placement game. Free, browser-based, no account required.</p>
          <div className="foot-links">
            <Link href="/create-room">Create Room</Link>
            <Link href="/join-room">Join Room</Link>
          </div>
        </div>
        <div>
          <h4>Learn</h4>
          <ul>
            <li><Link href="/how-to-play">How to Play</Link></li>
            <li><Link href="/rules">Official Rules</Link></li>
          </ul>
        </div>
        <div>
          <h4>Features</h4>
          <ul>
            <li>2–4 player individual mode</li>
            <li>Real-time multiplayer</li>
            <li>Browser-based, no install</li>
            <li>Share-by-link rooms</li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Quintet</span>
        <span className="foot-meta">
          <Link href="/how-to-play">Learn</Link>
          <Link href="/rules">Rules</Link>
        </span>
      </div>
    </footer>
  );
}
