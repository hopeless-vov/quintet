import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'pill';
type Size = 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
  href: string;
};

function buildClassName(variant: Variant, size: Size, block: boolean, extra?: string): string {
  const parts = ['btn', `btn-${variant}`];
  if (size === 'lg') parts.push('btn-lg');
  if (block) parts.push('btn-block');
  if (extra) parts.push(extra);
  return parts.join(' ');
}

export function Button({ variant = 'primary', size = 'md', block = false, className, children, ...rest }: ButtonProps) {
  return (
    <button className={buildClassName(variant, size, block, className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({ variant = 'primary', size = 'md', block = false, className, children, href, ...rest }: LinkButtonProps) {
  return (
    <a href={href} className={buildClassName(variant, size, block, className)} {...rest}>
      {children}
    </a>
  );
}
