import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MiniBoard } from '@/components/MiniBoard';

function CodeArt() {
  return (
    <div className="code-art">
      <div className="code-pill">ABC123</div>
      <div className="code-hint">Enter a room code like this</div>
    </div>
  );
}

type PlayChoiceProps = {
  href: string;
  title: string;
  sub: string;
  tone: 'primary' | 'secondary';
  features: string[];
  cta: string;
  visual: React.ReactNode;
};

function PlayChoice({ href, title, sub, tone, features, cta, visual }: PlayChoiceProps) {
  return (
    <div className={`play-card play-card-${tone}`}>
      <div className="play-card-head">
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      <div className="play-card-art">{visual}</div>
      <ul className="play-card-features">
        {features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
      <Link href={href} className={`btn btn-block ${tone === 'primary' ? 'btn-primary' : 'btn-secondary'}`}>
        {cta}
      </Link>
    </div>
  );
}

export default function PlayHubPage() {
  return (
    <div className="shell">
      <Navbar />
      <main>
        <section className="page-hero">
          <h1>Ready to play?</h1>
          <p>Choose how you&apos;d like to start.</p>
        </section>
        <section className="content-wrap">
          <div className="play-choices">
            <PlayChoice
              href="/create-room"
              title="Create new game"
              sub="Start a new room and invite friends to join"
              tone="primary"
              features={['2–4 players supported', 'Individual mode', 'Share room link to invite']}
              cta="Create Game Room"
              visual={<MiniBoard />}
            />
            <PlayChoice
              href="/join-room"
              title="Join existing game"
              sub="Enter a room code to join a game with friends"
              tone="secondary"
              features={['Quick join with room code', 'Join ongoing or waiting games', 'Play with friends instantly']}
              cta="Join Game Room"
              visual={<CodeArt />}
            />
          </div>
          <div className="back-home">
            <Link href="/" className="btn btn-ghost">← Back to home</Link>
          </div>
          <div className="learn-more">
            <span>New to Quintet?</span>
            <Link href="/how-to-play" className="btn btn-ghost">Learn how to play</Link>
            <Link href="/rules" className="btn btn-ghost">Read the rules</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
