'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { ModuleStatus, type ModuleWithStatus } from '@pegeps/domain';

interface KnowledgeGraphProps {
  modules: ModuleWithStatus[];
  variant?: 'study' | 'assessment';
  onSelect?: (module: ModuleWithStatus) => void;
}

const STATUS_META: Record<
  ModuleStatus,
  {
    label: string;
    iconName: 'concluido' | 'desbloqueado' | 'lock';
    textClass: string;
    cardClass: string;
  }
> = {
  [ModuleStatus.Concluido]: {
    label: 'Concluído',
    iconName: 'concluido',
    textClass: 'text-brand-green',
    cardClass: 'border-brand-green bg-[#DDFCE0]',
  },
  [ModuleStatus.Desbloqueado]: {
    label: 'Desbloqueado',
    iconName: 'desbloqueado',
    textClass: 'text-brand-700',
    cardClass: 'border-brand-700 bg-peach',
  },
  [ModuleStatus.Bloqueado]: {
    label: 'Bloqueado',
    iconName: 'lock',
    textClass: 'text-gray-600',
    cardClass: 'border-gray-300 bg-[#F7F5F0] opacity-85',
  },
};

// Posições pentagonais (%) para os 5 módulos ao redor do nó central (50%, 52%)
const PENTAGON_CARD_STYLES: Array<{ left: string; top: string; lineX: number; lineY: number }> = [
  { left: '50%', top: '16%', lineX: 50, lineY: 22 },   // Topo
  { left: '82%', top: '43%', lineX: 78, lineY: 44 },   // Direita superior
  { left: '72%', top: '79%', lineX: 70, lineY: 75 },   // Direita inferior
  { left: '28%', top: '79%', lineX: 30, lineY: 75 },   // Esquerda inferior
  { left: '18%', top: '43%', lineX: 22, lineY: 44 },   // Esquerda superior
];

export function KnowledgeGraph({
  modules,
  variant = 'study',
  onSelect,
}: KnowledgeGraphProps) {
  const isPentagon = modules.length <= 5;

  return (
    <div className="relative">
      {/* Layout Desktop Pentagonal (quando <= 5 módulos) + Mobile Lista Vertical */}
      <div
        className={cn(
          'relative',
          isPentagon && 'md:min-h-[670px]',
        )}
      >
        {/* Linhas SVG conectoras decorativas (apenas desktop quando pentagonal) */}
        {isPentagon && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
          >
            {modules.map((mod, idx) => {
              const pos = PENTAGON_CARD_STYLES[idx];
              if (!pos) return null;
              return (
                <line
                  key={`line-${mod.moduleId}`}
                  x1="50"
                  y1="52"
                  x2={pos.lineX}
                  y2={pos.lineY}
                  stroke="#5C554E"
                  strokeWidth="0.35"
                />
              );
            })}
          </svg>
        )}

        {/* Nó central */}
        <div
          className={cn(
            'mb-4 md:mb-0 flex justify-center',
            isPentagon && 'md:absolute md:left-1/2 md:top-[52%] md:-translate-x-1/2 md:-translate-y-1/2 md:z-10',
          )}
        >
          <div className="bg-brand-500 text-white rounded-full px-6 py-4 text-center max-w-[175px]">
            <p className="text-xs sm:text-sm font-black leading-snug">
              Gestão de projetos em startups
            </p>
          </div>
        </div>

        {/* Lista semântica única de módulos */}
        <ol
          aria-label="Módulos da trilha de conhecimento"
          className={cn(
            'flex flex-col gap-3',
            isPentagon && 'md:block md:static',
          )}
        >
          {modules.map((mod, idx) => {
            const status = (mod.status as ModuleStatus) ?? ModuleStatus.Bloqueado;
            const meta = STATUS_META[status] ?? STATUS_META[ModuleStatus.Bloqueado];
            const isUnlocked = status === ModuleStatus.Desbloqueado;
            const isConcluded = status === ModuleStatus.Concluido;
            const isInteractiveStudy = variant === 'study' && (isUnlocked || isConcluded);
            const isInteractiveAssessment = variant === 'assessment' && isUnlocked;

            const ariaLabel = `Módulo ${mod.order} de ${modules.length}, ${mod.title}, ${meta.label.toLowerCase()}, ${mod.concepts.length} conceitos`;

            const desktopPositionStyle =
              isPentagon && PENTAGON_CARD_STYLES[idx]
                ? {
                    left: PENTAGON_CARD_STYLES[idx].left,
                    top: PENTAGON_CARD_STYLES[idx].top,
                  }
                : undefined;

            const cardBody = (
              <div
                className={cn(
                  'rounded-3xl border p-3.5 transition-colors duration-200 text-left',
                  meta.cardClass,
                )}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon name={meta.iconName} size={14} />
                  <span className={cn('text-[11px] font-bold', meta.textClass)}>
                    {meta.label}
                  </span>
                </div>

                <h3 className="text-sm font-black text-brand-text leading-snug mb-1.5">
                  {mod.title}
                </h3>

                {mod.concepts.length > 0 && (
                  <ul className="flex flex-col gap-0.5 text-[11px] text-gray-600 mb-2" aria-label={`Conceitos de ${mod.title}`}>
                    {mod.concepts.map((c) => (
                      <li key={c.id} className="leading-snug">
                        {c.name}
                      </li>
                    ))}
                  </ul>
                )}

                {variant === 'assessment' && (
                  <div className="mt-3">
                    {isInteractiveAssessment ? (
                      <Link
                        href={`/avaliacoes/${mod.moduleId}`}
                        onClick={() => onSelect?.(mod)}
                        aria-label={`Responder avaliação — ${ariaLabel}`}
                        className="inline-flex items-center justify-center w-full rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-3 py-1.5 min-h-[34px] transition-colors"
                      >
                        Responder avaliação
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        aria-label={`${isConcluded ? 'Revisar avaliação' : 'Responder avaliação indisponível'} — ${ariaLabel}`}
                        className={cn(
                          'inline-flex items-center justify-center w-full rounded-full text-xs font-bold px-3 py-1.5 min-h-[34px] cursor-not-allowed',
                          isConcluded
                            ? 'bg-[#1B5E00] text-white'
                            : 'bg-[#DDDAD0] text-gray-600',
                        )}
                      >
                        {isConcluded ? 'Revisar avaliação' : 'Responder avaliação'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );

            return (
              <li
                key={mod.moduleId}
                style={desktopPositionStyle}
                className={cn(
                  isPentagon &&
                    'md:absolute md:-translate-x-1/2 md:-translate-y-1/2 md:w-[195px] md:z-20',
                )}
              >
                {variant === 'study' ? (
                  isInteractiveStudy ? (
                    <Link
                      href={`/trilha/${mod.slug}`}
                      onClick={() => onSelect?.(mod)}
                      aria-label={ariaLabel}
                      className="block rounded-3xl focus-visible:outline focus-visible:outline-3 focus-visible:outline-brand-500"
                    >
                      {cardBody}
                    </Link>
                  ) : (
                    <div aria-label={ariaLabel} aria-disabled="true">
                      {cardBody}
                    </div>
                  )
                ) : (
                  <div aria-label={ariaLabel}>{cardBody}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
