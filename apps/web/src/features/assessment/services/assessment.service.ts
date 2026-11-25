import { http } from '@/lib/http';
import type { ModuleWithStatus } from '@pegeps/domain';

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

export interface AssessmentQuestion {
  id: string;
  statement: string;
  conceptId: string;
  conceptName?: string;
  options: Array<{ id: string; text: string }>;
}

export interface AssessmentStartResponse {
  moduleId: string;
  moduleTitle: string;
  variantId: string;
  passThreshold: number;
  questions: AssessmentQuestion[];
}

export interface ConceptResultFeedback {
  id: string;
  name: string;
  correct: number;
  total: number;
  demonstrated: boolean;
  feedback: string;
}

export interface AssessmentSubmitResult {
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  scorePercentage?: number;
  passThreshold: number;
  moduleTitle: string;
  demonstratedConcepts: Array<{ id: string; name: string; feedback?: string }>;
  conceptFeedback?: ConceptResultFeedback[];
  nextModule: { id: string; title: string } | null;
  completedCount: number;
  totalModules: number;
  questionFeedback: Array<{
    questionId: string;
    conceptId?: string;
    conceptName?: string;
    isCorrect: boolean;
    correctOptionId: string;
    explanation: string;
  }>;
}

export const assessmentService = {
  list: () => http.get<AssessmentOverview>('/assessments'),

  start: (moduleId: string) =>
    http.get<AssessmentStartResponse>(`/assessments/${moduleId}/start`),

  submit: (
    moduleId: string,
    payload: {
      variantId: string;
      answers: Array<{ questionId: string; selectedOptionId: string }>;
    },
  ) => http.post<AssessmentSubmitResult>(`/assessments/${moduleId}/submit`, payload),
};
