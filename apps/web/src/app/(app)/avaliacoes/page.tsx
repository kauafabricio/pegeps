'use client';

import { useQuery } from '@tanstack/react-query';
import { assessmentService } from '@/features/assessment/services/assessment.service';
import { KnowledgeGraph } from '@/features/trail/components/KnowledgeGraph';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';

export default function AvaliacoesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => assessmentService.list(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-live="polite" aria-label="Carregando avaliações">
        <Skeleton className="h-10 w-48" />
        <SkeletonCard lines={4} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <p role="alert" className="text-red-700">
          Erro ao carregar suas avaliações. Tente recarregar a página.
        </p>
      </Card>
    );
  }

  const totalConcepts = data.modules.reduce((sum, m) => sum + m.concepts.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-bold text-brand-700 uppercase tracking-widest mb-1">
          Avaliações por módulo
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-1">Avaliações</h1>
        <p className="text-sm text-gray-600">
          Responda à avaliação do módulo desbloqueado para avançar na sua trilha.
        </p>
      </div>

      {/* Progress bar strip */}
      <Card className="p-5 border border-brand-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-baseline gap-2 flex-shrink-0">
            <span className="text-xl font-black text-brand-text">
              {data.completedCount}/{data.totalModules}
            </span>
            <span className="text-xs font-medium text-gray-600">
              avaliações concluídas • {data.percentage}%
            </span>
          </div>
          <div className="flex-1">
            <ProgressBar
              value={data.percentage}
              label="Progresso das avaliações"
            />
          </div>
        </div>
      </Card>

      {/* Assessment Knowledge Graph */}
      <Card className="p-6 border border-brand-100">
        <p className="text-xs font-bold text-brand-text mb-4">
          {data.totalModules} avaliações • {totalConcepts} conceitos
        </p>
        <KnowledgeGraph modules={data.modules} variant="assessment" />
      </Card>
    </div>
  );
}
