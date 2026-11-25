import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = { title: 'Criar conta — Pegeps' };

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl" aria-hidden>🚀</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Criar conta grátis</h1>
          <p className="text-gray-500 text-sm mt-1">Comece a aprender gestão de projetos hoje</p>
        </div>
        <Card>
          <RegisterForm />
        </Card>
      </div>
    </div>
  );
}
