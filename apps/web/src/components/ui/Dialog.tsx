'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface DialogModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function DialogModal({ open, onClose, title, description, children, className }: DialogModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md rounded-3xl bg-white p-8 border border-brand-100',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            className,
          )}
        >
          <Dialog.Title className="text-lg font-bold text-brand-text mb-2">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              {description}
            </Dialog.Description>
          )}
          {children}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
              aria-label="Fechar"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
