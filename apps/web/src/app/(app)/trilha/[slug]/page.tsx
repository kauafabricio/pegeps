'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { ModuleStatus } from '@pegeps/domain';
import { TutorChat } from '@/features/tutor/components/TutorChat';
import { AssessmentQuiz } from '@/features/assessment/components/AssessmentQuiz';
import { AssessmentResultCard } from '@/features/assessment/components/AssessmentResultCard';
import {
  assessmentService,
  type AssessmentQuestion,
  type AssessmentResultResponse,
} from '@/features/assessment/services/assessment.service';
import { useActiveTrail } from '@/features/trail/hooks/useActiveTrail';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { extractErrorMessage } from '@/lib/utils';

type ViewState = 'tutor' | 'assessment' | 'result';

interface AssessmentSession {
  variantId: string;
  questions: AssessmentQuestion[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ModulePage({ params }: PageProps) {
  const { slug } = use(params);
  const qc = useQueryClient();
  const { data: trailData, isLoading: isTrailLoading, error: trailError } = useActiveTrail();

  const [view, setView] = useState<ViewState>('tutor');
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [result, setResult] = useState<AssessmentResultResponse | null>(null);
  const [isStartingAssessment, setIsStartingAssessment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentError, setAssessmentError] = useState('');

  if (isTrailLoading) {
    return (
      <div className="flex items-center justify-center py-20" aria-live="polite">
        <p className="text-gray-400 animate-pulse">Carregando módulo…</p>
      </div>
    );
  }

  if (trailError || !trailData) {
    return (
      <Card>
        <p className="text-red-600" role="alert">
          Erro ao carregar sua trilha ativa.
        </p>
      </Card>
    );
  }

  const currentModule = trailData.modules.find((m) => m.slug === slug);

  if (!currentModule) {
    return (
      <Card className="flex flex-col gap-4 max-w-xl mx-auto text-center">
        <h1 className="text-xl font-bold text-gray-900">Módulo não encontrado na sua trilha</h1>
        <p className="text-sm text-gray-500">
          O módulo solicitado não faz parte da sua trilha ativa.
        </p>
        <Link href="/trilha">
          <Button>Voltar para a trilha</Button>
        </Link>
      </Card>
    );
  }

  const nextModuleSlug = result?.nextModule
    ? trailData.modules.find((m) => m.moduleId === result.nextModule?.id)?.slug
    : undefined;

  async function handleGoToAssessment() {
    if (!currentModule) return;
    setIsStartingAssessment(true);
    setAssessmentError('');
    try {
      const data = await assessmentService.start(currentModule.moduleId);
      setSession({ variantId: data.variantId, questions: data.questions });
      setView('assessment');
    } catch (err) {
      setAssessmentError(extractErrorMessage(err));
    } finally {
      setIsStartingAssessment(false);
    }
  }

  async function handleSubmitAssessment(
    answers: Array<{ questionId: string; selectedOptionId: string }>,
  ) {
    if (!session || !currentModule) return;
    setIsSubmitting(true);
    setAssessmentError('');
    try {
      const res = await assessmentService.submit(
        currentModule.moduleId,
        session.variantId,
        answers,
      );
      setResult(res);
      setView('result');
      qc.invalidateQueries({ queryKey: ['trail', 'active'] });
    } catch (err) {
      setAssessmentError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRetry() {
    setResult(null);
    setSession(null);
    setView('tutor');
  }

  // Keep showing assessment result even after trail invalidation marks the module completed.
  if (view === 'result' && result) {
    return (
      <div className="flex flex-col gap-6">
        <nav aria-label="Navegação estrutural" className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/trilha" className="hover:text-brand-700 transition-colors">
            Minha trilha
          </Link>
          <span aria-hidden>›</span>
          <span className="text-gray-900">{currentModule.title}</span>
        </nav>
        <AssessmentResultCard
          result={result}
          nextModuleSlug={nextModuleSlug}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (currentModule.status === ModuleStatus.Bloqueado) {
    return (
      <Card className="flex flex-col gap-4 max-w-xl mx-auto text-center">
        <span className="text-4xl" aria-hidden>
          🔒
        </span>
        <h1 className="text-xl font-bold text-gray-900">{currentModule.title}</h1>
        <p className="text-sm text-gray-500">
          Este módulo ainda está bloqueado. Conclua o módulo anterior para desbloqueá-lo.
        </p>
        <Link href="/trilha">
          <Button>Voltar para a trilha</Button>
        </Link>
      </Card>
    );
  }

  if (currentModule.status === ModuleStatus.Concluido) {
    const unlockedModule = trailData.modules.find(
      (m) => m.status === ModuleStatus.Desbloqueado,
    );

    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <nav aria-label="Navegação estrutural" className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/trilha" className="hover:text-brand-700 transition-colors">
            Minha trilha
          </Link>
          <span aria-hidden>›</span>
          <span className="text-gray-900">{currentModule.title}</span>
        </nav>

        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{currentModule.title}</h1>
            <Badge variant="success">Concluído</Badge>
          </div>
          <p className="text-sm text-gray-600">{currentModule.description}</p>
          {currentModule.concepts.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Conceitos do módulo
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentModule.concepts.map((c) => (
                  <Badge key={c.id}>{c.name}</Badge>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 flex-wrap pt-2">
            {unlockedModule && (
              <Link href={`/trilha/${unlockedModule.slug}`}>
                <Button>Ir para módulo atual: {unlockedModule.title}</Button>
              </Link>
            )}
            <Link href="/trilha">
              <Button variant="secondary">Voltar para a trilha</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Navegação estrutural" className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/trilha" className="hover:text-brand-700 transition-colors">
          Minha trilha
        </Link>
        <span aria-hidden>›</span>
        <span className="text-gray-900">{currentModule.title}</span>
      </nav>

      <div className="flex gap-2 border-b border-gray-200 pb-0">
        <button
          type="button"
          onClick={() => setView('tutor')}
          aria-current={view === 'tutor' ? 'page' : undefined}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px
            ${view === 'tutor' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          🤖 Tutor Tom
        </button>
        <button
          type="button"
          onClick={handleGoToAssessment}
          disabled={isStartingAssessment}
          aria-current={view === 'assessment' ? 'page' : undefined}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px
            ${view === 'assessment' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'}
            disabled:opacity-50`}
        >
          {isStartingAssessment ? '⏳ Carregando…' : '📝 Avaliação'}
        </button>
      </div>

      {assessmentError && (
        <p role="alert" className="text-sm text-red-600">
          {assessmentError}
        </p>
      )}

      {view === 'tutor' && <TutorChat onGoToAssessment={handleGoToAssessment} />}

      {view === 'assessment' && session && (
        <AssessmentQuiz
          questions={session.questions}
          onComplete={handleSubmitAssessment}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
