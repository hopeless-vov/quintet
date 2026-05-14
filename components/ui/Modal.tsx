import type { ReactNode, MouseEvent } from 'react';

type Props = {
  children: ReactNode;
  onClose: () => void;
  className?: string;
};

export function Modal({ children, onClose, className }: Props) {
  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }
  return (
    <div className="modal-back" onClick={handleBackdrop}>
      <div className={`modal ${className ?? ''}`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
