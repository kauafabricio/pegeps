'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { extractErrorMessage } from '@/lib/utils';
import { registerSchema, type RegisterInput } from '../schemas/auth.schema';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onNameChange?: (name: string) => void;
}

export function RegisterForm({ onSwitchToLogin, onNameChange }: RegisterFormProps) {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const nameValue = watch('name') ?? '';
  const emailValue = watch('email') ?? '';
  const passwordValue = watch('password') ?? '';

  const isNameValid = nameValue.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue.trim());
  const isPasswordValid =
    passwordValue.length >= 8 && /[a-zA-Z]/.test(passwordValue) && /\d/.test(passwordValue);

  const nameField = register('name');

  async function onSubmit(data: RegisterInput) {
    setServerError('');
    try {
      const user = await registerUser(data.name, data.email, data.password);
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
      aria-label="Formulário de cadastro"
      className="flex flex-col gap-4"
    >
      <div>
        <Input
          label="Nome completo"
          {...nameField}
          onChange={(e) => {
            nameField.onChange(e);
            onNameChange?.(e.target.value);
          }}
          error={errors.name?.message}
          success={isNameValid}
          autoComplete="name"
          required
          placeholder="Marina Costa"
        />
        {!errors.name && (
          <p className={`text-xs mt-1 ${isNameValid ? 'text-brand-green font-medium' : 'text-gray-600'}`}>
            <span aria-hidden>{isNameValid ? '✓' : '○'}</span> Nome preenchido.
          </p>
        )}
      </div>

      <div>
        <Input
          label="E-mail"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          success={isEmailValid}
          autoComplete="email"
          required
          placeholder="marina@startup.com"
        />
        {!errors.email && (
          <p className={`text-xs mt-1 ${isEmailValid ? 'text-brand-green font-medium' : 'text-gray-600'}`}>
            <span aria-hidden>{isEmailValid ? '✓' : '○'}</span> Formato de e-mail válido.
          </p>
        )}
      </div>

      <div>
        <Input
          label="Senha"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          success={isPasswordValid}
          autoComplete="new-password"
          required
          placeholder="••••••••••••"
        />
        {!errors.password && (
          <p className={`text-xs mt-1 ${isPasswordValid ? 'text-brand-green font-medium' : 'text-gray-600'}`}>
            <span aria-hidden>{isPasswordValid ? '✓' : '○'}</span> 8 ou mais caracteres · letras e números.
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" aria-live="polite" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2 bg-brand-600 hover:bg-brand-700" size="lg">
        Criar conta e começar →
      </Button>

      <p className="text-sm text-center text-gray-600">
        Já tem conta?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-brand-700 font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 rounded"
        >
          Entrar
        </button>
      </p>
    </form>
  );
}
