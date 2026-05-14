import Link from 'next/link';

export function Navbar() {
  return (
    <header className="topbar">
      <Link href="/" className="brand">Quintet</Link>
      <nav className="topnav">
        <Link href="/how-to-play">How to Play</Link>
        <Link href="/rules">Rules</Link>
        <Link href="/play" className="cta">Play</Link>
      </nav>
    </header>
  );
}
