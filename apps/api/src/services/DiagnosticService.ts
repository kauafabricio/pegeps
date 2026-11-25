import {
  DEFAULT_TRAIL_SLUG,
  DIAGNOSTIC_FALLBACK_TRAIL_SLUG,
  DIAGNOSTIC_LEVEL_THRESHOLDS,
  DIAGNOSTIC_QUESTIONS,
  OnboardingStep,
  resolveTrailSlug,
  type DiagnosticAnswer,
} from '../domain/index.js';
import { NotFoundError, ValidationError } from '../errors/AppError.js';
import type { DiagnosticRepository } from '../repositories/DiagnosticRepository.js';
import type { ModuleRepository } from '../repositories/ModuleRepository.js';
import type { ProgressRepository } from '../repositories/ProgressRepository.js';
import type { TrailEntity, TrailRepository } from '../repositories/TrailRepository.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import { toPublicUser, type PublicUser } from './AuthService.js';

export type DiagnosticLevel = 'inicial' | 'intermediario' | 'avancado';

export interface PublicDiagnosticQuestion {
  id: string;
  statement: string;
  conceptId: string;
  options: Array<{ id: string; text: string }>;
}

export interface TrailPreview {
  id: string;
  slug: string;
  title: string;
  description: string;
  firstStep: string;
  modulesCount: number;
  sequence: string[];
  modules: Array<{ id: string; slug: string; title: string }>;
}

export interface DiagnosticSummary {
  level: DiagnosticLevel;
  correctCount: number;
  totalQuestions: number;
  recommendationText: string;
  recommendedTrailId: string;
  concepts: Array<{
    conceptId: string;
    label: string;
    status: 'reconhecido' | 'a_desenvolver';
    feedback: string;
  }>;
  recommendedTrail: TrailPreview;
  defaultTrail: TrailPreview;
}

