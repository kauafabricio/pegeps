import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = { title: 'Entrar — Pegeps' };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl" aria-hidden>🚀</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Entrar no Pegeps</h1>
          <p className="text-gray-500 text-sm mt-1">Sua plataforma de gestão de projetos</p>
        </div>
        <Card>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
