'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ModuleStatus, type ModuleWithStatus } from '@pegeps/domain';

interface KnowledgeGraphProps {
  modules: ModuleWithStatus[];
  variant?: 'study' | 'assessment';
  onSelect?: (module: ModuleWithStatus) => void;
}

const STATUS_META: Record<
  ModuleStatus,
  { label: string; icon: string; badgeClass: string; cardClass: string }
> = {
  [ModuleStatus.Concluido]: {
    label: 'Concluído',
    icon: '✓',
    badgeClass: 'bg-emerald-50 text-brand-green border-emerald-200',
    cardClass: 'border-brand-green bg-white hover:shadow-card-hover',
  },
  [ModuleStatus.Desbloqueado]: {
    label: 'Desbloqueado',
    icon: '◉',
    badgeClass: 'bg-peach text-brand-700 border-brand-200',
    cardClass: 'border-brand-500 bg-white ring-2 ring-brand-500/20 hover:shadow-card-hover',
  },
  [ModuleStatus.Bloqueado]: {
    label: 'Bloqueado',
    icon: '🔒',
    badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
    cardClass: 'border-gray-200 bg-cream/70 opacity-80',
  },
};

// Posições pentagonais (%) para os 5 módulos ao redor do nó central (50%, 50%)
const PENTAGON_CARD_STYLES: Array<{ left: string; top: string; lineX: number; lineY: number }> = [
  { left: '50%', top: '14%', lineX: 50, lineY: 18 },   // Topo
  { left: '83%', top: '38%', lineX: 80, lineY: 40 },   // Direita superior
  { left: '72%', top: '79%', lineX: 70, lineY: 75 },   // Direita inferior
  { left: '28%', top: '79%', lineX: 30, lineY: 75 },   // Esquerda inferior
  { left: '17%', top: '38%', lineX: 20, lineY: 40 },   // Esquerda superior
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
          isPentagon && 'md:min-h-[580px]',
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
              const isActive = mod.status !== ModuleStatus.Bloqueado;
              return (
                <line
                  key={`line-${mod.moduleId}`}
                  x1="50"
                  y1="50"
                  x2={pos.lineX}
                  y2={pos.lineY}
                  stroke={
                    mod.status === ModuleStatus.Concluido
                      ? '#1F6B4A'
                      : isActive
                        ? '#FF7A00'
                        : '#D1D5DB'
                  }
                  strokeWidth="0.45"
                  strokeDasharray={isActive ? undefined : '1.2 1.2'}
                />
              );
            })}
          </svg>
        )}

        {/* Nó central */}
        <div
          className={cn(
            'mb-4 md:mb-0 flex justify-center',
            isPentagon && 'md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:z-10',
          )}
        >
          <div className="bg-brand-500 text-white rounded-3xl px-5 py-4 text-center shadow-card max-w-[190px] border-4 border-peach">
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
                  'rounded-3xl border-2 p-4 transition-all duration-200 text-left',
                  meta.cardClass,
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border',
                      meta.badgeClass,
                    )}
                  >
                    <span aria-hidden>{meta.icon}</span>
                    <span>{meta.label}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500" aria-hidden>
                    {mod.order}/{modules.length}
                  </span>
                </div>

                <h3 className="text-sm font-black text-brand-text leading-snug mb-1.5">
                  {mod.title}
                </h3>

                {mod.concepts.length > 0 && (
                  <ul className="flex flex-col gap-0.5 text-[11px] text-gray-600 mb-2" aria-label={`Conceitos de ${mod.title}`}>
                    {mod.concepts.map((c) => (
                      <li key={c.id} className="truncate">
                        {c.name}
                      </li>
                    ))}
                  </ul>
                )}

                {variant === 'assessment' && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    {isInteractiveAssessment ? (
                      <Link
                        href={`/avaliacoes/${mod.moduleId}`}
                        onClick={() => onSelect?.(mod)}
                        aria-label={`Responder avaliação — ${ariaLabel}`}
                        className="inline-flex items-center justify-center w-full rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-3 py-2 min-h-[40px] transition-colors"
                      >
                        Responder avaliação
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        aria-label={`Responder avaliação indisponível — ${ariaLabel}`}
                        className="inline-flex items-center justify-center w-full rounded-full bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-2 min-h-[40px] cursor-not-allowed"
                      >
                        {isConcluded ? 'Avaliação concluída' : 'Responder avaliação'}
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
                    'md:absolute md:-translate-x-1/2 md:-translate-y-1/2 md:w-[210px] md:z-20',
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
