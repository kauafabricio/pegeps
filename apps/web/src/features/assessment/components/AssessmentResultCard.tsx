'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { AssessmentSubmitResult } from '../services/assessment.service';

interface AssessmentResultCardProps {
  result: AssessmentSubmitResult;
  firstName?: string;
  onRetry: () => void;
}

export function AssessmentResultCard({
  result,
  firstName,
  onRetry,
}: AssessmentResultCardProps) {
  const {
    passed,
    correctCount,
    totalQuestions,
    passThreshold,
    moduleTitle,
    demonstratedConcepts,
    nextModule,
    completedCount,
    totalModules,
  } = result;

  const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const trailPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  if (!passed) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto" aria-live="polite">
        <div>
          <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">
            Avaliação não aprovada
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-2">
            Quase lá{firstName ? `, ${firstName}` : ''}! Vale revisar mais um pouco.
          </h1>
          <p className="text-sm text-gray-600">
            Você acertou <strong>{correctCount} de {totalQuestions}</strong> perguntas em{' '}
            <strong>{moduleTitle}</strong>. Para desbloquear o próximo módulo, são necessárias pelo menos{' '}
            <strong>{passThreshold} respostas corretas</strong>.
          </p>
        </div>

        <Card className="bg-peach border border-brand-200 p-6">
          <p className="text-3xl font-black text-brand-text mb-1">
            {correctCount} de {totalQuestions} corretas ({scorePct}%)
          </p>
          <p className="text-sm text-brand-accent leading-relaxed mt-2">
            💡 Converse com o Tutor Tom para revisar os materiais deste módulo e depois tente uma nova prova com questões variadas.
          </p>
        </Card>

        <div className="flex gap-3 flex-wrap">
          <Link href="/tutor">
            <Button size="md">Estudar com o Tom</Button>
          </Link>
          <Button variant="secondary" size="md" onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" aria-live="polite">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="w-10 h-10 rounded-full bg-emerald-100 text-brand-green flex items-center justify-center font-bold flex-shrink-0 mt-1"
        >
          ✓
        </span>
        <div>
          <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-1">
            Avaliação aprovada
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-1">
            Um passo importante. Bem feito{firstName ? `, ${firstName}` : ''}!
          </h1>
          <p className="text-sm text-gray-600">
            Você consolidou os conceitos de {moduleTitle}. Agora pode seguir para a próxima etapa da sua trilha.
          </p>
        </div>
      </div>

      {/* 2-column score + demonstrated concepts (PDF page 13) */}
      <div className="grid md:grid-cols-[260px_1fr] gap-5">
        <Card className="border border-brand-100 flex flex-col justify-between">
          <div>
            <Badge variant="success" className="mb-4">✓ {moduleTitle}</Badge>
            <p className="text-5xl font-black text-brand-text mb-2">{scorePct}%</p>
            <p className="text-sm font-bold text-brand-text mb-3">
              {correctCount} de {totalQuestions} respostas corretas
            </p>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Avaliação concluída. Este módulo agora conta como concluído no seu grafo.
          </p>
        </Card>

        <Card className="border border-brand-100">
          <h2 className="text-base font-black text-brand-text mb-4">O que você demonstrou</h2>
          {demonstratedConcepts.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {demonstratedConcepts.map((c) => (
                <li key={c.id} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="w-6 h-6 rounded-full bg-emerald-100 text-brand-green flex items-center justify-center text-xs font-bold flex-shrink-0"
                  >
                    ✓
                  </span>
                  <span className="text-sm font-semibold text-brand-text">{c.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">
              Você atingiu a pontuação mínima para concluir o módulo {moduleTitle}.
            </p>
          )}
        </Card>
      </div>

      {/* Unlocked next module strip */}
      <div className="bg-peach border border-brand-200 rounded-3xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap relative overflow-hidden">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-bold text-brand-green uppercase tracking-wider">
              ✓ Concluído
            </p>
            <p className="text-sm font-black text-brand-text">{moduleTitle}</p>
          </div>
          {nextModule && (
            <>
              <span className="text-brand-700 font-bold" aria-hidden>→</span>
              <div>
                <p className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                  ◉ Desbloqueado
                </p>
                <p className="text-sm font-black text-brand-text">{nextModule.title}</p>
              </div>
            </>
          )}
        </div>

        <Badge variant="success">
          ✓ {completedCount}/{totalModules} concluídos • {trailPct}%
        </Badge>
      </div>

      <div className="flex justify-end gap-3 flex-wrap">
        <Link href="/trilha">
          <Button size="md">Ver meu grafo atualizado →</Button>
        </Link>
      </div>
    </div>
  );
}
