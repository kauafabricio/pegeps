import { http } from '@/lib/http';

export interface AdaptStatus {
  canAdapt: boolean;
  cooldownDays: number;
  lastAdaptationAt: string | null;
  nextAvailableAt: string | null;
  daysRemaining: number;
}

export interface AdaptAiResult {
  trail: {
    id: string;
    slug: string;
    title: string;
    description: string;
  };
  adaptedAt: string;
}

export interface SpecialistRequestResult {
  requestId: string;
  email: string;
  status: string;
  message: string;
}

export const adaptService = {
  getStatus: () => http.get<AdaptStatus>('/adapt/status'),

  adaptWithAi: (context: string) =>
    http.post<AdaptAiResult>('/adapt/ai', { context }),

  requestSpecialist: () =>
    http.post<SpecialistRequestResult>('/adapt/specialist'),
};
