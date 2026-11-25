import {
  buildAfterMaterialsButtons,
  buildConceptButtons,
  buildStyleButtons,
  LEARNING_STYLE_LABELS,
  LearningStyle,
  ModuleStatus,
  type TutorNodeId,
  type TutorOptionButton,
  type TutorStepAction,
} from '../domain/index.js';
import { deriveModulesWithStatus } from '../domain/trail-status.js';
import { NotFoundError, ValidationError } from '../errors/AppError.js';
import type { MaterialEntity, MaterialRepository } from '../repositories/MaterialRepository.js';
import type { ModuleEntity, ModuleRepository } from '../repositories/ModuleRepository.js';
import type { ProgressRepository } from '../repositories/ProgressRepository.js';
import type { TrailRepository } from '../repositories/TrailRepository.js';
import type { UserRepository } from '../repositories/UserRepository.js';

export interface TutorStepInput {
  action: TutorStepAction;
  learningStyle?: LearningStyle;
  conceptId?: string;
}

export interface TutorStepOutput {
  nodeId: TutorNodeId;
  activeModule: {
    id: string;
    title: string;
    order: number;
    totalModules: number;
  } | null;
  message: string;
  selectedStyle?: LearningStyle;
  selectedConcept?: { id: string; name: string };
  usedStyleFallback?: boolean;
  materials: MaterialEntity[];
  options: TutorOptionButton[];
}

export class TutorService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly trailRepo: TrailRepository,
    private readonly moduleRepo: ModuleRepository,
    private readonly progressRepo: ProgressRepository,
    private readonly materialRepo: MaterialRepository,
  ) {}

  async step(userId: string, input: TutorStepInput): Promise<TutorStepOutput> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.activeTrailId) {
      throw new NotFoundError('Selecione uma trilha antes de conversar com o Tutor Tom.');
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
    const derived = deriveModulesWithStatus(
      trail.moduleIds,
      modulesById,
      progress?.completedModuleIds ?? [],
    );

    const unlocked = derived.find((m) => m.status === ModuleStatus.Desbloqueado);
    const firstName = user.name.split(/\s+/)[0] || user.name;

    if (!unlocked) {
      return {
        nodeId: 'trail_completed',
        activeModule: null,
        message: `Parabéns, ${firstName}! Você concluiu todos os módulos da sua trilha atual. Se quiser novos desafios, você pode adaptar sua trilha.`,
        materials: [],
        options: [],
      };
    }

    const activeModuleMeta = {
      id: unlocked.moduleId,
      title: unlocked.title,
      order: unlocked.order,
      totalModules: derived.length,
    };

    if (input.action === 'start' || input.action === 'change_style') {
      const preferred = user.profile.learningStyle;
      const greeting =
        input.action === 'start'
          ? `Olá, ${firstName}! Vamos começar seus estudos em "${unlocked.title}". Como você prefere estudar este módulo?`
          : `Sem problemas! Escolha outro formato para estudar "${unlocked.title}":`;

      return {
        nodeId: 'greeting',
        activeModule: activeModuleMeta,
        message: greeting,
        materials: [],
        options: buildStyleButtons(preferred),
      };
    }

    const chosenStyle =
      input.learningStyle ?? user.profile.learningStyle ?? LearningStyle.Visual;

    if (input.action === 'select_style' || input.action === 'change_concept') {
      const styleLabel = LEARNING_STYLE_LABELS[chosenStyle].toLowerCase();
      return {
        nodeId: 'choose_concept',
        activeModule: activeModuleMeta,
        selectedStyle: chosenStyle,
        message: `Ótimo, vamos focar em ${styleLabel}. Qual conceito de "${unlocked.title}" você quer estudar agora?`,
        materials: [],
        options: buildConceptButtons(unlocked.concepts, chosenStyle),
      };
    }

    // action === 'select_concept'
    const concept = unlocked.concepts.find((c) => c.id === input.conceptId);
    if (!concept) {
      throw new ValidationError('Conceito não pertence ao módulo desbloqueado atual.');
    }

    let materials = await this.materialRepo.findByFilter({
      moduleId: unlocked.moduleId,
      conceptId: concept.id,
      learningStyle: chosenStyle,
    });
    let usedStyleFallback = false;

    if (materials.length === 0) {
      usedStyleFallback = true;
      materials = await this.materialRepo.findByFilter({
        moduleId: unlocked.moduleId,
        conceptId: concept.id,
      });
    }

    if (materials.length === 0) {
      usedStyleFallback = true;
      materials = await this.materialRepo.findByFilter({
        moduleId: unlocked.moduleId,
      });
    }

    const message = usedStyleFallback
      ? `Não encontrei materiais exatamente nesse formato para "${concept.name}", então separei outras ótimas referências sobre o tema:`
      : `Separei estes materiais sobre "${concept.name}" no formato escolhido. Quando terminar, você pode explorar outro tema ou fazer a avaliação:`;

    return {
      nodeId: 'materials_ready',
      activeModule: activeModuleMeta,
      selectedStyle: chosenStyle,
      selectedConcept: concept,
      usedStyleFallback,
      message,
      materials,
      options: buildAfterMaterialsButtons(chosenStyle),
    };
  }
}
