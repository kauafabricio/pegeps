/**
 * Mapa de trilhas diagnósticas (RN2).
 *
 * Chave: string binária de 3 caracteres representando acerto (1) ou erro (0)
 * nas 3 perguntas do diagnóstico, na ordem:
 *   posição 0 → MVP
 *   posição 1 → Validação de hipóteses
 *   posição 2 → Priorização (RICE)
 *
 * Valor: slug da trilha recomendada (deve existir em seeds/diagnostic-trails.json).
 *
 * Lógica de montagem (RN2):
 *   - Lacunas em MVP ou Validação → módulo "estrategia-discovery" vai para o início.
 *   - Lacuna em Priorização → módulo "priorizacao-roadmap" vai para o início.
 *   - Módulos sem lacuna mantêm a ordem padrão no restante.
 *
 * Para editar: altere os slugs abaixo ou adicione combinações futuras.
 */
export const DIAGNOSTIC_TRAIL_MAP: Record<string, string> = {
  '000': 'diagnostico-iniciante-completo',      // lacunas nos 3 conceitos
  '001': 'diagnostico-foco-priorizacao',         // só Priorização correta
  '010': 'diagnostico-foco-validacao',           // só Validação correta
  '011': 'diagnostico-foco-discovery',           // MVP com lacuna
  '100': 'diagnostico-foco-mvp',                 // só MVP correto
  '101': 'diagnostico-foco-discovery-prior',    // Validação com lacuna
  '110': 'diagnostico-foco-priorizacao-b',      // Priorização com lacuna
  '111': 'diagnostico-avancado',                 // nenhuma lacuna
};

/** Trilha usada quando a chave não é encontrada no mapa (não deveria ocorrer). */
export const DIAGNOSTIC_FALLBACK_TRAIL_SLUG = 'comece-pelos-fundamentos';

/**
 * Retorna o slug da trilha recomendada a partir do vetor de acertos.
 * @param hits Array de booleanos na ordem [mvp, validacao-hipoteses, rice].
 */
export function resolveTrailSlug(hits: [boolean, boolean, boolean]): string {
  const key = hits.map((h) => (h ? '1' : '0')).join('');
  return DIAGNOSTIC_TRAIL_MAP[key] ?? DIAGNOSTIC_FALLBACK_TRAIL_SLUG;
}
