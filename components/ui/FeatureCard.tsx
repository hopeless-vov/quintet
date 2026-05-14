import type { ReactNode } from 'react';

type Props = {
  label: string;
  sub: string;
  icon: ReactNode;
};

export function FeatureCard({ label, sub, icon }: Props) {
  return (
    <div className="feature">
      <div className="feature-icon">{icon}</div>
      <div className="feature-label">{label}</div>
      <div className="feature-sub">{sub}</div>
    </div>
  );
}
