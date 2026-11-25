'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/cadastro');
    } else if (user.onboardingStep === 'done') {
      router.replace('/trilha');
    } else if (user.onboardingStep === 'trail') {
      router.replace('/escolher-trilha');
    } else {
      router.replace('/diagnostico');
    }
  }, [isLoading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" aria-hidden />
        <p className="text-sm text-gray-400">Carregando…</p>
      </div>
    </div>
  );
}
