import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroBoard } from '@/components/HeroBoard';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Panel } from '@/components/ui/Panel';

function UsersIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 20c0-2.5 2-4.5 5-4.5"/></svg>;
}
function ZapIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>;
}
function LinkIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 1 0 7 7l1-1"/></svg>;
}
function GlobeIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>;
}

export default function HomePage() {
  return (
    <div className="shell">
      <Navbar />
      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="eyebrow">Five chips in a row. Two sequences to win.</div>
            <h1 className="hero-title">Quintet</h1>
            <p className="hero-sub">A modern take on the classic strategy card game. Play a card, place a chip, and be the first to form five in a row.</p>
            <div className="hero-cta">
              <Link href="/play" className="btn btn-primary btn-lg">Play Now</Link>
              <Link href="/how-to-play" className="btn btn-ghost btn-lg">How to play</Link>
            </div>
            <div className="hero-meta">
              <span>Free forever</span>
              <span>·</span>
              <span>No download</span>
              <span>·</span>
              <span>2–4 players</span>
            </div>
          </div>
          <HeroBoard />
        </section>

        <section className="features">
          <div className="features-grid">
            <FeatureCard label="2–4 players" sub="Individual mode" icon={<UsersIcon />} />
            <FeatureCard label="Real-time" sub="Multiplayer via Ably" icon={<GlobeIcon />} />
            <FeatureCard label="Instant play" sub="Browser-only, no install" icon={<ZapIcon />} />
            <FeatureCard label="Share by link" sub="Private rooms" icon={<LinkIcon />} />
          </div>
        </section>

        <section className="explainer">
          <div className="explainer-grid">
            <div>
              <h2>What is Quintet?</h2>
              <p>Quintet is a strategic card-and-grid game that blends luck and tactics. Each player holds a small hand of cards. Play one, place a chip on the board space that matches, draw a fresh card, and pass the turn. First player to form two unbroken rows of five chips — horizontal, vertical, or diagonal — wins.</p>
              <div className="link-row">
                <Link className="btn btn-ghost" href="/how-to-play">Learn how to play →</Link>
                <Link className="btn btn-ghost" href="/rules">Read the rules →</Link>
              </div>
            </div>
            <div className="explainer-card">
              <h3>Game modes</h3>
              <ul className="checklist">
                <li><b>Individual</b> — 2–4 players, every player for themselves</li>
                <li><b>Private room</b> — share a code with friends</li>
                <li><b>Quick join</b> — drop into any open room</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
