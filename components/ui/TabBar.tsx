type Tab<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  tabs: Tab<T>[];
  active: T;
  onChange: (v: T) => void;
};

export function TabBar<T extends string>({ tabs, active, onChange }: Props<T>) {
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.value}
          type="button"
          className={tab.value === active ? 'active' : ''}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
