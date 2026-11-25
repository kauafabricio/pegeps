'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import {
  adaptService,
  type AdaptResult,
  type SpecialistRequestResult,
} from '../services/adapt.service';
import { adaptSchema, type AdaptInput } from '../schemas/adapt.schema';
import { extractErrorMessage, formatDate } from '@/lib/utils';

interface AdaptTrailFormProps {
  onSuccess?: (result: AdaptResult) => void;
}

export function AdaptTrailForm({ onSuccess }: AdaptTrailFormProps) {
  const qc = useQueryClient();
  const [result, setResult] = useState<AdaptResult | null>(null);
  const [specialistDialogOpen, setSpecialistDialogOpen] = useState(false);
  const [specialistResult, setSpecialistResult] = useState<SpecialistRequestResult | null>(null);
  const [specialistLoading, setSpecialistLoading] = useState(false);
  const [specialistError, setSpecialistError] = useState('');
  const [serverError, setServerError] = useState('');

  const statusQuery = useQuery({
    queryKey: ['adapt', 'status'],
    queryFn: () => adaptService.getStatus(),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdaptInput>({ resolver: zodResolver(adaptSchema) });

  const contextValue = watch('context') ?? '';
  const canAdapt = statusQuery.data?.canAdapt ?? true;

  async function onSubmit(data: AdaptInput) {
    setServerError('');
    try {
      const res = await adaptService.adapt(data);
      setResult(res);
      qc.invalidateQueries({ queryKey: ['trail', 'active'] });
      qc.invalidateQueries({ queryKey: ['adapt', 'status'] });
      onSuccess?.(res);
    } catch (err) {
      setServerError(extractErrorMessage(err));
    }
  }

  async function handleRequestSpecialist() {
    setSpecialistError('');
    setSpecialistLoading(true);
    try {
      const res = await adaptService.requestSpecialist();
      setSpecialistResult(res);
    } catch (err) {
      setSpecialistError(extractErrorMessage(err));
    } finally {
      setSpecialistLoading(false);
    }
  }

  if (result) {
    return (
      <Card>
        <div className="text-center flex flex-col items-center gap-3">
          <span className="text-4xl" aria-hidden>
            ✨
          </span>
          <h3 className="text-lg font-bold text-gray-900">Trilha personalizada criada!</h3>
          <p className="text-sm font-medium text-brand-700">{result.trail.title}</p>
          <p className="text-sm text-gray-600">{result.trail.description}</p>
          <Link href="/trilha" className="mt-2">
            <Button>Ver minha nova trilha</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Adaptar trilha com IA</h2>
        <p className="text-sm text-gray-500 mb-4">
          Descreva sua realidade, objetivos e dores. A IA vai reordenar os módulos da trilha para o
          seu contexto.
          <span className="block mt-1 text-xs text-gray-400">
            Limite: 1 adaptação gratuita a cada 15 dias. (20–800 caracteres)
          </span>
        </p>

        {!canAdapt && statusQuery.data && (
          <div
            role="status"
            className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900"
          >
            Você já realizou uma adaptação gratuita recentemente. Nova adaptação disponível em{' '}
            <strong>
              {statusQuery.data.nextAvailableAt
                ? formatDate(statusQuery.data.nextAvailableAt)
                : `${statusQuery.data.daysRemaining} dia(s)`}
            </strong>
            . Você ainda pode solicitar uma consultoria com especialista a qualquer momento.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="adapt-context" className="text-sm font-medium text-gray-700">
              Sua realidade e objetivos <span className="text-red-500" aria-hidden>*</span>
            </label>
            <textarea
              id="adapt-context"
              {...register('context')}
              rows={5}
              maxLength={800}
              disabled={!canAdapt}
              placeholder="Ex.: Sou PM numa startup de saúde em fase de tração. Tenho dificuldade em priorizar com o time e alinhar stakeholders externos..."
              aria-describedby={errors.context ? 'context-error' : 'context-hint'}
              aria-invalid={!!errors.context}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                hover:border-gray-400 placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
            />
            <div className="flex justify-between">
              {errors.context ? (
                <p id="context-error" role="alert" className="text-xs text-red-600">
                  {errors.context.message}
                </p>
              ) : (
                <p id="context-hint" className="text-xs text-gray-400">
                  Seja específico para melhores resultados.
                </p>
              )}
              <span className="text-xs text-gray-400">{contextValue.length}/800</span>
            </div>
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-red-600">
              {serverError}
            </p>
          )}

          <div className="flex gap-3 flex-wrap">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!canAdapt}
              className="flex-1"
            >
              ✨ Adaptar com IA
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSpecialistError('');
                setSpecialistDialogOpen(true);
              }}
            >
              Falar com especialista
            </Button>
          </div>
        </form>
      </Card>

      <Dialog
        open={specialistDialogOpen}
        onClose={() => setSpecialistDialogOpen(false)}
        title="Consultoria com especialista"
      >
        {specialistResult ? (
          <div className="text-center py-4">
            <span className="text-4xl mb-3 block" aria-hidden>
              📧
            </span>
            <p className="text-gray-700 font-medium">Solicitação enviada!</p>
            <p className="text-sm text-gray-500 mt-1">{specialistResult.message}</p>
            <Button className="mt-4 w-full" onClick={() => setSpecialistDialogOpen(false)}>
              Fechar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Um especialista em gestão de projetos para startups irá personalizar sua trilha
              manualmente. Você receberá um e-mail de confirmação após a solicitação.
            </p>
            {specialistError && (
              <p role="alert" className="text-sm text-red-600">
                {specialistError}
              </p>
            )}
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={handleRequestSpecialist}
                isLoading={specialistLoading}
              >
                Confirmar solicitação
              </Button>
              <Button variant="ghost" onClick={() => setSpecialistDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
