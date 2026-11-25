'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handler = () => onClose();
    el.addEventListener('close', handler);
    return () => el.removeEventListener('close', handler);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      className={cn(
        'w-full max-w-md rounded-2xl bg-white p-6 shadow-xl backdrop:bg-black/40',
        'open:flex open:flex-col open:gap-4',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h2 id="dialog-title" className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Fechar">
          ✕
        </Button>
      </div>
      {children}
    </dialog>
  );
}
