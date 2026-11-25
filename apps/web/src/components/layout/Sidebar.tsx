import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SidebarProps {
  items: Array<{ href: string; label: string; icon: string; active?: boolean }>;
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <nav aria-label="Navegação principal">
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold min-h-[44px] transition-all duration-150',
                item.active
                  ? 'bg-peach text-brand-700 border border-brand-200'
                  : 'text-brand-text hover:bg-cream hover:text-brand-700',
              )}
              aria-current={item.active ? 'page' : undefined}
            >
              <span aria-hidden className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
