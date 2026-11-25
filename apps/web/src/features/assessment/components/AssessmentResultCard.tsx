'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { AssessmentResultResponse } from '../services/assessment.service';

interface AssessmentResultCardProps {
  result: AssessmentResultResponse;
  nextModuleSlug?: string;
  onRetry: () => void;
}

export function AssessmentResultCard({
  result,
  nextModuleSlug,
  onRetry,
}: AssessmentResultCardProps) {
  const scorePercent =
    result.totalQuestions > 0
      ? Math.round((result.correctCount / result.totalQuestions) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <Card>
        <div className="text-center">
          <span className="text-5xl mb-4 block" aria-hidden>
            {result.passed ? '🏆' : '📚'}
          </span>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {result.passed ? 'Parabéns! Módulo concluído.' : 'Quase lá! Continue estudando.'}
          </h2>
          <p className="text-gray-500 text-sm">
            Você acertou <strong>{result.correctCount}</strong> de{' '}
            <strong>{result.totalQuestions}</strong> questões ({scorePercent}%)
          </p>
          <div className="mt-3">
            <Badge variant={result.passed ? 'success' : 'warning'}>
              {result.passed
                ? `Aprovado (≥${result.passThreshold}/${result.totalQuestions})`
                : `Não aprovado (<${result.passThreshold}/${result.totalQuestions})`}
            </Badge>
          </div>
        </div>

        {result.demonstratedConcepts.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              Conceitos demonstrados
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.demonstratedConcepts.map((c) => (
                <Badge key={c.id} variant="success">
                  {c.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {result.passed && result.nextModule && (
        <Card>
          <p className="text-sm text-gray-500 mb-1">Próximo módulo desbloqueado:</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{result.nextModule.title}</h3>
          <Link href={nextModuleSlug ? `/trilha/${nextModuleSlug}` : '/trilha'}>
            <Button className="w-full">Ir para o próximo módulo</Button>
          </Link>
        </Card>
      )}

      {!result.passed && (
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onRetry}>
            Tentar novamente
          </Button>
          <Link href="/trilha" className="flex-1">
            <Button variant="ghost" className="w-full">
              Voltar para a trilha
            </Button>
          </Link>
        </div>
      )}

      {result.passed && (
        <Link href="/trilha">
          <Button variant="secondary" className="w-full">
            Ver minha trilha
          </Button>
        </Link>
      )}

      {result.questionFeedback && result.questionFeedback.length > 0 && (
        <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Ver gabarito e explicações
          </summary>
          <ul className="mt-4 flex flex-col gap-3">
            {result.questionFeedback.map((fb, i) => (
              <li
                key={fb.questionId}
                className={`text-sm p-3 rounded-xl ${fb.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <p className="font-medium mb-1">
                  {fb.isCorrect ? '✅' : '❌'} Questão {i + 1}
                </p>
                <p className="text-gray-600">{fb.explanation}</p>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
