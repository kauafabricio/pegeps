import type { ModuleWithStatus } from '../domain/index.js';
import { deriveModulesWithStatus } from '../domain/trail-status.js';
import { NotFoundError } from '../errors/AppError.js';
import type { ModuleEntity, ModuleRepository } from '../repositories/ModuleRepository.js';
import type { ProgressRepository } from '../repositories/ProgressRepository.js';
import type { TrailEntity, TrailRepository } from '../repositories/TrailRepository.js';
import type { UserRepository } from '../repositories/UserRepository.js';

export interface ActiveTrailGraph {
  trail: {
    id: string;
    slug: string;
    title: string;
    description: string;
    kind: TrailEntity['kind'];
    firstStep: string;
  };
  progress: {
    completedCount: number;
    totalModules: number;
    percentage: number;
    totalConcepts: number;
  };
  modules: ModuleWithStatus[];
}

export class TrailService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly trailRepo: TrailRepository,
    private readonly moduleRepo: ModuleRepository,
    private readonly progressRepo: ProgressRepository,
  ) {}

  async getActiveTrailGraph(userId: string): Promise<ActiveTrailGraph> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.activeTrailId) {
      throw new NotFoundError('Nenhuma trilha ativa selecionada ainda.', 'NO_ACTIVE_TRAIL');
    }

    const trail = await this.trailRepo.findById(user.activeTrailId);
    if (!trail) {
      throw new NotFoundError('Trilha ativa não encontrada.');
    }

    const [modules, progress] = await Promise.all([
      this.moduleRepo.findByIds(trail.moduleIds),
      this.progressRepo.findByUserId(userId),
    ]);

    const modulesById = new Map<string, ModuleEntity>(modules.map((m) => [m.id, m]));
    const completedIds = progress?.completedModuleIds ?? [];
    const derivedModules = deriveModulesWithStatus(trail.moduleIds, modulesById, completedIds);

    const completedCount = derivedModules.filter((m) => m.status === 'concluido').length;
    const totalModules = derivedModules.length;
    const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
    const totalConcepts = derivedModules.reduce((sum, m) => sum + m.concepts.length, 0);

    return {
      trail: {
        id: trail.id,
        slug: trail.slug,
        title: trail.title,
        description: trail.description,
        kind: trail.kind,
        firstStep: trail.firstStep,
      },
      progress: {
        completedCount,
        totalModules,
        percentage,
        totalConcepts,
      },
      modules: derivedModules,
    };
  }
}
