import type { LogEntry } from '@/types/game';

type Props = { entry: LogEntry };

export function LogRow({ entry }: Props) {
  return <div className={`log-row log-${entry.type}`}>{entry.text}</div>;
}
