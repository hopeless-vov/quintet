import type { InputHTMLAttributes, ReactNode } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  headerRight?: ReactNode;
};

export function FormField({ label, hint, headerRight, ...inputProps }: Props) {
  return (
    <label className="field">
      {headerRight ? (
        <div className="field-head">
          <span>{label}</span>
          {headerRight}
        </div>
      ) : (
        <span>{label}</span>
      )}
      <input {...inputProps} />
      {hint && <small className="hint">{hint}</small>}
    </label>
  );
}
