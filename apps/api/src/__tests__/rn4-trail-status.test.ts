import { describe, expect, it } from 'vitest';
import { ModuleStatus } from '../domain/index.js';
import { deriveModulesWithStatus } from '../domain/trail-status.js';
import type { ModuleEntity } from '../repositories/ModuleRepository.js';

function makeModule(id: string, order: number): ModuleEntity {
  return {
    id,
    slug: `mod-${id}`,
    title: `Módulo ${order}`,
    description: `Descrição ${order}`,
    order,
    concepts: [{ id: `c-${id}`, name: `Conceito ${order}` }],
  };
}

describe('RN4 — Status do grafo da trilha', () => {
  const orderedIds = ['m1', 'm2', 'm3'];
  const modulesById = new Map<string, ModuleEntity>([
    ['m1', makeModule('m1', 1)],
    ['m2', makeModule('m2', 2)],
    ['m3', makeModule('m3', 3)],
  ]);

  it('desbloqueia apenas o primeiro módulo quando nenhum foi concluído', () => {
    const result = deriveModulesWithStatus(orderedIds, modulesById, []);
    expect(result.map((m) => m.status)).toEqual([
      ModuleStatus.Desbloqueado,
      ModuleStatus.Bloqueado,
      ModuleStatus.Bloqueado,
    ]);
  });

  it('marca concluídos e desbloqueia o próximo módulo pendente', () => {
    const result = deriveModulesWithStatus(orderedIds, modulesById, ['m1']);
    expect(result.map((m) => m.status)).toEqual([
      ModuleStatus.Concluido,
      ModuleStatus.Desbloqueado,
      ModuleStatus.Bloqueado,
    ]);
  });

  it('marca todos como concluídos quando todos foram aprovados', () => {
    const result = deriveModulesWithStatus(orderedIds, modulesById, ['m1', 'm2', 'm3']);
    expect(result.every((m) => m.status === ModuleStatus.Concluido)).toBe(true);
  });
});
