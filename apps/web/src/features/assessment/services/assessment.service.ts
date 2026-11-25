import { http } from '@/lib/http';

export interface AssessmentQuestion {
  id: string;
  statement: string;
  conceptId: string;
  options: Array<{ id: string; text: string }>;
}

export interface AssessmentStartResponse {
  moduleId: string;
  moduleTitle: string;
  variantId: string;
  passThreshold: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface AssessmentResultResponse {
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  passThreshold: number;
  moduleTitle: string;
  demonstratedConcepts: Array<{ id: string; name: string }>;
  nextModule: { id: string; title: string } | null;
  completedCount: number;
  totalModules: number;
  questionFeedback: Array<{
    questionId: string;
    isCorrect: boolean;
    correctOptionId: string;
    explanation: string;
  }>;
}

export const assessmentService = {
  start: (moduleId: string) =>
    http.get<AssessmentStartResponse>(`/assessments/${moduleId}/start`),

  submit: (moduleId: string, variantId: string, answers: AssessmentAnswer[]) =>
    http.post<AssessmentResultResponse>(`/assessments/${moduleId}/submit`, {
      variantId,
      answers,
    }),
};
