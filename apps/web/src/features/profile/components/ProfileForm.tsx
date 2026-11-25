'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/providers/AuthProvider';
import { profileService } from '../services/profile.service';
import { profileSchema, type ProfileInput } from '../schemas/profile.schema';
import { extractErrorMessage } from '@/lib/utils';
import { STARTUP_STAGE_LABELS, LEARNING_STYLE_LABELS } from '@/lib/constants';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const startupStageOptions = Object.entries(STARTUP_STAGE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const learningStyleOptions = Object.entries(LEARNING_STYLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function ProfileForm() {
  const { user, refresh } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      jobTitle: user?.profile.jobTitle ?? '',
      startupStage: user?.profile.startupStage ?? '',
      learningStyle: user?.profile.learningStyle ?? '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        jobTitle: user.profile.jobTitle ?? '',
        startupStage: user.profile.startupStage ?? '',
        learningStyle: user.profile.learningStyle ?? '',
      });
    }
  }, [user, reset]);

  async function onSubmit(data: ProfileInput) {
    setServerError('');
    setSuccessMsg('');
    const payload: Record<string, string> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v && v !== '') payload[k] = v as string;
    }
    try {
      await profileService.update(payload);
      await refresh();
      setSuccessMsg('Perfil atualizado com sucesso!');
    } catch (err) {
      setServerError(extractErrorMessage(err));
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setServerError('');
    setSuccessMsg('');

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setServerError('Formato inválido. Use PNG, JPG ou WebP.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setServerError('A imagem deve ter no máximo 2MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setIsUploadingAvatar(true);

    try {
      await profileService.uploadAvatar(file);
      await refresh();
      setSuccessMsg('Foto de perfil atualizada com sucesso!');
    } catch (err) {
      setAvatarPreview(null);
      setServerError(extractErrorMessage(err));
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  const avatarSrc = avatarPreview ?? user?.profile.avatarUrl;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Card className="flex items-center gap-6 flex-wrap">
        <div className="relative">
          {avatarSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarSrc}
              alt="Foto de perfil"
              className="w-20 h-20 rounded-full object-cover border-2 border-brand-200"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-3xl"
              aria-hidden
            >
              👤
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">{user?.name}</p>
          <p className="text-xs text-gray-400 mb-2">{user?.email}</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            isLoading={isUploadingAvatar}
            onClick={() => fileRef.current?.click()}
          >
            Trocar foto
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            aria-label="Selecionar foto de perfil"
            onChange={handleAvatarChange}
          />
          <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WebP · máx. 2MB</p>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-gray-900">Dados pessoais</h2>
        <Input
          label="Nome completo"
          {...register('name')}
          error={errors.name?.message}
          autoComplete="name"
        />
        <Input
          label="E-mail"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          autoComplete="email"
        />
        <Input
          label="Cargo / Função"
          {...register('jobTitle')}
          error={errors.jobTitle?.message}
          placeholder="Ex.: Product Manager"
        />
        <Select
          label="Estágio da startup"
          {...register('startupStage')}
          options={startupStageOptions}
          placeholder="Selecione o estágio"
        />
        <Select
          label="Estilo de aprendizado preferido"
          {...register('learningStyle')}
          options={learningStyleOptions}
          placeholder="Selecione o estilo"
        />
      </Card>

      {serverError && (
        <p role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      )}
      {successMsg && (
        <p role="status" className="text-sm text-green-600">
          {successMsg}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Salvar alterações
      </Button>
    </form>
  );
}
