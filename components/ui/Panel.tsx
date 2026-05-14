import type { ReactNode } from 'react';

type Props = { title: string; children: ReactNode };

export function Panel({ title, children }: Props) {
  return (
    <div className="panel">
      <h2 className="panel-title">{title}</h2>
      <div className="panel-body">{children}</div>
    </div>
  );
}
