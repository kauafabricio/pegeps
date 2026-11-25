import { type ReactNode } from 'react';
import { Header } from './Header';

interface ShellProps {
  children: ReactNode;
  sidebar?: ReactNode;
  mobileNav?: ReactNode;
}

export function Shell({ children, sidebar, mobileNav }: ShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      {mobileNav && (
        <div className="lg:hidden bg-white border-b border-brand-100 px-4 py-2 overflow-x-auto">
          {mobileNav}
        </div>
      )}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {sidebar ? (
          <div className="flex gap-8 items-start">
            <aside
              className="hidden lg:block w-56 flex-shrink-0 bg-white rounded-3xl p-4 shadow-card border border-brand-100 sticky top-24"
              aria-label="Navegação lateral"
            >
              <p className="px-4 pt-1 pb-2 text-[11px] font-bold uppercase tracking-widest text-brand-accent">
                Navegação
              </p>
              {sidebar}
            </aside>
            <main id="main-content" className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        ) : (
          <main id="main-content" className="w-full">
            {children}
          </main>
        )}
      </div>
      <footer className="border-t border-brand-100 py-4 text-center text-xs text-brand-accent">
        Pegeps © {new Date().getFullYear()} — Gestão de projetos para startups
      </footer>
    </div>
  );
}
