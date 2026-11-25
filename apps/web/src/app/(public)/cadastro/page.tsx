'use client';

import { useState } from 'react';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { PegepsWordmark } from '@/components/layout/Header';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';

export default function CadastroPage() {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [typedName, setTypedName] = useState('');

  const firstName = typedName.trim().split(/\s+/)[0];

  return (
    <AuthGuard mode="public">
      <div className="min-h-screen bg-cream flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-brand-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <PegepsWordmark />
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {mode === 'register' ? 'Já tem conta?' : 'Ainda não tem conta?'}
              </span>
              <Button
                type="button"
                size="sm"
                className="bg-brand-600 hover:bg-brand-700"
                onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
              >
                {mode === 'register' ? 'Entrar' : 'Criar conta'}
              </Button>
            </div>
          </div>
          {mode === 'register' && (
            <div className="border-t border-gray-100 py-3 px-4">
              <div className="max-w-md mx-auto">
                <Stepper
                  steps={['Sua conta', 'Diagnóstico', 'Sua trilha']}
                  current={0}
                  ariaLabel="Etapas do cadastro"
                />
              </div>
            </div>
          )}
        </header>

        {/* Main split content */}
        <main id="main-content" className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
          <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-10 items-center">
            {/* Orange decorative panel */}
            <div className="relative bg-brand-500 text-white rounded-4xl px-8 sm:px-10 py-14 sm:py-16 overflow-hidden shadow-card min-h-[340px] flex flex-col justify-end">
              {/* Decorative circles */}
              <div
                aria-hidden="true"
                className="absolute top-6 left-10 w-24 h-24 rounded-full bg-brand-800/45 deco-circle"
              />
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-12 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-brand-800/45 deco-circle"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-8 right-12 w-28 h-28 rounded-full bg-brand-800/45 deco-circle"
              />

              <div className="relative z-10 text-right">
                <p className="text-3xl sm:text-4xl font-black leading-[1.15] tracking-tight">
                  interaja.
                  <br />
                  contextualize.
                  <br />
                  adapte.
                  <br />
                  estude.
                  <br />
                  gerencie.
                </p>
              </div>
            </div>

            {/* Form panel */}
            <div className="w-full max-w-md mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-black text-brand-text mb-1">
                  {mode === 'register' ? 'Crie sua conta' : 'Entrar na sua conta'}
                </h1>
                <p className="text-sm text-gray-600">
                  {mode === 'register'
                    ? firstName
                      ? `Vamos construir seu ponto de partida, ${firstName}.`
                      : 'Vamos construir seu ponto de partida.'
                    : 'Acesse sua trilha e continue seus estudos.'}
                </p>
              </div>

              {mode === 'register' ? (
                <RegisterForm
                  onSwitchToLogin={() => setMode('login')}
                  onNameChange={setTypedName}
                />
              ) : (
                <LoginForm onSwitchToRegister={() => setMode('register')} />
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
