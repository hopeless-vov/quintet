type Status = 'online' | 'offline';

type Props = { status?: Status };

export function DotIndicator({ status = 'online' }: Props) {
  return <span className={`dot ${status}`} />;
}
