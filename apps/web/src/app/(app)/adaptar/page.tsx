'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /adaptar → /adaptar-trilha for backwards compatibility
export default function AdaptarRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/adaptar-trilha');
  }, [router]);
  return null;
}
