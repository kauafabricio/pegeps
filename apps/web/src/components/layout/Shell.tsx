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
      <div className="flex-1 w-full flex">
        {sidebar ? (
          <div className="flex flex-1 w-full">
            <aside
              className="hidden lg:block w-52 flex-shrink-0 bg-white border-r border-brand-100 px-3 py-6"
              aria-label="Navegação lateral"
            >
              <div className="sticky top-24">
                {sidebar}
              </div>
            </aside>
            <main id="main-content" className="flex-1 min-w-0 px-4 sm:px-8 py-8">
              {children}
            </main>
          </div>
        ) : (
          <main id="main-content" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
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
