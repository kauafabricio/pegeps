'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { extractErrorMessage } from '@/lib/utils';
import { loginSchema, type LoginInput } from '../schemas/auth.schema';
import { OnboardingStep } from '@pegeps/domain';

export function LoginForm() {
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
      const loggedUser = await login(data.email, data.password);
      router.push(
        loggedUser.onboardingStep === OnboardingStep.Done
          ? '/trilha'
          : '/onboarding/diagnostico',
      );
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
      />
      <Input
        label="Senha"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        autoComplete="current-password"
        required
      />

      {serverError && (
        <p role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
        Entrar
      </Button>

      <p className="text-sm text-center text-gray-600">
        Ainda não tem conta?{' '}
        <Link href="/cadastro" className="text-brand-600 font-medium hover:underline">
          Criar conta grátis
        </Link>
      </p>
    </form>
  );
}
