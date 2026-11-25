import type { Metadata } from 'next';
import { AdaptTrailForm } from '@/features/adapt/components/AdaptTrailForm';

export const metadata: Metadata = { title: 'Adaptar Trilha — Pegeps' };

export default function AdaptarPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Adaptar trilha</h1>
      <p className="text-gray-500 text-sm mb-6">
        Use IA para personalizar a ordem dos módulos ao seu contexto, ou solicite uma consultoria com especialista.
      </p>
      <AdaptTrailForm />
    </div>
  );
}
