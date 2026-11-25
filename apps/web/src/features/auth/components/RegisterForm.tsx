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
import { registerSchema, type RegisterInput } from '../schemas/auth.schema';

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setServerError('');
    try {
      await registerUser(data.name, data.email, data.password);
      // After register, onboardingStep = diagnostic
      router.push('/onboarding/diagnostico');
    } catch (err) {
      setServerError(extractErrorMessage(err));
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulário de cadastro"
      className="flex flex-col gap-4"
    >
      <Input
        label="Nome completo"
        {...register('name')}
        error={errors.name?.message}
        autoComplete="name"
        required
      />
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
        autoComplete="new-password"
        hint="Mínimo 8 caracteres com letras e números."
        required
      />

      {serverError && (
        <p role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
        Criar conta
      </Button>

      <p className="text-sm text-center text-gray-600">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-brand-600 font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
