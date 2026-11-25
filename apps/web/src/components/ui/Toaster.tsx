'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: 'var(--font-space-grotesk)',
          borderRadius: '1rem',
          border: '2px solid',
        },
        classNames: {
          success: 'border-brand-green text-brand-green',
          error: 'border-red-400 text-red-700',
          info: 'border-brand-500 text-brand-700',
        },
      }}
    />
  );
}
