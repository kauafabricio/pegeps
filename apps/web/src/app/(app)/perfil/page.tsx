import type { Metadata } from 'next';
import { ProfileForm } from '@/features/profile/components/ProfileForm';

export const metadata: Metadata = { title: 'Meu Perfil — Pegeps' };

export default function PerfilPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meu perfil</h1>
      <ProfileForm />
    </div>
  );
}
