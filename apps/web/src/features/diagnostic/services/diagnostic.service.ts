import { http } from '@/lib/http';
import type { DiagnosticQuestion } from '@pegeps/domain';

export type PublicDiagnosticQuestion = Omit<DiagnosticQuestion, 'correctOptionId'>;

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

export interface DiagnosticConceptDetail {
  conceptId: string;
  label: string;
  status: 'reconhecido' | 'a_desenvolver';
  feedback: string;
}

export interface DiagnosticSubmitResult {
  level: 'inicial' | 'intermediario' | 'avancado';
  correctCount: number;
  totalQuestions: number;
  recommendationText: string;
  recommendedTrailId: string;
  concepts: DiagnosticConceptDetail[];
  recommendedTrail: TrailPreview;
  defaultTrail: TrailPreview;
}

export interface TrailOptionsResponse {
  recommended: TrailPreview;
  default: TrailPreview;
}

export const diagnosticService = {
  getQuestions: () =>
    http.get<{ questions: PublicDiagnosticQuestion[] }>('/diagnostic/questions'),

  submit: (answers: Array<{ questionId: string; selectedOptionId: string }>) =>
    http.post<DiagnosticSubmitResult>('/diagnostic/submit', { answers }),

  getResult: () => http.get<DiagnosticSubmitResult>('/diagnostic/result'),

  getTrailOptions: () => http.get<TrailOptionsResponse>('/trails/options'),

  chooseTrail: (trailId: string) =>
    http.post<{ activeTrailId: string }>('/trails/choose', { trailId }),
};
