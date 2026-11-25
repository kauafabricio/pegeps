import { http } from '@/lib/http';

export interface AdaptPayload {
  context: string;
}

export interface AdaptStatusResponse {
  canAdapt: boolean;
  cooldownDays: number;
  lastAdaptationAt: string | null;
  nextAvailableAt: string | null;
  daysRemaining: number;
}

export interface AdaptResult {
  trail: {
    id: string;
    slug: string;
    title: string;
    description: string;
    firstStep: string;
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
  getStatus: () => http.get<AdaptStatusResponse>('/adapt/status'),

  adapt: (payload: AdaptPayload) => http.post<AdaptResult>('/adapt/ai', payload),

  requestSpecialist: () => http.post<SpecialistRequestResult>('/adapt/specialist'),
};
