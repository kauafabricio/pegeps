import {
  ASSESSMENT_PASS_THRESHOLD,
  ASSESSMENT_QUESTIONS_COUNT,
  ModuleStatus,
  type ModuleWithStatus,
} from '../domain/index.js';
import { deriveModulesWithStatus } from '../domain/trail-status.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../errors/AppError.js';
import type { AssessmentVariantDoc } from '../models/AssessmentBank.js';
import type { AssessmentRepository } from '../repositories/AssessmentRepository.js';
import type { ModuleEntity, ModuleRepository } from '../repositories/ModuleRepository.js';
import type { ProgressRepository } from '../repositories/ProgressRepository.js';
import type { TrailRepository } from '../repositories/TrailRepository.js';
import type { UserRepository } from '../repositories/UserRepository.js';

export interface AssessmentOverviewItem extends ModuleWithStatus {
  attemptsCount: number;
  lastScore?: number;
}

export interface AssessmentOverview {
  completedCount: number;
  totalModules: number;
  percentage: number;
  modules: AssessmentOverviewItem[];
}

export interface PublicAssessmentQuestion {
  id: string;
  statement: string;
  conceptId: string;
  conceptName?: string;
  options: Array<{ id: string; text: string }>;
}

export interface StartedAssessment {
  moduleId: string;
  moduleTitle: string;
  variantId: string;
  passThreshold: number;
  questions: PublicAssessmentQuestion[];
}

export interface ConceptResultFeedback {
  id: string;
  name: string;
  correct: number;
  total: number;
  demonstrated: boolean;
  feedback: string;
}

export interface SubmittedAssessmentResult {
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  scorePercentage: number;
  passThreshold: number;
  moduleTitle: string;
  demonstratedConcepts: Array<{ id: string; name: string; feedback?: string }>;
  conceptFeedback: ConceptResultFeedback[];
  nextModule: { id: string; title: string } | null;
  completedCount: number;
  totalModules: number;
  questionFeedback: Array<{
    questionId: string;
    conceptId: string;
    conceptName: string;
    isCorrect: boolean;
    correctOptionId: string;
    explanation: string;
  }>;
}

