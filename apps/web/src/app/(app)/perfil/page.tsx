import type { Metadata } from 'next';
import { ProfileForm } from '@/features/profile/components/ProfileForm';

export const metadata: Metadata = { title: 'Editar perfil — Pegeps' };

export default function PerfilPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-1">Editar perfil</h1>
        <p className="text-sm text-gray-600">
          Mantenha seu perfil atualizado para personalizar as recomendações da IA e do Tutor Tom.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
