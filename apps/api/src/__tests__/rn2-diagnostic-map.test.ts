import { describe, expect, it } from 'vitest';
import {
  DIAGNOSTIC_FALLBACK_TRAIL_SLUG,
  DIAGNOSTIC_TRAIL_MAP,
  resolveTrailSlug,
} from '../domain/diagnostic-trail-map.js';

describe('RN2 — Mapa de trilhas diagnósticas', () => {
  it('mapeia todas as 8 combinações binárias de acertos [MVP, Validação, Priorização]', () => {
    const cases: Array<{ hits: [boolean, boolean, boolean]; expected: string }> = [
      { hits: [false, false, false], expected: 'diagnostico-iniciante-completo' },
      { hits: [false, false, true], expected: 'diagnostico-foco-priorizacao' },
      { hits: [false, true, false], expected: 'diagnostico-foco-validacao' },
      { hits: [false, true, true], expected: 'diagnostico-foco-discovery' },
      { hits: [true, false, false], expected: 'diagnostico-foco-mvp' },
      { hits: [true, false, true], expected: 'diagnostico-foco-discovery-prior' },
      { hits: [true, true, false], expected: 'diagnostico-foco-priorizacao-b' },
      { hits: [true, true, true], expected: 'diagnostico-avancado' },
    ];

    expect(Object.keys(DIAGNOSTIC_TRAIL_MAP)).toHaveLength(8);
    for (const c of cases) {
      expect(resolveTrailSlug(c.hits)).toBe(c.expected);
    }
  });

  it('possui trilha de fallback definida', () => {
    expect(DIAGNOSTIC_FALLBACK_TRAIL_SLUG).toBe('comece-pelos-fundamentos');
  });
});
