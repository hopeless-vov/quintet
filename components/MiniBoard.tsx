export function MiniBoard() {
  return (
    <div className="mini-board">
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => {
          const corner = (r === 0 || r === 4) && (c === 0 || c === 4);
          const has = (r === 2 && c === 2) || (r === 1 && c === 1) || (r === 3 && c === 3);
          return (
            <div key={`${r}-${c}`} className={`mini-cell ${corner ? 'corner' : ''} ${has ? 'has' : ''}`} />
          );
        })
      )}
    </div>
  );
}
