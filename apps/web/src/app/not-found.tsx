import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = { title: 'Página não encontrada — Pegeps' };

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 px-4 text-center">
      <span className="text-6xl" aria-hidden>🔍</span>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
        <p className="text-gray-500">O endereço que você tentou acessar não existe.</p>
      </div>
      <Link href="/trilha">
        <Button>Voltar para a trilha</Button>
      </Link>
    </div>
  );
}
