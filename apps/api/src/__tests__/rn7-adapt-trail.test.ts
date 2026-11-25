import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { TrailKind } from '../domain/index.js';
import { BadGatewayError, TooManyRequestsError } from '../errors/AppError.js';
import { ModuleModel } from '../models/Module.js';
import { TrailAdaptationModel } from '../models/TrailAdaptation.js';
import { TrailModel } from '../models/Trail.js';
import { ModuleRepository } from '../repositories/ModuleRepository.js';
import { ProgressRepository } from '../repositories/ProgressRepository.js';
import { TrailAdaptationRepository } from '../repositories/TrailAdaptationRepository.js';
import { TrailRepository } from '../repositories/TrailRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { AdaptTrailService } from '../services/AdaptTrailService.js';
import type { TrailAdapterAI } from '../services/AiService.js';
import { clearTestDb, connectTestDb, disconnectTestDb } from './setup-db.js';

describe('RN7 — Adaptação de trilha com IA (cooldown 15d, validação, falha não consome)', () => {
  const userRepo = new UserRepository();
  const trailRepo = new TrailRepository();
  const moduleRepo = new ModuleRepository();
  const progressRepo = new ProgressRepository();
  const adaptationRepo = new TrailAdaptationRepository();

  let userId: string;
  let mod1Id: string;
  let mod2Id: string;

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();

    const mod1 = await ModuleModel.create({
      slug: 'mod-1',
      title: 'Módulo 1',
      description: 'Desc 1',
      order: 1,
      concepts: [{ id: 'mvp', name: 'MVP' }],
    });
    const mod2 = await ModuleModel.create({
      slug: 'mod-2',
      title: 'Módulo 2',
      description: 'Desc 2',
      order: 2,
      concepts: [{ id: 'scrum', name: 'Scrum' }],
    });
    mod1Id = mod1._id.toString();
    mod2Id = mod2._id.toString();

    const trail = await TrailModel.create({
      slug: 'trilha-base',
      title: 'Trilha Base',
      description: 'Desc',
      kind: TrailKind.Default,
      firstStep: 'Começar',
      moduleIds: [mod1._id, mod2._id],
    });

    const user = await userRepo.create({
      name: 'Teste IA',
      email: 'rn7@pegeps.test',
      passwordHash: 'hash',
    });
    userId = user.id;
    await userRepo.setActiveTrail(userId, trail.id);
    await progressRepo.markModuleCompleted(userId, mod1Id);
  });

  it('falha da IA (ID inválido ou erro) não consome o limite de 15 dias', async () => {
    const failingAi: TrailAdapterAI = {
      adaptTrail: vi.fn().mockResolvedValue({
        title: 'Trilha inválida',
        description: 'Tentando incluir módulo já concluído.',
        moduleIds: [mod1Id], // mod1 já foi concluído -> inválido
      }),
    };

    const service = new AdaptTrailService(
      userRepo,
      trailRepo,
      moduleRepo,
      progressRepo,
      adaptationRepo,
      failingAi,
    );

    await expect(service.adaptWithAi(userId, 'Preciso melhorar priorização.')).rejects.toBeInstanceOf(
      BadGatewayError,
    );

    const statusAfterFailure = await service.getStatus(userId);
    expect(statusAfterFailure.canAdapt).toBe(true);
    expect(await TrailAdaptationModel.countDocuments({ userId })).toBe(0);
  });

  it('cria trilha customizada preservando módulos concluídos e aplica cooldown de 15 dias', async () => {
    const validAi: TrailAdapterAI = {
      adaptTrail: vi.fn().mockResolvedValue({
        title: 'Trilha Focada em Metodologias',
        description: 'Sequência adaptada para o momento atual da startup.',
        moduleIds: [mod2Id],
      }),
    };

    const service = new AdaptTrailService(
      userRepo,
      trailRepo,
      moduleRepo,
      progressRepo,
      adaptationRepo,
      validAi,
    );

    const result = await service.adaptWithAi(userId, 'Quero organizar entregas com Scrum.');
    expect(result.trail.kind).toBe(TrailKind.Custom);
    expect(result.trail.moduleIds).toEqual([mod1Id, mod2Id]);

    const status = await service.getStatus(userId);
    expect(status.canAdapt).toBe(false);
    expect(status.daysRemaining).toBeGreaterThan(0);

    await expect(service.adaptWithAi(userId, 'Nova tentativa imediata.')).rejects.toBeInstanceOf(
      TooManyRequestsError,
    );
  });
});
