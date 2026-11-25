import { LearningStyle } from '@pegeps/domain';

export type TutorStepAction =
  | 'start'
  | 'select_style'
  | 'select_concept'
  | 'change_style'
  | 'change_concept';

export type TutorNodeId = 'greeting' | 'choose_concept' | 'materials_ready' | 'trail_completed';

export interface TutorOptionButton {
  id: string;
  label: string;
  action: TutorStepAction | 'go_to_assessment';
  payload?: {
    learningStyle?: LearningStyle;
    conceptId?: string;
  };
  recommended?: boolean;
}

export const LEARNING_STYLE_LABELS: Record<LearningStyle, string> = {
  [LearningStyle.Visual]: 'Vídeos e diagramas visuais',
  [LearningStyle.Leitura]: 'Artigos, livros e guias de leitura',
  [LearningStyle.Auditivo]: 'Podcasts e explicações em áudio',
  [LearningStyle.Pratico]: 'Ferramentas, templates e prática',
};

export function buildStyleButtons(preferredStyle?: LearningStyle): TutorOptionButton[] {
  return Object.values(LearningStyle).map((style) => ({
    id: `style-${style}`,
    label: LEARNING_STYLE_LABELS[style],
    action: 'select_style',
    payload: { learningStyle: style },
    recommended: style === preferredStyle,
  }));
}

export function buildConceptButtons(
  concepts: Array<{ id: string; name: string }>,
  selectedStyle: LearningStyle,
): TutorOptionButton[] {
  return concepts.map((concept) => ({
    id: `concept-${concept.id}`,
    label: concept.name,
    action: 'select_concept',
    payload: {
      learningStyle: selectedStyle,
      conceptId: concept.id,
    },
  }));
}

export function buildAfterMaterialsButtons(selectedStyle: LearningStyle): TutorOptionButton[] {
  return [
    {
      id: 'action-other-style',
      label: 'Outro formato',
      action: 'change_style',
    },
    {
      id: 'action-other-concept',
      label: 'Outro conceito',
      action: 'change_concept',
      payload: { learningStyle: selectedStyle },
    },
    {
      id: 'action-go-assessment',
      label: 'Responder a avaliação',
      action: 'go_to_assessment',
    },
  ];
}
