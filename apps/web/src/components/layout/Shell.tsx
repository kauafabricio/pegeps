import { type ReactNode } from 'react';
import { Header } from './Header';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        Pegeps © {new Date().getFullYear()} — Gestão de projetos para startups
      </footer>
    </div>
  );
}
