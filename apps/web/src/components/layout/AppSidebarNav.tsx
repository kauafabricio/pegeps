'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/trilha', label: 'Visão geral', icon: '🗺️' },
  { href: '/tutor', label: 'Tutor Tom', icon: '💬' },
  { href: '/avaliacoes', label: 'Avaliações', icon: '📝' },
  { href: '/perfil', label: 'Editar perfil', icon: '👤' },
];

function isRouteActive(pathname: string, href: string) {
  if (href === '/trilha' && pathname.startsWith('/adaptar-trilha')) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebarNav() {
  const pathname = usePathname();
  return (
    <Sidebar
      items={NAV_ITEMS.map((item) => ({
        ...item,
        active: isRouteActive(pathname, item.href),
      }))}
    />
  );
}

export function AppMobileNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegação rápida" className="flex items-center gap-2 min-w-max">
      {NAV_ITEMS.map((item) => {
        const active = isRouteActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold min-h-[40px] transition-colors',
              active
                ? 'bg-brand-500 text-white'
                : 'bg-cream text-brand-text hover:bg-peach hover:text-brand-700',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
