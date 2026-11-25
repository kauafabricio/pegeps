'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

interface SidebarProps {
  items: Array<{ href: string; label: string; icon: string; active?: boolean }>;
}

function getSidebarIcon(icon: string, active?: boolean) {
  switch (icon) {
    case '🗺️':
      return <Icon name="visao-geral" size={18} />;
    case '💬':
      return <Icon name="tutor" size={18} />;
    case '📝':
      return <Icon name={active ? 'info-orange' : 'info-gray'} size={18} />;
    case '👤':
      return <Icon name="circle" size={18} />;
    default:
      return <span aria-hidden className="text-base">{icon}</span>;
  }
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <nav aria-label="Navegação principal">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Navegação</p>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-sm font-semibold min-h-[44px] transition-all duration-150',
                item.active
                  ? 'bg-peach border border-brand-700 text-brand-700'
                  : 'text-brand-text hover:bg-peach/60 hover:text-brand-700',
              )}
              aria-current={item.active ? 'page' : undefined}
            >
              {getSidebarIcon(item.icon, item.active)}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