export class DiagnosticService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly diagnosticRepo: DiagnosticRepository,
    private readonly trailRepo: TrailRepository,
    private readonly moduleRepo: ModuleRepository,
    private readonly progressRepo: ProgressRepository,
  ) {}

  getQuestions(): PublicDiagnosticQuestion[] {
    return DIAGNOSTIC_QUESTIONS.map((q) => ({
      id: q.id,
      statement: q.statement,
      conceptId: q.conceptId,
      options: q.options,
    }));
  }

  async submitDiagnostic(userId: string, answers: DiagnosticAnswer[]): Promise<DiagnosticSummary> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const answerMap = new Map<string, string>();
    for (const ans of answers) {
      answerMap.set(ans.questionId, ans.selectedOptionId);
    }

    if (answerMap.size !== DIAGNOSTIC_QUESTIONS.length) {
      throw new ValidationError('Responda todas as 3 perguntas do diagnóstico.');
    }

    const hitsByQuestion = DIAGNOSTIC_QUESTIONS.map((q) => {
      const selected = answerMap.get(q.id);
      if (!selected || !q.options.some((o) => o.id === selected)) {
        throw new ValidationError(`Resposta inválida para a pergunta ${q.id}.`);
      }
      return selected === q.correctOptionId;
    }) as [boolean, boolean, boolean];

    const [mvpHit, validacaoHit, priorizacaoHit] = hitsByQuestion;
    const recommendedSlug = resolveTrailSlug(hitsByQuestion);

    const recommendedTrail =
      (await this.trailRepo.findBySlug(recommendedSlug)) ??
      (await this.trailRepo.findBySlug(DIAGNOSTIC_FALLBACK_TRAIL_SLUG));

    const defaultTrail = await this.trailRepo.findBySlug(DEFAULT_TRAIL_SLUG);

    if (!recommendedTrail || !defaultTrail) {
      throw new NotFoundError(
        'Trilhas iniciais não encontradas no banco. Execute o script de seed.',
      );
    }

    await this.diagnosticRepo.create({
      userId,
      answers,
      correctByConcept: {
        mvp: mvpHit,
        validacao: validacaoHit,
        priorizacao: priorizacaoHit,
      },
      recommendedTrailId: recommendedTrail.id,
    });

    if (user.onboardingStep === OnboardingStep.Diagnostic) {
      await this.userRepo.updateOnboarding(userId, {
        onboardingStep: OnboardingStep.Trail,
      });
    }

    return this.buildSummary({ mvpHit, validacaoHit, priorizacaoHit }, recommendedTrail, defaultTrail);
  }

  async getLatestResult(userId: string): Promise<DiagnosticSummary> {
    const result = await this.diagnosticRepo.findLatestByUserId(userId);
    if (!result) {
      throw new NotFoundError('Diagnóstico ainda não respondido.', 'DIAGNOSTIC_NOT_FOUND');
    }

    const [recommendedTrail, defaultTrail] = await Promise.all([
      this.trailRepo.findById(result.recommendedTrailId),
      this.trailRepo.findBySlug(DEFAULT_TRAIL_SLUG),
    ]);

    if (!recommendedTrail || !defaultTrail) {
      throw new NotFoundError('Trilhas do diagnóstico não encontradas.');
    }

    return this.buildSummary(
      {
        mvpHit: result.correctByConcept.mvp,
        validacaoHit: result.correctByConcept.validacao,
        priorizacaoHit: result.correctByConcept.priorizacao,
      },
      recommendedTrail,
      defaultTrail,
    );
  }

  async chooseTrail(
    userId: string,
    choice: 'recommended' | 'default',
  ): Promise<{ user: PublicUser; activeTrailId: string }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    let targetTrail: TrailEntity | null = null;
    if (choice === 'recommended') {
      const latestDiagnostic = await this.diagnosticRepo.findLatestByUserId(userId);
      if (!latestDiagnostic) {
        throw new ValidationError('Conclua o diagnóstico antes de escolher a trilha recomendada.');
      }
      targetTrail = await this.trailRepo.findById(latestDiagnostic.recommendedTrailId);
    } else {
      targetTrail = await this.trailRepo.findBySlug(DEFAULT_TRAIL_SLUG);
    }

    if (!targetTrail) {
      throw new NotFoundError('Trilha selecionada não encontrada.');
    }

    const updatedUser = await this.userRepo.updateOnboarding(userId, {
      onboardingStep: OnboardingStep.Done,
      activeTrailId: targetTrail.id,
    });

    await this.progressRepo.ensureForUser(userId);

    if (!updatedUser) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    return {
      user: toPublicUser(updatedUser),
      activeTrailId: targetTrail.id,
    };
  }

  async getTrailOptions(
    userId: string,
  ): Promise<{ recommended: TrailPreview; default: TrailPreview }> {
    const summary = await this.getLatestResult(userId);
    return {
      recommended: summary.recommendedTrail,
      default: summary.defaultTrail,
    };
  }

  async chooseTrailById(
    userId: string,
    trailId: string,
  ): Promise<{ user: PublicUser; activeTrailId: string }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const [latestDiagnostic, defaultTrail] = await Promise.all([
      this.diagnosticRepo.findLatestByUserId(userId),
      this.trailRepo.findBySlug(DEFAULT_TRAIL_SLUG),
    ]);

    if (!defaultTrail) {
      throw new NotFoundError('Trilha padrão não encontrada.');
    }

    const isDefault = defaultTrail.id === trailId;
    const isRecommended = latestDiagnostic?.recommendedTrailId === trailId;

    if (!isDefault && !isRecommended) {
      throw new ValidationError(
        'Você só pode escolher entre a trilha recomendada pelo diagnóstico ou a trilha padrão.',
        'INVALID_TRAIL_CHOICE',
      );
    }

    const updatedUser = await this.userRepo.updateOnboarding(userId, {
      onboardingStep: OnboardingStep.Done,
      activeTrailId: trailId,
    });

    await this.progressRepo.ensureForUser(userId);

    if (!updatedUser) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    return {
      user: toPublicUser(updatedUser),
      activeTrailId: trailId,
    };
  }

  private async buildSummary(
    hits: { mvpHit: boolean; validacaoHit: boolean; priorizacaoHit: boolean },
    recommendedTrail: TrailEntity,
    defaultTrail: TrailEntity,
  ): Promise<DiagnosticSummary> {
    const correctCount = [hits.mvpHit, hits.validacaoHit, hits.priorizacaoHit].filter(Boolean).length;

    let level: DiagnosticLevel = 'inicial';
    let recommendationText =
      'Recomendamos começar pelos fundamentos de descoberta, validação e priorização para ganhar tração com segurança.';
    if (correctCount >= DIAGNOSTIC_LEVEL_THRESHOLDS.ADVANCED_MIN) {
      level = 'avancado';
      recommendationText =
        'Você já domina os conceitos-base! Recomendamos acelerar com metodologias ágeis, priorização avançada e métricas.';
    } else if (correctCount >= DIAGNOSTIC_LEVEL_THRESHOLDS.INTERMEDIATE_MIN) {
      level = 'intermediario';
      recommendationText =
        'Você tem uma boa base inicial. Recomendamos focar nos pontos em aberto para consolidar suas decisões de produto.';
    }

    const [recommendedPreview, defaultPreview] = await Promise.all([
      this.buildTrailPreview(recommendedTrail),
      this.buildTrailPreview(defaultTrail),
    ]);

    return {
      level,
      correctCount,
      totalQuestions: DIAGNOSTIC_QUESTIONS.length,
      recommendationText,
      recommendedTrailId: recommendedTrail.id,
      concepts: [
        {
          conceptId: 'mvp',
          label: 'MVP',
          status: hits.mvpHit ? 'reconhecido' : 'a_desenvolver',
          feedback: hits.mvpHit
            ? 'Você reconhece que o MVP serve para testar uma hipótese importante com o menor esforço.'
            : 'Próximo passo: recortar o menor experimento possível para aprender antes de construir tudo.',
        },
        {
          conceptId: 'validacao-hipoteses',
          label: 'Validação de hipóteses',
          status: hits.validacaoHit ? 'reconhecido' : 'a_desenvolver',
          feedback: hits.validacaoHit
            ? 'Você reconhece que hipóteses precisam ser validadas com clientes e critérios objetivos.'
            : 'Próximo passo: trocar a opinião interna por evidências de clientes e critérios claros.',
        },
        {
          conceptId: 'rice',
          label: 'Priorização',
          status: hits.priorizacaoHit ? 'reconhecido' : 'a_desenvolver',
          feedback: hits.priorizacaoHit
            ? 'Você reconhece que a priorização deve equilibrar impacto, evidências e esforço.'
            : 'Próximo passo: comparar impacto, evidências e esforço antes de escolher o próximo teste.',
        },
      ],
      recommendedTrail: recommendedPreview,
      defaultTrail: defaultPreview,
    };
  }

  private async buildTrailPreview(trail: TrailEntity): Promise<TrailPreview> {
    const modules = await this.moduleRepo.findByIds(trail.moduleIds);
    const byId = new Map(modules.map((m) => [m.id, m]));
    const orderedModules = trail.moduleIds
      .map((id) => byId.get(id))
      .filter((m): m is NonNullable<typeof m> => Boolean(m))
      .map((m) => ({ id: m.id, slug: m.slug, title: m.title }));

    return {
      id: trail.id,
      slug: trail.slug,
      title: trail.title,
      description: trail.description,
      firstStep: trail.firstStep,
      modulesCount: orderedModules.length,
      sequence: orderedModules.map((m) => m.title),
      modules: orderedModules,
    };
  }
}
