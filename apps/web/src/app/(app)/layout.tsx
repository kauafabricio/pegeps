import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Shell } from '@/components/layout/Shell';
import { AppMobileNav, AppSidebarNav } from '@/components/layout/AppSidebarNav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="app">
      <Shell sidebar={<AppSidebarNav />} mobileNav={<AppMobileNav />}>
        {children}
      </Shell>
    </AuthGuard>
  );
}