export class AssessmentService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly trailRepo: TrailRepository,
    private readonly moduleRepo: ModuleRepository,
    private readonly progressRepo: ProgressRepository,
    private readonly assessmentRepo: AssessmentRepository,
  ) {}

  async getOverview(userId: string): Promise<AssessmentOverview> {
    const derived = await this.getUserDerivedModules(userId);
    const items = await Promise.all(
      derived.map(async (mod) => {
        const attempts = await this.assessmentRepo.findAttemptsByUserAndModule(
          userId,
          mod.moduleId,
        );
        const lastAttempt = attempts.at(-1);
        return {
          ...mod,
          attemptsCount: attempts.length,
          lastScore: lastAttempt?.correctCount,
        };
      }),
    );

    const completedCount = items.filter((m) => m.status === ModuleStatus.Concluido).length;
    const totalModules = items.length;
    const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

    return {
      completedCount,
      totalModules,
      percentage,
      modules: items,
    };
  }

  async startAssessment(userId: string, moduleId: string): Promise<StartedAssessment> {
    const unlocked = await this.requireUnlockedModule(userId, moduleId);
    const bank = await this.assessmentRepo.findBankByModuleId(moduleId);
    if (!bank || bank.variants.length === 0) {
      throw new NotFoundError('Banco de avaliações não encontrado para este módulo.');
    }

    const attempts = await this.assessmentRepo.findAttemptsByUserAndModule(userId, moduleId);
    const variant = this.pickNextVariant(bank.variants, attempts.map((a) => a.variantId));
    const conceptNameById = new Map(unlocked.concepts.map((c) => [c.id, c.name]));

    return {
      moduleId,
      moduleTitle: unlocked.title,
      variantId: variant.variantId,
      passThreshold: ASSESSMENT_PASS_THRESHOLD,
      questions: variant.questions.map((q) => ({
        id: q.id,
        statement: q.statement,
        conceptId: q.conceptId,
        conceptName: conceptNameById.get(q.conceptId) ?? q.conceptId,
        options: q.options,
      })),
    };
  }

  async submitAssessment(
    userId: string,
    moduleId: string,
    input: {
      variantId: string;
      answers: Array<{ questionId: string; selectedOptionId: string }>;
    },
  ): Promise<SubmittedAssessmentResult> {
    const unlocked = await this.requireUnlockedModule(userId, moduleId);
    const bank = await this.assessmentRepo.findBankByModuleId(moduleId);
    if (!bank) {
      throw new NotFoundError('Banco de avaliações não encontrado para este módulo.');
    }

    const variant = bank.variants.find((v) => v.variantId === input.variantId);
    if (!variant) {
      throw new ValidationError('Variante de avaliação inválida para este módulo.');
    }

    if (variant.questions.length !== ASSESSMENT_QUESTIONS_COUNT) {
      throw new ValidationError('Configuração de avaliação inconsistente.');
    }

    const answerMap = new Map<string, string>();
    for (const ans of input.answers) {
      answerMap.set(ans.questionId, ans.selectedOptionId);
    }

    if (answerMap.size !== variant.questions.length) {
      throw new ValidationError(
        `Responda todas as ${variant.questions.length} perguntas da avaliação.`,
      );
    }

    let correctCount = 0;
    const conceptNameById = new Map(unlocked.concepts.map((c) => [c.id, c.name]));
    const conceptStats = new Map<
      string,
      { total: number; correct: number; correctExp?: string; missedExp?: string; anyExp?: string }
    >();

    const questionFeedback = variant.questions.map((q) => {
      const selected = answerMap.get(q.id);
      if (!selected || !q.options.some((o) => o.id === selected)) {
        throw new ValidationError(`Resposta inválida para a questão ${q.id}.`);
      }

      const isCorrect = selected === q.correctOptionId;
      if (isCorrect) {
        correctCount += 1;
      }

      const prev = conceptStats.get(q.conceptId) ?? { total: 0, correct: 0 };
      conceptStats.set(q.conceptId, {
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        correctExp: prev.correctExp ?? (isCorrect ? q.explanation : undefined),
        missedExp: prev.missedExp ?? (!isCorrect ? q.explanation : undefined),
        anyExp: prev.anyExp ?? q.explanation,
      });

      return {
        questionId: q.id,
        conceptId: q.conceptId,
        conceptName: conceptNameById.get(q.conceptId) ?? q.conceptId,
        isCorrect,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
      };
    });

    const passed = correctCount >= ASSESSMENT_PASS_THRESHOLD;

    await this.assessmentRepo.createAttempt({
      userId,
      moduleId,
      variantId: variant.variantId,
      answers: input.answers,
      correctCount,
      passed,
    });

    if (passed) {
      await this.progressRepo.markModuleCompleted(userId, moduleId);
    }

    const updatedModules = await this.getUserDerivedModules(userId);
    const nextUnlocked = updatedModules.find((m) => m.status === ModuleStatus.Desbloqueado);
    const completedCount = updatedModules.filter((m) => m.status === ModuleStatus.Concluido).length;

    const conceptFeedback: ConceptResultFeedback[] = unlocked.concepts
      .filter((concept) => conceptStats.has(concept.id))
      .map((concept) => {
        const stat = conceptStats.get(concept.id)!;
        const demonstrated = stat.correct > 0 && stat.correct >= Math.ceil(stat.total / 2);
        const feedback = demonstrated
          ? (stat.correctExp ?? stat.anyExp ?? '')
          : (stat.missedExp ?? stat.anyExp ?? '');
        return {
          id: concept.id,
          name: concept.name,
          correct: stat.correct,
          total: stat.total,
          demonstrated,
          feedback,
        };
      });

    const demonstratedConcepts = conceptFeedback
      .filter((c) => c.demonstrated)
      .map(({ id, name, feedback }) => ({ id, name, feedback }));

    const totalQuestions = variant.questions.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return {
      passed,
      correctCount,
      totalQuestions,
      scorePercentage,
      passThreshold: ASSESSMENT_PASS_THRESHOLD,
      moduleTitle: unlocked.title,
      demonstratedConcepts,
      conceptFeedback,
      nextModule: nextUnlocked ? { id: nextUnlocked.moduleId, title: nextUnlocked.title } : null,
      completedCount,
      totalModules: updatedModules.length,
      questionFeedback,
    };
  }

  private pickNextVariant(
    variants: AssessmentVariantDoc[],
    usedVariantIds: string[],
  ): AssessmentVariantDoc {
    const cycleSize = variants.length;
    const currentCycleStart = Math.floor(usedVariantIds.length / cycleSize) * cycleSize;
    const usedInCurrentCycle = new Set(usedVariantIds.slice(currentCycleStart));

    const unused = variants.find((v) => !usedInCurrentCycle.has(v.variantId));
    return unused ?? variants[usedVariantIds.length % cycleSize];
  }

  private async getUserDerivedModules(userId: string): Promise<ModuleWithStatus[]> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.activeTrailId) {
      throw new NotFoundError('Nenhuma trilha ativa encontrada para o usuário.');
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
    return deriveModulesWithStatus(
      trail.moduleIds,
      modulesById,
      progress?.completedModuleIds ?? [],
    );
  }

  private async requireUnlockedModule(userId: string, moduleId: string): Promise<ModuleWithStatus> {
    const derived = await this.getUserDerivedModules(userId);
    const target = derived.find((m) => m.moduleId === moduleId);
    if (!target) {
      throw new NotFoundError('Módulo não faz parte da sua trilha ativa.');
    }
    if (target.status !== ModuleStatus.Desbloqueado) {
      throw new ForbiddenError(
        'Apenas o módulo atualmente desbloqueado pode ter sua avaliação respondida.',
        'MODULE_LOCKED',
      );
    }
    return target;
  }
}
