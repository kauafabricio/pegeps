'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { OnboardingStep } from '@pegeps/domain';
import { useAuth } from '@/providers/AuthProvider';

type GuardMode = 'public' | 'onboarding' | 'app';

interface AuthGuardProps {
  mode: GuardMode;
  children: ReactNode;
}

export function AuthGuard({ mode, children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (mode === 'public' && user) {
      if (user.onboardingStep === OnboardingStep.Done) {
        router.replace('/trilha');
      } else if (user.onboardingStep === OnboardingStep.Trail) {
        router.replace('/escolher-trilha');
      } else {
        router.replace('/diagnostico');
      }
      return;
    }

    if (mode === 'onboarding') {
      if (!user) {
        router.replace('/cadastro');
        return;
      }
      if (user.onboardingStep === OnboardingStep.Done) {
        router.replace('/trilha');
        return;
      }
      // Impede acesso fora de ordem: não pode ir para /escolher-trilha sem concluir diagnóstico
      if (
        user.onboardingStep === OnboardingStep.Diagnostic &&
        pathname.startsWith('/escolher-trilha')
      ) {
        router.replace('/diagnostico');
      }
      return;
    }

    if (mode === 'app') {
      if (!user) {
        router.replace('/cadastro');
        return;
      }
      if (user.onboardingStep === OnboardingStep.Diagnostic) {
        router.replace('/diagnostico');
      } else if (user.onboardingStep === OnboardingStep.Trail) {
        router.replace('/escolher-trilha');
      }
    }
  }, [isLoading, mode, pathname, router, user]);

  const outOfOrderOnboarding =
    mode === 'onboarding' &&
    Boolean(user) &&
    user?.onboardingStep === OnboardingStep.Diagnostic &&
    pathname.startsWith('/escolher-trilha');

  const shouldBlock =
    isLoading ||
    (mode === 'public' && Boolean(user)) ||
    (mode === 'onboarding' && (!user || user.onboardingStep === OnboardingStep.Done || outOfOrderOnboarding)) ||
    (mode === 'app' && (!user || user.onboardingStep !== OnboardingStep.Done));

  if (shouldBlock) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cream"
        aria-live="polite"
        aria-label="Carregando"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" aria-hidden />
          <p className="text-sm text-brand-accent">Carregando…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
