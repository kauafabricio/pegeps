'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    if (isLoading) return;

    if (mode === 'public' && user) {
      router.replace(
        user.onboardingStep === OnboardingStep.Done ? '/trilha' : '/onboarding/diagnostico',
      );
      return;
    }

    if (mode === 'onboarding') {
      if (!user) {
        router.replace('/login');
        return;
      }
      if (user.onboardingStep === OnboardingStep.Done) {
        router.replace('/trilha');
      }
      return;
    }

    if (mode === 'app') {
      if (!user) {
        router.replace('/login');
        return;
      }
      if (user.onboardingStep !== OnboardingStep.Done) {
        router.replace('/onboarding/diagnostico');
      }
    }
  }, [isLoading, mode, router, user]);

  const shouldBlock =
    isLoading ||
    (mode === 'public' && Boolean(user)) ||
    (mode === 'onboarding' && (!user || user.onboardingStep === OnboardingStep.Done)) ||
    (mode === 'app' && (!user || user.onboardingStep !== OnboardingStep.Done));

  if (shouldBlock) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        aria-live="polite"
      >
        <p className="text-sm text-gray-500 animate-pulse">Carregando…</p>
      </div>
    );
  }

  return <>{children}</>;
}
