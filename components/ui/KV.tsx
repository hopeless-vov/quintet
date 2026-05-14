type Props = { k: string; v: string };

export function KV({ k, v }: Props) {
  return (
    <div className="kv">
      <div className="kv-k">{k}</div>
      <div className="kv-v">{v}</div>
    </div>
  );
}
