'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { SkeletonCard } from '@/components/ui/Skeleton';
import {
  diagnosticService,
  type TrailPreview,
} from '@/features/diagnostic/services/diagnostic.service';
import { extractErrorMessage } from '@/lib/utils';

export default function EscolherTrilhaPage() {
  const { refresh } = useAuth();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data, isLoading, error: loadError } = useQuery({
    queryKey: ['trail-options'],
    queryFn: () => diagnosticService.getTrailOptions(),
  });

  const chooseMutation = useMutation({
    mutationFn: (trailId: string) => diagnosticService.chooseTrail(trailId),
    onSuccess: async () => {
      await refresh();
      router.push('/trilha');
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  const cards: Array<{ trail: TrailPreview; isRecommended: boolean }> = data
    ? [
        { trail: data.recommended, isRecommended: true },
        { trail: data.default, isRecommended: false },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <p className="text-xs font-bold text-brand-700 uppercase tracking-widest mb-1">
          Sua trilha
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-2">
          Escolha como quer começar.
        </h1>
        <p className="text-sm text-gray-600">
          Duas opções com o mesmo início. Escolha a abordagem que melhor combina com o seu diagnóstico.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonCard lines={5} />
          <SkeletonCard lines={5} />
        </div>
      ) : loadError ? (
        <Card>
          <p role="alert" className="text-sm text-red-700">
            {extractErrorMessage(loadError)}
          </p>
        </Card>
      ) : (
        <div
          className="grid gap-5 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Opções de trilha inicial"
        >
          {cards.map(({ trail, isRecommended }) => {
            const isSelected = selectedId === trail.id;
            return (
              <Card
                key={trail.id}
                as="button"
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedId(trail.id)}
                className={`text-left w-full relative overflow-hidden bg-white p-7 rounded-3xl ${
                  isSelected
                    ? 'border-2 border-brand-700'
                    : 'border border-gray-400/70 hover:border-brand-400'
                }`}
                aria-label={`${trail.title}, ${isRecommended ? 'Recomendada para você' : 'Padrão iniciante'}, ${trail.modulesCount} módulos`}
              >
                {/* Background art from Figma */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={isRecommended ? '/trail-art-recommended.png' : '/trail-art-default.png'}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-right-bottom pointer-events-none"
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <Badge variant="orange" className="border-0">
                      <Icon name="desbloqueado" size={14} />
                      {isRecommended ? 'Recomendada para você' : 'Padrão iniciante'}
                    </Badge>
                    <span
                      aria-hidden
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-brand-700 border-2 border-brand-700'
                          : 'border border-gray-500 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-brand-text mb-2">{trail.title}</h2>
                  <p className="text-xs text-gray-600 leading-relaxed mb-5">{trail.description}</p>

                  <hr className="border-gray-200 mb-5" />

                  <p className="text-xs font-bold text-brand-text mb-2">
                    {trail.modulesCount} módulos • sequência guiada
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-5 pr-8">
                    {trail.sequence.join(' → ')}
                  </p>

                  <p className="text-xs font-semibold text-brand-700 pr-12 mt-auto">
                    Primeiro passo: {trail.firstStep}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Notice strip */}
      <div className="bg-peach border border-brand-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <span aria-hidden className="mt-0.5 flex-shrink-0">
          <Icon name="info-orange" size={20} />
        </span>
        <div>
          <p className="text-sm font-bold text-brand-text">Selecione uma trilha para continuar.</p>
          <p className="text-xs text-brand-accent mt-0.5">
            O diagnóstico orienta o foco, mas não conclui módulos. Só o primeiro módulo estará disponível.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" aria-live="polite" className="text-sm text-red-700 bg-red-50 rounded-2xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link href="/diagnostico">
          <Button variant="ghost" size="md">
            ← Voltar ao resultado
          </Button>
        </Link>
        <Button
          size="md"
          disabled={!selectedId}
          isLoading={chooseMutation.isPending}
          onClick={() => selectedId && chooseMutation.mutate(selectedId)}
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
}
