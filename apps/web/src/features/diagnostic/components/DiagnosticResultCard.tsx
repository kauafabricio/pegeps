'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { DiagnosticSubmitResult } from '../services/diagnostic.service';

interface DiagnosticResultCardProps {
  result: DiagnosticSubmitResult;
  firstName?: string;
  onReview: () => void;
}

const LEVEL_LABELS: Record<DiagnosticSubmitResult['level'], string> = {
  inicial: 'Nível inicial',
  intermediario: 'Nível intermediário',
  avancado: 'Nível avançado',
};

export function DiagnosticResultCard({
  result,
  firstName,
  onReview,
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
            <p className="text-3xl font-black text-brand-text">
              {correctCount} de {totalQuestions}
            </p>
            <p className="text-sm font-bold text-brand-text mb-1">
              conceitos reconhecidos
            </p>
            <p className="text-xs text-brand-accent">
              Conhecimento em construção. Este resumo considera apenas as três situações do diagnóstico.
            </p>
          </div>
          {/* Decorative orange badge graphic */}
          <div
            aria-hidden="true"
            className="hidden sm:flex w-20 h-20 rounded-full bg-brand-500 items-center justify-center flex-shrink-0 relative"
          >
            <div className="w-12 h-12 rounded-full border-4 border-brand-yellow bg-white/20" />
          </div>
        </div>

        {/* Concept list */}
        <ul className="flex flex-col divide-y divide-brand-100" aria-label="Resultado por conceito">
          {concepts.map((c) => {
            const recognized = c.status === 'reconhecido';
            return (
              <li key={c.conceptId} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3">
                <span
                  aria-hidden
                  className={`mt-0.5 inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold flex-shrink-0 ${
                    recognized
                      ? 'bg-emerald-100 text-brand-green'
                      : 'border-2 border-dashed border-gray-400 text-gray-600'
                  }`}
                >
                  {recognized ? '✓' : '○'}
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
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-lg text-brand-700 mt-0.5">ⓘ</span>
          <div>
            <p className="text-sm font-bold text-brand-text">
              Recomendação: começar por {recommendedTrail.sequence[0] ?? recommendedTrail.title}.
            </p>
            <p className="text-xs text-brand-accent mt-0.5 leading-relaxed">
              {recommendedTrail.description}
            </p>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="hidden sm:block w-14 h-14 rounded-full bg-brand-500 flex-shrink-0 translate-y-4"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button variant="ghost" onClick={onReview} size="md">
          ← Revisar respostas
        </Button>
        <Link href="/escolher-trilha">
          <Button size="md">Escolher minha trilha →</Button>
        </Link>
      </div>
    </div>
  );
}
