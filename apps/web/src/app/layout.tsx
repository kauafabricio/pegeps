import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Pegeps — Gestão de Projetos para Startups',
  description:
    'Plataforma educacional de gestão de projetos adaptada ao seu contexto. Trilha de conhecimento em grafo com progressão gamificada.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-brand-700 focus:font-medium"
        >
          Ir para o conteúdo principal
        </a>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
