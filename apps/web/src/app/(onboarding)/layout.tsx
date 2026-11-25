'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Stepper } from '@/components/ui/Stepper';
import { Header } from '@/components/layout/Header';

const STEPS = ['Sua conta', 'Diagnóstico', 'Sua trilha'];

function stepFromPath(pathname: string): number {
  if (pathname.includes('escolher-trilha')) return 2;
  return 1;
}

function OnboardingContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const current = stepFromPath(pathname);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <div className="bg-white border-b border-brand-100 py-3 px-4">
        <div className="max-w-md mx-auto">
          <Stepper steps={STEPS} current={current} ariaLabel="Progresso do onboarding" />
        </div>
      </div>
      <main id="main-content" className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>
    </div>
  );
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="onboarding">
      <OnboardingContent>{children}</OnboardingContent>
    </AuthGuard>
  );
}
