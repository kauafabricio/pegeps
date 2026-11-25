'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { OnboardingStep } from '@pegeps/domain';
import {
  diagnosticService,
  type DiagnosticResult,
} from '@/features/diagnostic/services/diagnostic.service';
import { DiagnosticWizard } from '@/features/diagnostic/components/DiagnosticWizard';
import { DiagnosticResultCard } from '@/features/diagnostic/components/DiagnosticResultCard';
import { useAuth } from '@/providers/AuthProvider';
import { Card } from '@/components/ui/Card';
import { extractErrorMessage } from '@/lib/utils';

export default function DiagnosticoPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [submittedResult, setSubmittedResult] = useState<DiagnosticResult | null>(null);

  const shouldResumeResult = user?.onboardingStep === OnboardingStep.Trail && !submittedResult;

  const questionsQuery = useQuery({
    queryKey: ['diagnostic', 'questions'],
    queryFn: () => diagnosticService.getQuestions(),
    enabled: user?.onboardingStep === OnboardingStep.Diagnostic,
  });

  const existingResultQuery = useQuery({
    queryKey: ['diagnostic', 'result'],
    queryFn: () => diagnosticService.getResult(),
    enabled: shouldResumeResult,
  });

  const submitMutation = useMutation({
    mutationFn: diagnosticService.submit,
    onSuccess: (res) => setSubmittedResult(res),
  });

  const chooseMutation = useMutation({
    mutationFn: (choice: 'recommended' | 'default') => diagnosticService.chooseTrail(choice),
    onSuccess: async () => {
      await refresh();
      router.push('/trilha');
    },
  });

  const result = submittedResult ?? existingResultQuery.data ?? null;
  const isLoading =
    (user?.onboardingStep === OnboardingStep.Diagnostic && questionsQuery.isLoading) ||
    (shouldResumeResult && existingResultQuery.isLoading);
  const loadError = questionsQuery.error ?? existingResultQuery.error;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 animate-pulse">Carregando diagnóstico…</p>
      </div>
    );
  }

  if (loadError || (!result && !questionsQuery.data)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card>
          <p className="text-red-600" role="alert">
            Erro ao carregar diagnóstico. Tente novamente.
          </p>
        </Card>
      </div>
    );
  }

  const mutationError = submitMutation.error ?? chooseMutation.error;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto mb-8 text-center">
        <span className="text-4xl" aria-hidden>
          🧩
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Diagnóstico inicial</h1>
        <p className="text-sm text-gray-500 mt-1">
          3 perguntas para identificar seu nível e recomendar a melhor trilha.
        </p>
      </div>

      {mutationError && (
        <div className="max-w-xl mx-auto mb-4">
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {extractErrorMessage(mutationError)}
          </p>
        </div>
      )}

      {!result && questionsQuery.data ? (
        <DiagnosticWizard
          questions={questionsQuery.data.questions}
          onComplete={(answers) => submitMutation.mutate({ answers })}
          isSubmitting={submitMutation.isPending}
        />
      ) : result ? (
        <DiagnosticResultCard
          result={result}
          onChoose={(choice) => chooseMutation.mutate(choice)}
          isChoosing={chooseMutation.isPending}
        />
      ) : null}
    </div>
  );
}
