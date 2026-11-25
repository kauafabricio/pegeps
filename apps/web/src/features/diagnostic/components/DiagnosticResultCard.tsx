'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { DiagnosticLevel, DiagnosticResult, TrailPreview } from '../services/diagnostic.service';

interface DiagnosticResultCardProps {
  result: DiagnosticResult;
  onChoose: (choice: 'recommended' | 'default') => void;
  isChoosing: boolean;
}

const levelBadge: Record<DiagnosticLevel, 'info' | 'warning' | 'success'> = {
  inicial: 'info',
  intermediario: 'warning',
  avancado: 'success',
};

const levelLabels: Record<DiagnosticLevel, string> = {
  inicial: 'Inicial',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

function TrailModulesPreview({ trail }: { trail: TrailPreview }) {
  return (
    <>
      <p className="text-xs text-brand-700 bg-brand-50 rounded-lg px-3 py-2 mb-3">
        Primeiro passo: {trail.firstStep}
      </p>
      {trail.modules.length > 0 && (
        <ol className="text-xs text-gray-500 flex flex-wrap gap-1.5 mb-4">
          {trail.modules.map((mod, idx) => (
            <li key={mod.id} className="bg-gray-100 rounded-md px-2 py-0.5">
              {idx + 1}. {mod.title}
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

export function DiagnosticResultCard({ result, onChoose, isChoosing }: DiagnosticResultCardProps) {
  const isRecommendedSameAsDefault = result.recommendedTrail.id === result.defaultTrail.id;
  const levelLabel = levelLabels[result.level] ?? result.level;

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl" aria-hidden>
            🎯
          </span>
          <div>
            <p className="text-sm text-gray-500">
              Seu nível ({result.correctCount} de {result.totalQuestions} acertos)
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-gray-900">{levelLabel}</span>
              <Badge variant={levelBadge[result.level] ?? 'default'}>{levelLabel}</Badge>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Conceitos avaliados:</p>
          <ul className="flex flex-col gap-1.5">
            {result.concepts.map((concept) => {
              const recognized = concept.status === 'reconhecido';
              return (
                <li key={concept.conceptId} className="flex items-center gap-2 text-sm">
                  <span aria-hidden>{recognized ? '✅' : '⚠️'}</span>
                  <span>{concept.label}</span>
                  <span className="text-gray-400 text-xs">
                    {recognized ? 'Reconhecido' : 'A desenvolver'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-1">
          Trilha recomendada para você
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{result.recommendedTrail.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{result.recommendedTrail.description}</p>
        <TrailModulesPreview trail={result.recommendedTrail} />
        <Button
          className="w-full"
          onClick={() => onChoose('recommended')}
          isLoading={isChoosing}
        >
          Seguir trilha recomendada
        </Button>
      </Card>

      {!isRecommendedSameAsDefault && (
        <Card>
          <p className="text-sm font-medium text-gray-500 mb-1">Ou comece pelo início</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{result.defaultTrail.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{result.defaultTrail.description}</p>
          <TrailModulesPreview trail={result.defaultTrail} />
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onChoose('default')}
            isLoading={isChoosing}
          >
            Seguir trilha padrão
          </Button>
        </Card>
      )}
    </div>
  );
}
