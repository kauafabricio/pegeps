import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { TrailKind } from '../domain/index.js';
import { AssessmentBankModel } from '../models/AssessmentBank.js';
import { ModuleModel } from '../models/Module.js';
import { TrailModel } from '../models/Trail.js';
import { AssessmentRepository } from '../repositories/AssessmentRepository.js';
import { ModuleRepository } from '../repositories/ModuleRepository.js';
import { ProgressRepository } from '../repositories/ProgressRepository.js';
import { TrailRepository } from '../repositories/TrailRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { AssessmentService } from '../services/AssessmentService.js';
import { clearTestDb, connectTestDb, disconnectTestDb } from './setup-db.js';

function makeQuestions(prefix: string) {
  return Array.from({ length: 10 }, (_, idx) => ({
    id: `${prefix}-q${idx + 1}`,
    conceptId: 'mvp',
    statement: `Pergunta ${idx + 1}`,
    options: [
      { id: 'a', text: 'Correta' },
      { id: 'b', text: 'Errada 1' },
      { id: 'c', text: 'Errada 2' },
    ],
    correctOptionId: 'a',
    explanation: 'Explicação padrão.',
  }));
}

describe('RN6 — Avaliações (7/10, rotação de variantes, desbloqueio)', () => {
  const userRepo = new UserRepository();
  const trailRepo = new TrailRepository();
  const moduleRepo = new ModuleRepository();
  const progressRepo = new ProgressRepository();
  const assessmentRepo = new AssessmentRepository();
  const service = new AssessmentService(
    userRepo,
    trailRepo,
    moduleRepo,
    progressRepo,
    assessmentRepo,
  );

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
      slug: 'trilha-teste',
      title: 'Trilha Teste',
      description: 'Desc',
      kind: TrailKind.Default,
      firstStep: 'Começar',
      moduleIds: [mod1._id, mod2._id],
    });

    const user = await userRepo.create({
      name: 'Teste',
      email: 'rn6@pegeps.test',
      passwordHash: 'hash',
    });
    userId = user.id;
    await userRepo.setActiveTrail(userId, trail.id);

    await AssessmentBankModel.create({
      moduleId: mod1._id,
      variants: [
        { variantId: 'v1', questions: makeQuestions('v1') },
        { variantId: 'v2', questions: makeQuestions('v2') },
      ],
    });
  });

  it('não expõe gabarito no start e rotaciona variantes após reprovação (6/10)', async () => {
    const start1 = await service.startAssessment(userId, mod1Id);
    expect(start1.variantId).toBe('v1');
    expect(start1.questions).toHaveLength(10);
    expect('correctOptionId' in start1.questions[0]).toBe(false);

    const answers6of10 = start1.questions.map((q, idx) => ({
      questionId: q.id,
      selectedOptionId: idx < 6 ? 'a' : 'b',
    }));

    const failResult = await service.submitAssessment(userId, mod1Id, {
      variantId: start1.variantId,
      answers: answers6of10,
    });

    expect(failResult.passed).toBe(false);
    expect(failResult.correctCount).toBe(6);
    expect(failResult.completedCount).toBe(0);
    expect(failResult.nextModule?.id).toBe(mod1Id);

    const start2 = await service.startAssessment(userId, mod1Id);
    expect(start2.variantId).toBe('v2');
  });

  it('aprova com 7/10 e desbloqueia o módulo seguinte', async () => {
    const start1 = await service.startAssessment(userId, mod1Id);
    const answers7of10 = start1.questions.map((q, idx) => ({
      questionId: q.id,
      selectedOptionId: idx < 7 ? 'a' : 'b',
    }));

    const passResult = await service.submitAssessment(userId, mod1Id, {
      variantId: start1.variantId,
      answers: answers7of10,
    });

    expect(passResult.passed).toBe(true);
    expect(passResult.correctCount).toBe(7);
    expect(passResult.completedCount).toBe(1);
    expect(passResult.nextModule?.id).toBe(mod2Id);
  });
});
