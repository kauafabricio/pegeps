'use client';

import { use, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { assessmentService } from '@/features/assessment/services/assessment.service';
import { AssessmentQuiz } from '@/features/assessment/components/AssessmentQuiz';
import { AssessmentResultCard } from '@/features/assessment/components/AssessmentResultCard';
import { Stepper } from '@/components/ui/Stepper';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { extractErrorMessage } from '@/lib/utils';

type Phase = 'quiz' | 'result';

interface AssessmentModulePageProps {
  params: Promise<{ moduleId: string }>;
}

const STEPS = ['Estudo', 'Avaliação', 'Próximo módulo'];

export default function AssessmentModulePage({ params }: AssessmentModulePageProps) {
  const { moduleId } = use(params);
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>('quiz');
  const [submitError, setSubmitError] = useState('');
  const queryClient = useQueryClient();

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? '';

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assessment-start', moduleId],
    queryFn: () => assessmentService.start(moduleId),
    staleTime: 0,
  });

  const submitMutation = useMutation({
    mutationFn: (answers: Array<{ questionId: string; selectedOptionId: string }>) => {
      if (!data) throw new Error('Avaliação não carregada');
      return assessmentService.submit(moduleId, {
        variantId: data.variantId,
        answers,
      });
    },
    onSuccess: () => {
      setSubmitError('');
      queryClient.invalidateQueries({ queryKey: ['active-trail'] });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      setPhase('result');
    },
    onError: (err) => setSubmitError(extractErrorMessage(err)),
  });

  const currentStep = phase === 'result' && submitMutation.data?.passed ? 2 : 1;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6" aria-live="polite" aria-label="Carregando avaliação">
        <SkeletonCard lines={5} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <h1 className="text-lg font-bold text-brand-text mb-2">Avaliação indisponível</h1>
        <p role="alert" className="text-sm text-red-700 mb-4">
          {extractErrorMessage(error) ||
            'Esta avaliação não está disponível. Verifique se este módulo está desbloqueado.'}
        </p>
        <Link href="/avaliacoes">
          <Button variant="secondary" size="sm">← Voltar às avaliações</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link href="/avaliacoes">
          <Button variant="ghost" size="sm">← Avaliações</Button>
        </Link>
        <div className="max-w-sm w-full">
          <Stepper steps={STEPS} current={currentStep} ariaLabel="Etapas da avaliação" />
        </div>
      </div>

      {phase === 'quiz' && (
        <AssessmentQuiz
          questions={data.questions}
          moduleTitle={data.moduleTitle}
          onComplete={(answers) => submitMutation.mutate(answers)}
          onBack={() => {
            window.history.back();
          }}
          isSubmitting={submitMutation.isPending}
          submitError={submitError}
        />
      )}

      {phase === 'result' && submitMutation.data && (
        <AssessmentResultCard
          result={submitMutation.data}
          firstName={firstName}
          onRetry={async () => {
            submitMutation.reset();
            setSubmitError('');
            await refetch();
            setPhase('quiz');
          }}
        />
      )}
    </div>
  );
}
