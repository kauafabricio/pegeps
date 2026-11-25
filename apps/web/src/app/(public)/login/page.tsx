'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

// /login → redirect to /cadastro (unified page)
export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace(user.onboardingStep === 'done' ? '/trilha' : '/diagnostico');
      } else {
        router.replace('/cadastro');
      }
    }
  }, [isLoading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream" aria-live="polite">
      <p className="text-sm text-gray-400 animate-pulse">Redirecionando…</p>
    </div>
  );
}
