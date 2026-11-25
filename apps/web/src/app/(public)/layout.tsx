import { type ReactNode } from 'react';

// Public routes don't share a layout wrapper — AuthGuard is per-page
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
