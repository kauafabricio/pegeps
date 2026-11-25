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
                className="bg-brand-500 hover:bg-brand-600"
                onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
              >
                {mode === 'register' ? 'Entrar' : 'Criar conta'}
              </Button>
            </div>
          </div>
          {mode === 'register' && (
            <div className="border-t border-gray-100 py-3 px-4">
              <div className="max-w-sm mx-auto">
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
            {/* Orange decorative panel — image background + text overlay */}
            <div className="relative rounded-4xl overflow-hidden flex flex-col justify-end" style={{ minHeight: '460px' }}>
              {/* Background image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cadastro-panel.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Text overlay */}
              <div className="relative z-10 text-right px-8 pb-8">
                <p className="text-3xl sm:text-4xl font-black leading-[1.2] tracking-tight text-white">
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
