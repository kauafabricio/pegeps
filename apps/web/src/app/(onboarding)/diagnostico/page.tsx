'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { OnboardingStep } from '@pegeps/domain';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { DiagnosticWizard } from '@/features/diagnostic/components/DiagnosticWizard';
import { DiagnosticResultCard } from '@/features/diagnostic/components/DiagnosticResultCard';
import {
  diagnosticService,
  type DiagnosticSubmitResult,
} from '@/features/diagnostic/services/diagnostic.service';
import { extractErrorMessage } from '@/lib/utils';

type Phase = 'intro' | 'quiz' | 'result';

const INTRO_CARDS: Array<{ icon: IconName; title: string; description: string }> = [
  {
    icon: 'avaliacoes',
    title: 'Responda no seu ritmo',
    description: 'MVP, validação de hipóteses e priorização. Vale não saber ainda.',
  },
  {
    icon: 'search',
    title: 'Enxergue suas lacunas',
    description: 'Veja o que reconheceu e quais temas merecem atenção primeiro.',
  },
  {
    icon: 'trilha',
    title: 'Escolha sua trilha',
    description: 'Receba uma recomendação ou comece pelo padrão iniciante.',
  },
];

export default function DiagnosticoPage() {
  const { user, refresh } = useAuth();
  const [phase, setPhase] = useState<Phase>('intro');
  const [result, setResult] = useState<DiagnosticSubmitResult | null>(null);
  const [submitError, setSubmitError] = useState('');

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? '';

  // Se o usuário já concluiu o diagnóstico (onboardingStep === 'trail'), carrega o resultado salvo
  const savedResultQuery = useQuery({
    queryKey: ['diagnostic-result'],
    queryFn: () => diagnosticService.getResult(),
    enabled: user?.onboardingStep === OnboardingStep.Trail && !result,
    retry: false,
  });

  useEffect(() => {
    if (savedResultQuery.data && !result) {
      setResult(savedResultQuery.data);
      setPhase('result');
    }
  }, [savedResultQuery.data, result]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['diagnostic-questions'],
    queryFn: () => diagnosticService.getQuestions(),
    enabled: phase === 'quiz',
  });

  const submitMutation = useMutation({
    mutationFn: (answers: Array<{ questionId: string; selectedOptionId: string }>) =>
      diagnosticService.submit(answers),
    onSuccess: async (res) => {
      setSubmitError('');
      setResult(res);
      await refresh();
      setPhase('result');
    },
    onError: (err) => setSubmitError(extractErrorMessage(err)),
  });

  if (user?.onboardingStep === OnboardingStep.Trail && savedResultQuery.isLoading && !result) {
    return <SkeletonCard lines={5} />;
  }

  if (phase === 'intro') {
    return (
      <div className="flex flex-col gap-8">
        <div className="grid md:grid-cols-[1fr_240px] gap-6 items-center relative">
          {/* Decorative yellow ring behind heading */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute -left-8 top-6 w-48 h-48 rounded-full border-4 border-brand-yellow/60 pointer-events-none"
          />

          <div className="relative z-10">
            <div className="mb-3">
              <Badge variant="success">✓ CONTA CRIADA</Badge>
            </div>
            {firstName && (
              <p className="text-xs font-bold text-brand-700 uppercase tracking-widest mb-1">
                OLÁ, {firstName.toUpperCase()}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl font-black text-brand-text leading-tight mb-3">
              Antes de começar, vamos entender o que você já sabe.
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-lg">
              Um diagnóstico curto para sugerir por onde estudar. Sem pressão, sem nota de aprovação.
            </p>
          </div>

          {/* 3 illustrative questions highlight card */}
          <div className="relative bg-peach rounded-3xl p-6 border border-brand-100 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full border-4 border-brand-yellow"
            />
            <p className="text-4xl font-black text-brand-text leading-none mb-1">3</p>
            <p className="text-sm font-bold text-brand-text mb-2">perguntas ilustrativas</p>
            <p className="text-xs text-brand-accent leading-relaxed mb-2">
              Uma por tela, sobre situações reais em gestão de projetos.
            </p>
            <p className="text-xs text-gray-600">
              Você pode voltar e revisar antes de concluir.
            </p>
          </div>
        </div>

        {/* 3 explanatory cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {INTRO_CARDS.map((c) => (
            <Card key={c.title} className="border border-brand-100">
              <div className="mb-3" aria-hidden="true">
                <Icon name={c.icon} size={24} />
              </div>
              <h2 className="font-bold text-brand-text mb-1.5 text-sm">{c.title}</h2>
              <p className="text-xs text-gray-600 leading-relaxed">{c.description}</p>
            </Card>
          ))}
        </div>

        {/* Notice */}
        <div className="bg-peach border border-brand-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="mt-0.5 flex-shrink-0" aria-hidden="true">
            <Icon name="info-orange" size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-brand-text">Um ponto de partida, não um rótulo.</p>
            <p className="text-xs text-brand-accent mt-0.5">
              O resultado é uma orientação baseada nestas três respostas. Não é uma medida definitiva do seu conhecimento e não conclui módulos.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="lg" onClick={() => setPhase('quiz')}>
            Começar diagnóstico →
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'quiz') {
    if (isLoading) return <SkeletonCard lines={4} />;
    if (error || !data?.questions.length) {
      return (
        <Card>
          <p role="alert" className="text-red-700">
            {extractErrorMessage(error) || 'Perguntas indisponíveis. Tente novamente.'}
          </p>
        </Card>
      );
    }

    return (
      <DiagnosticWizard
        questions={data.questions}
        onComplete={(answers) => submitMutation.mutate(answers)}
        onBack={() => setPhase('intro')}
        isSubmitting={submitMutation.isPending}
        submitError={submitError}
      />
    );
  }

  if (phase === 'result' && result) {
    return (
      <DiagnosticResultCard
        result={result}
        firstName={firstName}
      />
    );
  }

  return null;
}
