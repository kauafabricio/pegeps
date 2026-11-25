import { http } from '@/lib/http';

export type TutorNodeId = 'greeting' | 'choose_concept' | 'materials_ready' | 'trail_completed';

export interface TutorOptionButton {
  id: string;
  label: string;
  action: 'start' | 'select_style' | 'select_concept' | 'change_style' | 'change_concept' | 'go_to_assessment';
  recommended?: boolean;
  payload?: {
    learningStyle?: string;
    conceptId?: string;
  };
}

export interface TutorMaterial {
  id?: string;
  type: string;
  title: string;
  url: string;
  author?: string;
}

export interface TutorStepResponse {
  nodeId: TutorNodeId;
  activeModule: {
    id: string;
    title: string;
    order: number;
    totalModules: number;
  } | null;
  message: string;
  selectedStyle?: string;
  selectedConcept?: { id: string; name: string };
  usedStyleFallback?: boolean;
  materials: TutorMaterial[];
  options: TutorOptionButton[];
}

export const tutorService = {
  start: () => http.get<TutorStepResponse>('/tutor/start'),
  step: (body: { action: string; learningStyle?: string; conceptId?: string }) =>
    http.post<TutorStepResponse>('/tutor/step', body),
};
