import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from '@/components/ui/Toaster';
import '@/styles/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pegeps — Gestão de Projetos para Startups',
  description:
    'Plataforma educacional de gestão de projetos adaptada ao seu contexto. Trilha de conhecimento em grafo com progressão gamificada.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={spaceGrotesk.variable}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-full focus:border focus:border-brand-200 focus:text-brand-700 focus:font-medium"
        >
          Pular para o conteúdo
        </a>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
