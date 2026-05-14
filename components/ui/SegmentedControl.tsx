type Option<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
};

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="segmented">
      {options.map(opt => (
        <button
          key={opt.value}
          className={[opt.value === value ? 'active' : '', opt.disabled ? 'disabled' : ''].filter(Boolean).join(' ')}
          disabled={opt.disabled}
          onClick={() => !opt.disabled && onChange(opt.value)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
