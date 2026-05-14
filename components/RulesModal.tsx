'use client';

import { useState } from 'react';
import { Modal } from './ui/Modal';
import { TabBar } from './ui/TabBar';

type Tab = 'basic' | 'cards' | 'board';

const TABS: { value: Tab; label: string }[] = [
  { value: 'basic', label: 'Basic rules' },
  { value: 'cards', label: 'Card play' },
  { value: 'board', label: 'Board' },
];

type Props = { onClose: () => void };

export function RulesModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>('basic');

  return (
    <Modal onClose={onClose}>
      <div className="modal-head">
        <h2>Quintet rules</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <div className="modal-body">
        {tab === 'basic' && (
          <div>
            <p><b>Objective.</b> Form sequences of 5 chips in a row on the board — horizontal, vertical, or diagonal.</p>
            <p><b>Setup.</b> Each player receives 7 cards (or 6 in a 4-player game) and a chip color.</p>
            <p><b>Turn.</b> Play a card from your hand, place a chip on the matching board space, draw a fresh card. The four corners are FREE wild spaces.</p>
            <p><b>Winning.</b> The first to form the required sequences wins. 2 sequences in a 2- or 4-player game, 1 sequence in a 3-player game.</p>
          </div>
        )}
        {tab === 'cards' && (
          <div>
            <p><b>Two-eyed Jacks (J♦, J♣).</b> Wild — place a chip on any open space.</p>
            <p><b>One-eyed Jacks (J♥, J♠).</b> Anti-wild — remove an opponent&apos;s chip. Cannot remove chips that are part of a completed sequence.</p>
            <p><b>Dead cards.</b> If both spaces matching your card are already taken, discard it for a free redraw.</p>
          </div>
        )}
        {tab === 'board' && (
          <div>
            <p><b>Board.</b> A 10×10 grid. Each non-Jack card from the deck appears on exactly two spaces.</p>
            <p><b>Corners.</b> All four corners are FREE for every player and count toward any sequence.</p>
            <p><b>Sequences.</b> Sequences may share at most one chip as an endpoint.</p>
          </div>
        )}
      </div>
      <div className="modal-foot">
        <button type="button" className="btn btn-dark" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}
