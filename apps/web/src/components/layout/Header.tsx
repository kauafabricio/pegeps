'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/trilha"
          className="flex items-center gap-2 font-bold text-brand-700 text-lg focus-visible:outline-brand-500 rounded"
          aria-label="Pegeps — ir para a trilha"
        >
          <span aria-hidden className="text-2xl">🚀</span>
          Pegeps
        </Link>

        {user && (
          <nav className="flex items-center gap-4" aria-label="Navegação principal">
            <Link
              href="/trilha"
              className="text-sm text-gray-600 hover:text-brand-700 transition-colors"
            >
              Minha Trilha
            </Link>
            <Link
              href="/adaptar"
              className="text-sm text-gray-600 hover:text-brand-700 transition-colors"
            >
              Adaptar
            </Link>
            <Link
              href="/perfil"
              className="text-sm text-gray-600 hover:text-brand-700 transition-colors"
            >
              Perfil
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
