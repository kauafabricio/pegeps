import { z } from 'zod';
import { ADAPTATION_COOLDOWN_DAYS, TrailKind } from '../domain/index.js';
import {
  BadGatewayError,
  ConflictError,
  NotFoundError,
  TooManyRequestsError,
} from '../errors/AppError.js';
import type { ModuleRepository } from '../repositories/ModuleRepository.js';
import type { ProgressRepository } from '../repositories/ProgressRepository.js';
import type { TrailAdaptationRepository } from '../repositories/TrailAdaptationRepository.js';
import type { TrailEntity, TrailRepository } from '../repositories/TrailRepository.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import type { TrailAdapterAI } from './AiService.js';

export interface AdaptStatusOutput {
  canAdapt: boolean;
  cooldownDays: number;
  lastAdaptationAt: Date | null;
  nextAvailableAt: Date | null;
  daysRemaining: number;
}

const aiTrailResponseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(400),
  moduleIds: z.array(z.string().min(1)).min(1),
});

type AiTrailPayload = z.infer<typeof aiTrailResponseSchema>;

export class AdaptTrailService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly trailRepo: TrailRepository,
    private readonly moduleRepo: ModuleRepository,
    private readonly progressRepo: ProgressRepository,
    private readonly adaptationRepo: TrailAdaptationRepository,
    private readonly aiAdapter: TrailAdapterAI,
  ) {}

  async getStatus(userId: string): Promise<AdaptStatusOutput> {
    const latest = await this.adaptationRepo.findLatestByUserId(userId);
    if (!latest) {
      return {
        canAdapt: true,
        cooldownDays: ADAPTATION_COOLDOWN_DAYS,
        lastAdaptationAt: null,
        nextAvailableAt: null,
        daysRemaining: 0,
      };
    }

    const cooldownMs = ADAPTATION_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    const nextAvailableAt = new Date(latest.createdAt.getTime() + cooldownMs);
    const diffMs = nextAvailableAt.getTime() - Date.now();

    if (diffMs <= 0) {
      return {
        canAdapt: true,
        cooldownDays: ADAPTATION_COOLDOWN_DAYS,
        lastAdaptationAt: latest.createdAt,
        nextAvailableAt: null,
        daysRemaining: 0,
      };
    }

    const daysRemaining = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    return {
      canAdapt: false,
      cooldownDays: ADAPTATION_COOLDOWN_DAYS,
      lastAdaptationAt: latest.createdAt,
      nextAvailableAt,
      daysRemaining,
    };
  }

  async adaptWithAi(
    userId: string,
    context: string,
  ): Promise<{ trail: TrailEntity; adaptedAt: Date }> {
    const status = await this.getStatus(userId);
    if (!status.canAdapt) {
      throw new TooManyRequestsError(
        `Você já adaptou sua trilha com IA recentemente. Aguarde ${status.daysRemaining} dia(s) para uma nova adaptação gratuita.`,
        'ADAPTATION_COOLDOWN',
        { nextAvailableAt: status.nextAvailableAt, daysRemaining: status.daysRemaining },
      );
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const [catalogModules, progress, currentTrail] = await Promise.all([
      this.moduleRepo.findAllOrdered(),
      this.progressRepo.findByUserId(userId),
      user.activeTrailId ? this.trailRepo.findById(user.activeTrailId) : Promise.resolve(null),
    ]);

    const completedIds = progress?.completedModuleIds ?? [];
    const completedSet = new Set(completedIds);

    const remainingModules = catalogModules.filter((m) => !completedSet.has(m.id));
    if (remainingModules.length === 0) {
      throw new ConflictError(
        'Todos os módulos disponíveis no catálogo já foram concluídos.',
        'ALL_MODULES_COMPLETED',
      );
    }

    const remainingIdsSet = new Set(remainingModules.map((m) => m.id));
    let aiResult: AiTrailPayload;
    try {
      const rawAiResult = await this.aiAdapter.adaptTrail({
        user,
        context,
        remainingModules,
      });
      const parsed = aiTrailResponseSchema.parse(rawAiResult);
      const seen = new Set<string>();

      for (const id of parsed.moduleIds) {
        if (!remainingIdsSet.has(id) || completedSet.has(id) || seen.has(id)) {
          throw new Error(`ID de módulo inválido retornado pela IA: ${id}`);
        }
        seen.add(id);
      }

      aiResult = parsed;
    } catch (err) {
      if (err instanceof BadGatewayError) {
        throw err;
      }
      throw new BadGatewayError(
        'Não conseguimos adaptar sua trilha com IA agora. Sua trilha atual foi mantida intacta. Tente novamente em instantes.',
      );
    }

    const preservedCompletedIds = this.preserveCompletedOrder(completedIds, currentTrail);
    const finalModuleIds = [...preservedCompletedIds, ...aiResult.moduleIds];
    const firstNewModule = remainingModules.find((m) => m.id === aiResult.moduleIds[0]);

    const createdTrail = await this.trailRepo.create({
      slug: `custom-${userId}-${Date.now()}`,
      title: aiResult.title,
      description: aiResult.description,
      kind: TrailKind.Custom,
      ownerId: userId,
      moduleIds: finalModuleIds,
      firstStep: firstNewModule
        ? `Começar por ${firstNewModule.title}`
        : 'Continuar sua trilha personalizada',
    });

    await this.userRepo.setActiveTrail(userId, createdTrail.id);
    const adaptation = await this.adaptationRepo.create({
      userId,
      context,
      resultTrailId: createdTrail.id,
    });

    return {
      trail: createdTrail,
      adaptedAt: adaptation.createdAt,
    };
  }

  private preserveCompletedOrder(
    completedIds: string[],
    currentTrail: TrailEntity | null,
  ): string[] {
    if (!currentTrail) {
      return completedIds;
    }
    const completedSet = new Set(completedIds);
    const ordered = currentTrail.moduleIds.filter((id) => completedSet.has(id));
    for (const id of completedIds) {
      if (!ordered.includes(id)) {
        ordered.push(id);
      }
    }
    return ordered;
  }
}
