type Props = {
  options: number[];
  value: number;
  onChange: (v: number) => void;
};

export function NumberBar({ options, value, onChange }: Props) {
  return (
    <div className="number-bar">
      {options.map(n => (
        <button
          key={n}
          type="button"
          className={`num-btn ${n === value ? 'active' : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
