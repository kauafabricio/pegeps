import { http } from '@/lib/http';
import type { TutorOptionButton, TutorStepAction } from '../types';

export interface TutorStepPayload {
  action: TutorStepAction;
  learningStyle?: string;
  conceptId?: string;
}

export interface TutorStepResponse {
  nodeId: 'greeting' | 'choose_concept' | 'materials_ready' | 'trail_completed';
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
  materials: Array<{
    id?: string;
    type: string;
    title: string;
    url: string;
    author?: string;
  }>;
  options: TutorOptionButton[];
}

export const tutorService = {
  start: () => http.post<TutorStepResponse>('/tutor/step', { action: 'start' }),

  step: (payload: TutorStepPayload) => http.post<TutorStepResponse>('/tutor/step', payload),
};
