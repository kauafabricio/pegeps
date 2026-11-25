'use client';

import Link from 'next/link';
import { useActiveTrail } from '@/features/trail/hooks/useActiveTrail';
import { KnowledgeGraph } from '@/features/trail/components/KnowledgeGraph';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';

export default function TrilhaPage() {
  const { data, isLoading, error } = useActiveTrail();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6" aria-live="polite" aria-label="Carregando trilha">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-16 w-full" />
        <SkeletonCard lines={6} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <p className="text-red-700" role="alert">
          Erro ao carregar a trilha. Tente recarregar a página.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-1">
            Trilha de conhecimento
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl">
            {data.trail.description ||
              'Explore os tópicos essenciais de gestão de projetos no seu ritmo. Se preferir, monte uma trilha sob medida para o seu momento atual.'}
          </p>
        </div>

        <Link href="/tutor">
          <Button
            variant="outline"
            size="md"
            className="border border-brand-700 text-brand-700 hover:bg-peach"
          >
            Perguntar ao Tom
          </Button>
        </Link>
      </div>

      {/* Progress strip card */}
      <Card className="px-6 py-4 border border-gray-200 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-baseline gap-2 flex-shrink-0">
            <span className="text-xl font-black text-brand-text">
              {data.progress.completedCount}/{data.progress.totalModules}
            </span>
            <span className="text-xs font-medium text-gray-600">
              módulos concluídos • {data.progress.percentage}%
            </span>
          </div>
          <div className="flex-1">
            <ProgressBar
              value={data.progress.percentage}
              label="Progresso da trilha"
              segmented
              segments={data.progress.totalModules || 5}
            />
          </div>
        </div>
      </Card>

      {/* Main grid: KnowledgeGraph + Side Adaptation Card */}
      <div className="grid xl:grid-cols-[1fr_270px] gap-6 items-start">
        <Card className="p-6 border border-gray-200">
          <p className="text-xs font-bold text-brand-text mb-4">
            {data.progress.totalModules} módulos • {data.progress.totalConcepts} conceitos
          </p>
          <KnowledgeGraph modules={data.modules} variant="study" />
        </Card>

        <aside aria-label="Personalização da trilha">
          <Card className="bg-white border border-gray-200 sticky top-24">
            <div className="mb-3">
              <Badge variant="orange" className="border-0">
                <Icon name="dot" size={14} />
                Personalização
              </Badge>
            </div>
            <h2 className="text-lg font-black text-brand-text mb-2 leading-snug">
              Adapte sua trilha de forma inteligente com IA
            </h2>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Avance pelos módulos essenciais para dominar o tema. Quer algo mais específico? Crie uma trilha personalizada para os seus objetivos.
            </p>
            <Link href="/adaptar-trilha" className="block">
              <Button size="md" className="w-full">
                Adaptar trilha
              </Button>
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
