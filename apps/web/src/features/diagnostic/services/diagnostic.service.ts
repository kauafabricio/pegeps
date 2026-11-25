import { http } from '@/lib/http';
import type { AuthUser } from '@/providers/AuthProvider';
import type { DiagnosticQuestion } from '@pegeps/domain';

export type PublicDiagnosticQuestion = Omit<DiagnosticQuestion, 'correctOptionId'>;

export interface DiagnosticResultPayload {
  answers: Array<{ questionId: string; selectedOptionId: string }>;
}

export type DiagnosticLevel = 'inicial' | 'intermediario' | 'avancado';

export interface TrailPreview {
  id: string;
  slug: string;
  title: string;
  description: string;
  firstStep: string;
  modules: Array<{ id: string; slug: string; title: string }>;
}

export interface DiagnosticResult {
  level: DiagnosticLevel;
  correctCount: number;
  totalQuestions: number;
  concepts: Array<{
    conceptId: string;
    label: string;
    status: 'reconhecido' | 'a_desenvolver';
  }>;
  recommendedTrail: TrailPreview;
  defaultTrail: TrailPreview;
}

export const diagnosticService = {
  getQuestions: () =>
    http.get<{ questions: PublicDiagnosticQuestion[] }>('/diagnostic/questions'),

  submit: (payload: DiagnosticResultPayload) =>
    http.post<DiagnosticResult>('/diagnostic/submit', payload),

  getResult: () => http.get<DiagnosticResult>('/diagnostic/result'),

  chooseTrail: (choice: 'recommended' | 'default') =>
    http.post<{ user: AuthUser; activeTrailId: string }>('/diagnostic/choose-trail', {
      choice,
    }),
};
