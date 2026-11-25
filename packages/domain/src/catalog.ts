import type { CatalogModule } from './types.js';

export const CATALOG_MODULES: CatalogModule[] = [
  {
    slug: 'estrategia-discovery',
    title: 'Estratégia e Discovery',
    description:
      'Aprenda a validar hipóteses, definir MVPs e medir o ajuste produto-mercado com OKRs.',
    order: 1,
    concepts: [
      { id: 'validacao-hipoteses', name: 'Validação de hipóteses' },
      { id: 'mvp', name: 'MVP' },
      { id: 'product-market-fit', name: 'Product-market fit' },
      { id: 'okrs', name: 'OKRs' },
    ],
  },
  {
    slug: 'metodologias',
    title: 'Metodologias Ágeis',
    description: 'Domine Scrum, Kanban, Lean Startup e Shape Up na prática.',
    order: 2,
    concepts: [
      { id: 'scrum', name: 'Scrum' },
      { id: 'kanban', name: 'Kanban' },
      { id: 'lean-startup', name: 'Lean Startup' },
      { id: 'shape-up', name: 'Shape Up' },
    ],
  },
  {
    slug: 'priorizacao-roadmap',
    title: 'Priorização e Roadmap',
    description: 'Use RICE, MoSCoW e construa backlogs e roadmaps que comunicam estratégia.',
    order: 3,
    concepts: [
      { id: 'rice', name: 'RICE' },
      { id: 'moscow', name: 'MoSCoW' },
      { id: 'backlog', name: 'Backlog' },
      { id: 'roadmap', name: 'Roadmap' },
    ],
  },
  {
    slug: 'pessoas-cultura',
    title: 'Pessoas e Cultura',
    description: 'Construa times de alta performance com feedback, rituais e comunicação assíncrona.',
    order: 4,
    concepts: [
      { id: 'feedback', name: 'Feedback' },
      { id: 'rituais', name: 'Rituais' },
      { id: 'comunicacao-assincrona', name: 'Comunicação assíncrona' },
    ],
  },
  {
    slug: 'metricas-riscos',
    title: 'Métricas e Riscos',
    description: 'Defina sua North Star Metric, controle burn rate, velocity e gerencie riscos.',
    order: 5,
    concepts: [
      { id: 'north-star', name: 'North Star' },
      { id: 'burn-rate', name: 'Burn rate' },
      { id: 'velocity', name: 'Velocity' },
      { id: 'gestao-riscos', name: 'Gestão de riscos' },
    ],
  },
];

/** Slug da trilha padrão (ordem natural do catálogo). */
export const DEFAULT_TRAIL_SLUG = 'comece-pelos-fundamentos';

/** Conceitos avaliados no diagnóstico inicial (RN2). */
export const DIAGNOSTIC_CONCEPT_IDS = ['mvp', 'validacao-hipoteses', 'rice'] as const;

export type DiagnosticConceptId = (typeof DIAGNOSTIC_CONCEPT_IDS)[number];
