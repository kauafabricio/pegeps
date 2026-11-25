import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <AuthGuard mode="onboarding">{children}</AuthGuard>;
}
