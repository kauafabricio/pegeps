import { ModuleStatus, type ModuleWithStatus } from '@pegeps/domain';
import type { ModuleEntity } from '../repositories/ModuleRepository.js';

export function deriveModulesWithStatus(
  orderedModuleIds: string[],
  modulesById: Map<string, ModuleEntity>,
  completedModuleIds: string[],
): ModuleWithStatus[] {
  const completedSet = new Set(completedModuleIds);
  let unlockedAssigned = false;

  const result: ModuleWithStatus[] = [];

  orderedModuleIds.forEach((moduleId, index) => {
    const mod = modulesById.get(moduleId);
    if (!mod) {
      return;
    }

    let status: ModuleStatus;
    if (completedSet.has(moduleId)) {
      status = ModuleStatus.Concluido;
    } else if (!unlockedAssigned) {
      status = ModuleStatus.Desbloqueado;
      unlockedAssigned = true;
    } else {
      status = ModuleStatus.Bloqueado;
    }

    result.push({
      moduleId: mod.id,
      slug: mod.slug,
      title: mod.title,
      description: mod.description,
      order: index + 1,
      status,
      concepts: mod.concepts,
    });
  });

  return result;
}
