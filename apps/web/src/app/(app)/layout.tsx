import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Shell } from '@/components/layout/Shell';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="app">
      <Shell>{children}</Shell>
    </AuthGuard>
  );
}
