import Link from 'next/link';

type Props = {
  onRules: () => void;
  onExit: () => void;
  onShare?: () => void;
  shareCopied?: boolean;
};

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function RoomTopbar({ onRules, onExit, onShare, shareCopied }: Props) {
  return (
    <header className="room-top">
      <Link href="/" className="brand">Quintet</Link>
      <div className="room-top-actions">
        {onShare && (
          <button type="button" className="btn btn-pill" onClick={onShare}>
            {shareCopied ? '✓ Copied' : <><CopyIcon /> Share link</>}
          </button>
        )}
        <button type="button" className="btn btn-pill" onClick={onRules}>Rules</button>
        <button type="button" className="btn btn-pill" onClick={onExit}>Exit game</button>
      </div>
    </header>
  );
}
