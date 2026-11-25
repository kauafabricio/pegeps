'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Old route: /onboarding/diagnostico → redirect to /diagnostico
export default function OldDiagnosticoRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/diagnostico');
  }, [router]);
  return null;
}
