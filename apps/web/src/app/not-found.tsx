import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Página não encontrada — Pegeps' };

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream gap-6 px-4 text-center">
      <div className="text-8xl" aria-hidden>🗺️</div>
      <h1 className="text-3xl font-black text-brand-text">Página não encontrada</h1>
      <p className="text-gray-500 max-w-xs">
        Parece que você se perdeu no mapa. Volte para a trilha principal.
      </p>
      <Link
        href="/trilha"
        className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-600 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-brand-500"
      >
        Ir para minha trilha
      </Link>
    </div>
  );
}
