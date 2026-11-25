'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { extractErrorMessage } from '@/lib/utils';
import { loginSchema, type LoginInput } from '../schemas/auth.schema';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError('');
    try {
      const user = await login(data.email, data.password);
      if (user.onboardingStep === 'done') {
        router.push('/trilha');
      } else if (user.onboardingStep === 'trail') {
        router.push('/escolher-trilha');
      } else {
        router.push('/diagnostico');
      }
    } catch (err) {
      setServerError(extractErrorMessage(err));
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulário de login"
      className="flex flex-col gap-4"
    >
      <Input
        label="E-mail"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        autoComplete="email"
        required
        placeholder="marina@startup.com"
      />
      <Input
        label="Senha"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />

      {serverError && (
        <p role="alert" aria-live="polite" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2 bg-brand-600 hover:bg-brand-700" size="lg">
        Entrar →
      </Button>

      <p className="text-sm text-center text-gray-600">
        Não tem conta?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-brand-700 font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 rounded"
        >
          Criar conta
        </button>
      </p>
    </form>
  );
}
