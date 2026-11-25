'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { ModuleWithStatus } from '@pegeps/domain';
import { ModuleStatus } from '@pegeps/domain';
import Link from 'next/link';

interface TrailGraphProps {
  modules: ModuleWithStatus[];
}

const statusBadge: Record<ModuleStatus, 'success' | 'info' | 'default'> = {
  [ModuleStatus.Concluido]: 'success',
  [ModuleStatus.Desbloqueado]: 'info',
  [ModuleStatus.Bloqueado]: 'default',
};

const statusLabel: Record<ModuleStatus, string> = {
  [ModuleStatus.Concluido]: 'Concluído',
  [ModuleStatus.Desbloqueado]: 'Em andamento',
  [ModuleStatus.Bloqueado]: 'Bloqueado',
};

const statusIcon: Record<ModuleStatus, string> = {
  [ModuleStatus.Concluido]: '✅',
  [ModuleStatus.Desbloqueado]: '🔓',
  [ModuleStatus.Bloqueado]: '🔒',
};

export function TrailGraph({ modules }: TrailGraphProps) {
  return (
    <ol className="relative flex flex-col gap-0" aria-label="Módulos da trilha">
      {modules.map((mod, i) => (
        <li key={mod.moduleId} className="relative flex gap-4">
          {/* Vertical connector line */}
          {i < modules.length - 1 && (
            <div
              aria-hidden
              className={cn(
                'absolute left-5 top-10 bottom-0 w-0.5',
                mod.status === ModuleStatus.Concluido ? 'bg-brand-300' : 'bg-gray-200',
              )}
            />
          )}

          {/* Node circle */}
          <div
            className={cn(
              'relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-4',
              mod.status === ModuleStatus.Concluido
                ? 'bg-brand-100'
                : mod.status === ModuleStatus.Desbloqueado
                  ? 'bg-indigo-50 ring-2 ring-brand-500'
                  : 'bg-gray-100',
            )}
            aria-hidden
          >
            {statusIcon[mod.status as ModuleStatus]}
          </div>

          {/* Card */}
          <div className="flex-1 pb-6">
            <Card
              className={cn(
                'transition-colors',
                mod.status === ModuleStatus.Desbloqueado && 'ring-2 ring-brand-500',
                mod.status === ModuleStatus.Bloqueado && 'opacity-60',
              )}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 font-medium">Módulo {mod.order}</span>
                    <Badge variant={statusBadge[mod.status as ModuleStatus]}>
                      {statusLabel[mod.status as ModuleStatus]}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{mod.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{mod.description}</p>
                  {mod.concepts.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      Conceitos: {mod.concepts.map((c) => c.name).join(', ')}
                    </p>
                  )}
                </div>

                {mod.status === ModuleStatus.Desbloqueado && (
                  <Link href={`/trilha/${mod.slug}`}>
                    <Button size="sm">Estudar agora</Button>
                  </Link>
                )}
                {mod.status === ModuleStatus.Concluido && (
                  <Link href={`/trilha/${mod.slug}`}>
                    <Button variant="secondary" size="sm">Revisar</Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </li>
      ))}
    </ol>
  );
}
