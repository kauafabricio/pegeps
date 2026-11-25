'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
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
    conceptFeedback,
    nextModule,
    completedCount,
    totalModules,
  } = result;

  const scorePct =
    result.scorePercentage ??
    (totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0);
  const passPct = totalQuestions > 0 ? Math.round((passThreshold / totalQuestions) * 100) : 70;
  const trailPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const topics =
    conceptFeedback && conceptFeedback.length > 0
      ? conceptFeedback
      : demonstratedConcepts.map((c) => ({
          id: c.id,
          name: c.name,
          correct: 0,
          total: 0,
          demonstrated: true,
          feedback: c.feedback ?? '',
        }));

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full" aria-live="polite">
      {/* Header */}
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
            passed ? 'bg-emerald-50' : 'bg-peach'
          }`}
        >
          <Icon name={passed ? 'seal' : 'info-orange'} size={24} />
        </span>
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-widest mb-1 ${
              passed ? 'text-brand-700' : 'text-red-700'
            }`}
          >
            {passed ? 'Avaliação aprovada' : 'Avaliação não aprovada'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-1">
            {passed
              ? `Um passo importante. Bem feito${firstName ? `, ${firstName}` : ''}!`
              : `Quase lá${firstName ? `, ${firstName}` : ''}! Vale revisar mais um pouco.`}
          </h1>
          <p className="text-sm text-gray-600">
            {passed ? (
              <>
                Você consolidou os conceitos de {moduleTitle}. Agora pode seguir para a próxima
                etapa da sua trilha.
              </>
            ) : (
              <>
                Você acertou <strong>{correctCount} de {totalQuestions}</strong> perguntas em{' '}
                <strong>{moduleTitle}</strong>. Para desbloquear o próximo módulo, são necessárias
                pelo menos <strong>{passThreshold} respostas corretas</strong>.
              </>
            )}
          </p>
        </div>
      </div>

      {/* 2-column score + demonstrated topics */}
      <div className="grid md:grid-cols-[260px_1fr] gap-5">
        <Card className="border border-gray-200 flex flex-col justify-between p-6">
          <div>
            <Badge
              variant={passed ? 'success' : 'orange'}
              className={`mb-5 border-0 ${passed ? 'bg-emerald-50' : 'bg-peach'}`}
            >
              {passed ? `✓ ${moduleTitle}` : moduleTitle}
            </Badge>
            <p
              className={`text-5xl font-black mb-2 ${
                passed ? 'text-brand-green' : 'text-brand-700'
              }`}
            >
              {scorePct}%
            </p>
            <p className="text-sm font-bold text-brand-text mb-3">
              {correctCount} de {totalQuestions} respostas corretas
            </p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            {passed
              ? 'Avaliação concluída. Este módulo agora conta como concluído no seu grafo.'
              : `Mínimo para aprovação: ${passThreshold} de ${totalQuestions} (${passPct}%).`}
          </p>
        </Card>

        <Card className="border border-gray-200 p-6">
          <h2 className="text-base font-black text-brand-text mb-4">
            {passed ? 'O que você demonstrou' : 'O que você demonstrou conhecer'}
          </h2>
          {topics.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {topics.map((topic) => (
                <li key={topic.id} className="flex items-start gap-3">
                  <span aria-hidden className="mt-0.5 flex-shrink-0">
                    <Icon name={topic.demonstrated ? 'concluido' : 'dashed'} size={20} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-bold text-brand-text">{topic.name}</span>
                      {topic.total > 0 && (
                        <span
                          className={`text-xs font-semibold ${
                            topic.demonstrated ? 'text-brand-green' : 'text-brand-700'
                          }`}
                        >
                          {topic.correct}/{topic.total} acertos
                        </span>
                      )}
                    </div>
                    {topic.feedback && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {topic.feedback}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">
              {passed
                ? `Você atingiu a pontuação mínima para concluir o módulo ${moduleTitle}.`
                : `Revise os materiais de ${moduleTitle} com o Tutor Tom para fortalecer cada tópico antes da próxima tentativa.`}
            </p>
          )}
        </Card>
      </div>

      {/* Bottom observation / module progress strip with Figma spheres art */}
      <div className="relative rounded-3xl px-7 py-5 overflow-hidden bg-peach">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assessment-banner-bg.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {passed ? (
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <p className="text-[11px] font-bold text-brand-green uppercase tracking-wider">
                  ✓ Concluído
                </p>
                <p className="text-sm font-black text-brand-text">{moduleTitle}</p>
              </div>
              {nextModule && (
                <>
                  <span className="text-brand-700 font-bold text-lg" aria-hidden>→</span>
                  <div>
                    <p className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                      ○ Desbloqueado
                    </p>
                    <p className="text-sm font-black text-brand-text">{nextModule.title}</p>
                  </div>
                </>
              )}
            </div>

            <Badge variant="success" className="border-0 bg-emerald-50">
              ✓ {completedCount}/{totalModules} concluídos • {trailPct}%
            </Badge>
          </div>
        ) : (
          <div className="relative z-10 flex items-start gap-3">
            <span aria-hidden className="mt-0.5 flex-shrink-0">
              <Icon name="info-orange" size={20} />
            </span>
            <div>
              <p className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-0.5">
                Observação e próximo passo
              </p>
              <p className="text-sm font-medium text-brand-text leading-relaxed">
                Converse com o Tutor Tom para revisar os materiais deste módulo e depois tente uma
                nova prova com questões variadas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 flex-wrap">
        {passed ? (
          <Link href="/trilha">
            <Button size="md">Ver meu grafo atualizado →</Button>
          </Link>
        ) : (
          <>
            <Button variant="secondary" size="md" onClick={onRetry}>
              Tentar novamente
            </Button>
            <Link href="/tutor">
              <Button size="md">Estudar com o Tom →</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
