'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useActiveTrail } from '@/features/trail/hooks/useActiveTrail';
import { TutorChat } from '@/features/tutor/components/TutorChat';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface TrilhaModulePageProps {
  params: Promise<{ slug: string }>;
}

export default function TrilhaModulePage({ params }: TrilhaModulePageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { data, isLoading } = useActiveTrail();

  const mod = data?.modules.find((m) => m.slug === slug);

  function handleGoToAssessment(moduleId?: string) {
    const id = moduleId ?? mod?.moduleId;
    if (id) {
      router.push(`/avaliacoes/${id}`);
    } else {
      router.push('/avaliacoes');
    }
  }

  if (isLoading) {
    return <SkeletonCard lines={5} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link href="/trilha">
          <Button variant="ghost" size="sm">← Voltar à trilha</Button>
        </Link>
        {mod && (
          <Button
            size="sm"
            disabled={mod.status === 'bloqueado'}
            onClick={() => handleGoToAssessment(mod.moduleId)}
          >
            Responder a avaliação
          </Button>
        )}
      </div>

      {mod && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="orange">Módulo {mod.order}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-1">{mod.title}</h1>
          <p className="text-sm text-gray-600">{mod.description}</p>
        </div>
      )}

      <TutorChat onGoToAssessment={handleGoToAssessment} />
    </div>
  );
}
