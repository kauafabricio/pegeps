'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { profileService, type UpdateProfileInput } from '../services/profile.service';
import { profileSchema, type ProfileInput } from '../schemas/profile.schema';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { extractErrorMessage, getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

const STARTUP_STAGES = [
  { value: '', label: 'Selecionar…' },
  { value: 'ideacao', label: 'Ideação' },
  { value: 'validacao', label: 'Validação' },
  { value: 'tracao', label: 'Tração' },
  { value: 'escala', label: 'Escala' },
];

const LEARNING_STYLES = [
  { value: '', label: 'Selecionar…' },
  { value: 'visual', label: 'Visual — vídeos e mapas mentais' },
  { value: 'leitura', label: 'Leitura e escrita' },
  { value: 'auditivo', label: 'Auditivo' },
  { value: 'pratico', label: 'Prático' },
];

export function ProfileForm() {
  const { user, refresh } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.profile?.avatarUrl ?? null,
  );
  const [serverError, setServerError] = useState('');

  const initials = getInitials(user?.name);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      jobTitle: user?.profile?.jobTitle ?? '',
      startupStage: (user?.profile?.startupStage as ProfileInput['startupStage']) ?? '',
      learningStyle: (user?.profile?.learningStyle as ProfileInput['learningStyle']) ?? '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProfileInput) => {
      const payload: UpdateProfileInput = {
        name: data.name,
        email: data.email,
      };
      if (data.jobTitle?.trim()) payload.jobTitle = data.jobTitle.trim();
      if (data.startupStage) payload.startupStage = data.startupStage;
      if (data.learningStyle) payload.learningStyle = data.learningStyle;
      return profileService.update(payload);
    },
    onSuccess: async (res) => {
      setServerError('');
      await refresh();
      reset({
        name: res.user.name,
        email: res.user.email,
        jobTitle: res.user.profile?.jobTitle ?? '',
        startupStage: (res.user.profile?.startupStage as ProfileInput['startupStage']) ?? '',
        learningStyle: (res.user.profile?.learningStyle as ProfileInput['learningStyle']) ?? '',
      });
      toast.success('Alterações salvas com sucesso!');
    },
    onError: (err) => {
      const msg = extractErrorMessage(err);
      setServerError(msg);
      toast.error(msg);
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: async (res) => {
      setAvatarPreview(res.user.profile?.avatarUrl ?? null);
      await refresh();
      toast.success('Foto atualizada!');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    avatarMutation.mutate(file);
  }

  function onSubmit(data: ProfileInput) {
    setServerError('');
    updateMutation.mutate(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulário de perfil"
      className="grid md:grid-cols-[240px_1fr] gap-6 items-start"
    >
      {/* Left Avatar Card (PDF page 11) */}
      <Card className="flex flex-col items-center text-center gap-4 border border-brand-100">
        {avatarPreview ? (
          <Image
            src={avatarPreview}
            alt={`Foto de perfil de ${user?.name ?? 'usuário'}`}
            width={96}
            height={96}
            unoptimized
            className="w-24 h-24 rounded-full object-cover border-4 border-brand-500"
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full bg-peach border-2 border-brand-200 text-brand-700 flex items-center justify-center text-2xl font-black"
            aria-label={`Iniciais ${initials}`}
          >
            {initials}
          </div>
        )}

        <div>
          <p className="font-black text-brand-text">{user?.name}</p>
          <p className="text-xs text-gray-600 break-all">{user?.email}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={avatarMutation.isPending}
          onClick={() => avatarInputRef.current?.click()}
        >
          Alterar foto
        </Button>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={handleAvatarChange}
          aria-label="Selecionar nova foto de perfil"
        />
      </Card>

      {/* Right Fields Card */}
      <Card className="border border-brand-100">
        <div className="flex flex-col gap-4">
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

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Cargo ou função"
              {...register('jobTitle')}
              error={errors.jobTitle?.message}
              placeholder="Ex.: Product Manager"
            />
            <Select
              label="Estágio da startup"
              {...register('startupStage')}
              error={errors.startupStage?.message}
              options={STARTUP_STAGES}
            />
          </div>

          <Select
            label="Como você gosta de estudar"
            {...register('learningStyle')}
            error={errors.learningStyle?.message}
            options={LEARNING_STYLES}
          />
        </div>

        {serverError && (
          <p role="alert" aria-live="polite" className="mt-4 text-xs text-red-700 bg-red-50 rounded-2xl px-4 py-2.5">
            {serverError}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 flex-wrap">
          <Link href="/trilha">
            <Button variant="ghost" size="md" type="button">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            isLoading={isSubmitting || updateMutation.isPending}
            disabled={!isDirty}
            size="md"
          >
            Salvar alterações
          </Button>
        </div>
      </Card>
    </form>
  );
}
