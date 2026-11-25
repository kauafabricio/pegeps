'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { DiagnosticSubmitResult } from '../services/diagnostic.service';

interface DiagnosticResultCardProps {
  result: DiagnosticSubmitResult;
  firstName?: string;
}

const LEVEL_LABELS: Record<DiagnosticSubmitResult['level'], string> = {
  inicial: 'Nível inicial',
  intermediario: 'Nível intermediário',
  avancado: 'Nível avançado',
};

export function DiagnosticResultCard({
  result,
  firstName,
}: DiagnosticResultCardProps) {
  const {
    level,
    correctCount,
    totalQuestions,
    recommendationText,
    concepts,
    recommendedTrail,
  } = result;

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto" aria-live="polite">
      <div>
        <p className="text-xs font-bold text-brand-700 uppercase tracking-widest mb-1">
          Diagnóstico concluído
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-2">
          Seu ponto de partida está mais claro{firstName ? `, ${firstName}` : ''}.
        </h1>
        <p className="text-sm text-gray-600">{recommendationText}</p>
      </div>

      {/* Main result card */}
      <Card className="p-6 sm:p-8 border border-brand-100">
        <div className="mb-4">
          <Badge variant="orange">{LEVEL_LABELS[level] ?? 'Nível inicial'}</Badge>
        </div>

        {/* Peach summary banner */}
        <div className="bg-peach rounded-3xl p-6 flex items-center justify-between gap-6 mb-6 relative overflow-hidden">
          <div>
            <p className="text-3xl font-black text-brand-500">
              {correctCount} de {totalQuestions}
            </p>
            <p className="text-sm font-bold text-brand-text mb-1">
              conceitos reconhecidos
            </p>
            <p className="text-xs text-brand-accent">
              Conhecimento em construção. Este resumo considera apenas as três situações do diagnóstico.
            </p>
          </div>
          {/* Tom mascot image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tom-right.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block w-20 h-24 object-contain flex-shrink-0"
          />
        </div>

        {/* Concept list */}
        <ul className="flex flex-col divide-y divide-brand-100" aria-label="Resultado por conceito">
          {concepts.map((c) => {
            const recognized = c.status === 'reconhecido';
            return (
              <li key={c.conceptId} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3">
                <span aria-hidden className="mt-0.5 flex-shrink-0">
                  <Icon name={recognized ? 'concluido' : 'dashed'} size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold text-brand-text">
                    {c.label} •{' '}
                    <span className={recognized ? 'text-brand-green' : 'text-brand-700'}>
                      {recognized ? 'Reconhecido' : 'A desenvolver'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{c.feedback}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Recommendation strip */}
      <div className="bg-peach border border-brand-200 rounded-3xl px-6 py-5 flex items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-start gap-3 sm:pr-20">
          <span aria-hidden className="mt-0.5 flex-shrink-0">
            <Icon name="info-orange" size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-brand-700">
              Recomendação: começar por {recommendedTrail.sequence[0] ?? recommendedTrail.title}.
            </p>
            <p className="text-xs text-brand-accent mt-0.5 leading-relaxed">
              {recommendedTrail.description}
            </p>
          </div>
        </div>
        {/* Decorative stacked rings matching Figma */}
        <div
          aria-hidden="true"
          className="hidden sm:block w-14 h-14 rounded-full border-2 border-brand-500 absolute -top-5 right-6 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block w-14 h-14 rounded-full bg-brand-500 absolute -bottom-5 right-6 pointer-events-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Link href="/escolher-trilha">
          <Button size="md">Escolher minha trilha →</Button>
        </Link>
      </div>
    </div>
  );
}
