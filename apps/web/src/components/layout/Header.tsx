'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getInitials } from '@/lib/utils';

export function PegepsWordmark() {
  return (
    <span className="text-2xl font-black tracking-tight text-brand-500 flex items-center">
      <span className="text-brand-yellow mr-0.5" aria-hidden>.</span>
      <span className="text-brand-500">pegeps</span>
      <span className="text-brand-yellow ml-0.5" aria-hidden>.</span>
    </span>
  );
}

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    }
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    router.push('/cadastro');
  }

  const initials = getInitials(user?.name);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href={user ? '/trilha' : '/cadastro'}
          className="inline-flex items-center rounded-lg py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
          aria-label="Pegeps — ir para a página inicial"
        >
          <PegepsWordmark />
        </Link>

        {user && (
          <div className="relative" ref={menuRef}>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full p-1 min-h-[44px] min-w-[44px] justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
              aria-label={`Menu do usuário ${user.name}`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {user.profile?.avatarUrl ? (
                <Image
                  src={user.profile.avatarUrl}
                  alt={`Avatar de ${user.name}`}
                  width={36}
                  height={36}
                  unoptimized
                  className="w-9 h-9 rounded-full object-cover border-2 border-brand-500"
                />
              ) : (
                <span className="w-9 h-9 rounded-full bg-peach border border-brand-200 text-brand-700 flex items-center justify-center text-xs font-bold">
                  {initials}
                </span>
              )}
            </button>

            {menuOpen && (
              <div
                role="menu"
                aria-label="Opções da conta"
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card border border-brand-100 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-bold text-brand-text truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  href="/perfil"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-brand-text hover:bg-peach transition-colors"
                >
                  Editar perfil
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-700 font-medium hover:bg-red-50 transition-colors"
                >
                  Sair da conta
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
