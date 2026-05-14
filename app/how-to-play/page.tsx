import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Panel } from '@/components/ui/Panel';
import { KV } from '@/components/ui/KV';

export default function HowToPlayPage() {
  return (
    <div className="shell">
      <Navbar />
      <main>
        <section className="page-hero">
          <h1>How to play Quintet</h1>
          <p>The strategic card-and-chip game that blends luck and skill. Learn the rules, sharpen your tactics, and start winning sequences.</p>
        </section>

        <section className="content-wrap">
          <Panel title="Game overview">
            <p>Quintet is a card-driven board game where players place chips on a 10×10 grid. Each space on the grid corresponds to a specific playing card. The first player to form <b>two sequences of five chips in a row</b> — horizontal, vertical, or diagonal — wins.</p>
            <div className="kv-grid">
              <KV k="Players" v="2–4 players (individual)" />
              <KV k="Age" v="8+ years" />
              <KV k="Game time" v="15–30 minutes" />
              <KV k="Difficulty" v="Easy to learn, deep to master" />
            </div>
          </Panel>

          <Panel title="Setup">
            <ol className="steps">
              <li><b>Choose your seat.</b> 2–4 players, each assigned a chip color (red, blue, gold, purple).</li>
              <li><b>Deal cards.</b> 7 cards per player for 2–3 players, 6 cards for 4 players.</li>
              <li><b>First player.</b> Player order is randomized; play proceeds clockwise.</li>
            </ol>
          </Panel>

          <Panel title="Step-by-step turn">
            <ol className="steps numbered">
              <li><b>Choose a card.</b> Select a card from your hand.</li>
              <li><b>Place a chip.</b> Find the matching space on the board — there are two of every non-Jack card — and place one of your chips on either.</li>
              <li><b>Discard &amp; draw.</b> The played card goes to the discard pile, then you draw a fresh one to restore your hand.</li>
              <li><b>Pass the turn.</b> Play moves to the next player.</li>
            </ol>
          </Panel>

          <Panel title="The four Jacks">
            <div className="two-col">
              <div className="jack-card">
                <div className="jack-suits">J<span className="red">♦</span> &nbsp; J<span className="black">♣</span></div>
                <div className="jack-head">Two-eyed Jacks (wild)</div>
                <div className="jack-body">Place a chip on <b>any open space</b>. The board card doesn&apos;t matter.</div>
              </div>
              <div className="jack-card">
                <div className="jack-suits">J<span className="red">♥</span> &nbsp; J<span className="black">♠</span></div>
                <div className="jack-head">One-eyed Jacks (anti-wild)</div>
                <div className="jack-body"><b>Remove an opponent&apos;s chip</b> from the board. Cannot remove chips that are part of a completed sequence.</div>
              </div>
            </div>
          </Panel>

          <Panel title="Corners are free">
            <p>The four corner spaces are <b>free for everyone</b>. Any player may count them as their own when forming a sequence. No card is required to claim them — they&apos;re always wild.</p>
          </Panel>

          <Panel title="Winning">
            <p>The first player to form <b>two complete sequences</b> wins the game (one sequence in a 3-player game). A sequence is exactly five chips of your color in an unbroken horizontal, vertical, or diagonal line. Sequences may share <b>at most one chip</b> as an endpoint.</p>
          </Panel>

          <div className="cta-row">
            <Link className="btn btn-primary btn-lg" href="/play">Start playing</Link>
            <Link className="btn btn-ghost btn-lg" href="/rules">Read full rules</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
