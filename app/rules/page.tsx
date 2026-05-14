import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Panel } from '@/components/ui/Panel';

export default function RulesPage() {
  return (
    <div className="shell">
      <Navbar />
      <main>
        <section className="page-hero">
          <h1>Official rules</h1>
          <p>Complete rules and regulations for competitive Quintet play.</p>
        </section>

        <section className="content-wrap">
          <Panel title="Basic rules">
            <h3>Objective</h3>
            <p>Be the first player to form the required number of sequences. A sequence is five consecutive chips of your color in a row, column, or diagonal.</p>
            <h3>Sequence requirements</h3>
            <ul className="bullets">
              <li>Individual play (2 players): 2 sequences to win</li>
              <li>Individual play (3 players): 1 sequence to win</li>
              <li>Individual play (4 players): 2 sequences to win</li>
            </ul>
            <h3>Valid sequences</h3>
            <ul className="bullets">
              <li>Horizontal — five chips left to right</li>
              <li>Vertical — five chips top to bottom</li>
              <li>Diagonal — five chips on either diagonal</li>
            </ul>
          </Panel>

          <Panel title="Card play rules">
            <h3>Regular cards</h3>
            <ul className="bullets">
              <li>Each non-Jack card corresponds to exactly two spaces on the board</li>
              <li>Players must place chips on a matching, unoccupied space</li>
              <li>Cards are announced when played</li>
              <li>Dead cards (cards whose both spaces are already taken) may be discarded for a free redraw</li>
            </ul>
            <div className="two-col">
              <div className="rule-card">
                <h4>One-eyed Jacks</h4>
                <ul>
                  <li>Remove an opponent&apos;s chip</li>
                  <li>Cannot remove chips in completed sequences</li>
                  <li>Cannot remove from corner (FREE) spaces</li>
                  <li>Cannot remove your own chips</li>
                </ul>
              </div>
              <div className="rule-card">
                <h4>Two-eyed Jacks</h4>
                <ul>
                  <li>Place a chip on any unoccupied space</li>
                  <li>Functions as a true wild card</li>
                  <li>Cannot place on already-occupied spaces</li>
                </ul>
              </div>
            </div>
          </Panel>

          <Panel title="Board rules">
            <h3>Corner spaces</h3>
            <ul className="bullets">
              <li>Four corner spaces are free for all players</li>
              <li>No card is required to use a corner in a sequence</li>
              <li>Corners cannot be blocked or removed</li>
              <li>They count as wild for sequence formation</li>
            </ul>
            <h3>Chip placement</h3>
            <ul className="bullets">
              <li>Only one chip per board space</li>
              <li>Chips cannot move once placed (except by Jack removal)</li>
              <li>Chips in completed sequences cannot be removed</li>
              <li>Players must use their assigned chip color</li>
            </ul>
          </Panel>

          <Panel title="Pacing &amp; disconnects">
            <h3>Time limits</h3>
            <ul className="bullets">
              <li>60 seconds per turn in competitive play</li>
              <li>10-second warning before time expires</li>
              <li>Auto-skip (random legal play) if time expires</li>
            </ul>
            <h3>Disconnects</h3>
            <ul className="bullets">
              <li>Game state is saved every turn</li>
              <li>2-minute reconnection window</li>
            </ul>
          </Panel>

          <div className="cta-row">
            <Link className="btn btn-primary btn-lg" href="/play">Start playing</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
