'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveTrail } from '@/features/trail/hooks/useActiveTrail';
import { TutorChat } from '@/features/tutor/components/TutorChat';
import type { TutorStepResponse } from '@/features/tutor/services/tutor.service';
import { Button } from '@/components/ui/Button';
import { ModuleStatus } from '@pegeps/domain';

export default function TutorPage() {
  const { data } = useActiveTrail();
  const router = useRouter();
  const [activeModule, setActiveModule] = useState<TutorStepResponse['activeModule']>(null);

  const unlockedFromTrail = data?.modules.find((m) => m.status === ModuleStatus.Desbloqueado);
  const targetModuleId = activeModule?.id ?? unlockedFromTrail?.moduleId;
  const targetModuleTitle = activeModule?.title ?? unlockedFromTrail?.title;

  const handleActiveModuleChange = useCallback((mod: TutorStepResponse['activeModule']) => {
    setActiveModule(mod);
  }, []);

  function handleGoToAssessment(moduleId?: string) {
    const id = moduleId ?? targetModuleId;
    if (id) {
      router.push(`/avaliacoes/${id}`);
    } else {
      router.push('/avaliacoes');
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-1">
            Não sabe o que estudar?
          </h1>
          <p className="text-sm text-gray-600">
            Tom te ajuda com isso! Interaja com ele no chat abaixo e descubra materiais para o seu módulo{' '}
            {targetModuleTitle ? <strong>{targetModuleTitle}</strong> : 'atual'}.
          </p>
        </div>

        <Button
          size="md"
          disabled={!targetModuleId}
          onClick={() => handleGoToAssessment(targetModuleId)}
        >
          Responder a avaliação
        </Button>
      </div>

      <TutorChat
        onGoToAssessment={handleGoToAssessment}
        onActiveModuleChange={handleActiveModuleChange}
      />
    </div>
  );
}
