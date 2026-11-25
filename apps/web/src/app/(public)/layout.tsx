import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <AuthGuard mode="public">{children}</AuthGuard>;
}
