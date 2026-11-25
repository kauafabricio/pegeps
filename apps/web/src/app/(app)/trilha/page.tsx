'use client';

import Link from 'next/link';
import { useActiveTrail } from '@/features/trail/hooks/useActiveTrail';
import { TrailGraph } from '@/features/trail/components/TrailGraph';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function TrilhaPage() {
  const { data, isLoading, error } = useActiveTrail();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20" aria-live="polite">
        <p className="text-gray-400 animate-pulse">Carregando sua trilha…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <p className="text-red-600" role="alert">
          Erro ao carregar a trilha. Tente recarregar a página.
        </p>
      </Card>
    );
  }

  const kindLabel: Record<string, string> = {
    default: 'Padrão',
    diagnostic: 'Diagnóstica',
    custom: 'Personalizada com IA',
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">{data.trail.title}</h1>
          <Badge variant={data.trail.kind === 'custom' ? 'info' : 'default'}>
            {kindLabel[data.trail.kind] ?? data.trail.kind}
          </Badge>
        </div>
        <p className="text-gray-500 text-sm mb-2">{data.trail.description}</p>
        {data.trail.firstStep && (
          <p className="text-xs text-brand-700 font-medium mb-4">
            Próxima orientação: {data.trail.firstStep}
          </p>
        )}
        <ProgressBar
          value={data.progress.percentage}
          label={`${data.progress.completedCount} de ${data.progress.totalModules} módulos concluídos`}
        />
      </div>

      <TrailGraph modules={data.modules} />

      <Card className="text-center bg-brand-50 border-brand-200">
        <p className="text-sm font-medium text-brand-800 mb-3">
          ✨ Quer uma trilha personalizada para o seu contexto?
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/adaptar">
            <Button size="sm">Adaptar com IA ou especialista</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
